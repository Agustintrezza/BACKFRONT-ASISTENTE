const express = require('express');
const router = express.Router();
const {
  crearReserva,
  obtenerReservas,
  obtenerReservaPorId,
  actualizarEstado,
  eliminarReserva
} = require('../controllers/reservaController');

// ✅ Crear una nueva reserva
router.post('/', crearReserva);

// 📋 Obtener todas las reservas
router.get('/', obtenerReservas);

// 🔍 Obtener una reserva específica por ID
router.get('/:id', obtenerReservaPorId);

// 🔄 Actualizar el estado de una reserva
router.patch('/:id', actualizarEstado); // ✅ ahora coincide con el frontend

// 🗑️ Eliminar una reserva
router.delete('/:id', eliminarReserva);

module.exports = router;
