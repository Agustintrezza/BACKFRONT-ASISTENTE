// seedItems.js
const mongoose = require("mongoose");
const Item = require("./src/models/Items");
require("dotenv").config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Limpia coleccion antes de cargar
    await Item.deleteMany({ tenant: "demo" });

    const items = [
      // Productos
      {
        tenant: "demo",
        tipo: "producto",
        nombre: "Hotel Plaza",
        descripcion: "Hotel céntrico con desayuno incluido",
        categoria: "Alojamiento",
        keywords: ["hotel", "plaza", "alojamiento", "hospedaje"],
        etiquetas: ["premium"],
        destacado: true,
        orden: 1,
      },
      {
        tenant: "demo",
        tipo: "producto",
        nombre: "Traslado Aeropuerto",
        descripcion: "Servicio de traslado privado desde y hacia el aeropuerto",
        categoria: "Traslados",
        keywords: ["transfer", "aeropuerto", "taxi"],
        orden: 2,
      },
      {
        tenant: "demo",
        tipo: "producto",
        nombre: "Show de Tango La Ventana",
        descripcion: "Cena y espectáculo en San Telmo",
        categoria: "Shows de Tango",
        keywords: ["tango", "ventana", "espectáculo"],
        orden: 3,
      },

      // Secciones
      {
        tenant: "demo",
        tipo: "seccion",
        nombre: "Reservas",
        descripcion: "Opciones relacionadas con reservas",
        keywords: ["reserva", "booking"],
        orden: 10,
      },
      {
        tenant: "demo",
        tipo: "seccion",
        nombre: "Quiénes Somos",
        descripcion: "Información sobre la agencia",
        keywords: ["nosotros", "info", "agencia"],
        orden: 11,
      },
      {
        tenant: "demo",
        tipo: "seccion",
        nombre: "Contacto",
        descripcion: "Hablar con un asesor",
        keywords: ["contacto", "asesor", "ayuda"],
        orden: 12,
      },
    ];

    await Item.insertMany(items);
    console.log("✅ Seed de Items cargado con éxito");
    process.exit();
  } catch (err) {
    console.error("❌ Error en el seed:", err);
    process.exit(1);
  }
};

seed();
