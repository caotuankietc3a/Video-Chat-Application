const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const replySchema = new Schema({
  messageId: {
    type: String,
    required: true,
  },
  replyer: {
    type: String,
    default: "",
  },
  replyee: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
  haveImages: {
    type: Boolean,
    default: false,
  },
  haveAttachments: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Reply", replySchema);
