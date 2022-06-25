const mongoose = require("mongoose");
const conn = mongoose.createConnection(process.env.MONGOOSE_URL);
const Grid = require("gridfs-stream");

let gridFSBucket;
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("images");
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "images",
  });
  // all set!
});

exports.getImages = (req, res, next) => {
  gfs.files.find().toArray((error, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ error: "Files no exists !!!" });
    }
    return res.json({ files: files });
  });
};

exports.getImageDetail = (req, res, next) => {
  const { filename } = req.params;
  gfs.files.findOne({ filename: filename }, (error, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ error: "Files no exists !!!" });
    }
    if (
      file.contentType === "image/jpeg" ||
      file.contentType === "image/png" ||
      file.contentType === "image/jpg"
    ) {
      // let readstream = gfs.createReadStream(file._id);
      // readstream.pipe(res);
      const readStream = gridFSBucket.openDownloadStream(file._id);
      return readStream.pipe(res);
    } else {
      return res.status(404).json({ error: "Please pick an image !!!" });
    }
  });
};
