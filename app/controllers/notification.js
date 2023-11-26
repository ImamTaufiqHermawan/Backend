const Notification = require("../models/Notification");
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

module.exports = {
  getNotification,
  readNotification,
};
