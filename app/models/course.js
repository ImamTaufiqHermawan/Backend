const mongoose = require('mongoose');
const BaseSchema = require('./baseSchema');

const courseSchema = new BaseSchema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  classCode: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  typeClass: {
    type: String,
    required: true,
    enum: ['FREE', 'PREMIUM'],
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  targetAudience: {
    type: [String],
  },
  totalModule: {
    type: Number,
    default: 0,
  },
  totalRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalDuration: {
    type: Number,
    default: 0,
  },
  chapters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
    },
  ],
  sold: {
    type: Number,
    default: 0,
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
