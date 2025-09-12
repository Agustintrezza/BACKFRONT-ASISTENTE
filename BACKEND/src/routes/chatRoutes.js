'use strict';

const router = require('express').Router();
const axios = require('axios');

const Conversacion = require('../models/Conversaciones');
const AsistenteGlobalStatus = require('../models/AsistenteGlobalStatus');

// util: obtiene baseUrl de Rasa desde config del tenant o .env
function getRasaBaseUrl(req) {
  const cfgUrl = req?.cfg?.integrations?.rasa?.baseUrl;
  return (cfgUrl && String(cfgUrl)) || process.env.RASA_BASE_URL || 'http://localhost:5005';
}

async function getGlobalStatus(tenant) {
  const doc = await AsistenteGlobalStatus.findOne({ tenant });
  if (!doc) return { online: true, mensajeOffline: null };
  return { online: !!doc.online, mensajeOffline: doc.mensajeOffline || null };
}

/**
 * POST /api/chat/enviar
 * Body: { sender, message }
 */
router.post('/enviar', async (req, res) => {
  try {
    const { sender, message } = req.body || {};
    if (!sender || !message) {
      return res.status(400).json({ error: 'Faltan parámetros: sender, message' });
    }

    // 1) asegurar conversación por tenant+sender
    let conv = await Conversacion.findOne({ tenant: req.tenant, sender });
    if (!conv) {
      conv = await Conversacion.create({
        tenant: req.tenant,
        sender,
        mensajes: [],
        lastMessage: '',
        timestamp: new Date(),
      });
    }

    const io = req.app.get('io'); // socket.io

    // 2) takeover activo: NO mandamos a Rasa
    if (conv.adminActivo) {
      conv.mensajes.push({
        from: 'user',
        text: message,
        buttons: [],
        timestamp: new Date(),
      });
      conv.lastMessage = message;
      conv.timestamp = new Date();
      await conv.save();

      // emitir a sala del sender para panel operador
      if (io) io.to(sender).emit('nuevo_mensaje', { from: 'user', text: message });

      return res.json({ ok: true, takeover: true, routed: 'operador' });
    }

    // 3) conversación cerrada (modoOffline): NO mandamos a Rasa
    if (conv.modoOffline) {
      conv.mensajes.push({ from: 'user', text: message, buttons: [], timestamp: new Date() });
      const cierre = 'Esta conversación está cerrada. Si necesitás, abrí una nueva o esperá a un operador.';
      conv.mensajes.push({ from: 'bot', text: cierre, buttons: [], timestamp: new Date() });
      conv.lastMessage = cierre;
      conv.timestamp = new Date();
      await conv.save();

      if (io) {
        io.to(sender).emit('nuevo_mensaje', { from: 'user', text: message });
        io.to(sender).emit('nuevo_mensaje', { from: 'bot', text: cierre });
      }

      return res.json({ ok: true, messages: [{ text: cierre }] });
    }

    // 4) offline GLOBAL por tenant: NO mandamos a Rasa
    const { online, mensajeOffline } = await getGlobalStatus(req.tenant);
    if (!online) {
      conv.mensajes.push({ from: 'user', text: message, buttons: [], timestamp: new Date() });
      const txt = mensajeOffline || 'Estamos fuera de línea. ¡Volvemos pronto!';
      conv.mensajes.push({ from: 'bot', text: txt, buttons: [], timestamp: new Date() });
      conv.lastMessage = txt;
      conv.timestamp = new Date();
      await conv.save();

      if (io) {
        io.to(sender).emit('nuevo_mensaje', { from: 'user', text: message });
        io.to(sender).emit('nuevo_mensaje', { from: 'bot', text: txt });
      }

      return res.json({ ok: true, messages: [{ text: txt }] });
    }

    // 5) flujo normal -> guardo mensaje del user y mando a Rasa
    conv.mensajes.push({
      from: 'user',
      text: message,
      buttons: [],
      timestamp: new Date(),
    });
    conv.lastMessage = message;
    conv.timestamp = new Date();
    await conv.save();

    if (io) io.to(sender).emit('nuevo_mensaje', { from: 'user', text: message });

    const rasaBase = getRasaBaseUrl(req);
    const senderNamespaced = `${req.tenant}:${sender}`;
    const { data: rasaRes } = await axios.post(
      `${rasaBase.replace(/\/$/, '')}/webhooks/rest/webhook`,
      { sender: senderNamespaced, message },
      { timeout: 12000 }
    );

    const out = [];
    for (const r of (rasaRes || [])) {
      if (r.text) {
        conv.mensajes.push({ from: 'bot', text: r.text, buttons: r.buttons || [], timestamp: new Date() });
        out.push({ text: r.text, buttons: r.buttons || [] });
        if (io) io.to(sender).emit('nuevo_mensaje', { from: 'bot', text: r.text, buttons: r.buttons || [] });
      }
      // acá podés sumar imágenes, payloads, etc., si Rasa los devuelve
    }
    conv.lastMessage = out.length ? out[out.length - 1].text : conv.lastMessage;
    conv.timestamp = new Date();
    await conv.save();

    return res.json({ ok: true, messages: out });
  } catch (e) {
    console.error('[POST /api/chat/enviar] Error:', e);
    return res.status(500).json({ error: 'Error procesando el mensaje' });
  }
});

module.exports = router;
