const mongoose = require('mongoose');
const BaseSchema = require('./BaseSchema');

const courseSchema = new BaseSchema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
    },
    classCode: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    typeClass: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    totalModule: {
        type: Number
    },
    rate: {
        type: mongoose.Types.Decimal128
    },
    totalDuration: {
        type: String
    },
    chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    }]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
