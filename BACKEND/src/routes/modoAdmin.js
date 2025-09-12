const express = require('express');
const router = express.Router();
const Conversacion = require('../models/Conversaciones');

// PATCH /api/chat/modo-admin
// Body esperado: { sender, adminActivo, operador?, modoOffline? }
router.patch('/modo-admin', async (req, res) => {
  const io = req.app.get('io');
  const { sender, adminActivo, operador, modoOffline } = req.body || {};

  if (typeof sender !== 'string' || typeof adminActivo !== 'boolean') {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const setFields = { adminActivo };
    if (typeof operador === 'string') setFields.operador = operador;
    if (typeof modoOffline === 'boolean') setFields.modoOffline = modoOffline;

    const conversacion = await Conversacion.findOneAndUpdate(
      { tenant: req.tenant, sender },
      { $set: setFields },
      { new: true }
    );

    if (!conversacion) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    // Emitir a todos (paneles) y a la sala del sender
    if (io) {
      io.emit('actualizar_conversacion', conversacion);
      io.to(sender).emit('actualizar_conversacion', conversacion);
    }

    res.json({ success: true, adminActivo: conversacion.adminActivo, conversacion });
  } catch (error) {
    console.error('Error actualizando modo admin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
