// src/controllers/seccionesController.js
'use strict';
const Seccion = require('../models/Secciones');

// Crear sección
exports.createSeccion = async (req, res) => {
  try {
    const payload = {
      title: req.body?.title,
      link: req.body?.link || '',
      menuItems: Array.isArray(req.body?.menuItems) ? req.body.menuItems : [],
    };
    if (!payload.title) {
      return res.status(400).json({ error: 'title es requerido' });
    }
    const created = await Seccion.create(payload);
    return res.status(201).json(created);
  } catch (e) {
    console.error('[createSeccion] Error:', e);
    return res.status(500).json({ error: 'No se pudo crear la sección' });
  }
};

// Listar secciones
exports.getSecciones = async (_req, res) => {
  try {
    const items = await Seccion.find({}).lean();
    return res.json(Array.isArray(items) ? items : []);
  } catch (e) {
    console.error('[getSecciones] Error:', e);
    return res.status(500).json({ error: 'No se pudieron obtener secciones.' });
  }
};

// Obtener sección por id
exports.getSeccionById = async (req, res) => {
  try {
    const { id } = req.params;
    const found = await Seccion.findById(id).lean();
    if (!found) return res.status(404).json({ error: 'Sección no encontrada.' });
    return res.json(found);
  } catch (e) {
    console.error('[getSeccionById] Error:', e);
    return res.status(500).json({ error: 'No se pudo obtener la sección.' });
  }
};

// Actualizar sección
exports.updateSeccion = async (req, res) => {
  try {
    const { id } = req.params;
    const patch = {};
    if ('title' in req.body) patch.title = req.body.title;
    if ('link' in req.body) patch.link = req.body.link;
    if ('menuItems' in req.body) patch.menuItems = Array.isArray(req.body.menuItems) ? req.body.menuItems : [];

    const updated = await Seccion.findByIdAndUpdate(id, patch, { new: true });
    if (!updated) return res.status(404).json({ error: 'Sección no encontrada.' });
    return res.json(updated);
  } catch (e) {
    console.error('[updateSeccion] Error:', e);
    return res.status(500).json({ error: 'No se pudo actualizar la sección.' });
  }
};

// Eliminar sección
exports.deleteSeccion = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Seccion.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Sección no encontrada.' });
    return res.json({ ok: true });
  } catch (e) {
    console.error('[deleteSeccion] Error:', e);
    return res.status(500).json({ error: 'No se pudo eliminar la sección.' });
  }
};
