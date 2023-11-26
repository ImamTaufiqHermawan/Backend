const route = require("express").Router();
const courseController = require("../controllers/course");
const multer = require("multer");
const uploadImage = require("../helpers/uploadImage");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

route.get("/", courseController.getAllCourses);
route.post("/", courseController.createCourse);
route.get("/:id", courseController.getCourseById);
route.patch("/:id", upload.single("thumbnail"), uploadImage, courseController.updateCourse);
route.delete("/:id", courseController.deleteCourse);

module.exports = route;
