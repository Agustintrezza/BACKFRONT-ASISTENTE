'use strict';

const { getAssistantConfig } = require('../services/configService');

/**
 * Carga la configuración efectiva del asistente para el tenant resuelto
 * y la adjunta en req.cfg para que la usen las rutas/controladores.
 */
function attachConfig(req, _res, next) {
  try {
    const tenant = req.tenant || 'default';
    const cfg = getAssistantConfig(tenant) || {};
    req.cfg = cfg;
    next();
  } catch (err) {
    console.error('[attachConfig] Error:', err);
    // En caso de error no rompemos el flujo; exponemos cfg vacío
    req.cfg = {};
    next();
  }
}

module.exports = { attachConfig };
