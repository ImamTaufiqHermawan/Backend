const route = require("express").Router();
const chapterController = require("../controllers/chapter");

route.post("/", chapterController.createChapter);
route.get("/", chapterController.getAllChapters);
route.patch("/:id", chapterController.updateChapter);
route.get("/:id", chapterController.getChapterById);

module.exports = route;
