const mongoose = require('mongoose');

const Attendance = new mongoose.Schema({
    studentId: { type: String, required: true },
    teacherId: { type: String, required: true },
    classId: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true, uppercase: true },
    date: { type: Date, required: true },
    periods: { type: Number, required: true }
});

module.exports = mongoose.model('Attendance', Attendance);