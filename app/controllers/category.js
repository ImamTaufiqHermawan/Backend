const Category = require("../models/category");
const ApiError = require("../utils/apiError");
const { resSuccess } = require("./resBase");

const getCategory = async (req, res) => {
  try {
    const data = await Category.find();
    res.status(200).send(resSuccess("Get all category successfully", data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = {
  getCategory,
};
