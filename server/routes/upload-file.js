const express = require("express");
const router = express.Router();
const { getImages, getImageDetail } = require("../controllers/upload-file.js");

router.get("/", getImages);
router.get("/:filename", getImageDetail);

module.exports = router;
