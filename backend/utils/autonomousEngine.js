const pool = require('../db');
const { callAgent } = require('./agentCaller');
const { prepareIcpCall } = require('./enrichmentToIcp');
const { sendDemoEmail } = require('./emailSender'); // Import your Nodemailer sender

const runAutonomousCycle = async () => {
  try {
    console.log("🤖 [AI Engine] Waking up to check for work...");

    const liveCampaigns = await pool.query(`SELECT * FROM campaigns WHERE status = 'Live'`);
    
    if (liveCampaigns.rows.length === 0) {
      return;
    }

    for (const campaign of liveCampaigns.rows) {
      // Find prospects still stuck at 'Discovered'
      const prospectsQuery = await pool.query(`
        SELECT p.*, cp.prospect_id 
        FROM campaign_prospects cp
        JOIN prospects p ON cp.prospect_id = p.id
        WHERE cp.campaign_id = $1 AND cp.funnel_stage = 'Discovered'
        LIMIT 1 
      `, [campaign.campaign_id]);

      if (prospectsQuery.rows.length === 0) continue;

      const prospect = prospectsQuery.rows[0];
      console.log(`🤖 [AI Engine] Processing prospect: ${prospect.name} at ${prospect.company}`);

      // 1. Run Research Enricher
      const sourceData = [{ source: "fixture:crm", text: `${prospect.company} is a fast-growing tech company.` }];
      const campaignIcp = campaign.icp_json ? JSON.parse(campaign.icp_json) : { criteria: [], exclusions: [] };

      const enrichResult = await callAgent({
        url: process.env.AGENT_URL_ENRICH,
        key: process.env.AGENT_KEY_ENRICH,
        message: `Prospect (raw): ${JSON.stringify(prospect)}\nSource data: ${JSON.stringify(sourceData)}`,
        fallback: { status: "insufficient_data" }
      });

      if (!enrichResult.ok) continue;

      const icpPayload = prepareIcpCall(prospect, sourceData, enrichResult.data, campaignIcp, "1.0.0");
      let finalDecision = "needs_review";

      // 2. Run ICP Fitment Agent
      if (icpPayload.should_call_icp) {
        const icpResult = await callAgent({
          url: process.env.AGENT_URL_ICP,
          key: process.env.AGENT_KEY_ICP,
          message: icpPayload.message,
          fallback: { decision: "needs_review" }
        });
        if (icpResult.ok && icpResult.data.decision) finalDecision = icpResult.data.decision;
      }

      // 3. Run Personalisation Agent to draft the email!
      console.log(`✍️ [AI Engine] Running Personalisation Agent for ${prospect.name}...`);
      const personalisationResult = await callAgent({
        url: process.env.AGENT_URL_PERSONALISE,
        key: process.env.AGENT_KEY_PERSONALISE,
        message: `Prospect: ${JSON.stringify(icpPayload.prospect)}\nStrategy decision: {"channel":"email","action":"contact_now"}\nKnowledge snippets: [{"source":"case_study:acme","text":"Our platform saves engineering teams 30% on infrastructure costs."}]\nCampaign tone: "consultative"`,
        fallback: { status: "escalate", body: `Hi ${prospect.name},\n\nSaw you're leading engineering at ${prospect.company}. Would love to connect about infrastructure optimization.` }
      });

      const emailBody = personalisationResult.data?.body || `Hi ${prospect.name}, caught your profile at ${prospect.company}. Let's connect!`;
      const subjectLine = personalisationResult.data?.subject || `Scaling engineering at ${prospect.company}`;

      // 4. CHECK IF HUMAN-IN-THE-LOOP IS ENABLED
      const settingsQuery = await pool.query("SELECT value FROM app_settings WHERE key = 'human_in_the_loop'");
      const hitlEnabled = settingsQuery.rows.length > 0 ? settingsQuery.rows[0].value === 'true' : true;

      if (hitlEnabled) {
        // PUT IN APPROVAL QUEUE
        await pool.query(
          `INSERT INTO pending_drafts (campaign_id, prospect_name, prospect_title, prospect_company, channel, draft_content, status) 
           VALUES ($1, $2, $3, $4, 'Email', $5, 'pending')`,
          [campaign.campaign_id, prospect.name, prospect.title, prospect.company, emailBody]
        );

        // UPDATE FUNNEL STAGE TO 'Qualified'
        await pool.query(
          `UPDATE campaign_prospects SET funnel_stage = 'Qualified' WHERE campaign_id = $1 AND prospect_id = $2`,
          [campaign.campaign_id, prospect.id]
        );

        const logMessage = `Drafted outreach for ${prospect.name} and added to Approval Queue.`;
        await pool.query(
          'INSERT INTO agent_logs (campaign_id, agent_name, action_text) VALUES ($1, $2, $3)',
          [campaign.campaign_id, 'Personalisation Agent', logMessage]
        );
        console.log(`✅ [AI Engine] Draft added to queue for ${prospect.name}`);
      } else {
        // SEND DIRECTLY
        const mockEmail = `${prospect.name.replace(/\s+/g, '.').toLowerCase()}@${prospect.company.replace(/\s+/g, '').toLowerCase()}.com`;
        await sendDemoEmail({
          toEmail: mockEmail,
          subject: subjectLine,
          content: emailBody
        });

        // UPDATE FUNNEL STAGE TO 'Contacted'
        await pool.query(
          `UPDATE campaign_prospects SET funnel_stage = 'Contacted' WHERE campaign_id = $1 AND prospect_id = $2`,
          [campaign.campaign_id, prospect.id]
        );

        const logMessage = `Sent AI outreach email to ${prospect.name} (${prospect.company}) automatically.`;
        await pool.query(
          'INSERT INTO agent_logs (campaign_id, agent_name, action_text) VALUES ($1, $2, $3)',
          [campaign.campaign_id, 'Personalisation Agent', logMessage]
        );
        console.log(`✅ [AI Engine] Outreach automatically sent to ${prospect.name}`);
      }
    }
  } catch (err) {
    console.error("❌ [AI Engine] Error during cycle:", err);
  }
};

const startEngine = () => {
  console.log("🚀 Autonomous AI SDR Engine Initialized with Nodemailer integration.");
  setInterval(runAutonomousCycle, 10 * 60 * 1000); // Checks every 15 minutes
};

module.exports = { startEngine };