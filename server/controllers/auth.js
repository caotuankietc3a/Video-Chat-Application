const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { sendMailFunction } = require("../util/mailer");
const {
  generateUniqueSecret,
  generateQRCode,
  generateOTPToken,
  verifyOTPToken,
} = require("../util/2fa");

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
    const user = await User.findOne({ email: email });
    if (user.twoFA.is2FAEnabled) {
      return res.status(200).json({ status: "enable2FA", userId: user._id });
    } else {
      const user = await User.findOneAndUpdate(
        { email: email },
        { status: true },
        { new: true }
      ).select("-password");

      req.session.isLogin = true;
      req.session.userId = user._id;
      req.session.save();
      return res.status(200).json({ user, status: "success" });
    }
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
    console.log(user);
    await User.findOneAndUpdate(
      { email: user.email },
      { status: false },
      { new: true }
    );
    req.session.destroy();
    res.status(200).json({ msg: "Successfully!!!" });
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
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { userId } = req.params;
    const { newPassword } = req.body;
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });
    // await sendMailFunction();
    res
      .status(200)
      .json({ msg: "Update new password successfully!!", status: "success" });
  } catch (err) {
    res.status(400).json({ msg: err.message, status: "error" });
  }
};

exports.postUpdateSecurityProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { is2FAEnabled } = req.body;
    if (is2FAEnabled) {
      const uniqueSecret = generateUniqueSecret();
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          twoFA: {
            is2FAEnabled: is2FAEnabled,
            secret: uniqueSecret,
          },
        },
        { new: true }
      );
      const otpAuth = generateOTPToken(
        updatedUser.email,
        "chat-zoom.com",
        uniqueSecret
      );
      const QRCodeUrl = await generateQRCode(otpAuth);
      return res.status(200).json({ QRCodeUrl, status: "success" });
    } else {
      await User.findByIdAndUpdate(
        userId,
        {
          twoFA: {
            is2FAEnabled: is2FAEnabled,
            secret: "",
          },
        },
        { new: true }
      );
      return res.status(200).json({ status: "cancel" });
    }
  } catch (err) {
    console.error(err);
  }
};

exports.postVerify2FA = async (req, res, next) => {
  try {
    const { otpToken } = req.body;
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    const isValid = verifyOTPToken(otpToken, user.twoFA.secret);
    if (!isValid) {
      res.status(200).json({
        msg: "Invalid 2FA token! Please try another one!!!",
        status: "invalid",
      });
    } else {
      const updatedUser = await User.findOneAndUpdate(
        userId,
        { status: true },
        { new: true }
      ).select("-password");
      req.session.isLogin = true;
      req.session.userId = user._id;
      req.session.save();
      res
        .status(200)
        .json({ msg: "success", status: "valid", user: updatedUser });
    }
  } catch (err) {
    res.status(400).json({ msg: "Error!" });
  }
};
