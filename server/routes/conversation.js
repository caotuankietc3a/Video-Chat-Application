const express = require("express");
const router = express.Router();
const {
  postNewGroupConversation,
  getConversations,
  getConversationDetail,
  postNewMessage,
  getMessages,
  postNewConversation,
} = require("../controllers/conversation");

router.post("/new-group-conversation", postNewGroupConversation);
router.get("/:userId", getConversations);
router.get("/detail/:conversationId", getConversationDetail);
router.get("/messages/:conversationId", getMessages);
router.post("/new-message", postNewMessage);
router.post("/new-conversation", postNewConversation);

module.exports = router;
