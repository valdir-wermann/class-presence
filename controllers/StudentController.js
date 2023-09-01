const Student = require('../models/Student');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class StudentController {
    findAll(req, res) {
        const { name, email, classId } = req.query;

        const where = {};
        if (name) where.name = RegExp(name, 'i');
        if (email) where.email = email;
        if (classId) where.classId = { $in: [classId] };

        let select = '-password';
        if (req.student) { select = '-_id -email -card -password -classId' }

        Student
            .find(where, select)
            .then(students => res.status(200).json(students))
            .catch(error => res.status(400).json(error));
    }

    findOne(req, res) {
        let select = '-password';
        if (req.student) { select = '-_id -email -card -password -classId' }

        Student.findById(req.params.id, select)
            .then(student => res.status(200).json(student))
            .catch(error => res.status(400).json(error));
    }

    create(req, res) {
        let { name, email, card, password } = req.body;

        if (!name || !email || !card || !password) res.status(400).json({ error: "Invalid values!" });

        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const passwordformat = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,}))/g;
        const cardformat = /^[0-9]{8}$/g;
        if (!mailformat.test(email) || !passwordformat.test(password) || !cardformat.test(card)) {
            return res.status(400).json({ err: "email or password or card is not valid!" });
        }

        bcrypt.hash(password, 10)
            .then(hash => {
                const student = new Student({
                    name,
                    email,
                    card,
                    password: hash
                });

                student.save()
                    .then((stud) => res.status(201).json(stud))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(400).json(error));
    }

    update(req, res) {
        const { name, email } = req.body;

        if (req.student) {
            if (req.student._id !== req.params.id) {
                res.status(403).json({ error: 'Unathorized to update other people info!' })
            }
        }

        let updateStud = {};
        if (name) updateStud.name = name;
        if (email) updateStud.email = email;

        updateStud = {
            ...updateStud
        };

        Student.findByIdAndUpdate(req.params.id, updateStud)
            .then(() => res.status(200).json({ msg: "Successfully updated student!" }))
            .catch(error => res.status(400).json(error));
    }

    async addClass(req, res) {
        let { identifiers } = req.body;

        if (!identifiers) res.status(400).json({ error: 'Missing body identifier' });
        console.log(identifiers);

        identifiers = identifiers.split(',');
        console.log(identifiers);

        const cards = identifiers.filter(t => (/^[0-9]{8}$/g).test(t));
        const emails = identifiers.filter(t => !(/^[0-9]{8}$/g).test(t));

        console.log({ cards, emails });

        try {
            const cl = await Class.findById(req.params.id);
            if (!cl.teacherId.includes(req.teacher._id)) return res.status(403).json({ error: 'You are not allowed to do that! Not the teacher of class!' });

            Student.find({ $or: [{ email: { $in: emails } }, { card: { $in: cards } }] }).then(students => {
                students.forEach(student => {
                    student.classId.push(req.params.id);
                    student.save();
                });
                res.status(200).json({ msg: 'successfully added!' })
            });
        } catch (err) {
            res.status(400).json({ err });
        }
    }

    async removeClass(req, res) {
        let { identifiers } = req.body;

        if (!identifiers) res.status(400).json({ error: 'Missing body identifier' });

        identifiers = identifiers.split(',');

        const cards = identifiers.filter(t => (/^[0-9]{8}$/g).test(t));
        const emails = identifiers.filter(t => !(/^[0-9]{8}$/g).test(t));

        try {
            const cl = await Class.findById(req.params.id);
            if (!cl.teacherId.includes(req.teacher._id)) return res.status(403).json({ error: 'You are not allowed to do that! Not the teacher of class!' });

            Student.find({ $or: [{ email: { $in: emails } }, { card: { $in: cards } }] })
                .then(async students => {
                    await Attendance.deleteMany({ studentId: { $in: students.map(st => st._id) }, classId: req.params.id });
                    students.forEach(student => {
                        student.classId = student.classId.filter(_ => _ !== req.params.id);
                        student.save();
                    });
                    res.status(200).json({ msg: 'successfully removed students!' });
                })
        } catch (error) {
            res.status(400).json({ error })
        }
    }

    delete(req, res) {
        if (req.student) {
            if (req.student._id !== req.params.id) res.status(403).json({ error: 'Unathorized to delete someone else!' });
        }

        Student.findByIdAndDelete(req.params.id)
            .then(() => res.status(200).json({ msg: "Sucessfully deleted student!" }))
            .catch(error => res.status(400).json(error));
    }

    login(req, res) {
        const { identifier } = req.body;

        if (!identifier) res.status(400).json({ error: 'Missing body identifier' })

        let where = {};
        const cardformat = /^[0-9]{8}$/g;
        if (cardformat.test(identifier)) { where.card = identifier } else { where.email = identifier }

        Student.findOne(where).then(stud => {
            if (!stud) return res.status(404).json({ error: 'User not found!' });
            bcrypt.compare(req.body.password, stud.password)
                .then(result => {
                    if (result) {
                        jwt.sign({ ...stud }, process.env.JWT_SECRET, { expiresIn: '2d' }, function (err, token) {
                            if (err) {
                                res.status(400).json({ err });
                            }
                            res.status(200).json({ token, user: { id: stud._id, name: stud.name, email: stud.email, card: stud.card } });
                        })
                    } else {
                        res.status(403).json({ error: 'Invalid credentials!' })
                    }
                })
        });
    }
}

module.exports = new StudentController()