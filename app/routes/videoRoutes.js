const route = require("express").Router();
const videoController = require("../controllers/VideosController");

route.post("/add", videoController.createVideo);
route.delete("/delete/:id", videoController.deleteVideo);
route.patch("/update/:id", videoController.updateVideo);

module.exports = route;