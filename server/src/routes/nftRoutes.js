const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');
const auth = require('../middleware/auth');

router.get('/listings', nftController.getListings);
router.post('/mint', auth, nftController.mint);

module.exports = router;
