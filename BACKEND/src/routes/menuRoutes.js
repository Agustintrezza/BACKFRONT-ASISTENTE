// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const { getMenu } = require('../controllers/menuController');

// GET /api/menu
router.get('/', getMenu);

// ✅ Endpoint opcional para debug
router.get('/source', async (req, res) => {
  try {
    const useConfig = !!req?.cfg?.features?.useConfigForMenu;
    const fromConfig = useConfig && (req?.cfg?.menu?.length > 0);

    if (fromConfig) {
      return res.json({ source: 'config', items: req.cfg.menu || [] });
    } else {
      const items = await getMenu(req, res);
      return res.json({ source: 'db', items });
    }
  } catch (e) {
    console.error('[/api/menu/source] Error:', e);
    res.status(500).json({ error: 'No se pudo resolver la fuente del menú' });
  }
});

module.exports = router;
