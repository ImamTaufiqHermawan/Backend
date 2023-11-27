const mongoose = require("mongoose");
const BaseSchema = require("./baseSchema");

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
  refreshToken: {
    type: String,
    default: "",
  },
  passwordResetToken: {
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
    enum: ["admin", "user"],
    default: "user",
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  otpExp: {
    type: Date,
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
