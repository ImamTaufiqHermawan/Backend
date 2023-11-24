const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const { resSuccess } = require("./resBase");
const { verifyEmailMessage } = require("../data/emailMessage");
const generateOTP = require("../helpers/otpGenerator");
const sendEmail = require("../helpers/nodemailer");

const login = async (req, res, next) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [
        {
          email: identifier,
        },
        {
          phone: identifier,
        },
      ],
    });
    if (!user) return next(new ApiError("Email address or Phone not registered", 404));

    const match = await bcrypt.compare(password, user.password);
    if (!match) return next(new ApiError("Sorry, wrong password", 400));

    const payload = {
      _id: user._id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESHTOKEN_SECRET, {
      expiresIn: "3d",
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken);
    res.status(200).send(resSuccess("Login successfully", accessToken));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingemail = await User.findOne({ email });
    const existingphone = await User.findOne({ phone });

    if (existingemail) return next(new ApiError("Email address already registered", 400));

    if (existingphone) return next(new ApiError("Mobile phone already registered", 400));

    if (password.length < 6) return next(new ApiError("Minimum password 8 characters", 400));

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email.split("@")[0];

    const newOTP = generateOTP();

    const user = await User.create({
      name,
      email,
      phone,
      username,
      password: hashedPassword,
      otp: newOTP,
    });

    const dataMailer = {
      to: email,
      text: "Hey User!!",
      subject: "Email verification link",
      html: verifyEmailMessage(newOTP),
    };
    await sendEmail(dataMailer);

    const responseBody = {
      _id: user._id,
      name: user.email,
      phone: user.phone,
      role: user.role,
    };

    res.status(200).send(resSuccess("Register successfully", responseBody));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = {
  login,
  register,
};
