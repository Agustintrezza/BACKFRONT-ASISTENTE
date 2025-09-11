const express = require('express');
const router = express.Router();

// Si ya tenés un servicio/ctrl que trae el menú “viejo”, importalo acá:
const { getMenuFromDB } = require('../services/configService'); // fallback
const { menuFromConfig } = require('../services/configService');

// GET /api/menu
router.get('/', async (req, res) => {
  try {
    const useConfig = !!req?.cfg?.features?.useConfigForMenu;

    if (useConfig) {
      const items = menuFromConfig(req.cfg);
      if (items && items.length) {
        return res.json(items);
      }
      // si el flag está on pero no hay menú en config, seguimos al fallback
    }

    // Fallback a tu implementación actual (DB/archivo/lo que haya)
    const legacy = await getMenuFromDB();
    return res.json(legacy || []);
  } catch (err) {
    console.error('[/api/menu] Error:', err);
    res.status(500).json({ error: 'No se pudo obtener el menú' });
  }
});

// ✅ Endpoint opcional para debug: saber de dónde salió el menú
router.get('/source', async (req, res) => {
  try {
    const useConfig = !!req?.cfg?.features?.useConfigForMenu;
    const fromConfig = useConfig && (req?.cfg?.menu?.length > 0);

    let payload;
    if (fromConfig) {
      payload = menuFromConfig(req.cfg) || [];
      return res.json({ source: 'config', items: payload });
    } else {
      payload = await getMenuFromDB();
      return res.json({ source: 'legacy', items: payload || [] });
    }
  } catch (e) {
    console.error('[/api/menu/source] Error:', e);
    res.status(500).json({ error: 'No se pudo resolver la fuente del menú' });
  }
});

module.exports = router;
