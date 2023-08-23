const Code = require('../models/TeacherCode');
const bcrypt = require('bcrypt');

class TeacherCodeController {
    async create(req, res) {
        const { username, password } = req.body;

        if (!username || !password) return res.status(400).json({ error: 'Invalid values!' });

        if (username === process.env.ADMIN_USERNAME && (await bcrypt.compare(password, process.env.ADMIN_PASSWORD))) {
            const teacherCode = new Code({ code: Date.now() });

            teacherCode.save()
                .then(cod => res.status(201).json({ code: cod.code }))
                .catch(error => res.status(400).json(error));
        } else {
            res.status(403).json({ msg: 'Invalid credentials!' });
        }
    }
}

module.exports = new TeacherCodeController();