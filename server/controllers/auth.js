const bcrypt = require("bcryptjs");
const User = require("../models/user");

// get Errors result from check().isEmail()...
const { validationResult } = require("express-validator");

exports.postLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { email, isChecked } = req.body;
    const user = await User.findOne({ email: email });
    if (isChecked) {
      req.session.isLogin = true;
    }
    req.session.userId = user._id;
    req.session.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ msg: err.message, status: "error" });
  }
};

exports.postRegister = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { email, password, fullname, profilePhoto } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      fullname,
      profilePhoto,
    });
    await newUser.save();
    res
      .status(200)
      .json({ msg: "Register successfully!!!", status: "success" });
  } catch (err) {
    res.status(400).json({ msg: err.message, status: "error" });
  }
};

exports.getSession = async (req, res, next) => {
  try {
    const { isLogin, userId } = req.session;
    const user = await User.findById(userId);
    res.status(200).json({ isLogin: isLogin ? true : false, user });
  } catch (err) {
    res.status(400).json({ msg: "Something went wrong!!!" });
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    console.log("Destroy");
    req.session.destroy();
    req.session.update();
  } catch (err) {
    res.status(400).json({ msg: "Something went wrong!!!" });
  }
};
