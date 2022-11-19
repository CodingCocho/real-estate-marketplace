const express = require('express');
const router = express.Router();
const {getGeocoding} = require('../controllers/geocodingController.js');

// Set a POST request to add the geocoding data to frontend
router.route('/').post(getGeocoding);

module.exports = router;