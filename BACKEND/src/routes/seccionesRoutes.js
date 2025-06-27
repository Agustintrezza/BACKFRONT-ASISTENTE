// routes/seccionesRoutes.js
const express = require('express');
const router = express.Router();
const seccionesController = require('../controllers/seccionesController');

// Rutas CRUD de Secciones
router.post('/', seccionesController.createSeccion);
router.get('/', seccionesController.getSecciones);
router.get('/:id', seccionesController.getSeccionById);
router.put('/:id', seccionesController.updateSeccion);
router.delete('/:id', seccionesController.deleteSeccion);

module.exports = router;
