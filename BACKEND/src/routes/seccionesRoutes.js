'use strict';

const express = require('express');
const router = express.Router();
const seccionesController = require('../controllers/seccionesController');

// CRUD (bloqueados si la fuente es config)
router.post('/', seccionesController.createSeccion);

// Listado y lectura
router.get('/', seccionesController.getSecciones);
router.get('/:id', seccionesController.getSeccionById);

// Updates (bloqueados si es config)
router.put('/:id', seccionesController.updateSeccion);
router.delete('/:id', seccionesController.deleteSeccion);

module.exports = router;
