const mongoose = require('mongoose');

// --------------------------
// Subdocumentos
// --------------------------

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

// ✅ Trazabilidad de notas internas
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

// --------------------------
// Esquema principal
// --------------------------
const ConversacionSchema = new mongoose.Schema(
  {
    // ✅ Multi-tenant
    tenant: {
      type: String,
      index: true,
      required: true,
    },

    sender: {
      type: String,
      required: true,
      // IMPORTANTE:
      // En el refactor multi-tenant preferimos índice compuesto (tenant+sender) único.
      // Si ya tenías un índice 'unique' solo en sender, asegurate de eliminarlo en la DB
      // para evitar colisiones entre tenants.
      // No ponemos 'unique: true' acá para permitir el compuesto de abajo.
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

    // ✅ Toma manual por operador (equivale al "modo admin" activo)
    adminActivo: {
      type: Boolean,
      default: false,
    },

    // Estado etiquetado para panel
    status: {
      type: String,
      enum: ['pendiente', 'urgente', 'prioritario', 'seguimiento', 'cerrado', 'resuelto', null],
      default: null,
    },

    notasInternas: {
      type: [NotaInternaSchema],
      default: [],
    },

    // Responsable asignado (email/usuario)
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

    // ✅ Cierre individual de conversación (no pasa a Rasa)
    modoOffline: {
      type: Boolean,
      default: false,
    },

    // ✅ Operador que tomó la conversación (informativo)
    operador: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Índice compuesto único: un sender puede repetirse en diferentes tenants
ConversacionSchema.index({ tenant: 1, sender: 1 }, { unique: true });

module.exports = mongoose.model('Conversacion', ConversacionSchema);
