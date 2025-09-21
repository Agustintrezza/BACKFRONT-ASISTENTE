const Conversacion = require('../models/Conversaciones');

// Obtener todas las conversaciones
exports.getConversaciones = async (req, res) => {
  try {
    const convs = await Conversacion.find().sort({ timestamp: -1 });
    res.json(convs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener conversación por sender
exports.getConversacion = async (req, res) => {
  try {
    const conv = await Conversacion.findOne({ sender: req.params.sender });
    if (!conv) return res.status(404).json({ error: 'Conversación no encontrada' });
    res.json(conv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear o actualizar conversación con mensaje nuevo
exports.saveMensaje = async (req, res) => {
  const { sender, from, text, buttons, modoOffline, mensajeOffline } = req.body;

  try {
    const nuevaEntrada = {
      from,
      text,
      buttons,
      timestamp: new Date(),
    };

    let conv = await Conversacion.findOne({ sender });

    if (!conv) {
      // 🔑 Conversación nueva
      conv = new Conversacion({
        sender,
        mensajes: [nuevaEntrada],
        lastMessage: text,
        timestamp: new Date(),
        modoOffline: modoOffline ?? false,
        mensajeOffline: mensajeOffline ?? '',
        status: 'none', // 👈 aseguramos que arranque con un estado válido
      });
    } else {
      // 🔑 Actualización de conversación existente
      conv.mensajes.push(nuevaEntrada);
      conv.lastMessage = text;
      conv.timestamp = new Date();

      if (typeof modoOffline === 'boolean') {
        conv.modoOffline = modoOffline;
      }

      if (typeof mensajeOffline === 'string') {
        conv.mensajeOffline = mensajeOffline;
      }

      // Si no tiene un status válido, lo forzamos a "none"
      if (!conv.status) {
        conv.status = 'none';
      }
    }

    await conv.save();
    res.json(conv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
