const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD_EMAIL,
  },
});

function sendEmail(payload, content, subject) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: payload.email,
    subject: subject,
    text: content,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Success sent email + ${info.response}`);
    }
  });
}

module.exports = sendEmail;
