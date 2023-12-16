const Chapter = require('../models/chapter');
const Course = require('../models/course');
const {resSuccess} = require('./resBase');
const ApiError = require('../utils/apiError');

const createChapter = async (req, res, next) => {
  const {courseId} = req.query;
  const {title} = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return next(new ApiError('Course not found', 404));
    if (!title) return next(new ApiError('All fields are mandatory', 400));

    const newChapter = {
      title,
    };
    const data = await Chapter.create(newChapter);

    const prevTotalModule = course.chapters.length;
    course.totalModule = prevTotalModule + 1;
    await course.save();

    await Course.updateOne({_id: courseId}, {$push: {chapters: data._id}});

    res.status(201).send(resSuccess('Create chapter successfully', data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const updateChapter = async (req, res, next) => {
  const {id} = req.params;
  const {title} = req.body;
  try {
    const updateChapter = {
      title,
      updatedAt: new Date().getTime() + 7 * 60 * 60 * 1000,
      updatedBy: req.user,
    };
    const data = await Chapter
        .findByIdAndUpdate(id, updateChapter, {new: true}).select('-__v');

    res.status(200).send(resSuccess('Update chapter successfully', data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getAllChapters = async (req, res, next) => {
  try {
    const data = await Chapter.find({isActive: true}).select('-__v');

    res.status(200).send(resSuccess('Get chapter successfully', data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getChapterById = async (req, res, next) => {
  const {id} = req.params;
  try {
    const data = await Chapter.findOne({
      _id: id,
      isActive: true,
    }).select('-__v');

    res.status(200).send(resSuccess('Get chapter successfully', data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const deleteChapter = async (req, res, next) => {
  try {
    const {id} = req.params;
    await Chapter.findByIdAndUpdate(id, {isActive: false});
    res.status(200).send(resSuccess('Delete chapter successfully', null));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = {
  createChapter,
  updateChapter,
  getAllChapters,
  getChapterById,
  deleteChapter,
};
