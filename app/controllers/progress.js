const Course = require('../models/course');
const Progress = require('../models/progress');
const ApiError = require('../utils/apiError');
const {resSuccess} = require('./resBase');
const createCertif = require('../helpers/createCertif');

const addIndexProgress = async (req, res, next) => {
  try {
    const userId = req.user;
    const {courseId} = req.query;
    let {indexProgress} = req.body;
    const existingProgress = await Progress.findOne({userId, courseId});
    if (existingProgress.indexProgress >= indexProgress) {
      indexProgress = existingProgress.indexProgress;
    }

    const course = await Course.findById(courseId).populate('chapters');
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

    const data = await Progress.findOneAndUpdate(
        {userId, courseId},
        {
          indexProgress,
          percentage: Math.floor((indexProgress / lastIndexVideo()) * 100),
        },
        {new: true});
    if (data.percentage === 100) {
      const data = await Progress.findOneAndUpdate(
          {userId, courseId},
          {status: 'Done'},
          {new: true},
      );
      if (existingProgress.percentage != 100) {
        const certifCaptions = [
          req.user.name,
          course.title,
        ];
        createCertif(req.user.email, certifCaptions);
      }
      res.status(200)
          .send(resSuccess(
              // eslint-disable-next-line max-len
              'Add index progress successfully, Check your email to download certificate',
              data,
          ));
    }
    res.status(200).send(resSuccess('Add index progress successfully', data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getProgressUser = async (req, res, next) => {
  try {
    const {status} = req.query;
    if (status === 'Done') {
      const progressProgress = await Progress.find({
        status: 'Done',
        userId: req.user,
      }).populate({
        path: 'courseId',
        select: '-chapters -__v -updatedBy',
        populate: {
          path: 'category createdBy',
          select: 'name imageCategory',
        },
      });
      return res
          .status(200)
          .send(resSuccess('Get progress user successfully', progressProgress));
    } else if (status === 'Progress') {
      const progressDone = await Progress.find({
        status: 'Progress',
        userId: req.user,
      }).populate({
        path: 'courseId',
        select: '-chapters -__v -updatedBy',
        populate: {
          path: 'category createdBy',
          select: 'name imageCategory',
        },
      });
      return res
          .status(200)
          .send(resSuccess('Get progress user successfully', progressDone));
    }
    const progress = await Progress.find({userId: req.user}).populate({
      path: 'courseId',
      select: '-chapters -__v -updatedBy',
      populate: {
        path: 'category createdBy',
        select: 'name imageCategory',
      },
    });

    res
        .status(200)
        .send(resSuccess('Get progress user successfully', progress));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = {
  addIndexProgress,
  getProgressUser,
};
