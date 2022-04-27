const {Schema, model} = require('mongoose');
const meetingSchema = new Schema({
   caller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
   },
   callee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
   },
   stream: {
      type: Schema.Types.Mixed,
      default: {}
   },
   signal: {
      type: Schema.Types.Mixed,
      default: {}
   }
});

module.exports = model("Meeting", meetingSchema);
