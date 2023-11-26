const Transaction = require("../models/transaction");
const midtransClient = require("midtrans-client");
const { resSuccess } = require("./resBase");
const ApiError = require("../utils/apiError");
const crypto = require("crypto");

const createPayment = async (req, res, next) => {
  try {
    const { courseId, userId, totalPrice, methodPayment } = req.body;
    const createPayment = await Transaction.create({
      courseId,
      userId,
      totalPrice,
      methodPayment,
    });

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.SERVER_KEY_MIDTRANS,
      clientKey: process.env.CLIENT_KEY_MIDTRANS,
    });

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: createPayment._id,
        gross_amount: createPayment.totalPrice,
      },
      customer_details: {
        user_id: createPayment.userId,
      },
    });

    const dataPayment = {
      response: JSON.stringify(transaction),
    };
    const data = {
      dataPayment,
      token: transaction.token,
    };
    res.status(201).send(resSuccess("Create payment success", data));
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const paymentCallback = async (req, res, next) => {
  try {
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = req.body;
    const serverKey = process.env.SERVER_KEY_MIDTRANS;
    const hashed = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + serverKey)
      .digest("hex");
    if (hashed === signature_key) {
      if (transaction_status === "settlement") {
        const payment = await Transaction.findOne({ _id: order_id });
        if (!payment) return next(new ApiError("Transaction not found", 404));
        payment.status = "paid";
        await payment.save();
      }
    }
    res.status(200).send(resSuccess("Success paid course", null));
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

module.exports = {
  createPayment,
  paymentCallback,
};
