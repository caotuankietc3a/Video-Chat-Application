const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const {
  checkEmailPassword,
  checkUpdatePassword,
} = require("../middleware/auth");

router.post("/login", checkEmailPassword("login"), auth.postLogin);
router.post("/register", checkEmailPassword("register"), auth.postRegister);
router.get("/session", auth.getSession);
router.post("/logout", auth.postLogout);
router.post("/update-profile-account/:userId", auth.postUpdateAccountProfile);
router.post("/update-profile-social/:userId", auth.postUpdateSocialProfile);
router.post(
  "/update-profile-password/:userId",
  checkUpdatePassword(),
  auth.postUpdatePasswordProfile
);

module.exports = router;
