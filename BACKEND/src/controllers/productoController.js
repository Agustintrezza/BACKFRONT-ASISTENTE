'use strict';

// Si tenés fuentes legacy, las importás acá:
const { getProductosFromDB } = require('../services/configService');

// Util: slug a partir de texto
function slugify(str = '') {
  return String(str)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 64);
}

// Lee categorías (type: "categoria_producto") desde cfg.menu
function categoriesFromConfig(cfg) {
  const menu = Array.isArray(cfg?.menu) ? cfg.menu : [];
  return menu.filter(i => (i?.type || '').toLowerCase() === 'categoria_producto');
}

// Aplana productos desde cfg.menu
function flattenProductsFromConfig(cfg) {
  const cats = categoriesFromConfig(cfg);
  const out = [];
  for (const cat of cats) {
    const category = cat.categoria || cat.title || 'Sin categoría';
    const children = Array.isArray(cat.children) ? cat.children : [];
    for (const child of children) {
      out.push({
        id: slugify(`${category}-${child.title || 'producto'}`),
        title: child.title || 'Sin título',
        description: child.description || '',
        category,
        _source: 'config'
      });
    }
  }
  return out;
}

// Filtra por categoría (case-insensitive) desde cfg.menu
function productsByCategoryFromConfig(cfg, categoryRaw) {
  const wanted = String(categoryRaw || '').trim().toLowerCase();
  const cats = categoriesFromConfig(cfg);
  const found = cats.find(c =>
    String(c.categoria || c.title || '').trim().toLowerCase() === wanted
  );
  if (!found) return [];
  const children = Array.isArray(found.children) ? found.children : [];
  return children.map(ch => ({
    id: slugify(`${found.categoria || found.title}-${ch.title || 'producto'}`),
    title: ch.title || 'Sin título',
    description: ch.description || '',
    category: found.categoria || found.title || 'Sin categoría',
    _source: 'config'
  }));
}

/* -------------------- Handlers -------------------- */

async function createProducto(req, res) {
  const usingConfig = !!req?.cfg?.features?.useConfigForMenu;
  if (usingConfig && Array.isArray(req?.cfg?.menu)) {
    return res.status(409).json({
      error: 'Productos gestionados por configuración del tenant. Editá el archivo de config.'
    });
  }
  return res.status(501).json({ error: 'createProducto no implementado en modo legacy.' });
}

async function getProductos(req, res) {
  try {
    const usingConfig = !!req?.cfg?.features?.useConfigForMenu;
    const qCategory = req.query?.category;

    if (usingConfig && Array.isArray(req?.cfg?.menu)) {
      if (qCategory) {
        return res.json(productsByCategoryFromConfig(req.cfg, qCategory));
      }
      return res.json(flattenProductsFromConfig(req.cfg));
    }

    // Legacy:
    const data = await getProductosFromDB();
    if (qCategory) {
      const filtered = (Array.isArray(data) ? data : []).filter(p =>
        String(p.category || '').trim().toLowerCase() === String(qCategory).trim().toLowerCase()
      );
      return res.json(filtered);
    }
    return res.json(Array.isArray(data) ? data : []);
  } catch (e) {
    console.error('[productoController.getProductos] Error:', e);
    return res.status(500).json({ error: 'No se pudieron obtener productos.' });
  }
}

async function getProductoById(req, res) {
  try {
    const { id } = req.params;
    const usingConfig = !!req?.cfg?.features?.useConfigForMenu;

    if (usingConfig && Array.isArray(req?.cfg?.menu)) {
      const all = flattenProductsFromConfig(req.cfg);
      const found = all.find(p => p.id === id);
      if (!found) return res.status(404).json({ error: 'Producto no encontrado.' });
      return res.json(found);
    }

    // Legacy:
    const all = await getProductosFromDB();
    const found = (Array.isArray(all) ? all : []).find(p => String(p.id || p._id) === id);
    if (!found) return res.status(404).json({ error: 'Producto no encontrado.' });
    return res.json(found);
  } catch (e) {
    console.error('[productoController.getProductoById] Error:', e);
    return res.status(500).json({ error: 'No se pudo obtener el producto.' });
  }
}

async function updateProducto(req, res) {
  const usingConfig = !!req?.cfg?.features?.useConfigForMenu;
  if (usingConfig && Array.isArray(req?.cfg?.menu)) {
    return res.status(409).json({
      error: 'Productos gestionados por configuración del tenant. Editá el archivo de config.'
    });
  }
  return res.status(501).json({ error: 'updateProducto no implementado en modo legacy.' });
}

async function deleteProducto(req, res) {
  const usingConfig = !!req?.cfg?.features?.useConfigForMenu;
  if (usingConfig && Array.isArray(req?.cfg?.menu)) {
    return res.status(409).json({
      error: 'Productos gestionados por configuración del tenant. Editá el archivo de config.'
    });
  }
  return res.status(501).json({ error: 'deleteProducto no implementado en modo legacy.' });
}

async function getCategorias(req, res) {
  try {
    const usingConfig = !!req?.cfg?.features?.useConfigForMenu;
    if (usingConfig && Array.isArray(req?.cfg?.menu)) {
      const cats = categoriesFromConfig(req.cfg).map(c => (c.categoria || c.title || 'Sin categoría'));
      const uniq = Array.from(new Set(cats));
      return res.json(uniq);
    }

    // Legacy:
    const data = await getProductosFromDB();
    const uniq = Array.from(
      new Set((Array.isArray(data) ? data : []).map(p => p.category).filter(Boolean))
    );
    return res.json(uniq);
  } catch (e) {
    console.error('[productoController.getCategorias] Error:', e);
    return res.status(500).json({ error: 'No se pudieron obtener categorías.' });
  }
}

async function getProductosPorCategoria(req, res) {
  try {
    const cat = decodeURIComponent(req.params?.categoria || '').trim();
    const usingConfig = !!req?.cfg?.features?.useConfigForMenu;

    if (usingConfig && Array.isArray(req?.cfg?.menu)) {
      return res.json({ items: productsByCategoryFromConfig(req.cfg, cat) });
    }

    // Legacy:
    const data = await getProductosFromDB();
    const filtrados = (Array.isArray(data) ? data : []).filter(p =>
      String(p.category || '').trim().toLowerCase() === cat.toLowerCase()
    );
    return res.json({ items: filtrados });
  } catch (e) {
    console.error('[productoController.getProductosPorCategoria] Error:', e);
    return res.status(500).json({ error: 'Error al obtener productos por categoría.' });
  }
}

module.exports = {
  createProducto,
  getProductos,
  getProductoById,
  updateProducto,
  deleteProducto,
  getCategorias,
  getProductosPorCategoria
};
