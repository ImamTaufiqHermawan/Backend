const route = require("express").Router();
const Authenthicate = require("../middleware/authenticate");
const Notification = require("../controllers/notification");
route.get("/", Authenthicate, Notification.getNotification);
route.get("/:id", Authenthicate, Notification.readNotification);

module.exports = route;
