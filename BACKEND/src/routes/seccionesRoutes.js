// src/routes/seccionesRoutes.js
const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/seccionesController');

// Guardas para evitar “argument handler must be a function”
function assertFn(fn, name) {
  if (typeof fn !== 'function') {
    const exported = ctrl && typeof ctrl === 'object' ? Object.keys(ctrl) : [];
    throw new TypeError(
      `[seccionesRoutes] El handler '${name}' no es una función. ` +
      `Exports disponibles: ${exported.join(', ')}`
    );
  }
}

const {
  getSecciones,
  getSeccionById,
  createSeccion,
  updateSeccion,
  deleteSeccion,
} = ctrl;

assertFn(getSecciones, 'getSecciones');
assertFn(getSeccionById, 'getSeccionById');
assertFn(createSeccion, 'createSeccion');
assertFn(updateSeccion, 'updateSeccion');
assertFn(deleteSeccion, 'deleteSeccion');

// Rutas
router.get('/', getSecciones);
router.get('/:id', getSeccionById);
router.post('/', createSeccion);
router.put('/:id', updateSeccion);
router.delete('/:id', deleteSeccion);

module.exports = router;
