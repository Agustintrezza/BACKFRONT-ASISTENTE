const mongoose = require('mongoose');
const CategoriaProducto = require('./models/categoriaProducto');

const CATEGORIAS = [
  "Tours y Experiencias",
  "Shows de Tango",
  "Alojamiento",
  "Traslados",
  "Programas"
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const cat of CATEGORIAS) {
    const exists = await CategoriaProducto.findOne({ categoria: cat });
    if (!exists) {
      await CategoriaProducto.create({ categoria: cat, items: [] });
      // console.log(`Creada categoría ${cat}`);
    }
  }
  mongoose.disconnect();
}

seed();
