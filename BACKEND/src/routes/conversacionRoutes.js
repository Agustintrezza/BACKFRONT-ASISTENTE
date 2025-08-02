const express = require('express');
const router = express.Router();
const {
  getConversaciones,
  getConversacion,
  saveMensaje,
} = require('../controllers/conversacionController');

const Conversacion = require('../models/Conversaciones');

// ✅ Ruta faltante: guardar nota interna
router.patch('/conversaciones/:sender/notaInterna', async (req, res) => {
  const { sender } = req.params;
  const { notaInterna } = req.body;

  try {
    const updated = await Conversacion.findOneAndUpdate(
      { sender },
      { notaInterna },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    const io = req.app.get('io');
    io?.emit?.('actualizar_conversacion', updated); // por si `io` está definido

    res.json(updated);
  } catch (err) {
    console.error('Error actualizando nota interna:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Rutas existentes
router.get('/conversaciones', getConversaciones);
router.get('/conversaciones/:sender', getConversacion);
router.post('/conversaciones/mensaje', saveMensaje);

module.exports = router;
