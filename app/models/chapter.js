const mongoose = require("mongoose");
const BaseSchema = require("./baseSchema");

const chapterSchema = new BaseSchema({
  title: {
    type: String,
    required: true,
  },
  totalDuration: {
    type: Number,
  },
  videos: [
    {
      index: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
      videoUrl: {
        type: String,
        required: true,
      },
    },
  ],
});

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;
