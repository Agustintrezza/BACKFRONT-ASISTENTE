const mongoose = require('mongoose');

const AsistenteGlobalStatusSchema = new mongoose.Schema({
  online: {
    type: Boolean,
    default: true,
  },
  mensajeOffline: {
    type: String,
    default: '🕐 El asistente está fuera de línea. Podés dejar tu mensaje y te responderemos pronto.',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('AsistenteGlobalStatus', AsistenteGlobalStatusSchema);
