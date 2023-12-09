const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports.login = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(user) {
                bcrypt.compare(req.body.password, user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            res.status(200).json({message: 'Logged in successfully'});
                        }
                        else
                            res.status(400).json({error: 'Invalid password'});
                    })
                    .catch((err) => res.status(500).json({err}));
            }
            else
                res.status(400).json({error: 'User not found'});
        })
        .catch((err) => res.status(500).json({err}));

}

module.exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message : 'User created successfully'}))
                .catch(err => res.status(400).json({err}));
        })
        .catch(err => res.status(400).json({err}));
};