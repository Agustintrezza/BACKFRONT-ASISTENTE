const express = require('express');
const router = express.Router();
const {
  getConversaciones,
  getConversacion,
  saveMensaje
} = require('../controllers/conversacionController');

// Nuevas rutas con prefijo 'conversaciones'
router.get('/conversaciones', getConversaciones);
router.get('/conversaciones/:sender', getConversacion);
router.post('/conversaciones/mensaje', saveMensaje);

module.exports = router;
