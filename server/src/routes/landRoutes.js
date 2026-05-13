const express = require('express');
const router = express.Router();
const landController = require('../controllers/landController');
const auth = require('../middleware/auth');

router.get('/', landController.getLands);
router.post('/buy', auth, landController.buyLand);

module.exports = router;
