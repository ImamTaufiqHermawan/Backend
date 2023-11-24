const Course = require("../models/Course");
const { check, validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");
const { resSuccess } = require("./resBase");
const Chapter = require("../models/Chapter");

const createCourse = async (req, res, next) => {
  try {
    const { title, category, classCode, typeClass, level, price, about, description } =
      req.body;
    const newCourse = {
      title,
      category,
      classCode,
      typeClass,
      level,
      price,
      about,
      description
    };
    const response = await Course.create(newCourse);
    res.status(201).send(resSuccess("Create course successfully", response));
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
      totalRating,
    } = req.body;
    let thumbnail;
    if (req.uploadImage) {
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
      totalRating,
    };
    const id = req.params.id;
    const response = await Course.findByIdAndUpdate(id, newData, { new: true });
    if(!response) throw new ApiError("Course not found", 400);
    res.status(200).send(resSuccess("Update course successfully", response));
  } catch (error) {
    next(error);
  }
};

const getCourse = async (req, res, next) => {
  try {
    const filter = {};
    const { category, type, level } = req.query;
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (level) filter.level = level;
    filter.isActive = true;
    const data = await Course.find(filter);
    res.status(200).send(resSuccess("Get course successfully", data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findOne({ _id: id, isActive: true }).populate({
      path: "chapters",
      match: { isActive: true },
    });

    if (!course) {
      throw new ApiError("Course not found", 400);
    }
    res.status(200).send(resSuccess("Get course successfully", course));
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async(req, res, next) => {
  try {
    const {id} = req.params;
    const data = await Course.findByIdAndUpdate(id, {isActive: false})
    res.status(200).send(resSuccess("Delete course successfully", null));
  } catch (error) {
    next(new ApiError(error.message));
  }
}
module.exports = {
  createCourse,
  updateCourse,
  getCourse,
  getCourseById,
  deleteCourse
};
