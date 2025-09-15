// models/Secciones.js
const mongoose = require('mongoose');
const { slugify } = require('../utils/slugify');

const ItemSchema = new mongoose.Schema({
  title: String,
  detail: String,
  link: String
});

const SeccionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    key:   { type: String, required: true, index: true }, // 🔐 clave estable
    link:  String,
    menuItems: [ItemSchema],
  },
  { timestamps: true }
);

// Asegura key antes de validar (create) si falta
SeccionSchema.pre('validate', function (next) {
  if (!this.key && this.title) {
    this.key = slugify(this.title);
  }
  next();
});

module.exports = mongoose.model('Seccion', SeccionSchema);
