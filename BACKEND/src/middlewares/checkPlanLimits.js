// middlewares/checkPlanLimits.js
const fs = require("fs");
const path = require("path");
const Producto = require("../models/Productos");
const Seccion = require("../models/Secciones");
const User = require("../models/User"); // asegurate que tengas este modelo
const { slugify } = require("../utils/slugify");

// Cargar configuración de planes
const plans = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../config/plans-config.json"), "utf-8")
);

// ⚡ claves entrenadas (deberías mantenerlas sincronizadas con client-config.json)
const trainedProductKeys = [
  "tours-y-excursiones",
  "alojamiento",
  "shows-de-tango",
  "programas",
  "traslados",
];

const specialSectionKeys = [
  "guia-turistico",
  "tipo-de-cambio",
  "preguntas-frecuentes",
  "nosotros",
  "contacto",
];

/**
 * Middleware genérico para validar límites de plan
 * @param {("productos"|"secciones")} tipo
 */
function checkPlanLimits(tipo) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      const userId = req.user.id || req.user._id;
      if (!userId) {
        return res.status(401).json({ error: "Token inválido: falta ID de usuario" });
      }

      const userDb = await User.findById(userId);
      if (!userDb) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const userPlan = userDb.plan || "basic";
      const plan = plans[userPlan] || plans.basic;

      if (tipo === "productos") {
        const total = await Producto.countDocuments({ userId });
        if (total >= plan.maxProductosTotales) {
          return res.status(400).json({
            error: `Tu plan ${plan.name} permite un máximo de ${plan.maxProductosTotales} productos.`,
          });
        }

        const productos = await Producto.find({ userId });
        const comodines = productos.filter(
          (p) => !trainedProductKeys.includes(p.categoryKey)
        );

        const categoryKey = req.body.categoryKey || slugify(req.body.category || "");
        if (
          !trainedProductKeys.includes(categoryKey) &&
          comodines.length >= plan.maxProductosComodines
        ) {
          return res.status(400).json({
            error: `Tu plan ${plan.name} permite un máximo de ${plan.maxProductosComodines} productos sin entrenar.`,
          });
        }
      }

      if (tipo === "secciones") {
        const total = await Seccion.countDocuments({ userId });
        if (total >= plan.maxSeccionesTotales) {
          return res.status(400).json({
            error: `Tu plan ${plan.name} permite un máximo de ${plan.maxSeccionesTotales} secciones.`,
          });
        }

        const secciones = await Seccion.find({ userId });
        const comodines = secciones.filter(
          (s) => !specialSectionKeys.includes(s.key)
        );

        const key = req.body.key || slugify(req.body.title || "");
        if (
          !specialSectionKeys.includes(key) &&
          comodines.length >= plan.maxSeccionesComodines
        ) {
          return res.status(400).json({
            error: `Tu plan ${plan.name} permite un máximo de ${plan.maxSeccionesComodines} secciones sin entrenar.`,
          });
        }
      }

      next();
    } catch (err) {
      console.error("❌ Error en checkPlanLimits:", err);
      res.status(500).json({ error: "Error en validación de plan." });
    }
  };
}

module.exports = checkPlanLimits;
