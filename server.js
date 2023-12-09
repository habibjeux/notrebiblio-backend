const express = require('express');
const User = require('./models/User')
const app = express();
const port = 3000;
const hostname = "localhost";
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://habibjeux:giftLJACca2JmmEo@cluster0.rxzsank.mongodb.net/?retryWrites=true&w=majority',
{ 
useNewUrlParser: true,
useUnifiedTopology: true 
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
const bcrypt = require('bcrypt');

app.get('/', (req, res) => {
    res.send("Hello World!");
    next();
});
app.use(express.json());
app.post('/login', (req, res) => {
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

});
app.post('/signup', (req, res) => {
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
});
app.listen(port, hostname, () => {
  console.log(`Server is running on port ${port}`);
});