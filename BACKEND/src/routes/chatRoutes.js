// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Conversacion = require('../models/Conversaciones');

// POST /api/chat/enviar
router.post('/enviar', async (req, res) => {
  const { sender, message } = req.body;

  try {
    const entrada = {
      from: 'user',
      text: message,
      timestamp: new Date()
    };

    let conv = await Conversacion.findOne({ sender });

    if (!conv) {
      conv = new Conversacion({
        sender,
        mensajes: [entrada],
        lastMessage: message,
        timestamp: new Date(),
        adminActivo: false
      });
    } else {
      conv.mensajes.push(entrada);
      conv.lastMessage = message;
      conv.timestamp = new Date();
    }

    await conv.save();

    if (conv.adminActivo) {
      const io = req.app.get('io');
      io.emit('actualizar_conversacion', conv);
      return res.json([]);
    }

    const rasaRes = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
      sender,
      message
    });

    const botMsgs = rasaRes.data.map((msg) => ({
      from: 'bot',
      text: msg.text || '',
      buttons: msg.buttons || [],
      timestamp: new Date()
    }));

    conv.mensajes.push(...botMsgs);
    conv.lastMessage = botMsgs[botMsgs.length - 1]?.text || message;
    conv.timestamp = new Date();
    await conv.save();

    const io = req.app.get('io');
    io.emit('nueva_conversacion', conv);
    io.emit('actualizar_conversacion', conv);

    res.json(botMsgs);
  } catch (err) {
    console.error('Error en /api/chat/enviar:', err);
    res.status(500).json({ error: 'Error al procesar mensaje' });
  }
});

// DELETE /api/chat/conversaciones/:sender
router.delete("/conversaciones/:sender", async (req, res) => {
  const { sender } = req.params;
  try {
    const result = await Conversacion.findOneAndDelete({ sender });
    if (!result) {
      return res.status(404).json({ error: "Conversación no encontrada" });
    }
    res.json({ message: "Conversación eliminada con éxito" });
  } catch (err) {
    console.error("Error eliminando conversación:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// PATCH /api/chat/conversaciones/:sender/status
router.patch('/conversaciones/:sender/status', async (req, res) => {
  const { sender } = req.params;
  const { status } = req.body;

  try {
    const allowedStatuses = ['none', 'pendiente', 'urgente', 'resuelto'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const updated = await Conversacion.findOneAndUpdate(
      { sender },
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    const io = req.app.get('io');
    io.emit('actualizar_conversacion', updated);

    res.json(updated);
  } catch (err) {
    console.error('Error actualizando status:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
