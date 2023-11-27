const route = require("express").Router();
const paymentController = require("../controllers/payment");
const authenticate = require("../middleware/authenticate");

route.post("/", authenticate, paymentController.createPayment);
route.post("/payment-callback", paymentController.paymentCallback);

module.exports = route;
