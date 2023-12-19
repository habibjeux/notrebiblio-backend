const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ENV = require('../config');
const { json } = require('express');

const verifyPassword = (password) => {
    if (password.length < 8) 
        return false;
    const hasLowercase = /[a-z]/.test(password);
    if(!hasLowercase)
        return false;
    const hasUppercase = /[A-Z]/.test(password); 
    if (!hasUppercase) 
        return false; 
    return true;
}
module.exports.login = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user) 
                return res.status(400).json({error: 'User not found'});
            bcrypt.compare(req.body.password, user.password)
                .then(isMatch => {
                    if(!isMatch) 
                        return res.status(400).json({error: 'Invalid password'});
                    const token = jwt.sign({userId: user._id}, ENV.JWT_SECRET)
                    res
                        .cookie('access_token', token, {httpOnly: true, maxAge: 1000 * 3600 * 24})
                        .status(200).json({
                        message: "Logged in successfully",
                        email: user.email,
                        role: user.role
                    });                           
                })
                .catch((err) => res.status(400).json({ err }));
            
        })
        .catch((err) => res.status(500).json({ err }));

}

module.exports.signup = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(user) {
                res.status(400).json({ error : 'User already exists'});
                return
            }
            if(!verifyPassword(req.body.password)) {
                res.status(400).json({ error : 'Invalid password'});
                return;
            }
            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const user = new User({
                        email: req.body.email,
                        password: hash,
                    });
                    user.save()
                        .then(() => res.status(201).json({message : 'User created successfully'}))
                        .catch(err => res.status(400).json({error: err}));
                })
                .catch(err => res.status(400).json({err}));
        })
        .catch(err => res.status(500).json({ error : err }));
   
};

module.exports.getUsers = (req, res) => {
    User.find()
       .then(users => res.status(200).json(users))
       .catch(err => res.status(400).json({err}));
} 