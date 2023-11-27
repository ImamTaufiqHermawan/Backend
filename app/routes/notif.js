const route = require("express").Router();
const Authenthicate = require("../middleware/authenticate");
const Notification = require("../controllers/notification");
const validationId = require("../middleware/validation");

route.post("/specific", Authenthicate, Notification.createNotifForSpecificUser);
route.post("/", Authenthicate, Notification.createNotifForAllUsers);
route.get("/", Authenthicate, Notification.getNotification);
route.patch("/:id", Authenthicate, validationId("Notification"), Notification.readNotification);

module.exports = route;
