const Users = require("../models/User");
const { resSuccess } = require("./resBase");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcrypt");

const findAllusers = async (req, res, next) => {
  try {
    const user = await Users.find().select(
      "-password -refreshToken -passwordResetExp -otp -__v",
    );
    res.status(200).send(resSuccess("Get all users data sucess", user));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const userFindByid = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id).select(
      "-password -refreshToken -passwordResetExp -otp -__v",
    );
    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    res.status(200).send(resSuccess("Get all users data by id", user));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const UserUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, country, city } = req.body;
    let image_profile = req.body.imageProfile;
    if (req.uploadImage) {
      image_profile = req.uploadImage.url;
    }

    const newdata = {
      name,
      email,
      phone,
      country,
      city,
      image_profile,
    };

    const user = await Users.findByIdAndUpdate(id, newdata, {
      new: true,
    }).select("-password -refreshToken -passwordResetExp -otp -__v");

    if (!user) {
      return next(new ApiError("User not found", 404));
    }

    res.status(200).send(resSuccess("Update Sucessfully", user));
  } catch (error) {
    console.error(error);
    next(new ApiError(error.message));
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { oldpassword, newpassword, confirmpassword } = req.body;
    const user = await Users.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!bcrypt.compareSync(oldpassword, user.password)) {
      return next(new ApiError("Your old password is incorrect.", 400));
    }

    if (newpassword !== confirmpassword) {
      return next(
        new ApiError(
          "New password and new confirm password does not match.",
          400,
        ),
      );
    }

    if (newpassword.length < 8) {
      return next(
        new ApiError("Minimum password length is 8 characters.", 401),
      );
    }

    const hashedPassword = bcrypt.hashSync(newpassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send(resSuccess("Password updated successfully"));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = {
  findAllusers,
  userFindByid,
  UserUpdate,
  updatePassword,
};
