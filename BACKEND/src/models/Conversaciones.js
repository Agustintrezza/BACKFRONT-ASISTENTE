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

// ✅ Esquema para trazabilidad de notas internas
const NotaInternaSchema = new mongoose.Schema({
  texto: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  autor: {
    type: String, // generalmente el email
    required: true,
  },
  fecha: {
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
    enum: ['pendiente', 'urgente', 'prioritario', 'seguimiento', 'cerrado', 'resuelto', null],
    default: null,
  },
  notasInternas: {
    type: [NotaInternaSchema],
    default: [],
  },

  // ✅ CAMPO NUEVO
  responsable: {
    type: String,
    default: null,
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
  timestamps: true,
});

module.exports = mongoose.model('Conversacion', ConversacionSchema);
