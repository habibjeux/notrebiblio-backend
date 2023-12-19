const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ENV = require('../config');
const { json } = require('express');

module.exports.login = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user) 
                return res.json({error: 'Email et/ou mot de passe incorrect(s)'});
            bcrypt.compare(req.body.password, user.password)
                .then(isMatch => {
                    if(!isMatch) 
                        return res.json({error: 'Email et/ou mot de passe incorrect(s)'});
                    const token = jwt.sign({userId: user._id}, ENV.JWT_SECRET)
                    res
                        .cookie('access_token', token, {httpOnly: true, maxAge: 1000 * 3600 * 24})
                        .json({
                        message: "Connexion avec succès",
                        email: user.email,
                        role: user.role
                    });                           
                })
                .catch((err) => res.status(500).json({ err }));
            
        })
        .catch((err) => res.status(500).json({ err }));

}

module.exports.signup = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(user) {
                res.json({ error : 'Email déjà utilisé'});
                return
            }
            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const user = new User({
                        email: req.body.email,
                        password: hash,
                    });
                    user.save()
                        .then(() => res.json({message : 'Utilisateur crée avec succès'}))
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