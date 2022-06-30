const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { sendMailFunction } = require("../util/mailer");

// get Errors result from check().isEmail()...
const { validationResult } = require("express-validator");
const { uploads, deletes } = require("../util/cloudinary");

exports.postLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { email } = req.body;
    const user = await User.findOneAndUpdate(
      { email: email },
      { status: true },
      { new: true }
    ).select("-password");

    req.session.isLogin = true;
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
    const { type } = req.query;
    const status = parseInt(type) ? true : isLogin ? true : false;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        status,
      },
      { new: true }
    ).select("-password");
    res.status(200).json({ isLogin: isLogin ? true : false, user });
  } catch (err) {
    res.status(400).json({ msg: "Something went wrong!!!" });
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    const { user } = req.body;
    await User.findOneAndUpdate(
      { email: user.email },
      { status: false },
      { new: true }
    );
    req.session.destroy();
    next();
  } catch (err) {
    res.status(400).json({ msg: "Something went wrong!!!" });
  }
};

exports.postUpdateAccountProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const oldUser = await User.findById(userId);

    if (oldUser.profilePhoto.cloudinary_id !== "") {
      await deletes({
        public_id: oldUser.profilePhoto.cloudinary_id,
        resource_type: "image",
      });
    }

    const {
      fullname,
      anotherEmail,
      website,
      birthdate,
      phone,
      address,
      profilePhoto,
    } = req.body;

    const uploadedProfile = await uploads(
      { filename: profilePhoto.name, folderName: "images-profile" },
      profilePhoto.url
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullname: fullname.trim(),
        website: website.trim(),
        birthdate: birthdate.trim(),
        phone: phone,
        address: address.trim(),
        profilePhoto: {
          url: uploadedProfile.url,
          name: profilePhoto.name,
          cloudinary_id: uploadedProfile.public_id,
        },
      },
      { new: true }
    );
    res.status(200).json({ updatedUser });
  } catch (err) {
    console.error(err);
  }
};

exports.postUpdateSocialProfile = async (req, res, next) => {
  const body = req.body;
  console.log(body);
  const { userId } = req.params;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      facebook: body?.facebook ? body.facebook.trim() : "",
      instagram: body?.instagram ? body.instagram.trim() : "",
      twitter: body?.twitter ? body.twitter.trim() : "",
    },
    { new: true }
  );
  console.log(updatedUser);
  res.status(200).json({ updatedUser });
};

exports.postUpdatePasswordProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { userId } = req.params;
    const { newPassword } = req.body;
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });
    await sendMailFunction();
    res.status(200).json({ msg: "Update new password successfully!!" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
