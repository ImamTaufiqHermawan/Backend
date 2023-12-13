const ApiError = require('../utils/apiError');

const checkVerify = (isVerify) => {
  return async (req, res, next) => {
    if (req.user.isVerify != isVerify) {
      if (isVerify == true) {
        return next(new ApiError('Please verify your account', 400));
      }
      return next(new ApiError('Your account is verify', 400));
    }
    next();
  };
};

module.exports = checkVerify;
