const pool = require('../db');
const axios = require('axios');
const { callAgent } = require('../utils/agentCaller');
const { prepareIcpCall } = require('../utils/enrichmentToIcp');

const getCampaigns = async (req, res) => {
  try {
    const query = `
      SELECT c.campaign_id, c.name, c.status, c.created_at, c.owner, c.icp,
      COUNT(DISTINCT cp.prospect_id) AS total_prospects,
      COUNT(DISTINCT CASE WHEN cp.funnel_stage IN ('Contacted', 'Engaged', 'Meeting', 'Opportunity') THEN cp.prospect_id END) AS outreach_sent
      FROM campaigns c
      LEFT JOIN campaign_prospects cp ON c.campaign_id = cp.campaign_id
      GROUP BY c.campaign_id ORDER BY c.created_at DESC;
    `;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const triggerAgent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const campQuery = await pool.query('SELECT agents FROM campaigns WHERE campaign_id = $1', [id]);
    if (campQuery.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    
    const enabledAgents = campQuery.rows[0].agents || [];

    const aiResponse = await axios.post(
      process.env.AI_ENGINE_URL, 
      {
        campaign_id: id,
        active_agents: enabledAgents,
        command: 'start'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.AI_ENGINE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    res.json({ 
      success: true, 
      message: `Agents triggered for campaign ${id}`,
      ai_status: aiResponse.data
    });

  } catch (err) {
    console.error("AI Engine API failed:", err.message);
    res.json({ 
      success: true, 
      ai_error: 'Database updated to Live, but failed to reach Python AI Engine.' 
    });
  }
};

const createCampaign = async (req, res) => {
  try {
    const { 
      name, owner, description, icp, geography, target_roles, 
      target_role, target_industry, // <-- Added new form fields
      company_criteria, exclusion_criteria, daily_contact_limit, status,
      agents, active_channels, value_proposition, agent_tone
    } = req.body;

    const query = `
      INSERT INTO campaigns (
        name, owner, description, icp, geography, target_roles, 
        target_role, target_industry, // <-- Added to columns
        company_criteria, exclusion_criteria, daily_contact_limit, status,
        agents, active_channels, value_proposition, agent_tone
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *;
    `;
    
    const values = [
      name, 
      owner, 
      description, 
      icp, 
      geography, 
      target_roles, 
      target_role || '', // Added value
      target_industry || '', // Added value
      company_criteria, 
      exclusion_criteria, 
      daily_contact_limit, 
      status || 'Draft',
      agents || [], 
      active_channels || 'Email + LinkedIn', 
      value_proposition || '', 
      agent_tone || 'Professional & Direct'
    ];
    
    const result = await pool.query(query, values);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("Error creating campaign:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM campaigns WHERE campaign_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { agents, active_channels, daily_contact_limit, status, target_roles, company_criteria, value_proposition, agent_tone } = req.body;

    const query = `
      UPDATE campaigns 
      SET 
        agents = COALESCE($1, agents), 
        active_channels = COALESCE($2, active_channels), 
        daily_contact_limit = COALESCE($3, daily_contact_limit), 
        status = COALESCE($4, status),
        target_roles = COALESCE($5, target_roles),
        company_criteria = COALESCE($6, company_criteria),
        value_proposition = COALESCE($7, value_proposition),
        agent_tone = COALESCE($8, agent_tone)
      WHERE campaign_id = $9
      RETURNING *;
    `;
    
    const values = [agents || [], active_channels, daily_contact_limit, status, target_roles, company_criteria, value_proposition, agent_tone, id];
    
    const result = await pool.query(query, values);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateCampaignStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE campaigns SET status = $1 WHERE campaign_id = $2 RETURNING *',
      [status, id]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const globalPause = async (req, res) => {
  try {
    const query = `UPDATE campaigns SET status = 'Paused' WHERE status = 'Live' RETURNING *;`;
    const result = await pool.query(query);
    
    res.json({ success: true, pausedCount: result.rowCount, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getCampaignIntelligence = async (req, res) => {
  try {
    const { id } = req.params;

    const formatTimeAgo = (date) => {
      const seconds = Math.floor((new Date() - date) / 1000);
      if (seconds < 60) return 'Just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} min ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hr ago`;
      return `${Math.floor(hours / 24)} days ago`;
    };

    // Fetch Agent Logs
    const logsQuery = await pool.query(
      'SELECT agent_name as agent, action_text as action, created_at FROM agent_logs WHERE campaign_id = $1 ORDER BY created_at DESC LIMIT 10',
      [id]
    );
    const agentActivities = logsQuery.rows.map(log => ({
      agent: log.agent,
      action: log.action,
      time: formatTimeAgo(new Date(log.created_at))
    }));

    // Fetch Funnel Data
    const funnelQuery = await pool.query(
      "SELECT funnel_stage, COUNT(*) as count FROM campaign_prospects WHERE campaign_id = $1 GROUP BY funnel_stage",
      [id]
    );
    
    // Map database counts to standard funnel order
    const stages = ['Discovered', 'Researched', 'Qualified', 'Contacted', 'Engaged', 'Meeting', 'Opportunity'];
    const exactCounts = {};
    funnelQuery.rows.forEach(row => { exactCounts[row.funnel_stage || 'Discovered'] = parseInt(row.count); });
    
    // Calculate cumulative counts (waterfall) from bottom to top
    const stageCounts = {};
    let cumulative = 0;
    for (let i = stages.length - 1; i >= 0; i--) {
      cumulative += (exactCounts[stages[i]] || 0);
      stageCounts[stages[i]] = cumulative;
    }
    
    let maxCount = 1;
    const funnelData = stages.map(stage => {
      const val = stageCounts[stage] || 0;
      if (val > maxCount) maxCount = val;
      return { label: stage, value: val };
    }).map(item => ({ ...item, max: maxCount }));

    // Fetch Global Prompt Versions
    const versionsQuery = await pool.query('SELECT version_id as id, name, status, created_at FROM prompt_versions ORDER BY created_at DESC');
    const versions = versionsQuery.rows.map(v => ({
      id: v.id,
      name: v.name,
      status: v.status,
      time: v.status === 'active' ? `activated ${formatTimeAgo(new Date(v.created_at))}` : formatTimeAgo(new Date(v.created_at))
    }));

    const contactedCount = stageCounts['Contacted'] || 0;

    const channelData = [
      { label: 'Email', value: contactedCount, max: Math.max(100, contactedCount) },
      { label: 'LinkedIn', value: 0, max: 100 },
      { label: 'Calls', value: 0, max: 100 },
    ];

    res.json({
      success: true,
      data: { funnelData, channelData, agentActivities, versions }
    });

  } catch (err) {
    console.error("Error fetching campaign intelligence:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getCampaignProspects = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT p.id, p.name, p.title, p.company, p.linkedin_url, cp.funnel_stage, cp.ai_fit_reason
      FROM prospects p
      JOIN campaign_prospects cp ON p.id = cp.prospect_id
      WHERE cp.campaign_id = $1
      ORDER BY p.name ASC
    `;
    const result = await pool.query(query, [id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching prospects:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const testAgentPipeline = async (req, res) => {
  try {
    const { id } = req.params; // The campaign ID from the URL

    // 1. Hardcoded Test Data (from Ishaan's Python file)
    const rawProspect = { name: "Asha Rao", title: "VP Engineering", company: "Lumen Freight" };
    const sourceData = [
      { source: "fixture:crm", text: "Lumen Freight has 120 employees. B2B SaaS for freight brokers." },
      { source: "web:company-site", text: "Series B in August 2026. Over 200 employees." }
    ];
    const dummyIcp = {
      criteria: [{ text: "Company is a B2B SaaS company", must_have: true }],
      exclusions: ["Competitors"]
    };

    console.log("1. Calling Research Enricher...");
    const enrichResult = await callAgent({
      url: process.env.AGENT_URL_ENRICH,
      key: process.env.AGENT_KEY_ENRICH,
      message: `Prospect (raw): ${JSON.stringify(rawProspect)}\nSource data: ${JSON.stringify(sourceData)}`,
      fallback: { status: "insufficient_data" } // Fail-safe fallback
    });

    if (!enrichResult.ok) {
      return res.status(500).json({ error: "Enricher failed", details: enrichResult });
    }

    console.log("2. Normalizing AI Output in Code...");
    // This strips hallucinations and formats the data for the next agent
    const icpPayload = prepareIcpCall(
      rawProspect, 
      sourceData, 
      enrichResult.data, 
      dummyIcp, 
      "1.0.0"
    );

    let finalDecision = "needs_review";

    // 3. Call ICP Agent (Only if we have enough data to bother)
    if (icpPayload.should_call_icp) {
      console.log("3. Calling ICP Fitment Agent...");
      const icpResult = await callAgent({
        url: process.env.AGENT_URL_ICP,
        key: process.env.AGENT_KEY_ICP,
        message: icpPayload.message,
        fallback: { decision: "needs_review", criteria_results: [], missing_fields: [] }
      });

      if (icpResult.ok && icpResult.data.decision) {
        finalDecision = icpResult.data.decision;
      }
    }

    // 4. Write the activity to the Database so it shows on the UI!
    const logMessage = `Processed Asha Rao: Enrichment ${icpPayload.log.status}, ICP Decision: ${finalDecision}`;
    await pool.query(
      'INSERT INTO agent_logs (campaign_id, agent_name, action_text) VALUES ($1, $2, $3)',
      [id, 'Pipeline Test', logMessage]
    );

    // 5. Return the full trace to the browser/Postman
    res.json({
      success: true,
      message: "Pipeline executed successfully!",
      trace: {
        enricher_raw: enrichResult.data,
        normalized_prospect: icpPayload.prospect,
        final_decision: finalDecision
      }
    });

  } catch (err) {
    console.error("Pipeline Test Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { 
  getCampaigns, triggerAgent, createCampaign, getCampaignById, updateCampaign, updateCampaignStatus, globalPause, getCampaignIntelligence, getCampaignProspects, testAgentPipeline 
};