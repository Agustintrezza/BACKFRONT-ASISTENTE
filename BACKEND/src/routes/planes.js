const express = require("express");
const { getPlanes } = require("../controllers/planesController");

const router = express.Router();

// ✅ Endpoint para devolver todos los planes
router.get("/", getPlanes);

module.exports = router;
