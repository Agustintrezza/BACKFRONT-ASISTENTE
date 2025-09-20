// controllers/planesController.js
const path = require("path");
const fs = require("fs");

// __dirname ya existe en CommonJS, no hace falta fileURLToPath
const getPlanes = (req, res) => {
  try {
    const filePath = path.join(__dirname, "../config/plans-config.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const planes = JSON.parse(raw);
    res.json(planes);
  } catch (err) {
    console.error("Error cargando planes:", err);
    res.status(500).json({
      error: "No se pudo cargar la configuración de planes",
    });
  }
};

module.exports = { getPlanes };
