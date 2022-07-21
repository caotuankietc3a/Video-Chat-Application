const express = require("express");
const router = express.Router();
const { getMeetings, getMeetingDetail } = require("../controllers/meeting.js");

router.get("/", getMeetings);
router.get("/detail/:meetingId", getMeetingDetail);

module.exports = router;
