require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_NAME } =
  process.env;
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

module.exports = { cloudinary };
