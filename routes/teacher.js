const express = require('express');
const Router = express.Router();
const TeacherController = require('../controllers/TeacherController');
const { teacher_auth, auth } = require('../middlewares/auth');

Router.post('/signup', TeacherController.create);
Router.post('/login', TeacherController.login);

Router.get('/', auth, TeacherController.findAll)
Router.get('/:id', auth, TeacherController.findOne);
Router.put('/:id', teacher_auth, TeacherController.update);
Router.delete('/:id', teacher_auth, TeacherController.delete);

module.exports = Router;