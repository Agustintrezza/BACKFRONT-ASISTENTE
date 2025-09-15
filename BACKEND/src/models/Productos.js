// models/Productos.js
const mongoose = require('mongoose');
const { slugify } = require('../utils/slugify');

const ProductoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: Number,
    duration: String,
    stock: { type: Number, min: 0 },
    category: { type: String, required: true },     // visible
    categoryKey: { type: String, required: true, index: true }, // 🔐 clave estable
    image: String,
    link: String,
    availableDates: [String],
    menuItems: [
      { title: String, detail: String, link: String }
    ]
  },
  { timestamps: true }
);

// Asegura categoryKey en create
ProductoSchema.pre('validate', function (next) {
  if (!this.categoryKey && this.category) {
    this.categoryKey = slugify(this.category);
  }
  next();
});

module.exports = mongoose.model('Producto', ProductoSchema);
