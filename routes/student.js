const express = require('express');
const Router = express.Router();
const StudentController = require('../controllers/StudentController');
const { auth, teacher_auth } = require('../middlewares/auth');

Router.post('/login', StudentController.login);
Router.post('/signup', StudentController.create);

Router.get('/', auth, StudentController.findAll)
Router.get('/:id', auth, StudentController.findOne);

Router.put('/add_class/:id', teacher_auth, StudentController.addClass);
Router.put('/remove_class/:id', teacher_auth, StudentController.removeClass);

Router.put('/:id', auth, StudentController.update);

Router.delete('/:id', StudentController.delete);

module.exports = Router;