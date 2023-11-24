const route = require("express").Router();
const chapterController = require("../controllers/ChapterController");

route.post("/add", chapterController.createChapter);
route.patch("/update/:id", chapterController.updateChapter);
route.get("/", chapterController.getChapter);
route.get("/:id", chapterController.getChapterById);

module.exports = route;