const route = require("express").Router();

route.get("/");
route.get("/:id");
route.patch("/:id");

module.exports = route