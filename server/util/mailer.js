const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
require("dotenv").config();
const { REACT_URL, NODEMAILER_API_KEY, NODEMAILER_API_USER } = process.env;
const options = {
  auth: {
    // api_user: NODEMAILER_API_USER,
    api_key: NODEMAILER_API_KEY,
  },
};

async function sendMailFunction() {
  try {
    console.log(new URL(REACT_URL).hostname);
    let mailer = nodemailer.createTransport(sgTransport(options));
    let info = await mailer.sendMail({
      from: "caotuankietc3a@gmail.com", // sender address
      to: "kiet.caoc3a@hcmut.edu.vn", // list of receivers
      subject: "Update password succeeded!!",
      html: "<h1>Update password succeeded!!</h1>",
    });

    console.log(info);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { sendMailFunction };
