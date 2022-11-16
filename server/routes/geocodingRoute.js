const express = require('express');
const router = express.Router();
const {getGeocoding} = require('../controllers/geocodingController.js');

router.route('/').post(getGeocoding);

module.exports = router;