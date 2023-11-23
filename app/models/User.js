const mongoose = require('mongoose');
const BaseSchema = require('./BaseSchema');

const userSchema = new BaseSchema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  name: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  image_profile: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  passwordResetExp: {
    type: Date,
  },
  otp: {
    type: Number,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
