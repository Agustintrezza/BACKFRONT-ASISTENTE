// src/routes/reservaRoutes.js
const express = require('express');
const {
  createReserva,
  listReservas,
  getReservaById,
  updateReserva,
  deleteReserva,
} = require('../controllers/reservaController');

const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware'); // (tus middlewares)

const router = express.Router();

// 👇 Pública: el front/Rasa puede crear pre-reservas sin login
router.post('/', createReserva);

// 👇 Protegidas: ver/listar/editar/borrar requieren admin (ajustá a gusto)
router.get('/', verifyToken, authorizeRoles('admin'), listReservas);
router.get('/:id', verifyToken, authorizeRoles('admin'), getReservaById);
router.put('/:id', verifyToken, authorizeRoles('admin'), updateReserva);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteReserva);

module.exports = router;
