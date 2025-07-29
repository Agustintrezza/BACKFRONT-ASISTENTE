const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  price: Number,
  duration: String,
  stock: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  image: String,
  link: String,
  availableDates: [String],
  menuItems: [ // ✅ NUEVO BLOQUE
    {
      title: String,
      detail: String,
      link: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Producto', ProductoSchema);
