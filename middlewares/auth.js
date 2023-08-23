const jwt = require('jsonwebtoken');

exports.teacher_auth = function (req, res, next) {
    if (!req.headers.authorization) return res.status(401).json({ error: 'Invalid token!' });
    const [, token] = req.headers.authorization.split(' ');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded._doc.classId) return res.status(401).json({ error: 'Invalid credentials!' })
        req.teacher = decoded._doc;
        res.setHeader('User', 'teacher');
    } catch (err) {
        res.status(401).json({ err });
    }

    next();
}

exports.auth = function (req, res, next) {
    if (!req.headers.authorization) return res.status(401).json({ error: 'Missing token!' });
    const [, token] = req.headers.authorization.split(' ');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const type = (decoded._doc.classId) ? 'student' : 'teacher';
        req[type] = decoded._doc;
        res.setHeader('User', type);
    } catch (err) {
        res.status(401).json({ err });
    }

    next();
}