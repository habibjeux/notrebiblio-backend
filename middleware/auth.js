const jwt = require('jsonwebtoken');
const ENV = require('../config');
module.exports = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if(!token)
            return res.status(401).json({ error: 'Not authorized, no token' });
        try {
            const decoded = jwt.verify(token, ENV.JWT_SECRET);
            req.user = decoded;
            next(); 
        } catch (error) {
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
        
    } catch (error) {
        return res.status(401).send({ message: 'Invalid Token.' });
    }
};