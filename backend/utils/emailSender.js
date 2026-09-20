// backend/utils/emailSender.js
const { Resend } = require('resend');

// Fallback just in case you haven't added the key yet to prevent crashes
const resend = new Resend(process.env.RESEND);

const sendDemoEmail = async ({ toEmail, subject, content }) => {
  try {
    const { data, error } = await resend.emails.send({
      // Resend's free tier requires sending FROM this specific onboarding address
      from: 'Autonomous SDR <onboarding@resend.dev>', 
      // Resend's free tier requires sending TO the email address you signed up with
      to: [process.env.EMAIL_USER], 
      subject: subject || "AI Outreach Draft",
      html: `<p><strong>[DEMO ROUTED FROM: ${toEmail}]</strong></p><p>${content.replace(/\n/g, '<br/>')}</p>`
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error: error.message };
    }

    console.log("Email sent via Resend successfully: ", data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("Exception during email send:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendDemoEmail };