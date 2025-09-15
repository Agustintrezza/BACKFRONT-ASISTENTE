// scripts/backfill-keys.js
require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('../src/models/Productos');
const Seccion = require('../src/models/Secciones');
const { slugify } = require('../src/utils/slugify');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Productos: rellenar categoryKey si falta
    const productos = await Producto.find({ $or: [{ categoryKey: { $exists: false } }, { categoryKey: "" }] });
    for (const p of productos) {
      p.categoryKey = slugify(p.category);
      await p.save();
    }
    console.log(`✅ Productos actualizados: ${productos.length}`);

    // Secciones: rellenar key si falta
    const secciones = await Seccion.find({ $or: [{ key: { $exists: false } }, { key: "" }] });
    for (const s of secciones) {
      s.key = slugify(s.title);
      await s.save();
    }
    console.log(`✅ Secciones actualizadas: ${secciones.length}`);

    await mongoose.disconnect();
    console.log("🏁 Backfill completado");
  } catch (err) {
    console.error("❌ Error en backfill:", err);
    process.exit(1);
  }
})();
