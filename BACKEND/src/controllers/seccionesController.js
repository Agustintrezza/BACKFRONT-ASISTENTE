const Seccion = require("../models/Secciones");
const { slugify } = require("../utils/slugify");

// ===============================
// 🟢 Crear nueva sección o categoría
// ===============================
exports.createSeccion = async (req, res) => {
  try {
    const body = { ...req.body };
    console.log("🟣 [createSeccion] Payload recibido:", body);

    // Si solo viene "title" y "key" → es una categoría, no una sección
    const isCategory =
      body.title && !body.category && !body.categoryKey && !body.sectionKey;

    if (isCategory) {
      body.key = body.key || slugify(body.title);
      body.menuItems = []; // por seguridad
      console.log("🟢 Creando CATEGORÍA con key:", body.key);
    } else {
      // Es una sección asociada a una categoría existente
      if (body.title && !body.key) {
        body.key = slugify(body.title);
      }
      if (body.category) {
        body.categoryKey = body.categoryKey || slugify(body.category);
      }
      console.log("🟣 Creando SECCIÓN con key:", body.key);
    }

    const seccion = new Seccion(body);
    const saved = await seccion.save();

    console.log("✅ [createSeccion] Sección/Categoría guardada:", saved._id);
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ [createSeccion] Error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// ===============================
// 🟡 Obtener todas las secciones
// ===============================
exports.getSecciones = async (req, res) => {
  try {
    const secciones = await Seccion.find().sort({ createdAt: -1 });
    console.log("🟣 [getSecciones] Total:", secciones.length);
    res.json(secciones);
  } catch (error) {
    console.error("❌ [getSecciones] Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ===============================
// 🔵 Obtener una sección por ID
// ===============================
exports.getSeccionById = async (req, res) => {
  try {
    const seccion = await Seccion.findById(req.params.id);
    if (!seccion) return res.status(404).json({ error: "Sección no encontrada" });
    res.json(seccion);
  } catch (error) {
    console.error("❌ [getSeccionById] Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ===============================
// 🟠 Actualizar una sección o categoría
// ===============================
exports.updateSeccion = async (req, res) => {
  try {
    const update = { ...req.body };
    if (typeof update.title === "string") {
      update.key = slugify(update.title);
    }

    const seccion = await Seccion.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!seccion)
      return res.status(404).json({ error: "Sección no encontrada" });

    console.log("🟢 [updateSeccion] Actualizada:", seccion.key);
    res.json(seccion);
  } catch (error) {
    console.error("❌ [updateSeccion] Error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// ===============================
// 🔴 Eliminar una sección o categoría
// ===============================
exports.deleteSeccion = async (req, res) => {
  try {
    const seccion = await Seccion.findByIdAndDelete(req.params.id);
    if (!seccion)
      return res.status(404).json({ error: "Sección no encontrada" });

    console.log("🗑️ [deleteSeccion] Eliminada:", seccion.title);
    res.json({ message: "Sección eliminada correctamente" });
  } catch (error) {
    console.error("❌ [deleteSeccion] Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ===============================
// ⚙️ Actualizar categoría por categoryKey
// ===============================
exports.updateCategoriaByKey = async (req, res) => {
  try {
    const { category } = req.body;
    const { categoryKey } = req.params;

    console.log("🟣 [updateCategoriaByKey] categoryKey:", categoryKey);
    console.log("🟣 [updateCategoriaByKey] Nuevo nombre:", category);

    const result = await Seccion.updateMany(
      { categoryKey },
      { $set: { category } }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Categoría no encontrada" });

    console.log("🟢 [updateCategoriaByKey] Result:", result);
    res.json({ message: "Categoría actualizada correctamente", result });
  } catch (error) {
    console.error("❌ [updateCategoriaByKey] Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ===============================
// 🔻 Eliminar categoría completa
// ===============================
exports.deleteCategoriaByKey = async (req, res) => {
  try {
    const { categoryKey } = req.params;
    console.log("🟣 [deleteCategoriaByKey] Eliminando categoría:", categoryKey);

    const result = await Seccion.deleteMany({ categoryKey });

    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Categoría no encontrada" });

    console.log("🗑️ [deleteCategoriaByKey] Result:", result);
    res.json({ message: "Categoría y secciones asociadas eliminadas", result });
  } catch (error) {
    console.error("❌ [deleteCategoriaByKey] Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
