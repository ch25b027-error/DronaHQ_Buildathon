// backend/utils/emailSender.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendDemoEmail = async ({ toEmail, subject, content }) => {
  try {
    // DEMO HACK: For the presentation, you can force all AI emails 
    // to go to your own inbox so you can show the judges!
    const demoRecipient = process.env.EMAIL_USER; 

    const mailOptions = {
      from: `"Autonomous AI SDR" <${process.env.EMAIL_USER}>`,
      to: demoRecipient, // Sends to your inbox for the demo
      subject: subject || "AI Outreach Draft",
      text: `[DEMO ROUTED FROM: ${toEmail}]\n\n${content}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: ", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendDemoEmail };