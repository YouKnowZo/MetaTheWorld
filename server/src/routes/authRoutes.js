const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/exchange', authController.exchange);
router.get('/me', auth, authController.me);

module.exports = router;
