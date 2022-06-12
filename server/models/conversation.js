const { Schema, model } = require("mongoose");
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
      senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        default: "",
      },
      date: {
        type: Date,
        default: new Date(Date.now()),
      },
      reply: {
        type: Schema.Types.Mixed,
        default: null,
      },
    },
  ],
});

module.exports = model("Conversation", conversationSchema);
