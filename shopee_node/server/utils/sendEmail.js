const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // use TLS STARTTLS (not SSL)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
   logger: true,
  debug: true, // show debug output
});

const sendEmail = async (to, subject, otp) => {
  await transporter.sendMail({
    from: `"Shoppee" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
  });
};

module.exports = sendEmail;
