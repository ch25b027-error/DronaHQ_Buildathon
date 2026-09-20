const axios = require('axios');

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

const callAgent = async ({ url, key, message, coerce, validate, fallback }) => {
  let lastError = null;
  const maxRetries = 1;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(
        url,
        { message: message },
        {
          headers: {
            'api-key': key, 
            'Content-Type': 'application/json'
          },
          timeout: 90000 
        }
      );

      let data = unwrapResponse(response.data);
      if (!data) throw new Error("Failed to parse JSON from agent");

      if (coerce) data = coerce(data);
      if (validate) validate(data); 

      return { ok: true, data: data };

    } catch (error) {
      lastError = error.message || "Unknown API Error";
      console.warn(`Agent call failed (Attempt ${attempt + 1}): ${lastError}`);
    }
  }

  console.error(`Agent failed permanently. Using fallback. Error: ${lastError}`);
  return { ok: false, data: fallback, error: lastError };
};

module.exports = { callAgent };