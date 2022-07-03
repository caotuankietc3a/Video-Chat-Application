const nodemailer = require("nodemailer");
require("dotenv").config();
const sgTransport = require("nodemailer-sendgrid-transport");
const sgMail = require("@sendgrid/mail");
const { REACT_URL, NODEMAILER_API_KEY, NODEMAILER_API_USER, SENDGRID_API_KEY } =
  process.env;
sgMail.setApiKey(SENDGRID_API_KEY);
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

    // const msg = {
    //   from: "caotuankietc3a@gmail.com", // sender address
    //   to: "kiet.caoc3a@hcmut.edu.vn", // list of receivers
    //   subject: "Update password succeeded!!",
    //   html: "<h1>Update password succeeded!!</h1>",
    //   text: "and easy to do anywhere, even with Node.js",
    //   templateId: "d-9af66d5891244cc3b7ae22bea80763b8 ",
    // };
    // const info1 = await sgMail.send(msg);
    // console.log(info1.body.errors);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { sendMailFunction };
