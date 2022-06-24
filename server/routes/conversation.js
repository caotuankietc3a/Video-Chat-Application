const express = require("express");
const { upload } = require("../middleware/upload-file");
const router = express.Router();
const {
  postNewGroupConversation,
  getConversations,
  getConversationDetail,
  postNewMessage,
  getMessages,
  postNewConversation,
} = require("../controllers/conversation");

router.post(
  "/new-group-conversation",
  upload.single("groupImg"),
  postNewGroupConversation
);
router.get("/:userId", getConversations);
router.get("/detail/:conversationId", getConversationDetail);
router.get("/messages/:conversationId", getMessages);
router.post("/new-message", postNewMessage);
router.post("/new-conversation", postNewConversation);

module.exports = router;
