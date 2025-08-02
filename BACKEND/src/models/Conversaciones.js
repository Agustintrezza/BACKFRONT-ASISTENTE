// models/Conversaciones.js
const mongoose = require('mongoose');

// Esquema de cada mensaje dentro de una conversación
const MensajeSchema = new mongoose.Schema({
  from: {
    type: String,
    enum: ['user', 'bot', 'admin'],
    required: true,
  },
  text: {
    type: String,
    default: '',
  },
  buttons: {
    type: Array,
    default: [],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Esquema principal de conversación
const ConversacionSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    unique: true,
  },
  mensajes: [MensajeSchema],
  lastMessage: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  adminActivo: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pendiente', 'prioritario', 'seguimiento', 'cerrado', null],
    default: null,
  },
  notaInterna: {
    type: String,
    default: '',
    maxlength: 2000, // límite opcional por seguridad
  },
  leido: {
    type: Boolean,
    default: false,
  },
  respondido: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // ✅ crea automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Conversacion', ConversacionSchema);
