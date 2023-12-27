const Users = require('../models/user');
const {resSuccess} = require('./resBase');
const ApiError = require('../utils/apiError');
const bcrypt = require('bcryptjs');
const Notification = require('../models/notification');

const getAllUsers = async (req, res, next) => {
  try {
    const {name, page, limit} = req.query;
    const defaultPage = page || 1;
    const defaultLimit = limit || 7;

    const filter = {};

    if (name) {
      filter.name = {$regex: '.*' + name + '.*', $options: 'i'};
    }

    const options = {
      skip: (defaultPage - 1) * defaultLimit,
      limit: parseInt(defaultLimit),
    };

    const users = await Users.find({isActive: true})
        // eslint-disable-next-line max-len
        .select('-password -refreshToken -passwordResetExp -otp -__v -passwordResetToken -otpExp');
    const user = await Users.find({isActive: true})
        // eslint-disable-next-line max-len
        .select('-password -refreshToken -passwordResetExp -otp -__v -passwordResetToken -otpExp')
        .skip(options.skip)
        .limit(options.limit)
        .sort('-creaetedAt');
    const response = {
      limit: options.limit,
      page: parseInt(defaultPage),
      total: users.length,
      user,
    };
    res.status(200)
        .send(resSuccess('Get all users data successfuly', response));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getUserById = async (req, res, next) => {
  const {id} = req.params;
  try {
    const user = await Users.findById(id)
        // eslint-disable-next-line max-len
        .select('-password -refreshToken -passwordResetExp -otp -__v -passwordResetToken -otpExp');

    res.status(200).send(resSuccess('Get single user succesfully', user));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const updateUser = async (req, res, next) => {
  const {id} = req.params;
  const {name, email, phone, country, city} = req.body;
  try {
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
    // eslint-disable-next-line max-len
    }).select('-password -refreshToken -passwordResetExp -otp -__v -passwordResetToken -otpExp');

    res.status(200).send(resSuccess('Update Sucessfully', user));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const updatePassword = async (req, res, next) => {
  const {id} = req.params;
  const {oldPassword, newPassword, confirmPassword} = req.body;
  try {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return next(new ApiError('All fields are mandatory', 400));
    };

    const user = await Users.findById(id);

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return next(new ApiError('Your old password is incorrect.', 400));
    }

    if (newPassword !== confirmPassword) {
      return next(new ApiError(
          'New password and new confirm password does not match.', 400,
      ));
    }

    if (newPassword.length < 8) {
      return next(new ApiError(
          'Minimum password length is 8 characters.', 401,
      ));
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await Notification.create({
      userId: user._id,
      title: 'Notifikasi',
      description: `Hai ${user.name} password anda berhasil diperbarui.`,
    });

    res.status(200).send(resSuccess('Password updated successfully'));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const addUser = async (req, res, next) => {
  const {name, email, phone, password, role} = req.body;

  try {
    if (!name || !email || !phone || !password) {
      return next(new ApiError('All fields are mandatory', 400));
    }

    const existingemail = await Users.findOne({email});
    const existingphone = await Users.findOne({phone});

    if (existingemail) {
      return next(new ApiError('Email address already registered', 400));
    }

    if (existingphone) {
      return next(new ApiError('Mobile phone already registered', 400));
    }

    if (password.length < 8) {
      return next(new ApiError('Minimum password 8 characters', 400));
    }

    const username = email.split('@')[0];
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    await Users.create({
      name,
      email,
      phone,
      username,
      isVerify: true,
      role,
      password: hashedPassword,
    });

    res.status(200).send(resSuccess('Register successfully'));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const deleteUser = async (req, res, next)=>{
  try {
    const {id} = req.params;
    const user = await Users.findByIdAndUpdate(id, {isActive: false});
    if (!user) {
      return res.status(404).send(resSuccess('User not found'));
    }
    res.status(200).send(resSuccess('Delete User Successfully', null));
  } catch (error) {
    next(new ApiError(error.message));
  }
};


module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  updatePassword,
  addUser,
  deleteUser,
};
