const route = require("express").Router();
const paymentController = require("../controllers/payment");
const authenticate = require("../middleware/authenticate");
const checkRole = require("../middleware/authorization");

route.get("/", authenticate, paymentController.historyPaymentCurrentUser);
route.get("/all", authenticate, checkRole("admin"), paymentController.historyPaymentAllUsers);
route.post("/", authenticate, paymentController.createPayment);
route.post("/payment-callback", paymentController.paymentCallback);

module.exports = route;
