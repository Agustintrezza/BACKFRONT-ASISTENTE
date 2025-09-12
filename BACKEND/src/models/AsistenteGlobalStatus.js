const mongoose = require('mongoose');

const AsistenteGlobalStatusSchema = new mongoose.Schema({
  tenant: { type: String, required: true, index: true, unique: true },
  online: { type: Boolean, default: true },
  mensajeOffline: {
    type: String,
    default: 'Estamos fuera de línea. ¡Volvemos pronto!',
  },
  horario: {
    habilitar: { type: Boolean, default: false },
    rango: { type: String, default: '' }, // ej: "09:00-18:00"
  },
}, { timestamps: true });

module.exports = mongoose.model('AsistenteGlobalStatus', AsistenteGlobalStatusSchema);
