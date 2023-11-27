const ApiError = require("../utils/apiError");

const checkRole = (role) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role;

      if (!role.includes(userRole)) {
        next(
          new ApiError(
            "You do not have permission to access this resource",
            401,
          ),
        );
      }
      next();
    } catch (error) {
      next(new ApiError(error.message, 400));
    }
  };
};

module.exports = checkRole;
