const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ApiError = require("../utils/apiError");
const { resSuccess } = require("./resBase");
const { verifyEmailMessage, forgotPasswordMessage, resetPasswordMsgSuccess, successVerifyMessage } = require("../data/emailMessage");
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

    if (password.length < 8) return next(new ApiError("Minimum password 8 characters", 400));

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

const sendOTPVerif = async (req, res, next) => {
  const { email } = req.body;
  try {
    const newOTP = generateOTP();
    await User.findOneAndUpdate(
      { email },
      {
        otp: newOTP,
      }
    );

    const dataMailer = {
      to: email,
      text: "Hey User!!",
      subject: "Email verification link",
      html: verifyEmailMessage(newOTP),
    };
    await sendEmail(dataMailer);

    res.status(200).send(resSuccess("Otp verification sent successfully"));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const verifyOTP = async (req, res, next) => {
  const { otp } = req.body;
  try {
    const user = await User.findOne({ otp });
    if (!user) return next(new ApiError("Sorry, OTP code is wrong", 400));

    user.otp = null;
    user.isVerify = true;
    await user.save();

    const dataMailer = {
      to: user.email,
      text: "Hey User!!",
      subject: "Email verification",
      html: successVerifyMessage(),
    };
    await sendEmail(dataMailer);

    res.status(200).send(resSuccess("Verify OTP successfully"));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return next(new ApiError("User not found", 404));

    const token = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");
    const passwordResetExpires = Date.now() + 15 * 60 * 1000;

    user.passwordResetToken = passwordResetToken;
    user.passwordResetExp = passwordResetExpires;

    await user.save();

    const dataMailer = {
      to: email,
      text: "Hey User!!",
      subject: "Email verification link",
      html: forgotPasswordMessage(passwordResetToken),
    };
    await sendEmail(dataMailer);

    res.status(200).send(resSuccess("Email reset password has been sent"));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExp: {
        $gt: Date.now(),
      },
    });

    if (!user) return next(new ApiError("Password reset token already expired", 400));
    if (password.length < 8) return next(new ApiError("Minimum password 8 characters", 400));
    if (password !== confirmPassword) return next(new ApiError("Password and confirm password doesn't match", 400));

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExp = null;

    await user.save();

    const dataMailer = {
      to: user.email,
      text: "Hey User!!",
      subject: "Email verification link",
      html: resetPasswordMsgSuccess(),
    };
    await sendEmail(dataMailer);

    res.status(200).send(resSuccess("Reset password successfully"));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = {
  login,
  register,
  sendOTPVerif,
  verifyOTP,
  forgotPassword,
  resetPassword,
};
