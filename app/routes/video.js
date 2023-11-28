const route = require("express").Router();
const videoController = require("../controllers/video");
const authenticate = require("../middleware/authenticate");
const checkRole = require("../middleware/authorization");

route.post("/", authenticate, checkRole("admin"), videoController.createVideo);
route.delete("/:id", authenticate, checkRole("admin"), videoController.deleteVideo);
route.patch("/:id", authenticate, checkRole("admin"), videoController.updateVideo);

module.exports = route;
