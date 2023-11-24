const mongoose = require("mongoose");
const BaseSchema = require("./BaseSchema");

const chapterSchema = new BaseSchema({
    title: {
        type: String,
        required: true
    },
    totalDuration: {
        type: String
    },
    videos: [{
        title: {
            type: String,
            required: true
        },
        duration: {
            type: String,
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