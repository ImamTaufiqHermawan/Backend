const route = require('express').Router();
const Authenthicate = require('../../middleware/Authenthicate');
const UserContorller = require('../controllers/UsersControllers');
const multer = require('multer');
const uploadImage = require('../helpers/uploadImage');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

route.get('/', Authenthicate, UserContorller.findAllusers);
route.get('/:id', Authenthicate, UserContorller.userFindByid);
route.patch(
  '/:id',
  Authenthicate,
  upload.single('imageProfile'),
  uploadImage,
  UserContorller.UserUpdate,
);
route.patch(
  '/update-password/:id',
  Authenthicate,
  UserContorller.updatePassword,
);

module.exports = route;
