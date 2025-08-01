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

// Crear o actualizar conversación
exports.saveMensaje = async (req, res) => {
  const { sender, from, text, buttons } = req.body;
  try {
    const nuevaEntrada = {
      from,
      text,
      buttons,
      timestamp: new Date()
    };

    let conv = await Conversacion.findOne({ sender });
    if (!conv) {
      conv = new Conversacion({
        sender,
        mensajes: [nuevaEntrada],
        lastMessage: text,
        timestamp: new Date()
      });
    } else {
      conv.mensajes.push(nuevaEntrada);
      conv.lastMessage = text;
      conv.timestamp = new Date();
    }

    await conv.save();
    res.json(conv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
