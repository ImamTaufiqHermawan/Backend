const jwt = require('jsonwebtoken');
const Users = require('../app/models/User');
const ApiError = require('../app/utils/apiError');

module.exports = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      return next(
        new ApiError(
          'You are unauthorized to make this request, Login please',
          401,
        ),
      );
    }
    const token = bearerToken.split('Bearer ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(payload.id);
    req.user = user;
    next();
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};
