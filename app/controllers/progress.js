const Course = require("../models/course");
const Progress = require("../models/progress");
const ApiError = require("../utils/apiError");
const { resSuccess } = require("./resBase");

const addIndexProgress = async (req, res, next) => {
  try {
    const userId = req.user;
    const { courseId } = req.query;
    let { indexProgress } = req.body;
    const existingProgress = await Progress.findOne({ userId, courseId });
    if (existingProgress.indexProgress >= indexProgress) {
      indexProgress = existingProgress.indexProgress;
    }

    const course = await Course.findById(courseId).populate("chapters");
    const lastIndexVideo = () => {
      let indexVideo = 0;
      course.chapters.map((chapter) => {
        chapter.videos.map((video) => {
          if (video.index >= indexVideo) {
            indexVideo = video.index;
          }
        });
      });
      return indexVideo;
    };

    const data = await Progress.findOneAndUpdate({ userId, courseId }, { indexProgress, percentage: Math.floor((indexProgress / lastIndexVideo()) * 100) }, { new: true });
    res.status(200).send(resSuccess("Add index progress successfully", data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getProgressUser = async (req, res, next) => {
  try {
    const progress = await Progress.find({ userId: req.user }).populate({
      path: "courseId",
      select: "-chapters -__v -updatedBy",
      populate: {
        path: "category createdBy",
        select: "name imageCategory",
      },
    });

    res.status(200).send(resSuccess("Get progress user successfully", progress));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = {
  addIndexProgress,
  getProgressUser,
};
