// routes/enviarManual.js
const express = require('express');
const router = express.Router();
const Conversacion = require("../models/Conversaciones"); // ✅ Modelo correcto

router.post('/enviarManual', async (req, res) => {
  const io = req.app.get('io');
  const { sender, text } = req.body || {};

  if (!sender || !text) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const mensaje = {
      from: 'admin',
      text,
      timestamp: new Date(),
      buttons: [],
    };

    // Buscar y actualizar la conversación en DB (por tenant + sender)
    const conv = await Conversacion.findOneAndUpdate(
      { tenant: req.tenant, sender },
      {
        $push: { mensajes: mensaje },
        $set: {
          adminActivo: true,               // ✅ mantiene takeover activo
          lastMessage: text,
          timestamp: new Date(),
        },
      },
      { new: true }
    );

    if (!conv) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    // Emitir actualización por socket
    if (io) {
      io.emit('actualizar_conversacion', conv);   // paneles generales
      io.to(sender).emit('nuevo_mensaje', mensaje); // sala del sender
      io.to(sender).emit('actualizar_conversacion', conv);
    }

    res.json({ success: true, mensaje, conversacion: conv });
  } catch (err) {
    console.error('Error al enviar mensaje manual:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
