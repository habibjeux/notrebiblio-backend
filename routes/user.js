const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrlUser = require('../controllers/user');

router.post('/login', ctrlUser.login);
router.post('/sign-up', ctrlUser.signup);
router.post('/users', ctrlUser.getUsers);

module.exports = router;