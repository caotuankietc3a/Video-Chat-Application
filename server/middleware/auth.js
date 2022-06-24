const User = require("../models/user");
const { check, body } = require("express-validator");
const bcryptjs = require("bcryptjs");

exports.checkEmailPassword = (method) => {
  switch (method) {
    case "login": {
      return check("email")
        .isEmail()
        .withMessage("Invalid Email!")
        .custom(async (_value, { req }) => {
          const { email, password } = req.body;
          const user = await User.findOne({ email });
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
          .withMessage("Invalid Email!")
          .normalizeEmail()
          .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
              return Promise.reject("Email already in use!!!");
            }
          }),
        body(
          "password",
          "The password must be 5+ chars long and contain a number"
        )
          .isLength({ min: 5 })
          .isAlphanumeric()
          .trim(),
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
    default: {
      return [];
    }
  }
};
