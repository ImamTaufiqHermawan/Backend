const route = require("express").Router();

route.get("/");
route.post("/add");
route.patch("/update/:id");
route.delete("/delete/:id");
route.get("/:id");

module.exports = route