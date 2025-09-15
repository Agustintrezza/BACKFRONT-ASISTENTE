// controllers/secciones.controller.js
const Seccion = require('../models/Secciones');
const { slugify } = require('../utils/slugify');

// Crear nueva sección
exports.createSeccion = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.title && !body.key) {
      body.key = slugify(body.title);
    }
    const seccion = new Seccion(body);
    const saved = await seccion.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las secciones
exports.getSecciones = async (req, res) => {
  try {
    const secciones = await Seccion.find().sort({ createdAt: -1 });
    res.json(secciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una sección por ID
exports.getSeccionById = async (req, res) => {
  try {
    const seccion = await Seccion.findById(req.params.id);
    if (!seccion) return res.status(404).json({ error: 'Sección no encontrada' });
    res.json(seccion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una sección
exports.updateSeccion = async (req, res) => {
  try {
    const update = { ...req.body };
    if (typeof update.title === 'string') {
      update.key = slugify(update.title);
    }
    const seccion = await Seccion.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!seccion) return res.status(404).json({ error: 'Sección no encontrada' });
    res.json(seccion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar una sección
exports.deleteSeccion = async (req, res) => {
  try {
    const seccion = await Seccion.findByIdAndDelete(req.params.id);
    if (!seccion) return res.status(404).json({ error: 'Sección no encontrada' });
    res.json({ message: 'Sección eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
