const route = require("express").Router();
const authenthicate = require("../middleware/authenticate");
const Notification = require("../controllers/notification");
const validationId = require("../middleware/validation");
const checkRole = require("../middleware/authorization");

route.post("/specific", authenthicate, checkRole("admin"), Notification.createNotifForSpecificUser);
route.post("/", authenthicate, checkRole("admin"), Notification.createNotifForAllUsers);
route.get("/", authenthicate, Notification.getNotification);
route.patch("/:id", authenthicate, validationId("Notification"), Notification.readNotification);

module.exports = route;
