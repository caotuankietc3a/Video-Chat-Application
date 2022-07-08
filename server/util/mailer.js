const nodemailer = require("nodemailer");
require("dotenv").config();
const { NODEMAILER_API_PASS, NODEMAILER_API_USER, REACT_URL } = process.env;

async function sendMailFunction(email, token) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      // host: "smtp.ethereal.email",
      // port: 465,
      // secure: true, // true for 465, false for other ports
      auth: {
        user: NODEMAILER_API_USER, // generated ethereal user
        pass: NODEMAILER_API_PASS, // generated ethereal password
      },
    });
    const url = `${REACT_URL}/auth/new-password?token=${token}`;

    const msg = {
      from: "caotuankietc3a@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Reset password!!",
      html: `<strong>Hello</strong> <i>${email}</i>.
        <br/>A request has been received to change the password for your Video Chat App account. 
        Please click <a href=${url}>here</a> to reset your password!!!
      `,
    };
    const info = await transporter.sendMail(msg);
    console.log(info);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { sendMailFunction };
