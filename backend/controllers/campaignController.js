const pool = require('../db'); // Assuming db.js exports your pg pool

const getCampaigns = async (req, res) => {
  try {
    const query = `
      SELECT c.campaign_id, c.name, c.status, c.created_at, c.owner, c.icp,
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

const createCampaign = async (req, res) => {
  try {
    const { 
      name, owner, description, icp, geography, target_roles, 
      company_criteria, exclusion_criteria, daily_contact_limit, status 
    } = req.body;

    const query = `
      INSERT INTO campaigns (
        name, owner, description, icp, geography, target_roles, 
        company_criteria, exclusion_criteria, daily_contact_limit, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    
    const values = [
      name, owner, description, icp, geography, target_roles, 
      company_criteria, exclusion_criteria, daily_contact_limit, status || 'Draft'
    ];
    
    const result = await pool.query(query, values);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
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
    const { agents, active_channels, daily_contact_limit, status } = req.body;

    const query = `
      UPDATE campaigns 
      SET agents = $1, active_channels = $2, daily_contact_limit = $3, status = COALESCE($4, status)
      WHERE campaign_id = $5
      RETURNING *;
    `;
    
    // Default agents to empty array if none selected
    const values = [agents || [], active_channels, daily_contact_limit, status, id];
    
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
    // Only target 'Live' campaigns, leaving 'Draft', 'Completed', or already 'Paused' alone
    const query = `UPDATE campaigns SET status = 'Paused' WHERE status = 'Live' RETURNING *;`;
    const result = await pool.query(query);
    
    res.json({ success: true, pausedCount: result.rowCount, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update your exports to include it
module.exports = { 
  getCampaigns, triggerAgent, createCampaign, getCampaignById, updateCampaign, updateCampaignStatus, globalPause 
};