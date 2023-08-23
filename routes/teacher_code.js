const express = require('express');
const Router = express.Router();
const CodeController = require('../controllers/TeacherCodeController');

Router.post('/create', CodeController.create);

module.exports = Router;