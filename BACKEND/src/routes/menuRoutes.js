const express = require('express');
const router = express.Router();
const { getMenu } = require('../controllers/menuController');

router.get('/', getMenu); // GET /api/menu

module.exports = router;
