const nodemailer = require("nodemailer");
require("dotenv").config();
const { NODEMAILER_API_PASS, NODEMAILER_API_USER, REACT_URL } = process.env;

// Need to change method authentication in google (2FA) into App method;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: NODEMAILER_API_USER,
    pass: NODEMAILER_API_PASS,
  },
});

async function sendMailFunction(email, token) {
  try {
    const url = `${REACT_URL}/auth/new-password?token=${token}`;

    const msg = {
      from: NODEMAILER_API_USER, // sender address
      to: email, // list of receivers
      subject: "Reset password!!",
      html: `<strong>Hello</strong> <i>${email}</i>.
        <br/>A request has been received to change the password for your Video Chat App account. 
        Please click <a href=${url}>here</a> to reset your password!!!
      `,
    };
    await transporter.sendMail(msg);
  } catch (err) {
    console.error(err);
  }
}

async function sendInvitationMessage({ senderEmail, receiverEmail, textArea }) {
  try {
    const url = `${REACT_URL}/auth/login`;

    const msg = {
      from: NODEMAILER_API_USER, // sender address
      to: receiverEmail, // list of receivers
      subject: "Invitation message to join into Video Chat App!!",
      html: `<strong>Hello</strong> <i>${receiverEmail}</i>.
        <br/>An invite request has been sended to you from ${senderEmail} account. <br/>
        <p><strong>Message:</strong> ${textArea}</p>
        Please click <a href=${url}>here</a> to participate in Video Chat App with me!!!
      `,
    };
    await transporter.sendMail(msg);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { sendMailFunction, sendInvitationMessage };
