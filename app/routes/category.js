const route = require('express').Router();
const categoryController = require('../controllers/category');

route.get('/', categoryController.getCategoryCourse);
route.get('/progress', categoryController.getCategoryProgress);
route.get('/type-class', categoryController.getCategoryTypeClass);
route.get('/statistik', categoryController.getStatistik);

module.exports = route;
