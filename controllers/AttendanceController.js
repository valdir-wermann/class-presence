const Attendance = require('../models/Attendance');
const Class = require('../models/Class');
const _ = require('underscore');

class AttendanceController {
    findAll(req, res) {
        const { studentId, teacherId, classId, groupBy, count } = req.query;

        const where = {};
        if (req.student) {
            where.studentId = req.student._id;
        } else if (studentId) {
            where.studentId = studentId;
        }
        if (teacherId) where.teacherId = teacherId;
        if (classId) where.classId = classId;

        Attendance
            .find(where)
            .sort({ date: 'desc' })
            .then(async attendance => {
                if (count === 'true') {
                    attendance = _.groupBy(attendance, (at) => at.classId);
                    const classes = await Class.find({ _id: { $in: Object.keys(attendance) } });
                    attendance = classes.reduce((prev, cur) => {
                        prev[cur.name] = attendance[cur._id];
                        return prev;
                    }, {});

                    const map = {};
                    Object.entries(attendance).forEach(([key, value]) => {
                        map[key] = value.reduce((prev, cur) => {
                            prev[cur.type] += cur.periods;
                            return prev;
                        }, { presente: 0, atrasado: 0, ausente: 0 });
                    });

                    return res.status(200).json(map);
                }

                if (groupBy === 'classId') {
                    attendance = _.groupBy(attendance, (at) => at.classId);
                    const classes = await Class.find({ _id: { $in: Object.keys(attendance) } });
                    attendance = classes.reduce((prev, cur) => {
                        prev[cur.name] = attendance[cur._id];
                        return prev;
                    }, {});
                };

                res.status(200).json(attendance);
            })
            .catch(error => res.status(400).json({ error }));
    }

    findOne(req, res) {
        Attendance
            .findById(req.params.id)
            .then(attendance => res.status(200).json(attendance))
            .catch(error => res.status(400).json(error));
    }

    async create(req, res) {
        const classId = req.params.id;
        let { students, description, date, periods } = req.body;
        const teacherId = req.teacher._id;

        students = students.map(student => {
            return {
                studentId: student.studentId,
                teacherId,
                classId,
                type: student.type,
                description,
                date,
                periods
            };
        });

        try {
            const saved = await Attendance.insertMany(students);
            res.status(200).json(saved);
        } catch (error) {
            res.status(400).json({ error });
        }
    }

    async update(req, res) {
        const { type } = req.body;

        const updateAttendance = {};
        if (type) updateAttendance.type = type;

        const a = await Attendance.findById(req.params.id);
        if (!a) res.status(404).json({ err: 'Not found!' })

        if (a.teacherId === req.teacher._id) {
            Attendance
                .findByIdAndUpdate(req.params.id, updateAttendance)
                .then((attend) => res.status(200).json(attend))
                .catch((error) => res.status(400).json(error));
        } else {
            res.status(403).json({ err: 'Forbidden request!' })
        }
    }
    async delete(req, res) {
        const a = await Attendance.findById(req.params.id);
        if (!a) return res.status(404).json({ msg: "attendance not found!" });
        const { date, teacherId, classId } = a;
        if (!teacherId.includes(req.teacher._id)) return res.status(401).json({ error: 'You are not allowed to delete others attendance!' });

        try {
            await Attendance.deleteMany({ date, teacherId, classId });
            res.status(200).json({ msg: 'Successfully deleted!' });
        } catch (e) {
            res.status(400).json({ error: 'Something went wrong!' })
        }

    }
}

module.exports = new AttendanceController();