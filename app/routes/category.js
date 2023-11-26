const route = require("express").Router();
const categoryController = require("../controllers/category");

route.get("/", categoryController.getCategory);

module.exports = route;
