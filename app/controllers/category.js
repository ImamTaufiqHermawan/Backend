const Category = require("../models/category");
const ApiError = require("../utils/apiError");
const { resSuccess } = require("./resBase");

const getCategoryCourse = async (req, res) => {
  try {
    const data = await Category.find();
    res.status(200).send(resSuccess("Get all category course successfully", data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getCategoryProgress = (req, res) => {
  const data = [
    {
      name: "All"
    },
    {
      name: "Progress"
    },
    {
      name: "Done"
    }
  ]
  res.status(200).send(resSuccess("Get all category progress successfully", data));
}

const getCategoryTypeClass = (req, res) => {
  const data = [
    {
      name: "All"
    },
    {
      name: "Premium"
    },
    {
      name: "Freemium"
    }
  ]
  res.status(200).send(resSuccess("Get all category type class successfully", data));
}


module.exports = {
  getCategoryCourse,
  getCategoryProgress,
  getCategoryTypeClass
};
