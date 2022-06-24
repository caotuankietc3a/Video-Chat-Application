const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

const storage = new GridFsStorage({
  url: process.env.MONGOOSE_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (error, buf) => {
        if (error) {
          return reject(error);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "images", // should match gfs.collection()
        };
        resolve(fileInfo);
      });
    });
  },
});

module.exports = {
  upload: multer({ storage }),
};
