/* eslint-disable max-len */
const route = require('express').Router();
const paymentController = require('../controllers/payment');
const authenticate = require('../middleware/authenticate');
const checkRole = require('../middleware/authorization');
const checkVerify = require('../middleware/checkVerify');

route.get('/', authenticate, paymentController.historyPaymentCurrentUser);
route.get('/all', authenticate, checkRole('admin'), paymentController.historyPaymentAllUsers);
route.post('/', authenticate, checkVerify(true), paymentController.createPayment);
route.get('/:id', authenticate, paymentController.getPaymentById);
route.post('/payment-callback', paymentController.paymentCallback);

module.exports = route;
