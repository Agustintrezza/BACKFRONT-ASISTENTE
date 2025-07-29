const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String },
  telefono: { type: String, required: true },
  fecha: { type: String, required: true },
  pasajeros: { type: Number, required: true },
  producto: { type: String, required: true },
  estado: {
    type: String,
    enum: ['pendiente', 'en_proceso', 'cerrada'],
    default: 'pendiente'
  },
  fecha_creacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reserva', reservaSchema);
