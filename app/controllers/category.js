const Category = require("../models/category");
const ApiError = require("../utils/apiError");

const getCategory = async (req, res) => {
  try {
    const data = await Category.find();
    res.status(200).json({
      status: "Success",
      message: "Get category successfully",
      data: {
        data,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = {
  getCategory,
};
