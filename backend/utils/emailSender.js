// backend/utils/emailSender.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  family: 4 // This prevents the IPv6 crash on Render
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