const route = require("express").Router();
const courseController = require("../controllers/course");
const multer = require("multer");
const uploadImage = require("../helpers/uploadImage");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const authenticate = require("../middleware/authenticate");
const validationId = require("../middleware/validation");

route.get("/", courseController.getAllCourses);
route.post("/", authenticate, courseController.createCourse);
route.get("/:id", authenticate, validationId("Course"), courseController.getCourseById);
route.patch("/:id", authenticate, validationId("Course"), upload.single("thumbnail"), uploadImage, courseController.updateCourse);
route.delete("/:id", authenticate, validationId("Course"), courseController.deleteCourse);

module.exports = route;
