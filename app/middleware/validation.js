const mongoose = require('mongoose');
const ApiError = require('../utils/apiError');

const validateMongooseId = async (model, id, next) => {
  try {
    const document = await mongoose.model(model).findById(id);
    if (!document) {
      return next(new ApiError(`${model} not found`, 404));
    }
    next();
  } catch (error) {
    next(new ApiError(`Error while validating ${model} ID in the database`,
        500));
  }
};

const validationId = (model) => {
  return async (req, res, next) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError('ID is not valid', 400));
    }
    validateMongooseId(model, id, next);
  };
};

module.exports = validationId;
