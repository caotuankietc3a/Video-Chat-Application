const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { randomBytes } = require("crypto");
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

const saveSession = (session, userId) => {
  session.isLogin = true;
  session.cookieExpiration = Date.now() + 1000 * 60 * 60 * 10;
  session.userId = userId;
  session.save();
};

exports.postLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { email } = req.body;
    const user = await User.findOne({
      email: email,
      provider: "",
    });
    if (user) {
      if (user.twoFA.is2FAEnabled) {
        return res.status(200).json({ status: "enable2FA", userId: user._id });
      } else {
        user.status = true;
        await user.save();
        saveSession(req.session, user._id);
        return res.status(200).json({ user, status: "success" });
      }
    } else {
      res.status(200).json({ msg: "User didn't exit!!!", status: "error" });
    }
  } catch (err) {
    res.status(400).json({ msg: err.message, status: "error" });
  }
};

exports.postLoginOther = async (req, res, next) => {
  try {
    const { email, fullname, profilePhoto, phone } = req.body;
    const { type } = req.query;
    const user = await User.findOne({ email: email, provider: type }).select(
      "-password -twoFA.secret"
    );
    if (user) {
      if (user.twoFA.is2FAEnabled) {
        return res.status(200).json({ status: "enable2FA", userId: user._id });
      }
      user.status = true;
      await user.save();
      saveSession(req.session, user._id);
      res.status(200).json({
        user,
        status: "success",
      });
    } else {
      const newUser = await new User({
        email,
        fullname,
        profilePhoto,
        phone: phone ? phone : "Unkown phone",
        status: true,
        provider: type,
      }).save();
      const findedUser = await User.findById(newUser._id).select(
        "-password -twoFA.secret"
      );

      saveSession(req.session, user._id);
      res.status(200).json({ user: findedUser, status: "success" });
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
    if (Date.now() - req.session.cookieExpiration >= 0) {
      throw new Error("Your session cookie has been expired!!!");
    }
    const { isLogin, userId } = req.session;
    const { type } = req.query;
    const status = parseInt(type) ? true : isLogin ? true : false;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        status,
      },
      { new: true }
    ).select("-password -twoFA.secret");
    res.status(200).json({ isLogin: isLogin ? true : false, user });
  } catch (err) {
    res.status(400).json({ msg: err.message, status: "error" });
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
            is2FAEnabled: true,
            secret: uniqueSecret,
          },
        },
        { new: true }
      ).select("-password -twoFA.secret");
      const otpAuth = generateOTPToken(
        updatedUser.email,
        "chat-zoom.com",
        uniqueSecret
      );
      const QRCodeUrl = await generateQRCode(otpAuth);
      return res
        .status(200)
        .json({ QRCodeUrl, status: "success", user: updatedUser });
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          twoFA: {
            is2FAEnabled: false,
            secret: "",
          },
        },
        { new: true }
      ).select("-password -twoFA.secret");
      return res.status(200).json({ status: "cancel", user: updatedUser });
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
      ).select("-password -twoFA.secret");

      saveSession(req.session, user._id);
      res
        .status(200)
        .json({ msg: "success", status: "valid", user: updatedUser });
    }
  } catch (err) {
    res.status(400).json({ msg: "Error!" });
  }
};

exports.postReset = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { email } = req.body;

    randomBytes(32, async (err, buf) => {
      try {
        if (err) {
          console.error(err);
          throw new Error(err);
        }
        const token = buf.toString("hex");
        await User.findOneAndUpdate(
          {
            email,
            provider: "",
          },
          {
            resetPassword: {
              resetToken: token,
              resetTokenExpiration: Date.now() + 36000000,
            },
          },
          { new: true }
        );

        await sendMailFunction(email, token);
        res.status(200).json({
          msg: "Please check your email to reset your password!!!",
          status: "success",
        });
      } catch (err) {
        res.status(404).json({ status: "error", msg: err });
      }
    });
  } catch (err) {
    res.status(404).json({ status: "error", msg: err.message });
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    const { token } = req.query;
    const { password } = req.body;

    const newHashPass = await bcrypt.hash(password, 12);

    const user = await User.findOneAndUpdate(
      {
        $and: [
          { "resetPassword.resetToken": token },
          { "resetPassword.resetTokenExpiration": { $gt: Date.now() } },
        ],
      },
      {
        resetPassword: {
          resetTokenExpiration: null,
          resetToken: null,
        },
        password: newHashPass,
      },
      { new: true }
    );

    if (!user) {
      throw new Error("Your reset token had been expired!!!");
    }

    res
      .status(200)
      .json({ status: "success", msg: "Change your password successfully!!!" });
  } catch (err) {
    res.status(404).json({ status: "error", msg: err.message });
  }
};
