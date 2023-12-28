const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    prenom: {type: String, required: true},
    nom: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true, default: 'user' }
});

module.exports = mongoose.model('User', userSchema);