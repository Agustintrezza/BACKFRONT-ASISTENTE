// src/models/Secciones.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: String,
  detail: String,
  link: String
});

const SeccionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: String,
  menuItems: [ItemSchema]
}, { timestamps: true, collection: 'seccions' });

module.exports = mongoose.model('Seccion', SeccionSchema);
