const Category = require("../models/category");
const Course = require("../models/course");
const Purchase = require("../models/purchase");
const ApiError = require("../utils/apiError");
const { resSuccess } = require("./resBase");

const createCourse = async (req, res, next) => {
  const { title, category, classCode, typeClass, level, price, about, description } = req.body;

  try {
    if (!title || !category || !classCode || !typeClass || !level || !price || !about || !description) return next(new ApiError("All fields are mandatory", 400));
    const newCourse = {
      title,
      category,
      classCode,
      typeClass,
      level,
      price,
      about,
      description,
      createdBy: req.user._id,
    };
    const existingCategory = await Category.findById(category);
    if (!existingCategory) return next(new ApiError("Id category not found", 404));
    const response = await Course.create(newCourse);
    res.status(201).send(resSuccess("Create course successfully", response));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const updateCourse = async (req, res, next) => {
  const id = req.params.id;
  const { title, description, classCode, category, typeClass, level, price, totalRating, about } = req.body;

  try {
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
      about,
      updatedAt: new Date().getTime() + 7 * 60 * 60 * 1000,
      updatedBy: req.user,
    };
    if (category) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) return next(new ApiError("Id category not found", 404));
    }
    const response = await Course.findByIdAndUpdate(id, newData, { new: true });

    res.status(200).send(resSuccess("Update course successfully", response));
  } catch (error) {
    next(error);
  }
};

const getAllCourses = async (req, res, next) => {
  const { category, typeClass, level, title } = req.query;
  try {
    const filter = {
      isActive: true,
    };
    if (title) {
      filter.title = { $regex: ".*" + title + ".*", $options: "i" };
    }
    if (typeClass) {
      filter.typeClass = { $regex: ".*" + typeClass + ".*", $options: "i" };
    }
    if (category) {
      const categoriesArray = category.split(",");
      filter.category = { $in: categoriesArray };
    }
    if (level) {
      const levelsArray = level.split(",");
      filter.level = { $regex: levelsArray.join("|"), $options: "i" };
    }
    const data = await Course.find(filter).select("-__v -chapters").populate("category", "_id name");

    res.status(200).send(resSuccess("Get all course successfully", data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getCourseById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const purchase = await Purchase.findOne({ courseId: id, userId: req.user });
    const checkCourse = await Course.findById(id);

    if (purchase || checkCourse.typeClass == "FREE" || req.user.role === "admin") {
      const course = await Course.findOne({ _id: id, isActive: true })
        .populate({
          path: "chapters",
          match: { isActive: true },
          select: "-__v",
        })
        .populate("category createdBy", "name")
        .select("-__v");
      res.status(200).send(resSuccess("Get course successfully", course));
    }
    const course = await Course.findOne({ _id: id, isActive: true })
      .populate({
        path: "chapters",
        match: { isActive: true },
        select: "-__v -videos.videoUrl",
      })
      .populate("category createdBy", "name")
      .select("-__v");
    res.status(200).send(resSuccess("Get course successfully", course));
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Course.findByIdAndUpdate(id, { isActive: false });
    res.status(200).send(resSuccess("Delete course successfully", null));
  } catch (error) {
    next(new ApiError(error.message));
  }
};
module.exports = {
  createCourse,
  updateCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
};
