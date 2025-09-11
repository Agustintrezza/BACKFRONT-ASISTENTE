const express = require('express');
const { getBranding, getFullConfig } = require('../controllers/brandingController');

const router = express.Router();

router.get('/', getBranding);      // /api/branding
router.get('/full', getFullConfig); // /api/branding/full  (debug/admin)

module.exports = router;
