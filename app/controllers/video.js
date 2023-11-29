const Chapter = require("../models/chapter");
const Course = require("../models/course");
const ApiError = require("../utils/apiError");
const { resSuccess } = require("./resBase");

const createVideo = async (req, res, next) => {
  const { chapterId } = req.query;
  const { title, videoUrl, duration, index } = req.body;
  try {
    if (!title || !videoUrl || !duration || !index) return next(new ApiError("All fields are mandatory", 400));

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) return next(new ApiError("Chapter not found", 404));

    const newVideo = {
      title,
      videoUrl,
      duration,
      index,
    };

    let prevChapterDuration = 0;
    for (const video of chapter.videos) {
      prevChapterDuration += video.duration;
    }

    const data = await Chapter.findOneAndUpdate(
      { _id: chapterId },
      {
        totalDuration: prevChapterDuration + duration,
        $push: { videos: newVideo },
      },
      {
        new: true,
      }
    );

    const course = await Course.findOne({ chapters: chapter._id }).populate("chapters");
    let coursePrevDuration = 0;
    for (const chapter of course.chapters) {
      coursePrevDuration += chapter.totalDuration;
    }

    course.totalDuration = coursePrevDuration;
    await course.save();

    res.status(201).send(resSuccess("Create video successfully", data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const deleteVideo = async (req, res, next) => {
  const videoId = req.params.id;
  try {
    const chapter = await Chapter.findOne({ "videos._id": videoId });
    if (!chapter) return next(new ApiError("Video not found", 404));

    const removeVideo = await Chapter.findOneAndUpdate(
      { "videos._id": videoId },
      { $pull: { videos: { _id: videoId } } },
      {
        new: true,
      }
    );

    let prevChapterDuration = 0;
    for (const video of removeVideo.videos) {
      prevChapterDuration += video.duration;
    }
    chapter.totalDuration = prevChapterDuration;
    await chapter.save();

    const course = await Course.findOne({ chapters: chapter._id }).populate("chapters");
    let coursePrevDuration = 0;
    for (const chapter of course.chapters) {
      coursePrevDuration += chapter.totalDuration;
    }

    course.totalDuration = coursePrevDuration;
    await course.save();

    res.status(200).send(resSuccess("Delete video successfully", null));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const updateVideo = async (req, res, next) => {
  const videoId = req.params.id;
  const { title, videoUrl, duration, index } = req.body;
  try {
    const chapter = await Chapter.findOne({ "videos._id": videoId });
    if (!chapter) return next(new ApiError("Video not found", 404));

    const updateVideo = await Chapter.findOneAndUpdate(
      { "videos._id": videoId },
      { $set: { "videos.$.title": title, "videos.$.videoUrl": videoUrl, "videos.$.duration": duration, "videos.$.index": index } },
      {
        new: true,
      }
    );

    let prevChapterDuration = 0;
    for (const video of updateVideo.videos) {
      prevChapterDuration += video.duration;
    }
    chapter.totalDuration = prevChapterDuration;
    await chapter.save();

    const course = await Course.findOne({ chapters: chapter._id }).populate("chapters");
    let coursePrevDuration = 0;
    for (const chapter of course.chapters) {
      coursePrevDuration += chapter.totalDuration;
    }

    course.totalDuration = coursePrevDuration;
    await course.save();

    const newData = await Chapter.findOne({ "videos._id": videoId });
    res.status(200).send(resSuccess("Update video successfully", newData));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = {
  createVideo,
  deleteVideo,
  updateVideo,
};
