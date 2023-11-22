const mongoose = require("mongoose");
const BaseSchema = require("./BaseSchema");

const chapterSchema = new BaseSchema({
    title: {
        type: String,
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    totalDuration: {
        type: Date
    },
    videos: [{
        title: {
            type: String,
            required: true
        },
        duration: {
            type: Date,
            required: true
        },
        videoUrl: {
            type: String,
            required: true
        }
    }]
})

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter