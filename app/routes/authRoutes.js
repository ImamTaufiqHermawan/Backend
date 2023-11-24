const route = require("express").Router();
const authController = require("../controllers/AuthController");

route.post("/login", authController.login);
route.post("/register", authController.register);
route.post("/email-otp", authController.sendOTPVerif);
route.post("/verify-otp", authController.verifyOTP);
route.post("/forgot-password", authController.forgotPassword);
route.post("/reset-password/:token");

module.exports = route;
