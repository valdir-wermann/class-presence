const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const student = require('./routes/student');
const teacher = require('./routes/teacher');
const class_ = require('./routes/class');
const attendance = require('./routes/attendance');
const teacher_code = require('./routes/teacher_code');

const app = express();

mongoose.connect('mongodb+srv://' + process.env.DATABASE_USER + ':' + process.env.DATABASE_PASSWORD + '@cluster0.9dzh5.mongodb.net/?retryWrites=true&w=majority', { dbName: 'presemce-list' })
    .then(() => console.log('connected to mongodb'))
    .catch((error) => console.error('something wewt wrong while connecting to mongodb: ', error));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Access-Control-Allow-Origin,ngrok-skip-browser-warning');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header('Access-Control-Expose-Headers', 'User');

    next();
});
app.use(express.json());

app.use('/api/students', student);
app.use('/api/teachers', teacher);
app.use('/api/classes', class_);
app.use('/api/attendances', attendance);
app.use('/api/teacher_code', teacher_code);

module.exports = app;