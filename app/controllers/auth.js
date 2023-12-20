const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const ApiError = require('../utils/apiError');
const {resSuccess} = require('./resBase');
const generateOTP = require('../helpers/otpGenerator');
const sendEmail = require('../helpers/nodemailer');
const {
  verifyEmailMessage,
  forgotPasswordMessage,
  resetPasswordMsgSuccess,
  successVerifyMessage,
} = require('../data/emailMessage');
const Notification = require('../models/notification');

const dateNow = new Date().getTime()+(7 * 60 * 60 * 1000);

const login = async (req, res, next) => {
  const {identifier, password} = req.body;
  try {
    if (!identifier || !password) {
      return next(new ApiError('All fields are mandatory', 400));
    };

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
    if (!user) {
      return next(new ApiError('Email address or Phone not registered', 404));
    };

    const match = await bcrypt.compare(password, user.password);
    if (!match) return next(new ApiError('Sorry, wrong password', 400));

    const payload = {
      _id: user._id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESHTOKEN_SECRET, {
      expiresIn: '3d',
    });

    user.refreshToken = refreshToken;
    await user.save();

    await Notification.create({
      userId: user._id,
      title: 'Notifikasi',
      description: `
        Selamat datang kembali ${user.name}!
        Anda telah berhasil login ke akun Anda.`,
    });
    const data = {
      _id: user._id,
      accessToken: accessToken,
    };
    res.cookie('refreshToken', refreshToken);
    res.status(200).send(resSuccess('Login successfully', data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const logOut = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const user = await User.findOne({
      refreshToken,
    });

    if (!user) return res.sendStatus(204);

    user.refreshToken = '';
    await user.save();

    res.clearCookie('refreshToken');
    res.status(200).json({
      success: true,
      message: 'Success logout',
    });
  } catch (error) {
    next(new ApiError(error.message, 500));
  }
};

const register = async (req, res, next) => {
  const {name, email, phone, password} = req.body;

  try {
    if (!name || !email || !phone || !password) {
      return next(new ApiError('All fields are mandatory', 400));
    };

    const existingemail = await User.findOne({email});
    const existingphone = await User.findOne({phone});

    if (existingemail) {
      return next(new ApiError('Email address already registered', 400));
    };

    if (existingphone) {
      return next(new ApiError('Mobile phone already registered', 400));
    };

    if (password.length < 8) {
      return next(new ApiError('Minimum password 8 characters', 400));
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email.split('@')[0];

    const newOTP = generateOTP();
    const otpExp = dateNow + 2 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      phone,
      username,
      otpExp,
      otp: newOTP,
      password: hashedPassword,
    });

    const payload = {
      _id: user._id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    const dataMailer = {
      to: email,
      text: 'Hey User!!',
      subject: 'Email verification link',
      html: verifyEmailMessage(newOTP),
    };
    await sendEmail(dataMailer, next);

    const responseBody = {
      _id: user._id,
      name: user.email,
      phone: user.phone,
      role: user.role,
      accessToken,
    };

    res.status(200).send(resSuccess('Register successfully', responseBody));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const sendOTPVerif = async (req, res, next) => {
  const {email} = req.body;
  try {
    if (!email) return next(new ApiError('All fields are mandatory', 400));
    const user = await User.findOne({email: email});
    if (user.isVerify == true) {
      return next(new ApiError('Your account is verify', 400));
    }
    const newOTP = generateOTP();
    const otpExp = dateNow + 2 * 60 * 1000;

    await User.findOneAndUpdate(
        {email},
        {
          otpExp,
          otp: newOTP,
        },
    );

    const dataMailer = {
      to: email,
      text: 'Hey User!!',
      subject: 'Email verification link',
      html: verifyEmailMessage(newOTP),
    };
    await sendEmail(dataMailer, next);

    res.status(200).send(resSuccess('Otp verification sent successfully'));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const verifyOTP = async (req, res, next) => {
  const {otp} = req.body;
  try {
    const userLogin = await User.findById(req.user);
    const latestOtp = userLogin.otp;
    if (latestOtp != otp) {
      return next(new ApiError('Sorry, OTP code is wrong', 400));
    }
    if (latestOtp.otpExp < dateNow) {
      return next(new ApiError('Sorry, OTP code already expired', 400));
    };

    userLogin.otp = null;
    userLogin.isVerify = true;
    await userLogin.save();

    const dataMailer = {
      to: userLogin.email,
      text: 'Hey User!!',
      subject: 'Email verification',
      html: successVerifyMessage(),
    };
    await sendEmail(dataMailer, next);

    res.status(200).send(resSuccess('Verify OTP successfully'));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const forgotPassword = async (req, res, next) => {
  const {email} = req.body;
  try {
    if (!email) return next(new ApiError('All fields are mandatory', 400));

    const user = await User.findOne({email});
    if (!user) return next(new ApiError('User not found', 404));

    const token = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256')
        .update(token).digest('hex');
    const passwordResetExpires = dateNow + 15 * 60 * 1000;
    new Date().getTime()+(7 * 60 * 60 * 1000);

    user.passwordResetToken = passwordResetToken;
    user.passwordResetExp = passwordResetExpires;

    await user.save();

    const dataMailer = {
      to: email,
      text: 'Hey User!!',
      subject: 'Email verification link',
      html: forgotPasswordMessage(passwordResetToken),
    };
    await sendEmail(dataMailer, next);

    res.status(200).send(resSuccess('Email reset password has been sent'));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const resetPassword = async (req, res, next) => {
  const {token} = req.params;
  const {password, confirmPassword} = req.body;
  try {
    if (!password || !confirmPassword) {
      return next(new ApiError('All fields are mandatory', 400));
    };

    const user = await User.findOne({
      passwordResetToken: token,
    });
    if (!user) {
      return next(new ApiError('User not found for the given token', 404));
    }
    if (user.passwordResetExp < dateNow) {
      return next(new ApiError('Password reset token already expired', 400));
    }
    if (password.length < 8) {
      return next(new ApiError('Minimum password 8 characters', 400));
    };
    if (password !== confirmPassword) {
      return next(new ApiError(
          'Password and confirm password doesn\'t match', 400,
      ));
    };

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExp = null;

    await user.save();

    const dataMailer = {
      to: user.email,
      text: 'Hey User!!',
      subject: 'Email verification link',
      html: resetPasswordMsgSuccess(),
    };
    await sendEmail(dataMailer, next);

    await Notification.create({
      userId: user._id,
      title: 'Notifikasi',
      description: `Hai ${user.name} password anda berhasil direset.`,
    });

    res.status(200).send(resSuccess('Reset password successfully'));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const adminLogin = async (req, res, next) => {
  const {username, password} = req.body;

  try {
    if (!username || !password) {
      return next(new ApiError('All fields are mandatory', 400));
    };
    const user = await User.findOne({
      username,
    });

    if (user && bcrypt.compareSync(password, user.password)) {
      if (user.role === 'admin') {
        const token = jwt.sign(
            {
              _id: user._id,
              role: user.role,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {expiresIn: '3d'},
        );
        const data = {
          token,
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
        };
        res.status(200).send(resSuccess('Login successfully', data));
      } else {
        next(new ApiError('You don\'t have permission to login as admin', 403));
      }
    } else {
      next(new ApiError('Wrong password or username', 400));
    }
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

const currentUser = async (req, res, next) => {
  try {
    const userData = {
      _id: req.user._id,
      email: req.user.email,
      phone: req.user.phone,
      name: req.user.name,
      username: req.user.username,
      image_profile: req.user.image_profile,
      country: req.user.country,
      city: req.user.city,
      role: req.user.role,
      isVerify: req.user.isVerify,
      isActive: req.user.isActive,
      createdAt: req.user.createdAt,
    };
    res
        .status(200)
        .send(resSuccess('Successfully retrieved user data', userData));
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

module.exports = {
  login,
  register,
  logOut,
  sendOTPVerif,
  verifyOTP,
  forgotPassword,
  resetPassword,
  adminLogin,
  currentUser,
};
