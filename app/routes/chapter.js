const route = require("express").Router();
const chapterController = require("../controllers/chapter");
const authenticate = require("../middleware/authenticate");
const checkRole = require("../middleware/authorization");
const validationId = require("../middleware/validation");

route.post("/", authenticate, checkRole("admin"), chapterController.createChapter);
route.get("/", chapterController.getAllChapters);
route.patch("/:id", authenticate, validationId("Chapter"), chapterController.updateChapter);
route.get("/:id", validationId("Chapter"), chapterController.getChapterById);

module.exports = route;
