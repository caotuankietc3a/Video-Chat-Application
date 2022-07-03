const User = require("../models/user");
const { check, body } = require("express-validator");
const bcryptjs = require("bcryptjs");

exports.checkEmailPassword = (method) => {
  switch (method) {
    case "login": {
      return check("email")
        .isEmail()
        .withMessage("Invalid Email. Please enter the correct one!!!")
        .custom(async (_value, { req }) => {
          const { email, password } = req.body;
          const user = await User.findOne({ email, provider: "" });
          if (!user) {
            return Promise.reject("User didn't exist !!!");
          }
          const matchPassword = await bcryptjs.compare(password, user.password);
          if (!matchPassword) {
            return Promise.reject("Password does not match!!!");
          }
          return true;
        });
    }
    case "register": {
      return [
        check("email")
          .isEmail()
          .withMessage("Invalid Email. Please enter the correct one!!!")
          .normalizeEmail()
          .custom(async (value) => {
            const user = await User.findOne({ email: value, provider: "" });
            if (user) {
              return Promise.reject("Email already in use!!!");
            }
          }),
        body(
          "password",
          "Password should contain one uppercase , one lower case, one special char, one digit!!!"
        )
          .trim()
          .isLength({ min: 8, max: 20 })
          .withMessage(
            "Password should contain at least 8 and max 20 chars long"
          )
          .isStrongPassword({
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          }),
        body("confirmpassword")
          .trim()
          .custom((value, { req }) => {
            if (value !== req.body.password)
              throw new Error(
                "Password confirmation does not match password!!!"
              );
            return true;
          }),
      ];
    }
    case "reset": {
      return check("email")
        .isEmail()
        .withMessage("Invalid Email. Please enter the correct one!!!")
        .normalizeEmail()
        .custom(async (value) => {
          const user = await User.findOne({ email: value, provider: "" });
          if (!user) {
            return Promise.reject("User didn't exist !!!");
          }
          return true;
        });
    }
  }
};

exports.checkUpdatePassword = () => {
  return [
    body("oldPassword")
      .trim()
      .custom(async (val, { req }) => {
        const { userId } = req.params;
        console.log(userId);
        const user = await User.findById(userId);
        if (!user) {
          return Promise.reject("User didn't exist !!!");
        }
        const matchPassword = await bcryptjs.compare(val, user.password);
        if (!matchPassword) {
          return Promise.reject("Current password is not valid!!!");
        }
        return true;
      }),
    body(
      "newPassword",
      "New password should contain one uppercase , one lower case, one special char, one digit!!!"
    )
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage(
        "New password should contain at least 8 and max 20 chars long"
      )
      .isStrongPassword({
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }),
    body("repeatPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.newPassword)
          throw new Error(
            "Password confirmation does not match the new password!!!"
          );
        return true;
      }),
  ];
};
