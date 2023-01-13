const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.signup = (req, res, next) => {
  // Extract the firstName, lastName, gender, emailId, phoneNumber from the request body
  const { firstName, lastName, gender, emailId, phoneNumber } = req.body;

  // Check if a user with the given email already exists
  User.findOne({ where: { emailId } })
    .then((user) => {
      if (user) {
        // If a user with the given email already exists, return an error
        return res.status(409).json({
          message: "Email already exists",
        });
      }
      // If a user with the given email does not exist, create a new user
      User.create({
        firstName,
        lastName,
        gender,
        emailId,
        phoneNumber,
      })
        .then((result) => {
          res.status(201).json({
            message: "User created",
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.login = (req, res, next) => {
  // Extract the emailId from the request body
  const { emailId } = req.body;

  // Find the user with the given email
  User.findOne({ where: { emailId } })
    .then((user) => {
      if (!user) {
        // If a user with the given email does not exist, return an error
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      // Generate an OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      // Send the OTP to the user's email
      sendOtp(emailId, otp);
      // Save the OTP and its expiration time in the user's database entry
      user
        .update({ otp: otp, otpExpires: Date.now() + 300000 })
        .then(() => {
          res.status(200).json({
            message: "OTP sent",
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.verifyOtp = (req, res, next) => {
  // Extract the emailId and otp from the request body
  const { emailId, otp } = req.body;

  // Find the user with the given email
  User.findOne({ where: { emailId } })
    .then((user) => {
      if (!user) {
        if (!user) {
          // If a user with the given email does not exist, return an error
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        // Check if the provided OTP is valid
        if (otp !== user.otp || Date.now() > user.otpExpires) {
          return res.status(401).json({
            message: "Invalid OTP",
          });
        }
        // If the OTP is valid, create a JSON web token
        const token = jwt.sign(
          {
            email: user.email,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );
        // Send the token to the client
        res.status(200).json({
          message: "Auth successful",
          token: token,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.logout = (req, res, next) => {
  // Invalidate the token on the server
  req.user.token = null;
  req.user
    .save()
    .then(() => {
      res.status(200).json({ message: "Logout successful" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
