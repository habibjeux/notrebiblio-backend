const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ENV = require('../config');

module.exports.login = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user) 
                return res.json({error: "L'utilisateur n'existe pas!"});
            bcrypt.compare(req.body.password, user.password)
                .then(isMatch => {
                    if(!isMatch) 
                        return res.json({error: 'Email et/ou mot de passe incorrect(s)'});
                    const token = jwt.sign({_id: user._id, prenom: user.prenom, nom: user.nom, username: user.username, email: user.email, role: user.role}, ENV.JWT_SECRET)
                    res
                        .cookie('access_token', token, {httpOnly: true, maxAge: 1000 * 3600 * 24})
                        .json({ message: "Connexion avec succès" });                           
                })
                .catch(() => res.status(500).json({ error: "Erreur coté serveur" }));
            
        })
        .catch(() => res.status(500).json({ error: "Erreur côté serveur" }));

}

module.exports.signup = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(user) {
                res.json({ error : 'Email déjà utilisé'});
                return
            }
            User.findOne({username: req.body.username})
            .then(user => {
                if(user) {
                    res.json({ error : 'Pseudo déjà utilisé'});
                    return
                }
                bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const user = new User({
                        prenom: req.body.prenom,
                        nom: req.body.nom,
                        username: req.body.username,
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
        })
        .catch(err => res.status(500).json({ error : err }));
   
};

module.exports.logoutUser = (req, res) => {
    res.cookie('access_token', '', {
       httpOnly: true,
       expires: new Date(0) 
    });
    res.json({message: 'Utilisateur déconnecté'});
}

module.exports.profile = (req, res) => {
    res.json(req.user);
}

module.exports.getUsers = (req, res) => {
    User.find()
       .then(users => res.status(200).json(users))
       .catch(err => res.status(400).json({err}));
} 

