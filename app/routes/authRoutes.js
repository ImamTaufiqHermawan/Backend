const route = require("express").Router();
const authController = require("../controllers/AuthController");

route.post("/login", authController.login);
route.post("/register", authController.register);
route.post("/email-otp", authController.sendOTPVerif);
route.post("/verify-otp");
route.post("/forgot-password");
route.post("/reset-password/:token");

module.exports = route;
