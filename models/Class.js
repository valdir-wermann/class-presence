const mongoose = require('mongoose');

const Class = new mongoose.Schema({
    name: { type: String, uppercase: true, required: true },
    teacherId: [{ type: String, required: true }]
});

module.exports = mongoose.model('Class', Class);