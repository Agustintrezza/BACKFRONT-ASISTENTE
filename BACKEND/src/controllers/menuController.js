// controllers/menu.controller.js
const Producto = require('../models/Productos');
const Seccion = require('../models/Secciones');

exports.getMenu = async (req, res) => {
  try {
    const productos = await Producto.find();
    const secciones = await Seccion.find();

    const menuItems = [];

    // 🧩 Agrupar productos por categoryKey (clave estable)
    const categoriasMap = {};
    productos.forEach((producto) => {
      const key = (producto.categoryKey || "").trim() || "sin-categoria";
      const visibleName = (producto.category || "Sin categoría").trim();

      if (!categoriasMap[key]) {
        categoriasMap[key] = {
          key,                                        // clave estable
          categoria: visibleName,                     // rótulo visible
          type: "categoria_producto",
          link: null,
          children: [],
        };
      }

      categoriasMap[key].children.push({
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

    // 🧩 Agrupar secciones por key (clave estable)
    const seccionesMap = {};
    secciones.forEach((seccion) => {
      const key = (seccion.key || "").trim();
      const titulo = (seccion.title || "").trim();

      if (!key) return; // sanity

      if (!seccionesMap[key]) {
        seccionesMap[key] = {
          id: seccion._id,
          key,                 // clave estable
          title: titulo,       // rótulo visible
          type: "section",
          link: seccion.link,
          children: [],
        };
      }

      seccionesMap[key].children.push(
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
