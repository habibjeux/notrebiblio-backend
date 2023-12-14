const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrlUser = require('../controllers/user');

router.post('/login', ctrlUser.login);
router.post('/signup', ctrlUser.signup);

module.exports = router;