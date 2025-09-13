// src/controllers/itemController.js
const Item = require("../models/Items");

// GET todos los items (productos + secciones)
exports.getItems = async (req, res) => {
  try {
    const { tenant } = req; // viene del middleware tenantResolver
    const items = await Item.find({ tenant, activo: true }).sort({ orden: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener items" });
  }
};

// GET por ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item no encontrado" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener item" });
  }
};

// POST crear nuevo item
exports.createItem = async (req, res) => {
  try {
    const { tenant } = req;
    const nuevo = new Item({ ...req.body, tenant });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: "Error al crear item" });
  }
};

// PUT actualizar item
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: "Item no encontrado" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar item" });
  }
};

// DELETE lógico (activo = false)
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
    if (!item) return res.status(404).json({ error: "Item no encontrado" });
    res.json({ message: "Item desactivado", item });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar item" });
  }
};

// Búsqueda dinámica
exports.searchItems = async (req, res) => {
    try {
      const { tenant } = req;
      const { q } = req.query;
  
      if (!q) {
        return res.status(400).json({ error: "Parámetro 'q' es requerido" });
      }
  
      // regex case-insensitive
      const regex = new RegExp(q, "i");
  
      const items = await Item.find({
        tenant,
        activo: true,
        $or: [
          { nombre: regex },
          { descripcion: regex },
          { categoria: regex },
          { keywords: regex },
          { etiquetas: regex }
        ]
      }).sort({ orden: 1 });
  
      res.json(items);
    } catch (err) {
      console.error("❌ Error en searchItems:", err);
      res.status(500).json({ error: "Error en búsqueda" });
    }
  };
  
