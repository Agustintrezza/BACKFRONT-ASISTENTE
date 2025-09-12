// src/routes/productosRoutes.js
const express = require('express');
const router = express.Router();

// ⬇️ Importá exactamente estos nombres como los exporta tu controller
const {
  getProductos,
  getProductoById,
  getCategorias,
  getProductosPorCategoria,
  createProducto,
  updateProducto,
  deleteProducto,
} = require('../controllers/productoController');

// (Opcional) Middlewares de auth si los querés acá
// const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Listado / filtros
router.get('/', getProductos); // ?category=... &source=db|legacy (override)
router.get('/categorias', getCategorias);
router.get('/categoria/:categoria', getProductosPorCategoria);

// Detalle
router.get('/:id', getProductoById);

// CRUD (legacy). Si usás auth, descomentá:
// router.post('/', verifyToken, authorizeRoles('admin'), createProducto);
// router.put('/:id', verifyToken, authorizeRoles('admin'), updateProducto);
// router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteProducto);

router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

module.exports = router;
