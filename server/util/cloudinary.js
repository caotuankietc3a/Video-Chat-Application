require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_NAME } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploads = ({ fileName, folderName }, data) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      data,
      {
        upload_preset: folderName,
        resource_type: "auto",
        public_id: fileName,
      },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );
  });
};

const deletes = ({ public_id, resource_type }) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      public_id,
      {
        resource_type: resource_type,
      },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );
  });
};

module.exports = { cloudinary, uploads, deletes };
