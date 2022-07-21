const express = require('express');
const router = express.Router();
const {getFriends, getFriendDetail} = require('../controllers/friend');

router.get("/:userId", getFriends);
router.get("/detail/:friendId", getFriendDetail);

module.exports = router;
