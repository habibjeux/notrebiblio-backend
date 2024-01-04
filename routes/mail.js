const express = require('express');
const router = express.Router();
const ctrlMail = require('../controllers/mail');

router.post('/send', ctrlMail.send);

module.exports = router;