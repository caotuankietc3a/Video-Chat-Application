const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const conversationSchema = new Schema({
  name: {
    type: String,
    default: "",
  },
  profilePhoto: {
    url: {
      type: String,
      default: "/images/user-img.jpg",
    },
    name: {
      type: String,
      default: "",
    },
    cloudinary_id: {
      type: String,
      default: "",
    },
  },
  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
      isBlock: {
        type: Boolean,
        default: false,
      },
      // type: Schema.Types.ObjectId,
      // ref: "User",
      // required: true,
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
        type: Schema.Types.ObjectId,
        ref: "Reply",
      },
      forward: {
        type: Schema.Types.Boolean,
        default: false,
      },
    },
  ],
  meetings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Meeting",
    },
  ],
});

module.exports = model("Conversation", conversationSchema);
