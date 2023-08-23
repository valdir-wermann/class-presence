const mongoose = require('mongoose');

const Code = new mongoose.Schema({
    code: { type: Number, required: true }
});

module.exports = mongoose.model('TeacherCode', Code);