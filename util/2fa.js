const qrcode = require("qrcode");
const { authenticator } = require("otplib");
authenticator.options = {
  window: 1,
  algorithm: "sha1",
};
const generateUniqueSecret = () => {
  return authenticator.generateSecret();
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
