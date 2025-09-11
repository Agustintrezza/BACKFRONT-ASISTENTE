const express = require('express');
const router = express.Router();
const axios = require('axios');
const Conversacion = require('../models/Conversaciones');
const AsistenteGlobalStatus = require('../models/AsistenteGlobalStatus');

// =========================
// RUTA PRINCIPAL DE ENVÍO
// =========================
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

    const io = req.app.get('io');

    // ⚠️ Si el admin está activo, no responde el bot
    if (conv.adminActivo) {
      io.emit('actualizar_conversacion', conv);
      return res.json([]);
    }

    // ⚠️ Check estado global antes de responder
    const globalStatus = await AsistenteGlobalStatus.findOne();
    if (globalStatus && globalStatus.online === false) {
      const respuesta = {
        from: 'bot',
        text: globalStatus.mensajeOffline || '🕐 El asistente no está disponible en este momento.',
        buttons: [],
        timestamp: new Date()
      };

      conv.mensajes.push(respuesta);
      conv.lastMessage = respuesta.text;
      conv.timestamp = new Date();
      await conv.save();

      io.emit('actualizar_conversacion', conv);
      return res.json([respuesta]);
    }

    // ⚠️ Si está en modo offline personalizado por conversación
    if (conv.modoOffline) {
      const msgOffline = conv.mensajeOffline || '🕐 El asistente no está disponible en este momento.';
      const respuesta = {
        from: 'bot',
        text: msgOffline,
        buttons: [],
        timestamp: new Date()
      };

      conv.mensajes.push(respuesta);
      conv.lastMessage = msgOffline;
      conv.timestamp = new Date();
      await conv.save();

      io.emit('actualizar_conversacion', conv);
      return res.json([respuesta]);
    }

    // ✅ Procesamiento normal si el bot está activo
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

    io.emit('nueva_conversacion', conv);
    io.emit('actualizar_conversacion', conv);

    res.json(botMsgs);
  } catch (err) {
    console.error('Error en /api/chat/enviar:', err);
    res.status(500).json({ error: 'Error al procesar mensaje' });
  }
});

// =========================
// ELIMINAR CONVERSACIÓN
// =========================
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

// =========================
// ACTUALIZAR STATUS
// =========================
router.patch('/conversaciones/:sender/status', async (req, res) => {
  const { sender } = req.params;
  const { status } = req.body;

  try {
    const allowedStatuses = ['none', 'pendiente', 'urgente', 'resuelto', 'prioritario', 'seguimiento', 'cerrado', null];
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

// =========================
// ACTUALIZAR MODO INDIVIDUAL
// =========================
router.patch('/conversaciones/:sender/modo', async (req, res) => {
  const { sender } = req.params;
  const { modoOffline, mensajeOffline } = req.body;

  try {
    const updated = await Conversacion.findOneAndUpdate(
      { sender },
      {
        modoOffline: Boolean(modoOffline),
        mensajeOffline: mensajeOffline || '🕐 El asistente no está disponible en este momento.'
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    const io = req.app.get('io');
    io.emit('actualizar_conversacion', updated);

    res.json(updated);
  } catch (err) {
    console.error('Error actualizando modo offline:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// =========================
// ESTADO GLOBAL - GET
// =========================
router.get('/status-global', async (req, res) => {
  try {
    const estado = await AsistenteGlobalStatus.findOne();
    if (!estado) {
      const nuevo = await AsistenteGlobalStatus.create({});
      return res.json(nuevo);
    }
    res.json(estado);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estado global' });
  }
});

// =========================
// ESTADO GLOBAL - PATCH
// =========================
router.patch('/status-global', async (req, res) => {
  const { online, mensajeOffline } = req.body;

  try {
    let estado = await AsistenteGlobalStatus.findOne();
    if (!estado) estado = new AsistenteGlobalStatus();

    if (typeof online === 'boolean') estado.online = online;
    if (typeof mensajeOffline === 'string') estado.mensajeOffline = mensajeOffline;

    await estado.save();

    const io = req.app.get('io');
    io.emit('estado_global_actualizado', estado);

    res.json(estado);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar estado global' });
  }
});

module.exports = router;
