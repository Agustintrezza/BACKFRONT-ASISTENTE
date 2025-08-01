// routes/chatAdmin.js
const express = require('express');
const router = express.Router();
const Conversacion = require('../models/Conversaciones');

router.post('/admin', async (req, res) => {
  const { sender, message } = req.body;

  try {
    const entrada = {
      from: 'admin',
      text: message,
      timestamp: new Date()
    };

    // Buscar conversación
    let conv = await Conversacion.findOne({ sender });
    if (!conv) {
      conv = new Conversacion({
        sender,
        mensajes: [entrada],
        lastMessage: message,
        timestamp: new Date()
      });
    } else {
      conv.mensajes.push(entrada);
      conv.lastMessage = message;
      conv.timestamp = new Date();
    }

    await conv.save();

    const io = req.app.get('io');
    io.to(sender).emit('nuevo_mensaje', {
      sender,
      mensajesNuevos: [entrada],
    });

    io.emit('nueva_conversacion', conv); // Para actualizar sidebar

    res.json({ ok: true });
  } catch (err) {
    console.error('Error en /api/chat/admin:', err);
    res.status(500).json({ error: 'Error al enviar mensaje admin' });
  }
});

module.exports = router;
