// Servicio simple en memoria con TTL opcional (mock)
// Podés reemplazar estas funciones por tu DB cuando quieras.

const { randomUUID } = require('node:crypto');

const store = new Map(); // key: tenant, value: array de reservas

function list(tenant, { limit = 50, offset = 0 } = {}) {
  const all = store.get(tenant) || [];
  return {
    total: all.length,
    items: all.slice(offset, offset + limit),
  };
}

function create(tenant, data) {
  const now = new Date().toISOString();
  const payload = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    estado: 'pendiente',
    ...data,
  };
  const all = store.get(tenant) || [];
  all.unshift(payload);
  store.set(tenant, all);
  return payload;
}

function getById(tenant, id) {
  const all = store.get(tenant) || [];
  return all.find(r => r.id === id) || null;
}

function update(tenant, id, partial) {
  const all = store.get(tenant) || [];
  const idx = all.findIndex(r => r.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...partial, updatedAt: new Date().toISOString() };
  store.set(tenant, all);
  return all[idx];
}

function remove(tenant, id) {
  const all = store.get(tenant) || [];
  const next = all.filter(r => r.id !== id);
  const removed = next.length !== all.length;
  store.set(tenant, next);
  return removed;
}

module.exports = { list, create, getById, update, remove };
