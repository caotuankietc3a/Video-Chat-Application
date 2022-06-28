const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const conversationSchema = new Schema({
  name: {
    type: String,
    default: "Group name",
  },
  profilePhoto: {
    type: String,
    default: "/images/user-img.jpg",
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [
    {
      _id: {
        type: String,
        default: uuidv4(),
      },
      sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        default: "",
      },
      files: {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
      date: {
        type: Date,
        default: new Date(Date.now()),
      },
      reply: {
        type: Schema.Types.Mixed,
        default: null,
      },
      forward: {
        type: Schema.Types.Mixed,
        default: null,
      },
    },
  ],
});

module.exports = model("Conversation", conversationSchema);
