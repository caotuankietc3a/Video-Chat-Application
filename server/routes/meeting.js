const express = require("express");
const router = express.Router();
const { getMeetings } = require("../controllers/meeting.js");

router.get("/", getMeetings);

module.exports = router;
