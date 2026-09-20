// backend/utils/enrichmentToIcp.js

const STATUSES = new Set(["enriched", "partial", "insufficient_data"]);
const PROFILE_FIELDS = [
  "company_description", "industry", "hq_country", "employee_count",
  "funding_stage", "regulator", "role_summary",
];
const KEY_FIELDS = [
  "company_description", "industry", "hq_country",
  "employee_count", "funding_stage"
];
const UNKNOWN = "unknown";
const UNKNOWN_WORDS = new Set(["", "unknown", "n/a", "none", "null", "not provided"]);

// Enricher field name -> ICP Prospect field name
const ICP_FIELD_MAP = {
  "industry": "industry",
  "hq_country": "hq_country",
  "funding_stage": "funding_stage",
  "regulator": "regulator",
  "company_description": "description",
};

const asStr = (v) => (v === null || v === undefined) ? "" : String(v).replace(/^"|"$/g, '').trim();

const asList = (v) => {
  if (!v) return [];
  if (typeof v === 'string') return v.split("\n").map(p => p.trim()).filter(Boolean);
  if (Array.isArray(v)) return v.map(x => String(x).trim()).filter(Boolean);
  return [];
};

const isUnknown = (v) => UNKNOWN_WORDS.has(asStr(v).toLowerCase());

const fallback = (reason) => {
  const profile = {};
  PROFILE_FIELDS.forEach(f => { profile[f] = UNKNOWN; });
  return {
    ...profile,
    status: "insufficient_data",
    status_model: null,
    confidence: null,
    recent_signals: [],
    field_sources: [],
    ungrounded: [],
    missing_fields: [...PROFILE_FIELDS],
    conflict_notes: "",
    error: reason,
  };
};

const normalizeEnrichment = (output, sourceIds, strict = true) => {
  let data = output;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      return fallback("output was not valid JSON");
    }
  }
  if (!data || typeof data !== 'object') {
    return fallback("output was not a JSON object");
  }

  // Convert keys to lowercase to handle AI drift
  const lowerData = {};
  for (const k in data) lowerData[k.toLowerCase()] = data[k];

  const statusModel = asStr(lowerData["status"]).toLowerCase();
  if (!STATUSES.has(statusModel)) return fallback(`invalid status: '${statusModel}'`);

  const profile = {};
  PROFILE_FIELDS.forEach(f => {
    const raw = asStr(lowerData[f]);
    profile[f] = isUnknown(raw) ? UNKNOWN : raw;
  });

  // Groundedness enforcement: every filled field needs a source that really exists
  const validIds = new Set([...sourceIds, "prospect_raw"]);
  const grounded = new Set();
  const cleanSources = [];

  asList(lowerData["field_sources"]).forEach(entry => {
    // Parse format "field | value | source_id" or "field | source_id"
    const parts = entry.split("|").map(p => p.trim());
    if (parts.length >= 2) {
      const field = parts[0];
      const sid = parts[parts.length - 1]; 
      if (profile[field] && validIds.has(sid)) {
        grounded.add(field);
        cleanSources.push(`${field} | ${sid}`);
      }
    }
  });

  const ungrounded = PROFILE_FIELDS.filter(f => profile[f] !== UNKNOWN && !grounded.has(f));
  
  if (strict) {
    ungrounded.forEach(f => { profile[f] = UNKNOWN; });
  }

  const signals = [];
  asList(lowerData["recent_signals"]).forEach(entry => {
    const lastPipe = entry.lastIndexOf("|");
    if (lastPipe !== -1) {
      const text = entry.substring(0, lastPipe).trim();
      const sid = entry.substring(lastPipe + 1).trim();
      if (text && validIds.has(sid)) {
        signals.push(`${text} | ${sid}`);
      }
    }
  });

  const notes = asStr(lowerData["conflict_notes"] || lowerData["notes"]);
  const conflictNotes = notes.includes(" vs ") ? notes : "";

  // Status is derived in code; the model's value is kept for logging comparison
  const knownKeys = KEY_FIELDS.filter(f => profile[f] !== UNKNOWN);
  let status = "partial";
  if (knownKeys.length === 0) status = "insufficient_data";
  else if (knownKeys.length === KEY_FIELDS.length && !conflictNotes) status = "enriched";

  let confidence = parseFloat(lowerData["confidence"]);
  if (isNaN(confidence)) confidence = null;
  else confidence = Math.max(0.0, Math.min(1.0, confidence));

  if (status === "insufficient_data") confidence = null;

  return {
    ...profile,
    status,
    status_model: statusModel,
    confidence,
    recent_signals: signals,
    field_sources: cleanSources,
    ungrounded,
    missing_fields: PROFILE_FIELDS.filter(f => profile[f] === UNKNOWN),
    conflict_notes: conflictNotes,
    error: null,
  };
};

const employeeValue = (text) => {
  // Plain integer -> int. Anything with a qualifier ("over 200") stays text.
  const match = text.match(/^\s*(\d[\d,]*)\s*(?:employees)?\s*$/i);
  if (match) {
    return parseInt(match[1].replace(/,/g, ""), 10);
  }
  return text;
};

const buildIcpProspect = (rawProspect, enrichment) => {
  const prospect = {
    name: rawProspect.name,
    title: rawProspect.title,
    company: rawProspect.company,
  };

  for (const [src, dst] of Object.entries(ICP_FIELD_MAP)) {
    if (enrichment[src] !== UNKNOWN) {
      prospect[dst] = enrichment[src];
    }
  }

  if (enrichment["employee_count"] !== UNKNOWN) {
    prospect["employee_count"] = employeeValue(enrichment["employee_count"]);
  }

  // The ICP agent treats an absent field as unknown, so we strip empties
  const cleanedProspect = {};
  for (const k in prospect) {
    if (prospect[k] !== null && prospect[k] !== undefined && prospect[k] !== "") {
      cleanedProspect[k] = prospect[k];
    }
  }
  return cleanedProspect;
};

const compact = (obj) => JSON.stringify(obj);

const prepareIcpCall = (rawProspect, sourceData, enrichmentOutput, icp, enricherVersion) => {
  const sourceIds = sourceData.map(s => s.source).filter(Boolean);
  const enrichment = normalizeEnrichment(enrichmentOutput, sourceIds);
  const prospect = buildIcpProspect(rawProspect, enrichment);
  
  const message = `Campaign ICP: ${compact(icp)}\nProspect: ${compact(prospect)}`;
  
  return {
    message,
    prospect,
    enrichment,
    // If we have no usable enrichment, we skip the ICP agent entirely to save credits
    should_call_icp: enrichment.status !== "insufficient_data",
    log: {
      enricher_version: enricherVersion,
      status: enrichment.status,
      status_model: enrichment.status_model,
      status_disagrees: enrichment.status !== enrichment.status_model,
      ungrounded: enrichment.ungrounded,
      error: enrichment.error,
    },
  };
};

module.exports = {
  normalizeEnrichment,
  buildIcpProspect,
  prepareIcpCall
};