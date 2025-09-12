const router = require('express').Router();
const { getStatus, setStatus } = require('../controllers/asistenteGlobalStatusController');
const { authMiddleware } = require('../middlewares/authMiddleware'); // tu middleware existente

// Público: consultar estado
router.get('/status', getStatus);

// Protegido: cambiar estado (requiere token)
router.patch('/status', authMiddleware, setStatus);

module.exports = router;
