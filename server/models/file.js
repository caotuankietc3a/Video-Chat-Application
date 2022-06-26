const { Schema, model } = require("mongoose");
const fileSchema = new Schema({
  images: [
    {
      type: String,
      default: "",
    },
  ],
  attachments: [
    {
      type: String,
      default: "",
    },
  ],
});

module.exports = model("File", fileSchema);
