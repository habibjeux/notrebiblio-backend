const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ENV = require('../config');

module.exports.login = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user) 
                return res.status(400).json({error: 'User not found'});
            bcrypt.compare(req.body.password, user.password)
                .then(isMatch => {
                    if(!isMatch) 
                        return res.status(400).json({error: 'Invalid password'});
                    const token = jwt.sign({userId: user._id}, ENV.JWT_SECRET, { expiresIn: "60s" })
                    res.status(200).json({
                        message: "Logged in successfully",
                        email: user.email,
                        token
                    });                           
                })
                .catch((err) => res.status(400).json({error : "Failed"}));
            
        })
        .catch((err) => res.status(500).json({error : "Failed to check server"}));

}

module.exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user.save()
                .then(() => res.status(201).json({message : 'User created successfully'}))
                .catch(err => res.status(400).json({err}));
        })
        .catch(err => res.status(400).json({err}));
};