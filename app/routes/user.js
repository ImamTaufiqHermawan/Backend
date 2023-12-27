/* eslint-disable max-len */
const route = require('express').Router();
const Authenthicate = require('../middleware/authenticate');
const UserContorller = require('../controllers/user');
const Authorize = require('../middleware/authorization');
const multer = require('multer');
const uploadImage = require('../helpers/uploadImage');
const validationId = require('../middleware/validation');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

route.patch('/update-password/:id', Authenthicate, validationId('User'), UserContorller.updatePassword);
route.get('/', Authenthicate, UserContorller.getAllUsers);
route.post('/create-user', Authenthicate, Authorize('admin'), UserContorller.addUser);
route.delete('/:id', Authenthicate, Authorize('admin'), UserContorller.deleteUser);
route.get('/:id', Authenthicate, validationId('User'), UserContorller.getUserById);
route.patch('/:id', Authenthicate, validationId('User'), upload.single('imageProfile'), uploadImage, UserContorller.updateUser);

module.exports = route;
