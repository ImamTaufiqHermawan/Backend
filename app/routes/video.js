const route = require("express").Router();
const videoController = require("../controllers/video");
const authenticate = require("../middleware/authenticate");

route.post("/", authenticate, videoController.createVideo);
route.delete("/:id", authenticate, videoController.deleteVideo);
route.patch("/:id", authenticate, videoController.updateVideo);

module.exports = route;
