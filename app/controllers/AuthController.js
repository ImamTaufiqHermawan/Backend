const Users = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const { resSuccess } = require("./resBase");

const login = async (req, res, next) => {
  const { identifier, password } = req.body;
  try {
    const user = await Users.findOne({
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

    const existingemail = await Users.findOne({ email });
    const existingphone = await Users.findOne({ phone });

    if (existingemail) {
      return res.status(400).json({
        status: "Error",
        message: "Email already in use",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        status: "Error",
        message: "Password must be at least 6 characters long.",
      });
    }

    if (existingphone) {
      return res.status(400).json({
        status: "error",
        message: "Phone Number Already use",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const users = await Users.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    res.status(200).json({
      status: "Success",
      data: {
        users,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = {
  login,
  register,
};
