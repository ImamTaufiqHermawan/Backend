const route = require("express").Router();
const progressController = require("../controllers/progress");
const authenticate = require("../middleware/authenticate");

route.post("/", authenticate, progressController.addIndexProgress);
route.get("/", authenticate, progressController.getProgressUser);

module.exports = route;
