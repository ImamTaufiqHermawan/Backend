const crypto = require('crypto');
const midtransClient = require('midtrans-client');
const {resSuccess} = require('./resBase');
const ApiError = require('../utils/apiError');
const Transaction = require('../models/transaction');
const Purchase = require('../models/purchase');
const Notification = require('../models/notification');
const Course = require('../models/course');
const User = require('../models/user');

const createPayment = async (req, res, next) => {
  try {
    const {courseId, courseTitle, totalPrice} = req.body;
    if (!courseId || !courseTitle || !totalPrice) {
      return next(new ApiError('All fields are mandatory', 400));
    }

    const isPremium = await Purchase.findOne({
      courseId,
      userId: req.user._id,
    });
    if (isPremium) {
      return next(new ApiError('You already bought this course!', 400));
    }

    const createPayment = await Transaction.create({
      courseId,
      totalPrice,
      userId: req.user._id,
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
      item_details: [
        {
          id: courseId,
          name: courseTitle,
          price: createPayment.totalPrice,
          quantity: 1,
        },
      ],
      customer_details: {
        first_name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      },
    });
    transaction._id = createPayment._id;
    res.status(201).send(resSuccess('Create payment success', transaction));
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const paymentCallback = async (req, res, next) => {
  try {
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
    } = req.body;
    const serverKey = process.env.SERVER_KEY_MIDTRANS;
    const hashed = crypto
        .createHash('sha512')
        .update(order_id + status_code + gross_amount + serverKey)
        .digest('hex');

    if (hashed === signature_key) {
      // eslint-disable-next-line max-len
      if (
        transaction_status === 'settlement' ||
        transaction_status === 'capture'
      ) {
        const payment = await Transaction.findOne({_id: order_id});
        if (!payment) return next(new ApiError('Transaction not found', 404));
        payment.status = 'Paid';
        payment.paymentType = payment_type;

        await payment.save();

        if (payment.status === 'Paid') {
          await Purchase.create({
            userId: payment.userId,
            courseId: payment.courseId,
          });
          payment.updatedAt = new Date().getTime() + 7 * 60 * 60 * 1000;
          await payment.save();

          await Notification.create({
            userId: payment.userId,
            title: 'Pembayaran sukses',
            description: `Pembayaran course anda sukses!.`,
          });

          const course = await Course.findByIdAndUpdate(payment.courseId);
          const prevSoldNumber = course.sold;
          course.sold = prevSoldNumber + 1;
          await course.save();
        }
      }
    }

    res.status(200).send(resSuccess('Success paid course', null));
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const historyPaymentCurrentUser = async (req, res, next) => {
  try {
    const payments = await Transaction.find({userId: req.user._id})
        .select('-__v')
        .populate({
          path: 'courseId',
          select: '-chapters -__v',
          populate: {
            path: 'category',
            select: 'name',
          },
        })
    // eslint-disable-next-line max-len
        .populate(
            'userId',
            // eslint-disable-next-line max-len
            '-__v -password -refreshToken -otpExp -otp -passwordResetExp -passwordResetToken',
        );

    res
        .status(200)
        .send(resSuccess('Get payment user login success', payments));
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const historyPaymentAllUsers = async (req, res, next) => {
  try {
    const {username, status, page, limit} = req.query;

    const defaultPage = page || 1;
    const defaultLimit = limit || 7;

    const filter = {};
    const options = {
      skip: (defaultPage - 1) * defaultLimit,
      limit: parseInt(defaultLimit),
    };

    if (status) {
      filter.status = {$regex: '.*' + status + '.*', $options: 'i'};
    }

    if (username) {
      const cleanedUsername = username.replace(/_/g, ' ');

      const userArray = cleanedUsername.split(',');
      const usernameObjects = await User.find({
        username: {
          $in: userArray.map((user) => new RegExp(user.trim(), 'i')),
        },
      });

      const userIds = usernameObjects.map((user) => user._id);
      filter.userId = {$in: userIds};
    }

    const payments = await Transaction.find(filter)
        .select('-__v')
        .populate({
          path: 'courseId',
          select: '-chapters -__v',
          populate: {
            path: 'category',
            select: 'name',
          },
        })
        .populate(
            'userId',
            // eslint-disable-next-line max-len
            '-__v -password -refreshToken -otpExp -otp -passwordResetExp -passwordResetToken',
        )
        .skip(options.skip)
        .limit(options.limit)
        .sort('-createdAt');

    const payment = await Transaction.find().select('_id');

    const response = {
      limit: options.limit,
      page: parseInt(defaultPage),
      total: payment.length,
      payments,
    };

    res
        .status(200)
        .send(resSuccess('Get all payment history success', response));
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};


const getPaymentById = async (req, res, next) => {
  try {
    const {id} = req.params;
    const data = await Transaction.findById(id);
    if (!data) {
      return next(new ApiError('Id payment not found', 404));
    }
    res.status(200).send(resSuccess('Get payment by id success', data));
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

module.exports = {
  createPayment,
  paymentCallback,
  historyPaymentCurrentUser,
  historyPaymentAllUsers,
  getPaymentById,
};
