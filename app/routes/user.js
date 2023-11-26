const route = require("express").Router();
const Authenthicate = require("../middleware/authenticate");
const UserContorller = require("../controllers/user");
const multer = require("multer");
const uploadImage = require("../helpers/uploadImage");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

route.get("/", Authenthicate, UserContorller.getAllUsers);
route.get("/:id", Authenthicate, UserContorller.getUserById);
route.patch("/:id", Authenthicate, upload.single("imageProfile"), uploadImage, UserContorller.updateUser);
route.patch("/update-password/:id", Authenthicate, UserContorller.updatePassword);

module.exports = route;
