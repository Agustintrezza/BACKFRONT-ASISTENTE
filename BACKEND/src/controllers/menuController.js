const Producto = require('../models/Productos');
const Seccion = require('../models/Secciones');
const { slugify } = require('../utils/slugify');

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
          key,
          categoria: visibleName,
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

    // 🧩 Agrupar secciones correctamente (compatibilidad con modelo viejo y nuevo)
    const seccionesMap = {};
    secciones.forEach((seccion) => {
      const key =
        (seccion.key ||
          seccion.categoryKey ||
          slugify(seccion.title) ||
          "").trim();
      const titulo =
        (seccion.title || seccion.category || "Sin título").trim();

      if (!key) return;

      if (!seccionesMap[key]) {
        seccionesMap[key] = {
          id: seccion._id,
          key,
          title: titulo,
          type: "section",
          link: seccion.link || null,
          children: [],
        };
      }

      // 🧠 Compatibilidad: puede venir "menuItems" o "items"
      const items = seccion.menuItems || seccion.items || [];

      // cada item debe tener title/detail/link
      seccionesMap[key].children.push(
        ...items.map((item) => ({
          title: item.title || "",
          detail: item.detail || "",
          link: item.link || "",
        }))
      );
    });

    // Insertar secciones agrupadas al menú
    Object.values(seccionesMap).forEach((section) => menuItems.push(section));

    // ✅ Responder menú final
    res.json(menuItems);
  } catch (error) {
    console.error("❌ Error generando el menú:", error);
    res.status(500).json({ error: error.message });
  }
};
