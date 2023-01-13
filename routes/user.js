// Module contains the routes for signup, login, and logout
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middleware/auth");

// Signup route
router.post("/signup", userController.signup);

// Login route
router.post("/login", userController.login);

// Verify OTP route
router.post("/verify-otp", userController.verifyOtp);

// Logout route
router.post("/logout", auth, userController.logout);

module.exports = router;
