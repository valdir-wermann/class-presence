const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

class ClassController {
    async findAll(req, res) {
        const { name, teacherId } = req.query;

        if (teacherId === 'own' && req.student) {
            return res.status(401).json({ error: 'Not allowed!' })
        }

        if (req.student) {
            try {
                const stud = await Student.findById(req.student);
                const classes = await Class.find({ _id: { $in: stud.classId } });
                return res.status(200).json(classes)
            } catch (e) {
                return res.status(400).json({ error: e })
            }
        }

        const where = {};
        if (name) where.name = RegExp(name, 'i');
        if (teacherId === 'own' && req.teacher) {
            where.teacherId = req.teacher._id;
        } else if (teacherId) {
            where.teacherId = teacherId;
        }

        Class
            .find(where)
            .then(classes => res.status(200).json(classes))
            .catch(error => res.status(400).json({ error }));
    }
    findOne(req, res) {
        Class
            .findById(req.params.id)
            .then(class_ => {
                if (req.teacher) {
                    if (!class_.teacherId.includes(req.teacher._id)) return res.status(403).json({ error: 'You are not allowed!' });
                } else if (req.student) {
                    if (!req.student.classId.includes(req.params.id)) return res.status(403).json({ error: 'You are not allowed!' });
                }
                res.status(200).json(class_);
            })
            .catch(error => res.status(400).json({ error }));
    }
    create(req, res) {
        let { name } = req.body;

        const class_ = new Class({
            name,
            teacherId: req.teacher._id
        });

        class_
            .save()
            .then((cl) => res.status(200).json(cl))
            .catch(error => res.status(400).json({ error }));
    }
    update(req, res) {
        const { name, teacherId } = req.body;

        let updateClass = {};
        if (name) updateClass.name = name;
        if (teacherId) updateClass.teacherId = teacherId.split(',');

        Class
            .findByIdAndUpdate(req.params.id, updateClass)
            .then(() => res.status(200).json({ msg: "Successfully updated!" }))
            .catch(error => res.status(400).json({ error }));
    }

    async addTeacher(req, res) { //req params id is for the class
        const cl = await Class.findById(req.params.id);
        if (!cl) return res.status(404).json({ error: "class not found!" })
        if (!cl.teacherId.includes(req.teacher._id)) return res.status(403).json({ error: "Not your class!" });

        if (!req.body.identifiers) return res.status(400).json({ error: 'Missing body identifiers' });

        const identifiers = req.body.identifiers.split(',');
        const cardformat = /^[0-9]{8}$/g;

        const cards = identifiers.filter(t => cardformat.test(t));
        const emails = identifiers.filter(t => !cardformat.test(t));

        const teachersId = (await Teacher.find({ $or: [{ email: { $in: emails } }, { card: { $in: cards } }] })).map(val => val._id);
        cl.teacherId.push(...teachersId);
        cl.save()
            .then(() => res.status(200).json({ msg: 'successfully added teachers to class!' }))
            .catch(error => res.status(400).json({ error, msg: 'sim' }))
    }
    async removeTeacher(req, res) { //req params id is for the class
        try {
            let cl = await Class.findById(req.params.id);
            if (!cl) return res.status(404).json({ error: "class not found!" })
            if (!cl.teacherId.includes(req.teacher._id)) return res.status(403).json({ error: "Not your class!" });

            if (!req.body.identifiers) return res.status(400).json({ error: 'Missing body identifiers' });

            const identifiers = req.body.identifiers.split(',');
            const cardformat = /^[0-9]{8}$/g;

            const cards = identifiers.filter(t => cardformat.test(t));
            const emails = identifiers.filter(t => !cardformat.test(t));

            const ids = (await Teacher.find({ $or: [{ email: { $in: emails } }, { card: { $in: cards } }] })).map(teacher => teacher._id.toString());
            cl.teacherId = cl.teacherId.filter(_ => !ids.includes(_));
            cl.save().then(() => res.status(200).json({ msg: 'successfully removed teachers from class!' }))
        } catch (error) {
            console.log('trying')
            res.status(400).json({ error, msg: 'yes' });
        }
    }

    async delete(req, res) {
        const cl = await Class.findById(req.params.id);
        if (!cl.teacherId.includes(req.teacher._id)) return res.status(403).json({ error: 'Not your class!' });
        await Attendance.deleteMany({ classId: req.params.id });

        Class.findByIdAndDelete(req.params.id)
            .then(() => res.status(200).json({ msg: "Sucessfully deleted!" }))
            .catch(error => res.status(400).json({ error }));
    }
}

module.exports = new ClassController();