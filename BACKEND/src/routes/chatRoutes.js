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
      // Crear conversación si no existe
      conv = new Conversacion({
        sender,
        mensajes: [entrada],
        lastMessage: message,
        timestamp: new Date(),
        adminActivo: false // default
      });
    } else {
      conv.mensajes.push(entrada);
      conv.lastMessage = message;
      conv.timestamp = new Date();
    }

    // Guardar mensaje del usuario
    await conv.save();

    // 🚫 Si el modo admin está activo, NO llamamos a Rasa
    if (conv.adminActivo) {
      const io = req.app.get('io');
      io.emit('actualizar_conversacion', conv);
      return res.json([]); // Devolvemos array vacío porque no hay respuesta del bot
    }

    // ✅ Si no hay admin, llamamos a Rasa
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

    // 🔁 Emitimos cambios en tiempo real
    const io = req.app.get('io');
    io.emit('nueva_conversacion', conv);
    io.emit('actualizar_conversacion', conv);

    res.json(botMsgs); // Devuelve las respuestas del bot al frontend
  } catch (err) {
    console.error('Error en /api/chat/enviar:', err);
    res.status(500).json({ error: 'Error al procesar mensaje' });
  }
});

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

module.exports = router;
