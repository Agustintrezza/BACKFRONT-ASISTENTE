const mongoose = require('mongoose');

// Esquema de cada mensaje
const MensajeSchema = new mongoose.Schema({
  from: { type: String, enum: ['user', 'bot', 'admin'], required: true }, // ← agregado 'admin'
  text: String,
  buttons: Array,
  timestamp: { type: Date, default: Date.now }
});

// Esquema de la conversación
const ConversacionSchema = new mongoose.Schema({
  sender: { type: String, required: true, unique: true },
  mensajes: [MensajeSchema],
  lastMessage: String,
  timestamp: { type: Date, default: Date.now },
  adminActivo: { type: Boolean, default: false } // ← agregado para control humano
});

module.exports = mongoose.model('Conversacion', ConversacionSchema);
