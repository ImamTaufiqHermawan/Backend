const mongoose = require('mongoose');
const BaseSchema = require('./BaseSchema');

const courseSchema = new BaseSchema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    thumbnail: {
        type: String
    },
    classCode: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    typeClass: {
        type: String
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    price: {
        type: Number
    },
    rate: {
        type: mongoose.Types.Decimal128
    },
    totalDuration: {
        type: Date
    },
    chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    }]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
