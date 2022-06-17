const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
  profilePhoto: {
    type: String,
    default: "/images/user-img.jpg",
  },
  birthdate: {
    type: String,
    default: "Unknown birthdate",
  },
  phone: {
    type: String,
    default: "Unkown phone",
  },
  website: {
    type: String,
    default: "Unknown website",
  },
  address: {
    type: String,
    default: "Unknown address",
  },
  status: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("User", userSchema);
