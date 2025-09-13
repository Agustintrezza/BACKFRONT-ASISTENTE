// src/models/Items.js
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  tenant: { type: String, required: true },   // multi-tenant
  tipo: { type: String, enum: ["producto", "seccion"], required: true },

  // Info básica
  nombre: { type: String, required: true },
  descripcion: { type: String },
  categoria: { type: String },  // ej: "Alojamiento", "Traslado", "Tango"

  // Filtros y búsquedas
  keywords: [{ type: String }],  // sinónimos o frases clave para búsquedas
  etiquetas: [{ type: String }], // tags adicionales (ej: "premium", "promo")
  destacado: { type: Boolean, default: false }, // para destacar en el menú

  // Datos extra
  metadata: { type: Object },   // JSON libre para extensiones (ej: precio, URL, horario)
  orden: { type: Number, default: 0 }, // control de orden en menú
  activo: { type: Boolean, default: true } // soft-delete / visibilidad
}, { timestamps: true });

module.exports = mongoose.model("Item", ItemSchema);
