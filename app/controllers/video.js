const Chapter = require("../models/chapter");
const ApiError = require("../utils/apiError");
const { resSuccess } = require("./resBase");

const createVideo = async (req, res, next) => {
  try {
    const { chapterId } = req.query;
    const { title, videoUrl, duration } = req.body;
    const newVideo = {
      title,
      videoUrl,
      duration,
    };
    const data = await Chapter.updateOne({ _id: chapterId }, { $push: { videos: newVideo } });
    if (data.modifiedCount === 0) {
      return res.status(404).send(resSuccess("Chapter not found", null));
    }
    const newData = await Chapter.findById(chapterId);
    res.status(201).send(resSuccess("Create video successfully", newData));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const deleteVideo = async (req, res, next) => {
  try {
    const { chapterId } = req.query;
    const videoId = req.params.id;
    await Chapter.updateOne({ _id: chapterId }, { $pull: { videos: { _id: videoId } } });
    res.status(200).send(resSuccess("Delete video successfully", null));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const updateVideo = async (req, res, next) => {
  try {
    const { chapterId } = req.query;
    const videoId = req.params.id;
    const { title, videoUrl, duration } = req.body;
    const newVideo = {
      title,
      videoUrl,
      duration,
    };
    const data = await Chapter.updateOne({ _id: chapterId, "videos._id": videoId }, { $set: { "videos.$.title": newVideo.title, "videos.$.videoUrl": newVideo.videoUrl, "videos.$.duration": newVideo.duration } });
    if (data.modifiedCount === 0) {
      return res.status(404).send(resSuccess("Chapter not found", null));
    }
    const newData = await Chapter.findById(chapterId);
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