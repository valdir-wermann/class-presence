const mongoose = require('mongoose');

const Student = new mongoose.Schema({
    name: { type: String, uppercase: true, required: true },
    email: { type: String, lowercase: true, required: true, unique: true },
    card: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    classId: [{ type: String, required: true }]
});

module.exports = mongoose.model('Student', Student);