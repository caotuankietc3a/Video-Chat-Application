const { Schema, model } = require("mongoose");
const meetingSchema = new Schema({
  caller: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  callee: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // stream: {
  //   type: Schema.Types.Mixed,
  //   default: {},
  // },
  // signal: {
  //   type: Schema.Types.Mixed,
  //   default: {},
  // },
  date: {
    type: Date,
    default: new Date(Date.now()),
  },
  callAccepted: {
    type: Boolean,
    default: false,
    required: true,
  },
  timeCall: {
    type: String,
    default: "0s",
  },
});

module.exports = model("Meeting", meetingSchema);
