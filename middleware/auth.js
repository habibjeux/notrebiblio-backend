const jwt = require('jsonwebtoken');
const ENV = require('../config');
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, ENV.JWT_SECRET);
        req.user = decodedToken;
        res.status(200).send({decodedToken});
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Invalid Token.' });
    }
};