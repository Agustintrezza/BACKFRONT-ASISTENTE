// routes/productoRoutes.js
const express = require('express');
const {
  createProducto,
  getProductos,
  getProductoById,
  updateProducto,
  deleteProducto,
  getCategorias
} = require('../controllers/productoController');

const router = express.Router();

// Rutas CRUD de Productos
router.post('/', createProducto);
router.get('/', getProductos);        // Soporta query param ?category=XXX
router.get('/:id', getProductoById);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

// Ruta para listar categorías únicas
router.get('/categories/list', getCategorias);

// ✅ NUEVA RUTA: Obtener productos por categoría (case insensitive)
router.get('/categoria/:categoria', async (req, res) => {
  try {
    const categoria = decodeURIComponent(req.params.categoria || "").trim().toLowerCase();

    const Producto = require('../models/Productos');
    const productos = await Producto.find();

    const filtrados = productos.filter(p =>
      (p.category || "").trim().toLowerCase() === categoria
    );

    res.json({ items: filtrados });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos por categoría" });
  }
});

module.exports = router;
