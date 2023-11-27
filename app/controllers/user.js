const Users = require("../models/user");
const { resSuccess } = require("./resBase");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const Notification = require("../models/notification");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await Users.find().select("-password -refreshToken -passwordResetExp -otp -__v");
    res.status(200).send(resSuccess("Get all users data successfuly", users));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id).select("-password -refreshToken -passwordResetExp -otp -__v");

    res.status(200).send(resSuccess("Get single user succesfully", user));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, country, city } = req.body;
    let imageUrl = req.body.imageProfile;
    if (req.uploadImage) {
      imageUrl = req.uploadImage.url;
    }

    const newdata = {
      name,
      email,
      phone,
      country,
      city,
      image_profile: imageUrl,
    };

    const user = await Users.findByIdAndUpdate(id, newdata, {
      new: true,
    }).select("-password -refreshToken -passwordResetExp -otp -__v");

    res.status(200).send(resSuccess("Update Sucessfully", user));
  } catch (error) {
    console.error(error);
    next(new ApiError(error.message));
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await Users.findById(id);

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return next(new ApiError("Your old password is incorrect.", 400));
    }

    if (newPassword !== confirmPassword) {
      return next(new ApiError("New password and new confirm password does not match.", 400));
    }

    if (newPassword.length < 8) {
      return next(new ApiError("Minimum password length is 8 characters.", 401));
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    const notificationData = {
      title: "Password Update Sucessfully",
      userId: user._id,
      description: "Your password has been successfully updated.",
    };

    const newNotification = new Notification(notificationData);

    await newNotification.save();

    res.status(200).send(resSuccess("Password updated successfully"));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  updatePassword,
};
