function getBranding(req, res) {
    try {
      const branding = req?.cfg?.branding || { name: 'App', colors: {} };
      return res.json({
        tenant: req.tenant,
        branding,
      });
    } catch (e) {
      console.error('[getBranding] Error:', e);
      res.status(500).json({ error: 'No se pudo obtener branding' });
    }
  }
  
  function getFullConfig(req, res) {
    try {
      // Devuelve la config completa que cargamos por tenant
      return res.json({ tenant: req.tenant, config: req.cfg });
    } catch (e) {
      console.error('[getFullConfig] Error:', e);
      res.status(500).json({ error: 'No se pudo obtener config' });
    }
  }
  
  module.exports = { getBranding, getFullConfig };
  