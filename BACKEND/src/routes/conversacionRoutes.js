const express = require('express');
const router = express.Router();
const {
  getConversaciones,
  getConversacion,
  saveMensaje,
} = require('../controllers/conversacionController');

const Conversacion = require('../models/Conversaciones');
const { verifyToken } = require('../middlewares/authMiddleware');

// ✅ Ruta: guardar nueva nota interna con trazabilidad
router.patch(
  '/conversaciones/:sender/notaInterna',
  verifyToken,
  async (req, res) => {
    const { sender } = req.params;
    const { notaInterna } = req.body;
    const { email } = req.user; // viene del token

    if (!notaInterna || typeof notaInterna !== 'string') {
      return res
        .status(400)
        .json({ error: 'Se requiere una nota interna válida.' });
    }

    try {
      const conversacion = await Conversacion.findOne({ sender });
      if (!conversacion) {
        return res.status(404).json({ error: 'Conversación no encontrada' });
      }

      // ✅ Agregar la nueva nota al historial
      conversacion.notasInternas.push({
        texto: notaInterna,
        autor: email,
        fecha: new Date(),
      });

      await conversacion.save();

      const io = req.app.get('io');
      io?.emit?.('actualizar_conversacion', conversacion); // broadcast si está conectado

      res.json({
        message: 'Nota interna agregada correctamente',
        conversacion,
      });
    } catch (err) {
      console.error('❌ Error guardando nota interna:', err);
      res.status(500).json({ error: 'Error del servidor' });
    }
  }
);

// ✅ Ruta: asignar responsable a una conversación
router.patch(
  '/conversaciones/:sender/responsable',
  verifyToken,
  async (req, res) => {
    const { sender } = req.params;
    const { responsable } = req.body;

    // ✅ Aceptar string vacío o null para "sin responsable"
    if (responsable !== null && responsable !== "" && typeof responsable !== "string") {
      return res.status(400).json({ error: 'Responsable no válido' });
    }

    try {
      const conversacion = await Conversacion.findOne({ sender });
      if (!conversacion) {
        return res.status(404).json({ error: 'Conversación no encontrada' });
      }

      conversacion.responsable = responsable || null;
      await conversacion.save();

      const io = req.app.get('io');
      io?.emit?.('actualizar_conversacion', conversacion); // notificar si hay socket activo

      res.json({
        message: 'Responsable asignado correctamente',
        conversacion,
      });
    } catch (err) {
      console.error('❌ Error asignando responsable:', err);
      res.status(500).json({ error: 'Error del servidor' });
    }
  }
);



// 📥 Obtener todas las conversaciones
router.get('/conversaciones', getConversaciones);

// 📥 Obtener conversación específica por sender
router.get('/conversaciones/:sender', getConversacion);

// ✉️ Guardar mensaje nuevo
router.post('/conversaciones/mensaje', saveMensaje);

module.exports = router;
