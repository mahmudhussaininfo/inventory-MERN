import nodemailer from "nodemailer";

const sendEmail = async (to, sub, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASS, // generated ethereal password
    },

    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `Enventory MERN <${process.env.EMAIL_USER}>`,
    to: to,
    subject: sub,
    text: text,
  };

  return await transporter.sendMail(mailOptions);
};

export default sendEmail;
