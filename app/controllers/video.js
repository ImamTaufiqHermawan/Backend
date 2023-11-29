const Chapter = require("../models/chapter");
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

    let prevDuration = 0;
    for (const video of chapter.videos) {
      prevDuration += video.duration;
    }

    const data = await Chapter.findOneAndUpdate(
      { _id: chapterId },
      {
        totalDuration: prevDuration + duration,
        $push: { videos: newVideo },
      },
      {
        new: true,
      }
    );

    res.status(201).send(resSuccess("Create video successfully", data));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const deleteVideo = async (req, res, next) => {
  const videoId = req.params.id;
  try {
    await Chapter.updateOne({ "videos._id": videoId }, { $pull: { videos: { _id: videoId } } });
    res.status(200).send(resSuccess("Delete video successfully", null));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const updateVideo = async (req, res, next) => {
  const videoId = req.params.id;
  const { title, videoUrl, duration } = req.body;
  try {
    const newVideo = {
      title,
      videoUrl,
      duration,
    };
    const data = await Chapter.updateOne({ "videos._id": videoId }, { $set: { "videos.$.title": newVideo.title, "videos.$.videoUrl": newVideo.videoUrl, "videos.$.duration": newVideo.duration } });
    if (data.modifiedCount === 0) {
      return res.status(404).send(resSuccess("Chapter not found", null));
    }
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
