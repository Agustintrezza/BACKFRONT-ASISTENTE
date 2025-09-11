'use strict';

const express = require('express');
const router = express.Router();

// Nota: req.cfg ya viene del middleware attachConfig
// Estructura esperada de req.cfg:
// {
//   tenant: '...',
//   features: {...},
//   branding: {...},
//   menu: [...]
// }

// GET /api/config -> config completa (segura para front)
router.get('/', (req, res) => {
  try {
    const cfg = req.cfg || {};
    // Si necesitás filtrar secretos, hacelo acá antes de responder.
    return res.json({
      tenant: req.tenant || 'default',
      features: cfg.features || {},
      branding: cfg.branding || {},
      menu: cfg.menu || []
    });
  } catch (e) {
    console.error('[/api/config] Error:', e);
    return res.status(500).json({ error: 'No se pudo obtener la configuración' });
  }
});

// GET /api/config/branding
router.get('/branding', (req, res) => {
  try {
    return res.json(req.cfg?.branding || {});
  } catch (e) {
    console.error('[/api/config/branding] Error:', e);
    return res.status(500).json({ error: 'No se pudo obtener el branding' });
  }
});

// GET /api/config/menu
router.get('/menu', (req, res) => {
  try {
    return res.json(req.cfg?.menu || []);
  } catch (e) {
    console.error('[/api/config/menu] Error:', e);
    return res.status(500).json({ error: 'No se pudo obtener el menú desde config' });
  }
});

// GET /api/config/features
router.get('/features', (req, res) => {
  try {
    return res.json(req.cfg?.features || {});
  } catch (e) {
    console.error('[/api/config/features] Error:', e);
    return res.status(500).json({ error: 'No se pudo obtener los features' });
  }
});

module.exports = router;
