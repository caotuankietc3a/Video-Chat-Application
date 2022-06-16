const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const { checkEmailPassword } = require("../middleware/auth");

router.post("/login", checkEmailPassword("login"), auth.postLogin);
router.post("/register", checkEmailPassword("register"), auth.postRegister);
router.get("/session", auth.getSession);
router.post("/logout", auth.postLogout);

module.exports = router;
