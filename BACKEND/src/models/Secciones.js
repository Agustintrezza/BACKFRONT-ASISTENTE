// models/Secciones.js
const mongoose = require('mongoose');
const { slugify } = require('../utils/slugify');

const ItemSchema = new mongoose.Schema({
  title: String,
  detail: String,
  link: String,
});

const SeccionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Título del registro individual
    category: { type: String, required: true }, // 🆕 Nombre visible de la categoría
    categoryKey: { type: String, required: true, index: true }, // 🆕 Clave técnica única
    link: String,
    menuItems: [ItemSchema],
  },
  { timestamps: true }
);

// Genera automáticamente categoryKey si no existe
SeccionSchema.pre('validate', function (next) {
  if (!this.categoryKey && this.category) {
    this.categoryKey = slugify(this.category);
  }
  next();
});

module.exports = mongoose.model('Seccion', SeccionSchema);
