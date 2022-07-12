require("dotenv").config();
const File = require("../models/file");
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
        console.log(result);
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

const uploadsFiles = async (datas, id, folderName = "images") => {
  let newFile = null;
  const uploadedFiles = await Promise.all(
    datas.map((data) => {
      const fileName =
        folderName === "images"
          ? id + "-" + data.name.split(".")[0]
          : id + "-" + data.name;
      return uploads(
        {
          fileName: fileName,
          folderName: folderName,
        },
        data.url
      );
    })
  );
  let files = [];
  for (let i = 0; i < datas.length; i++) {
    files.push({
      url: uploadedFiles[i].url,
      name: datas[i].name,
      cloudinary_id: uploadedFiles[i].public_id,
      size: folderName === "attachments" ? datas[i].size : null,
    });
  }

  newFile = new File({
    images: folderName === "images" ? files : [],
    attachments: folderName === "attachments" ? files : [],
  });
  await newFile.save();
  return { fileId: newFile._id };
};

const deletesFiles = async (fileId) => {
  const file = await File.findByIdAndRemove(fileId);
  if (file.images.length !== 0) {
    file.images.forEach(async (img) => {
      try {
        await deletes({
          public_id: img.cloudinary_id,
          resource_type: "image",
        });
      } catch (err) {
        console.log(err);
      }
    });
  }

  if (file.attachments.length !== 0) {
    file.attachments.forEach(async (attachment) => {
      try {
        await deletes({
          public_id: attachment.cloudinary_id,
          resource_type: "raw",
        });
      } catch (err) {
        console.error(err);
      }
    });
  }
};

module.exports = { cloudinary, uploads, deletes, uploadsFiles, deletesFiles };
