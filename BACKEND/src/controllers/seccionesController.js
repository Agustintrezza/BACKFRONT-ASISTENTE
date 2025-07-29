const Seccion = require('../models/Secciones');

// Crear nueva sección
exports.createSeccion = async (req, res) => {
  try {
    // console.log('📥 [CREATE] Body recibido:', req.body);

    const seccion = new Seccion(req.body);
    const saved = await seccion.save();

    // console.log('✅ [CREATE] Sección guardada:', saved);
    res.status(201).json(saved);
  } catch (error) {
    // console.error('❌ [CREATE] Error al guardar sección:', error.message);
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
    console.log('📥 [UPDATE] Body recibido:', req.body);

    const seccion = await Seccion.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!seccion) {
      console.warn('⚠️ [UPDATE] Sección no encontrada:', req.params.id);
      return res.status(404).json({ error: 'Sección no encontrada' });
    }

    // console.log('✅ [UPDATE] Sección actualizada:', seccion);
    res.json(seccion);
  } catch (error) {
    // console.error('❌ [UPDATE] Error al actualizar sección:', error.message);
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
