const mongoose = require("mongoose");
const BaseSchema = require("./baseSchema");

const purchaseSchema =  new BaseSchema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
})

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;