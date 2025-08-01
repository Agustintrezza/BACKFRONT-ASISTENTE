const express = require('express');
const router = express.Router();
const Conversacion = require('../models/Conversaciones');

// PATCH /api/chat/modo-admin
router.patch('/modo-admin', async (req, res) => {
  const io = req.app.get('io');
  const { sender, adminActivo } = req.body;

  if (typeof sender !== 'string' || typeof adminActivo !== 'boolean') {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const conversacion = await Conversacion.findOneAndUpdate(
      { sender },
      { adminActivo },
      { new: true }
    );

    if (!conversacion) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    io.emit('actualizar_conversacion', conversacion);
    res.json({ success: true, adminActivo });
  } catch (error) {
    console.error('Error actualizando modo admin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
