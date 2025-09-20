// routes/planes.js
const express = require("express");
const { getPlanes } = require("../controllers/planesController");

const router = express.Router();

router.get("/", getPlanes);

module.exports = router;
