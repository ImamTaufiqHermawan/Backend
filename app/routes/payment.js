const route = require("express").Router();
const paymentController = require("../controllers/payment");

route.post("/", paymentController.createPayment);
route.post("/payment-callback", paymentController.paymentCallback);

module.exports = route;
