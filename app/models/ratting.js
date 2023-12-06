const mongoose = require('mongoose');
const BaseSchema = require('./baseSchema');

const rattingSchema = new BaseSchema({
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
  ratting: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

const Ratting = mongoose.model('Ratting', rattingSchema);

module.exports = Ratting;
