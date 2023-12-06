const mongoose = require('mongoose');
const BaseSchema = require('./baseSchema');

const progressSchema = new BaseSchema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  indexProgress: {
    type: Number,
    required: true,
    default: 1,
  },
  percentage: {
    type: Number,
    default: 0,
  },
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
