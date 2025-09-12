// src/services/configService.js
'use strict';

const { loadAssistantConfig } = require('../lib/configLoader');
const { deepGet } = require('../lib/deepGet');

// ✅ Modelos legacy (asegurate que apunten a las colecciones correctas)
const Producto = require('../models/Productos');   // colección: productos
const Seccion  = require('../models/Secciones');   // colección: secciones

/**
 * Carga la config del tenant.
 */
function getAssistantConfig(tenant) {
  return loadAssistantConfig(tenant);
}

/**
 * Branding desde la config del tenant.
 */
function getBranding(tenant) {
  const cfg = loadAssistantConfig(tenant);
  return cfg.branding || {};
}

/**
 * Menú (array) desde la config del tenant.
 */
function getMenu(tenant) {
  const cfg = loadAssistantConfig(tenant);
  return Array.isArray(cfg.menu) ? cfg.menu : [];
}

/**
 * Flag: si el menú debe salir de la config del tenant.
 */
function isUseConfigForMenu(tenant) {
  const cfg = loadAssistantConfig(tenant);
  return !!deepGet(cfg, 'features.useConfigForMenu', false);
}

/**
 * Helper usado por /api/menu cuando la fuente es config.
 */
function menuFromConfig(cfg) {
  return Array.isArray(cfg?.menu) ? cfg.menu : [];
}

/* ----------------------------------------------------------------
 * Legacy / DB
 * ----------------------------------------------------------------
 *
 * Notas multi-tenant:
 * - Si tus documentos de Productos/Secciones NO tienen campo 'tenant',
 *   el filtro con {$or:[{tenant:...},{tenant:{$exists:false}}]} igual
 *   devuelve todo (porque $exists:false será true).
 * - Si más adelante agregás 'tenant' en esas colecciones, esto ya queda listo.
 */

// Filtro por tenant "suave": toma docs del tenant o sin tenant
function buildTenantFilter(tenant) {
  return {
    $or: [{ tenant }, { tenant: { $exists: false } }, { tenant: null }],
  };
}

/**
 * Devuelve productos legacy desde Mongo.
 * Estructura esperada de cada item:
 * { _id, title, description, category, price, duration, stock, image, link, availableDates, ... }
 */
async function getProductosFromDB(tenant) {
  const filter = buildTenantFilter(tenant);
  // lean() para objetos planos (mejor perf)
  return await Producto.find(filter).lean();
}

/**
 * Devuelve secciones legacy desde Mongo.
 * Estructura esperada:
 * { _id, title, link, menuItems: [{title,detail,link}], ... }
 */
async function getSeccionesFromDB(tenant) {
  const filter = buildTenantFilter(tenant);
  return await Seccion.find(filter).lean();
}

/**
 * Construye el menú (array) a partir de Productos y Secciones de DB.
 * - Agrupa productos por 'category' en bloques type: "categoria_producto"
 * - Agrupa secciones por 'title' en bloques type: "section"
 */
function buildMenuFromDB(productos = [], secciones = []) {
  const menuItems = [];

  // 🧩 Agrupar productos por categoría
  const categoriasMap = {};
  for (const producto of productos) {
    const categoriaNombre = String(producto?.category || 'Sin categoría').trim();

    if (!categoriasMap[categoriaNombre]) {
      categoriasMap[categoriaNombre] = {
        categoria: categoriaNombre,
        title: categoriaNombre,
        type: 'categoria_producto',
        link: null,
        children: [],
      };
    }

    categoriasMap[categoriaNombre].children.push({
      id: String(producto._id || ''),
      title: producto.title || '',
      description: producto.description || '',
      price: producto.price ?? null,
      duration: producto.duration ?? null,
      stock: producto.stock ?? null,
      image: producto.image ?? null,
      link: producto.link ?? null,
      availableDates: Array.isArray(producto.availableDates) ? producto.availableDates : [],
    });
  }

  // Insertar categorías al menú (manteniendo orden de inserción)
  for (const cat of Object.values(categoriasMap)) {
    menuItems.push(cat);
  }

  // 🧩 Agrupar secciones por título
  const seccionesMap = {};
  for (const seccion of secciones) {
    const titulo = String(seccion?.title || '').trim();
    if (!titulo) continue;

    if (!seccionesMap[titulo]) {
      seccionesMap[titulo] = {
        id: String(seccion._id || ''),
        title: titulo,
        type: 'section',
        link: seccion.link ?? null,
        children: [],
      };
    }

    const items = Array.isArray(seccion.menuItems) ? seccion.menuItems : [];
    for (const it of items) {
      seccionesMap[titulo].children.push({
        title: it?.title || '',
        detail: it?.detail || '',
        link: it?.link || null,
      });
    }
  }

  for (const section of Object.values(seccionesMap)) {
    menuItems.push(section);
  }

  return menuItems;
}

/**
 * Devuelve menú legacy (DB). Si no hay datos, retorna [].
 */
async function getMenuFromDB(tenant) {
  const [productos, secciones] = await Promise.all([
    getProductosFromDB(tenant),
    getSeccionesFromDB(tenant),
  ]);
  return buildMenuFromDB(productos, secciones);
}

module.exports = {
  // Config-centric
  getAssistantConfig,
  getBranding,
  getMenu,
  isUseConfigForMenu,
  menuFromConfig,

  // Legacy / DB
  getMenuFromDB,
  getProductosFromDB,
  getSeccionesFromDB,

  // Utilidad (por si querés usarlo desde el controller)
  buildMenuFromDB,
};
