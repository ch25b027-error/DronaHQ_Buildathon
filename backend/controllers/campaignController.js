const pool = require('../db'); // Assuming db.js exports your pg pool

const getCampaigns = async (req, res) => {
  try {
    const query = `
      SELECT c.campaign_id, c.name, c.status, c.created_at,
      COUNT(DISTINCT cp.prospect_id) AS total_prospects
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
  const { id } = req.params;
  const { agent_type } = req.body;
  res.json({ success: true, message: `Triggered ${agent_type} for campaign ${id}` });
};

module.exports = { getCampaigns, triggerAgent };