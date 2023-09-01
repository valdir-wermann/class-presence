const express = require('express');
const Router = express.Router();
const ClassController = require('../controllers/ClassController');
const { auth, teacher_auth } = require('../middlewares/auth');

Router.get('/', auth, ClassController.findAll)
Router.get('/:id', auth, ClassController.findOne);
Router.post('/', teacher_auth, ClassController.create);
Router.put('/:id', teacher_auth, ClassController.update);

Router.put('/add_teacher/:id', teacher_auth, ClassController.addTeacher);
Router.put('/remove_teacher/:id', teacher_auth, ClassController.removeTeacher);

Router.delete('/:id', teacher_auth, ClassController.delete);

Router.get('/student_list/:id', teacher_auth, ClassController.generateStudentList);
Router.post('/:id', teacher_auth, ClassController.generateReport);

module.exports = Router;