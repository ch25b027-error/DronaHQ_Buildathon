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
    const mailOptions = {
      from: `"Autonomous AI SDR" <${process.env.EMAIL_USER}>`,
      to: toEmail, // Sends to the fake prospect directly
      subject: subject || "AI Outreach Draft",
      text: content
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