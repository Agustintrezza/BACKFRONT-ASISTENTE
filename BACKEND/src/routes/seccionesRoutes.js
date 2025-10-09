const express = require("express");
const router = express.Router();
const seccionesController = require("../controllers/seccionesController");

// CRUD general
router.post("/", seccionesController.createSeccion);
router.get("/", seccionesController.getSecciones);
router.get("/:id", seccionesController.getSeccionById);
router.put("/:id", seccionesController.updateSeccion);
router.delete("/:id", seccionesController.deleteSeccion);

// Rutas de categorías
router.put("/categoria/:categoryKey", seccionesController.updateCategoriaByKey);
router.delete("/categoria/:categoryKey", seccionesController.deleteCategoriaByKey);

module.exports = router;
