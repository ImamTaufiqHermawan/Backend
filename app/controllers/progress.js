const Progress = require("../models/progress");
const ApiError = require("../utils/apiError");
const { resSuccess } = require("./resBase");


const addIndexProgress = async(req, res, next) => {
    try {
        const userId = req.user
        const courseId = req.params.id
        let { indexProgress } = req.body;
        const existingProgress = await Progress.findOne({ userId, courseId});
        if(existingProgress.indexProgress >= indexProgress){
            indexProgress = existingProgress.indexProgress
        };
        const data = await Progress.findOneAndUpdate({ userId, courseId}, {indexProgress}, { new: true });
        res.status(200).send(resSuccess("Add index progress successfully", data));
    } catch (error) {
        next(new ApiError(error.message))
    }
};

module.exports = {
    addIndexProgress
}