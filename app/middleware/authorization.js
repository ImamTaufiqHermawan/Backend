const ApiError = require("../utils/apiError");

const checkRole = (role) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role;

      if (!role.includes(userRole)) {
        next(new ApiError("Access forbidden, only admin can make this request", 403));
      }
      next();
    } catch (error) {
      next(new ApiError(error.message, 400));
    }
  };
};

module.exports = checkRole;
