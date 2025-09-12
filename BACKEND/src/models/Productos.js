// src/models/Productos.js
const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String, default: '' },
    price: { type: Number, default: null },
    duration: { type: String, default: '' },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: { type: String, default: '' },
    link: { type: String, default: '' },
    availableDates: { type: [String], default: [] },

    // ✅ Ítems asociados para el menú/UX (opcional)
    menuItems: [
      {
        title: { type: String, default: '' },
        detail: { type: String, default: '' },
        link: { type: String, default: '' },
        _id: false,
      },
    ],

    // (Opcional) multi-tenant si lo agregás más adelante
    // tenant: { type: String, index: true },
  },
  {
    timestamps: true,
    collection: 'productos', // 👈 importante para coincidir con Atlas
  }
);

// (Opcional) índices útiles
// ProductoSchema.index({ tenant: 1, category: 1 });

module.exports = mongoose.model('Producto', ProductoSchema);
