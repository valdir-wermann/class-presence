const Teacher = require('../models/Teacher');
const Code = require('../models/TeacherCode');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class TeacherController {
    findAll(req, res) {
        const { name, email } = req.query;
        let ids;

        if (req.query.ids) ids = req.query.ids.split(',');

        const where = {};
        if (ids) where._id = { $in: ids }
        if (name) where.name = RegExp(name, 'i');
        if (email) where.email = email;

        let select = '-password';
        if (req.student) { select = '-_id -card -password' }

        Teacher
            .find(where, select)
            .then(teachers => res.status(200).json(teachers))
            .catch(error => res.status(400).json({ error }));
    }

    findOne(req, res) {
        let select = '-password';
        if (req.student) { select = '-_id -card -password' }

        Teacher.findById(req.params.id, select)
            .then(teacher => res.status(200).json(teacher))
            .catch(error => res.status(400).json(error));
    }

    async create(req, res) {
        const { name, email, card, password } = req.body;
        console.log(req.body);

        if (!name || !email || !card || !password) res.status(400).json({ error: "Invalid values!" });
        if ((await Code.find({ code: req.body.code })).length === 0) return res.status(400).json({ error: 'Unable to create account without a valid token!' })

        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const passwordformat = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,}))/g;
        const cardformat = /^[0-9]{8}$/g;

        if (!mailformat.test(email) || !passwordformat.test(password) || !cardformat.test(card)) {
            return res.status(400).json({ err: "email or password card is not valid!" });
        }

        bcrypt.hash(password, 10)
            .then(hash => {
                const teacher = new Teacher({
                    name,
                    email,
                    card,
                    password: hash
                });

                teacher.save()
                    .then(async (teacher) => {
                        await Code.deleteOne({ code: req.body.code });
                        res.status(201).json(teacher);
                    })
                    .catch(error => res.status(400).json({ msg: 'Sorry something went wrong!', error }));
            })
            .catch(error => res.status(400).json({ error }));
    }

    update(req, res) {
        const { name, email } = req.body;

        if (req.teacher._id !== req.params.id) res.status(403).json({ error: 'Unauthorized!' });

        let updateTeacher = {};
        if (name) updateTeacher.name = name;
        if (email) updateTeacher.email = email;

        Teacher.findByIdAndRemove(req.params.id, updateTeacher)
            .then(() => res.status(200).json({ msg: 'successfully updated!' }))
            .catch(error => res.status(400).json(error));
    }
    delete(req, res) {
        if (req.teacher._id !== req.params.id) res.statuts(403).json({ error: 'Unathorized!' });

        Teacher
            .findByIdAndDelete(req.params.id)
            .then(() => res.status(200).json({ msg: "Sucessfully deleted teacher!" }))
            .catch(error => res.status(400).json(error));
    }

    login(req, res) {
        const { identifier } = req.body;
        let where = {};
        const cardformat = /^[0-9]{8}$/g;
        if (cardformat.test(identifier)) { where.card = identifier } else { where.email = identifier }

        Teacher.findOne(where).then(teacher => {
            if (!teacher) return res.status(404).json({ error: 'Teacher not found!' })
            bcrypt.compare(req.body.password, teacher.password)
                .then(result => {
                    if (result) {
                        jwt.sign({ ...teacher }, process.env.JWT_SECRET, { expiresIn: '2d' }, function (err, token) {
                            if (err) {
                                res.status(400).json({ err });
                            }
                            res.status(200).json({ token, user: { id: teacher._id, name: teacher.name, email: teacher.email, card: teacher.card } });
                        })
                    } else {
                        res.status(403).json({ error: 'Invalid credentials!' })
                    }
                })
        })
    }
}

module.exports = new TeacherController();