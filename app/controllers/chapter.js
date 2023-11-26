const Chapter = require("../models/chapter");
const Course = require("../models/course");
const { resSuccess } = require("./resBase");
const ApiError = require("../utils/apiError");

const createChapter = async (req, res, next) => {
  try {
    const { courseId } = req.query;
    const { title, totalDuration } = req.body;
    const newChapter = {
      title,
      totalDuration,
    };
    const data = await Chapter.create(newChapter);
    await Course.updateOne({ _id: courseId }, { $push: { chapters: data._id } });
    res.status(201).send(resSuccess("Create chapter successfully", data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const updateChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, totalDuration } = req.body;
    const newChapter = {
      title,
      totalDuration,
    };
    const data = await Chapter.findByIdAndUpdate(id, newChapter);
    res.status(200).send(resSuccess("Update chapter successfully", data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getAllChapters = async (req, res, next) => {
  try {
    const data = await Chapter.find({ isActive: true });
    res.status(200).send(resSuccess("Get chapter successfully", data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getChapterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Chapter.findOne({
      _id: id,
      isActive: true,
    });
    res.status(200).send(resSuccess("Get chapter successfully", data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = {
  createChapter,
  updateChapter,
  getAllChapters,
  getChapterById,
};
