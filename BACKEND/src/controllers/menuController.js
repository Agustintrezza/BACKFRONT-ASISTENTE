const Producto = require('../models/Productos');
const Seccion = require('../models/Secciones');

exports.getMenu = async (req, res) => {
  try {
    const productos = await Producto.find();
    const secciones = await Seccion.find();

    const menuItems = [];

    // 🧩 Agrupar productos por categoría
    const categoriasMap = {};

    productos.forEach((producto) => {
      const categoriaNombre = producto.category?.trim() || "Sin categoría";

      if (!categoriasMap[categoriaNombre]) {
        categoriasMap[categoriaNombre] = {
          categoria: categoriaNombre,
          type: "categoria_producto",
          link: null,
          children: [],
        };
      }

      categoriasMap[categoriaNombre].children.push({
        id: producto._id,
        title: producto.title,
        description: producto.description,
        price: producto.price,
        duration: producto.duration,
        stock: producto.stock,
        image: producto.image,
        link: producto.link,
        availableDates: producto.availableDates,
      });
    });

    // Insertar categorías de productos al menú
    Object.values(categoriasMap).forEach((cat) => menuItems.push(cat));

    // 🧩 Agrupar secciones por título (para evitar duplicados)
    const seccionesMap = {};

    secciones.forEach((seccion) => {
      const titulo = seccion.title.trim();

      if (!seccionesMap[titulo]) {
        seccionesMap[titulo] = {
          id: seccion._id,
          title: titulo,
          type: "section",
          link: seccion.link,
          children: [],
        };
      }

      // Agregar ítems (si hay)
      seccionesMap[titulo].children.push(
        ...(seccion.menuItems || []).map((item) => ({
          title: item.title,
          detail: item.detail,
          link: item.link,
        }))
      );
    });

    // Insertar secciones agrupadas al menú
    Object.values(seccionesMap).forEach((section) => menuItems.push(section));

    res.json(menuItems);
  } catch (error) {
    console.error("Error generando el menú:", error);
    res.status(500).json({ error: error.message });
  }
};
