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
  },
  password: {
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
  facebook: {
    type: String,
    default: "Unknown facebook site",
  },
  instagram: {
    type: String,
    default: "Unknown instagram site",
  },
  twitter: {
    type: String,
    default: "Unknown twitter site",
  },
  twoFA: {
    is2FAEnabled: {
      type: Boolean,
      default: false,
    },
    secret: {
      type: String,
      default: "",
    },
  },
  provider: {
    type: String,
    default: "",
  },
});

module.exports = model("User", userSchema);
