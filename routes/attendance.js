const express = require('express');
const Router = express.Router();
const AttendanceController = require('../controllers/AttendanceController');
const { auth, teacher_auth } = require('../middlewares/auth');

// Router.use(teacher_auth);

Router.get('/', auth, AttendanceController.findAll);
Router.get('/:id', auth, AttendanceController.findOne);
Router.get('/lessonAttendance/:id', teacher_auth, AttendanceController.lessonAttendance);
Router.post('/:id', teacher_auth, AttendanceController.create);
Router.put('/:id', teacher_auth, AttendanceController.update);
Router.delete('/:id', teacher_auth, AttendanceController.delete);


module.exports = Router;