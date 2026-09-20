const pool = require('../db');
const { sendDemoEmail } = require('../utils/emailSender');

const getPendingApprovals = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pending_drafts WHERE status = 'pending' ORDER BY created_at ASC"
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, draft_content, subject_line } = req.body; // status can be 'approved' or 'rejected'

    // 1. Update database status
    const result = await pool.query(
      "UPDATE pending_drafts SET status = $1, draft_content = COALESCE($2, draft_content) WHERE id = $3 RETURNING *",
      [status, draft_content, id]
    );

    const draft = result.rows[0];

    // 2. UPDATE FUNNEL STAGE to 'Contacted' so metrics increase
    if (status === 'approved' && draft) {
      await pool.query(
        `UPDATE campaign_prospects 
         SET funnel_stage = 'Contacted' 
         WHERE campaign_id = $1 AND prospect_id = (SELECT id FROM prospects WHERE name = $2 LIMIT 1)`,
        [draft.campaign_id, draft.prospect_name]
      );
    }

    // 3. FIRE THE REAL EMAIL TO INBOX!
    if (status === 'approved' && draft) {
      // Create a dummy prospect email if one doesn't exist in DB
      const mockEmail = `${draft.prospect_name.replace(/\s+/g, '.').toLowerCase()}@${draft.prospect_company.replace(/\s+/g, '').toLowerCase()}.com`;
      
      await sendDemoEmail({
        toEmail: mockEmail,
        subject: subject_line || `Outreach from SDR Control to ${draft.prospect_name}`,
        content: draft.draft_content
      });

      return res.json({ success: true, data: draft, message: 'Draft approved and email sent to your inbox!' });
    }

    res.json({ success: true, data: draft, message: 'Draft updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getSettings = async (req, res) => {
  try {
    const result = await pool.query("SELECT value FROM app_settings WHERE key = 'human_in_the_loop'");
    const isEnabled = result.rows.length > 0 ? result.rows[0].value === 'true' : true;
    res.json({ success: true, humanInTheLoop: isEnabled });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { enabled } = req.body;
    await pool.query(
      "INSERT INTO app_settings (key, value) VALUES ('human_in_the_loop', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
      [enabled ? 'true' : 'false']
    );
    res.json({ success: true, humanInTheLoop: enabled });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getPendingApprovals, updateApproval, getSettings, updateSettings };

