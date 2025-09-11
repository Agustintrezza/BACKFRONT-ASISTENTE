'use strict';

const { getSeccionesFromDB } = require('../services/configService');

function slugify(str = '') {
  return String(str)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 64);
}

function sectionsFromConfig(cfg) {
  const menu = Array.isArray(cfg?.menu) ? cfg.menu : [];
  return menu
    .filter(i => (i?.type || '').toLowerCase() === 'section')
    .map(sec => ({
      id: slugify(sec.title || 'section'),
      title: sec.title || 'Sin título',
      children: Array.isArray(sec.children) ? sec.children : [],
      _source: 'config'
    }));
}

async function createSeccion(req, res) {
  const usingConfig = !!req?.cfg?.features?.useConfigForMenu;
  if (usingConfig && Array.isArray(req?.cfg?.menu)) {
    return res.status(409).json({
      error: 'Secciones gestionadas por configuración del tenant. Editá el archivo de config.'
    });
  }
  return res.status(501).json({ error: 'createSeccion no implementado en modo legacy.' });
}

async function getSecciones(req, res) {
  try {
    const usingConfig = !!req?.cfg?.features?.useConfigForMenu;
    if (usingConfig && Array.isArray(req?.cfg?.menu)) {
      return res.json(sectionsFromConfig(req.cfg));
    }
    const data = await getSeccionesFromDB();
    return res.json(Array.isArray(data) ? data : []);
  } catch (e) {
    console.error('[seccionesController.getSecciones] Error:', e);
    return res.status(500).json({ error: 'No se pudieron obtener secciones.' });
  }
}

async function getSeccionById(req, res) {
  try {
    const { id } = req.params;
    const usingConfig = !!req?.cfg?.features?.useConfigForMenu;

    if (usingConfig && Array.isArray(req?.cfg?.menu)) {
      const secs = sectionsFromConfig(req.cfg);
      const found = secs.find(s => s.id === id);
      if (!found) return res.status(404).json({ error: 'Sección no encontrada.' });
      return res.json(found);
    }

    const all = await getSeccionesFromDB();
    const found = (Array.isArray(all) ? all : []).find(s => String(s.id || s._id) === id);
    if (!found) return res.status(404).json({ error: 'Sección no encontrada.' });
    return res.json(found);
  } catch (e) {
    console.error('[seccionesController.getSeccionById] Error:', e);
    return res.status(500).json({ error: 'No se pudo obtener la sección.' });
  }
}

async function updateSeccion(req, res) {
  const usingConfig = !!req?.cfg?.features?.useConfigForMenu;
  if (usingConfig && Array.isArray(req?.cfg?.menu)) {
    return res.status(409).json({
      error: 'Secciones gestionadas por configuración del tenant. Editá el archivo de config.'
    });
  }
  return res.status(501).json({ error: 'updateSeccion no implementado en modo legacy.' });
}

async function deleteSeccion(req, res) {
  const usingConfig = !!req?.cfg?.features?.useConfigForMenu;
  if (usingConfig && Array.isArray(req?.cfg?.menu)) {
    return res.status(409).json({
      error: 'Secciones gestionadas por configuración del tenant. Editá el archivo de config.'
    });
  }
  return res.status(501).json({ error: 'deleteSeccion no implementado en modo legacy.' });
}

module.exports = {
  createSeccion,
  getSecciones,
  getSeccionById,
  updateSeccion,
  deleteSeccion
};
