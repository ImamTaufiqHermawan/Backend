const mongoose = require('mongoose');
const BaseSchema = require('./baseSchema');

const transactionSchema = new BaseSchema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'On Progress',
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
