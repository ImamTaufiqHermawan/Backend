const Notification = require("../models/notification");
const User = require("../models/user");
const ApiError = require("../utils/apiError");
const { resSuccess } = require("./resBase");

const getNotification = async (req, res, next) => {
  try {
    const notif = await Notification.find({ userId: req.user._id }).populate("userId", "-password -refreshToken -passwordResetExp -otp -__v");

    res.status(200).send(resSuccess("Get all notifications success", notif));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const readNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true }).populate("userId", "-password -refreshToken -passwordResetExp -otp -__v");
    res.status(200).send(resSuccess("message has been read", notif));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const createNotifForAllUsers = async (req, res, next) => {
  const { title, description } = req.body;
  try {
    const users = await User.find();

    users.map(async (user) => {
      await Notification.create({
        title,
        description,
        userId: user._id,
      });
    });

    res.status(201).send(resSuccess("Create notification successfully"));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const createNotifForSpecificUser = async (req, res, next) => {
  const { title, description, userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return next(new ApiError("User not found", 404));

    await Notification.create({
      title,
      description,
      userId: user._id,
    });

    res.status(201).send(resSuccess("Create notification successfully"));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = {
  getNotification,
  readNotification,
  createNotifForAllUsers,
  createNotifForSpecificUser,
};
