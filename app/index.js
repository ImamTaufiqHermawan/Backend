require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const db = require("../database/index");
const ApiError = require("./utils/apiError");
const errorHandler = require("./controllers/errorController");

const authRoute = require("./routes/auth");
const categoryRoute = require("./routes/category");
const courseRoute = require("./routes/course");
const chapterRoute = require("./routes/chapter");
const paymentRoute = require("./routes/payment");
const videoRoute = require("./routes/video");
const usersRoute = require("./routes/user");
const notificationRoute = require("./routes/notif");

const app = express();

db.connect().catch();
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1/auths", authRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/chapters", chapterRoute);
app.use("/api/v1/videos", videoRoute);
app.use("/api/v1/payments", paymentRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/notifications", notificationRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`Routes does not exist`, 404));
});
app.use(errorHandler);

module.exports = app
