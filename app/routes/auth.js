const route = require('express').Router();
const authController = require('../controllers/auth');
const authenticate = require('../middleware/authenticate');

route.post('/login', authController.login);
route.post('/admin/login', authController.adminLogin);
route.post('/register', authController.register);
route.post('/email-otp', authController.sendOTPVerif);
route.post('/verify-otp', authenticate, authController.verifyOTP);
route.post('/forgot-password', authController.forgotPassword);
route.patch('/reset-password/:token', authController.resetPassword);
route.delete('/logout', authController.logOut);
route.get('/me', authenticate, authController.currentUser);

module.exports = route;
