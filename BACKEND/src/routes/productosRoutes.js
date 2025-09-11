'use strict';

const express = require('express');
const router = express.Router();
const {
  createProducto,
  getProductos,
  getProductoById,
  updateProducto,
  deleteProducto,
  getCategorias,
  getProductosPorCategoria
} = require('../controllers/productoController');

// Crear (bloqueado si la fuente es config)
router.post('/', createProducto);

// Listado general (?category=XXX soportado)
router.get('/', getProductos);

// RUTAS ESPECIALES (ANTES de '/:id')
router.get('/categories/list', getCategorias);
router.get('/categoria/:categoria', getProductosPorCategoria);

// Lectura por id
router.get('/:id', getProductoById);

// Update/Delete (bloqueados si fuente es config)
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

module.exports = router;
