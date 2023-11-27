const mongoose = require("mongoose");
const BaseSchema = require("./baseSchema");

const progressSchema = new BaseSchema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  isDone: {
    type: Boolean,
    required: true,
  },
});

const Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;
