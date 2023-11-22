const route = require("express").Router();
const courseController = require("../controllers/CourseController");
const multer = require("multer");
const uploadImage = require("../helpers/uploadImage");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

route.get("/");
route.post("/add", courseController.createCourse);
route.patch("/update/:id", upload.single("thumbnail"), uploadImage, courseController.updateCourse);
route.delete("/delete/:id");
route.get("/:id");

module.exports = route