// src/controllers/productoController.js
const Producto = require('../models/Productos');

// Crear un nuevo producto
exports.createProducto = async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los productos (opcional filtro por categoría via query ?category=)
exports.getProductos = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) {
      // match exacto, case-insensitive
      query.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
    }
    const productos = await Producto.find(query);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un producto por ID
exports.getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un producto
exports.updateProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un producto
exports.deleteProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener lista única de categorías
exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Producto.distinct('category');
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Obtener productos por categoría (case-insensitive) vía ruta /categoria/:categoria
exports.getProductosPorCategoria = async (req, res) => {
  try {
    const raw = (req.params.categoria || '').trim();
    if (!raw) return res.json({ items: [] });

    const regex = new RegExp(`^${escapeRegex(raw)}$`, 'i');
    const items = await Producto.find({ category: regex });

    return res.json({ items });
  } catch (error) {
    console.error('[getProductosPorCategoria] Error:', error);
    res.status(500).json({ error: 'Error al obtener productos por categoría' });
  }
};

// Helper para escapar caracteres especiales en RegExp
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
