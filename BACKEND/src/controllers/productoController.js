// controllers/productos.controller.js
const Producto = require('../models/Productos');
const { slugify } = require('../utils/slugify');

// Crear un nuevo producto
exports.createProducto = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.category && !body.categoryKey) {
      body.categoryKey = slugify(body.category);
    }
    const producto = new Producto(body);
    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los productos (opcional filtro por categoría visible o por key)
exports.getProductos = async (req, res) => {
  try {
    const { category, categoryKey } = req.query;
    const query = {};
    if (categoryKey) {
      query.categoryKey = categoryKey.toString().trim().toLowerCase();
    } else if (category) {
      // si filtran por visible, lo mapeamos a key para igualdad exacta
      query.categoryKey = slugify(category);
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
    const update = { ...req.body };
    if (typeof update.category === 'string') {
      update.categoryKey = slugify(update.category);
    }
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
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

// Obtener lista única de categorías (visibles) + keys (opcional)
exports.getCategorias = async (req, res) => {
  try {
    const categories = await Producto.distinct('category');
    const categoryKeys = await Producto.distinct('categoryKey');
    res.json({ categories, categoryKeys });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Editar una categoría (actualiza todos los productos que tengan esa categoría)
exports.updateCategoria = async (req, res) => {
  try {
    const { categoriaKey } = req.params;
    const { newCategory, newCategoryKey } = req.body;

    if (!newCategory || !newCategoryKey) {
      return res.status(400).json({ error: "Faltan parámetros" });
    }

    const result = await Producto.updateMany(
      { categoryKey: categoriaKey },
      {
        $set: {
          category: newCategory,
          categoryKey: newCategoryKey
        }
      }
    );

    res.json({ message: "Categoría actualizada correctamente", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una categoría (borra todos los productos de esa categoría)
exports.deleteCategoria = async (req, res) => {
  try {
    const { categoriaKey } = req.params;

    const result = await Producto.deleteMany({ categoryKey: categoriaKey });

    res.json({
      message: "Categoría eliminada correctamente",
      eliminados: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};