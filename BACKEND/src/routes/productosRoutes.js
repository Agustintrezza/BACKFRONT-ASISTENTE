const express = require('express');
const {
  createProducto,
  getProductos,
  getProductoById,
  updateProducto,
  deleteProducto,
  getCategorias,
} = require('../controllers/productoController');

const Producto = require('../models/Productos');
const { slugify } = require('../utils/slugify');

const router = express.Router();

// CRUD productos
router.post('/', createProducto);
router.get('/', getProductos);
router.get('/:id', getProductoById);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

// Listado de categorías únicas
router.get('/categories/list', getCategorias);

// Obtener productos por categoría
router.get('/categoria/:categoria', async (req, res) => {
  try {
    const categoria = decodeURIComponent(req.params.categoria || "").trim().toLowerCase();
    const productos = await Producto.find();
    const filtrados = productos.filter(
      (p) => (p.category || "").trim().toLowerCase() === categoria
    );
    res.json({ items: filtrados });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos por categoría" });
  }
});

// Eliminar categoría completa (todos sus productos)
router.delete('/categoria/:categoriaKey', async (req, res) => {
  try {
    const categoriaKey = decodeURIComponent(req.params.categoriaKey || "").trim().toLowerCase();
    const result = await Producto.deleteMany({ categoryKey: categoriaKey });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "No se encontraron productos en esa categoría" });
    }
    res.json({ message: `Categoría eliminada correctamente (${result.deletedCount} productos borrados)` });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar la categoría" });
  }
});

// Editar nombre de categoría (afecta todos los productos de esa categoría)
router.put('/categoria/:categoriaKey', async (req, res) => {
  try {
    const categoriaKey = decodeURIComponent(req.params.categoriaKey || "").trim().toLowerCase();
    const newCategory = req.body.category;
    if (!newCategory) {
      return res.status(400).json({ error: "Debe proporcionar un nuevo nombre de categoría" });
    }
    const newCategoryKey = slugify(newCategory);

    const result = await Producto.updateMany(
      { categoryKey: categoriaKey },
      { category: newCategory, categoryKey: newCategoryKey }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "No se encontraron productos en esa categoría" });
    }

    res.json({
      message: `Categoría actualizada correctamente a "${newCategory}"`,
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar categoría" });
  }
});

module.exports = router;
