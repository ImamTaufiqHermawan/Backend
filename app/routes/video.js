const route = require("express").Router();
const videoController = require("../controllers/video");

route.post("/", videoController.createVideo);
route.delete("/:id", videoController.deleteVideo);
route.patch("/:id", videoController.updateVideo);

module.exports = route;
