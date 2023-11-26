const dotenv = require("dotenv");
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const db = require("../database/index");
const authRoute = require("./routes/authRoutes");
const categoryRoute = require("./routes/categoryRoutes");
const courseRoute = require("./routes/courseRoutes");
const chapterRoute = require("./routes/chapterRoutes");
const paymentRoute = require("./routes/paymentRoutes");
const videoRoute = require("./routes/videoRoutes");
const errorHandler = require("./controllers/errorController")
const ApiError = require("./utils/apiError");
const multer = require("multer");

function server() {
    const app = express();
    db.connect().catch(console.log());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use("/api/v1/auth", authRoute)
    app.use("/api/v1/category", categoryRoute)
    app.use("/api/v1/course", courseRoute)
    app.use("/api/v1/chapter", chapterRoute)
    app.use("/api/v1/video", videoRoute)
    app.use("/api/v1/payment", paymentRoute)
    app.all('*', (req, res, next) => {
        next(new ApiError(`Routes does not exist`, 404));
    });
    app.use(errorHandler)
    return app;
}

module.exports = {
    server
}