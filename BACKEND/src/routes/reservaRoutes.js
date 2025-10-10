const express = require("express");
const router = express.Router();
const {
  crearReserva,
  obtenerReservas,
  obtenerReservaPorId,
  actualizarEstado,
  eliminarReserva,
  descargarReservas,
} = require("../controllers/reservaController");

// ✅ Crear una nueva reserva
router.post("/", crearReserva);

// 📋 Obtener todas las reservas
router.get("/", obtenerReservas);

// 🔍 Obtener una reserva específica
router.get("/:id", obtenerReservaPorId);

// 🔄 Actualizar estado
router.patch("/:id", actualizarEstado);

// 🗑️ Eliminar una reserva
router.delete("/:id", eliminarReserva);

// 📦 Descargar todas las reservas (Excel)
router.get("/descargar/excel", descargarReservas);

module.exports = router;
