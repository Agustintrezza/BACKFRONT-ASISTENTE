// src/services/configService.js
'use strict';

const { loadAssistantConfig } = require('../lib/configLoader');
const { deepGet } = require('../lib/deepGet');

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
 * Fallbacks a “DB/legacy”.
 * Por ahora son STUBS (no-op). Más adelante podés conectar Mongo,
 * Postgres o lo que uses y reemplazar estas funciones.
 * ---------------------------------------------------------------- */

/**
 * Devuelve menú legacy (DB, archivo, etc.). Por ahora: array vacío.
 */
async function getMenuFromDB() {
  return [];
}

/**
 * Devuelve productos legacy. Por ahora: array vacío.
 * Estructura esperada de cada item:
 * { id, title, description, category, ... }
 */
async function getProductosFromDB() {
  return [];
}

/**
 * Devuelve secciones legacy. Por ahora: array vacío.
 * Estructura esperada:
 * { id, title, children: [...], ... }
 */
async function getSeccionesFromDB() {
  return [];
}

module.exports = {
  // Config-centric
  getAssistantConfig,
  getBranding,
  getMenu,
  isUseConfigForMenu,
  menuFromConfig,

  // Fallbacks (stubs)
  getMenuFromDB,
  getProductosFromDB,
  getSeccionesFromDB
};
