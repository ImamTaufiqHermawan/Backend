const route = require("express").Router();
const progressController = require("../controllers/progress");
const authenticate = require("../middleware/authenticate");

route.post("/:id", authenticate, progressController.addIndexProgress);

module.exports = route;