const jwt = require('jsonwebtoken');
const ENV = require('../config');
module.exports = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(token) {
            try {
                const decoded = jwt.verify(token, ENV.JWT_SECRET);
                req.user = decoded; 
            } catch (error) {
                res.status(401).json({ error: 'Not authorized, token failed' });
            }
        } else {
            res.status(401).json({ error: 'Not authorized, no token' });
        }
    } catch (error) {
        return res.status(401).send({ message: 'Invalid Token.' });
    }
};