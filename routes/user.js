const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrlUser = require('../controllers/user');

router.post('/login', ctrlUser.login);
router.post('/sign-up', ctrlUser.signup);
router.post('/logout', ctrlUser.logoutUser);
router.get('/profile', auth, ctrlUser.profile);
router.post('/users', ctrlUser.getUsers);

module.exports = router;