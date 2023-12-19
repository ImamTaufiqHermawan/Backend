const Chapter = require('../models/chapter');
const Course = require('../models/course');
const ApiError = require('../utils/apiError');
const {resSuccess} = require('./resBase');

const createVideo = async (req, res, next) => {
  const {chapterId} = req.query;
  const {title, videoUrl, duration} = req.body;
  try {
    if (!title || !videoUrl || !duration) {
      return next(new ApiError('All fields are mandatory', 400));
    };

    let index;

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) return next(new ApiError('Chapter not found', 404));

    let prevChapterDuration = 0;
    for (const video of chapter.videos) {
      prevChapterDuration += video.duration;
    }

    const checkIndex = await Course.findOne({chapters: chapter._id})
        .populate('chapters');
    for (const chapterCourse of checkIndex.chapters) {
      for (const videoChapter of chapterCourse.videos) {
        index = videoChapter.index + 1;
      }
    };

    const newVideo = {
      title,
      videoUrl,
      duration,
      index,
    };

    const data = await Chapter.findOneAndUpdate(
        {_id: chapterId},
        {
          totalDuration: prevChapterDuration + duration,
          $push: {videos: newVideo},
        },
        {
          new: true,
        },
    );

    const course = await Course.findOne({chapters: chapter._id})
        .populate('chapters');
    let coursePrevDuration = 0;
    for (const chapter of course.chapters) {
      coursePrevDuration += chapter.totalDuration;
    }

    course.totalDuration = coursePrevDuration;
    await course.save();

    res.status(201).send(resSuccess('Create video successfully', data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const deleteVideo = async (req, res, next) => {
  const videoId = req.params.id;
  try {
    const chapter = await Chapter.findOne({'videos._id': videoId});
    if (!chapter) return next(new ApiError('Video not found', 404));

    const removeVideo = await Chapter.findOneAndUpdate(
        {'videos._id': videoId},
        {$pull: {videos: {_id: videoId}}},
        {
          new: true,
        },
    );

    let prevChapterDuration = 0;
    for (const video of removeVideo.videos) {
      prevChapterDuration += video.duration;
    }
    chapter.totalDuration = prevChapterDuration;
    chapter.updatedAt = new Date().getTime()+(7 * 60 * 60 * 1000);
    chapter.updatedBy = req.user._id;
    await chapter.save();

    const course = await Course.findOne({chapters: chapter._id})
        .populate('chapters');
    let coursePrevDuration = 0;
    for (const chapter of course.chapters) {
      coursePrevDuration += chapter.totalDuration;
    }
    let updateIndex = 1;
    for (const chapterCourse of course.chapters) {
      for (const videoChapter of chapterCourse.videos) {
        videoChapter.index = updateIndex++;
      }
      await chapterCourse.save();
    }

    course.totalDuration = coursePrevDuration;
    await course.save();

    res.status(200).send(resSuccess('Delete video successfully', null));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const updateVideo = async (req, res, next) => {
  const videoId = req.params.id;
  const {title, videoUrl, duration, index} = req.body;
  try {
    const chapter = await Chapter.findOne({'videos._id': videoId});
    if (!chapter) return next(new ApiError('Video not found', 404));

    const updateVideo = await Chapter.findOneAndUpdate(
        {'videos._id': videoId},
        {$set: {'videos.$.title': title, 'videos.$.videoUrl': videoUrl,
          'videos.$.duration': duration, 'videos.$.index': index},
        },
        {
          new: true,
        },
    );

    let prevChapterDuration = 0;
    for (const video of updateVideo.videos) {
      prevChapterDuration += video.duration;
    }
    chapter.totalDuration = prevChapterDuration;
    chapter.updatedAt = new Date().getTime()+(7 * 60 * 60 * 1000);
    chapter.updatedBy = req.user._id;
    await chapter.save();

    const course = await Course.findOne({chapters: chapter._id})
        .populate('chapters');
    let coursePrevDuration = 0;
    for (const chapter of course.chapters) {
      coursePrevDuration += chapter.totalDuration;
    }

    course.totalDuration = coursePrevDuration;
    await course.save();

    const newData = await Chapter.findOne({'videos._id': videoId});
    res.status(200).send(resSuccess('Update video successfully', newData));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = {
  createVideo,
  deleteVideo,
  updateVideo,
};
