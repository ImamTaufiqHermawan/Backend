const route = require("express").Router();
const categoryController = require("../controllers/CategoryController");

route.get("/", categoryController.getCategory);

module.exports = route;