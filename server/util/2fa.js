const qrcode = require("qrcode");
const { authenticator } = require("otplib");
// const SHA1 = require("crypto-js/en");
// const Crypto = require("crypto-js");
// const { randomBytes } = require("crypto");
authenticator.options = {
  window: 1,
  algorithm: "sha1",
};
const generateUniqueSecret = () => {
  // let secret = SHA1("Message", { outputLength: 32 });
  //
  // console.log(secret);
  return authenticator.generateSecret();
  // return authenticator.generate(secret.words);
};
const generateOTPToken = (username, serviceName, secret) => {
  return authenticator.keyuri(username, serviceName, secret);
};
const verifyOTPToken = (token, secret) => {
  return authenticator.verify({ token, secret });
  // return authenticator.check(token, secret);
};
const generateQRCode = async (otpAuth) => {
  try {
    const QRCodeImageUrl = await qrcode.toDataURL(otpAuth);
    return QRCodeImageUrl;
  } catch (error) {
    console.error("Could not generate QR code: ", error);
  }
};

module.exports = {
  generateUniqueSecret,
  verifyOTPToken,
  generateOTPToken,
  generateQRCode,
};
