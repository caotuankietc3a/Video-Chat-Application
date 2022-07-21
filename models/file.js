const { Schema, model } = require("mongoose");
const fileSchema = new Schema({
  images: [
    {
      type: Schema.Types.Mixed,
      default: {},
    },
  ],
  attachments: [
    {
      type: Schema.Types.Mixed,
      default: {},
    },
  ],
});

module.exports = model("File", fileSchema);
