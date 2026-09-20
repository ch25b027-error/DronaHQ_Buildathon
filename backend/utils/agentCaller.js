// backend/utils/agentCaller.js
const axios = require('axios');

/**
 * Safely unwrap the DronaHQ response.
 * DronaHQ webhooks sometimes wrap the answer in nested objects.
 */
const unwrapResponse = (obj) => {
  if (!obj) return null;
  
  // If the agent returned a stringified JSON block, parse it
  if (typeof obj === 'string') {
    try {
      // Strip markdown code blocks if the AI added them
      const cleaned = obj.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      return null;
    }
  }

  // If the actual AI decision is nested inside a DronaHQ envelope
  if (obj.decision || obj.status || obj.action || obj.intent) return obj;
  if (obj.body && obj.body.message) return unwrapResponse(obj.body.message);
  if (obj.data) return unwrapResponse(obj.data);
  
  return obj;
};

/**
 * Universal wrapper to call DronaHQ agents with 1 retry and a fallback
 */
const callAgent = async ({ url, key, message, coerce, validate, fallback }) => {
  let lastError = null;
  const maxRetries = 1;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // 1. Call DronaHQ Webhook
      const response = await axios.post(
        url,
        { message: message },
        {
          headers: {
            'api-key': key, // DronaHQ requires this specific header
            'Content-Type': 'application/json'
          },
          timeout: 90000 // 90 second timeout as requested in handoff
        }
      );

      // 2. Unwrap the nested response
      let data = unwrapResponse(response.data);
      if (!data) throw new Error("Failed to parse JSON from agent");

      // 3. Coerce and Validate (Fix boolean strings, check enums)
      if (coerce) data = coerce(data);
      if (validate) validate(data); // Should throw Error if invalid

      return { ok: true, data: data };

    } catch (error) {
      lastError = error.message || "Unknown API Error";
      console.warn(`Agent call failed (Attempt ${attempt + 1}): ${lastError}`);
    }
  }

  // If we exhaust retries, return the safe fallback
  console.error(`Agent failed permanently. Using fallback. Error: ${lastError}`);
  return { ok: false, data: fallback, error: lastError };
};

module.exports = { callAgent };