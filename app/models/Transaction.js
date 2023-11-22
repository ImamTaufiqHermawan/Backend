const mongoose = require('mongoose');
const BaseSchema = require('./BaseSchema');

const transactionSchema = new BaseSchema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
