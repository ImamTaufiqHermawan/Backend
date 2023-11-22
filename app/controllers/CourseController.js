const Course = require("../models/Course");
const { check, validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");

const createCourse = async (req, res, next) => {
  try {
    const { title } = req.body;
    const newCourse = {
      title,
    };
    const response = await Course.create(newCourse);
    res.status(201).json({
      status: "Success",
      message: "Create category successfully",
      data: {
        response,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const {
      title,
      description,
      classCode,
      category,
      typeClass,
      level,
      price,
      totalRating
    } = req.body;
    let thumbnail;
    if(req.uploadImage){
        thumbnail = req.uploadImage.url;
    }
    const newData = {
      title,
      description,
      thumbnail,
      classCode,
      category,
      typeClass,
      level,
      price,
      totalRating
    };
    const id = req.params.id;
    const response = await Course.findByIdAndUpdate(id, newData, { new: true });
    res.status(200).json({
        status: 'Success',
        message: 'Update course successfully',
        data: {
          response,
        },
      });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = {
  createCourse,
  updateCourse
};
