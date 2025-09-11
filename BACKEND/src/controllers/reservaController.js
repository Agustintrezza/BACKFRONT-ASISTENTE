// src/controllers/reservaController.js
const Joi = require('joi');

// ⛳ Si tenés un modelo de Mongo, descomentá esto y usalo en lugar del RAM driver.
// const Reserva = require('../models/Reserva');

const schema = Joi.object({
  nombre: Joi.string().min(3).max(120).required(),
  fecha: Joi.string().trim().required(),        // lo validás en Rasa como DD/MM/AAAA
  pasajeros: Joi.number().integer().min(1).max(15).required(),
  telefono: Joi.string().pattern(/^\d{8,15}$/).required(),
  producto: Joi.string().min(2).max(200).required(),
  email_usuario: Joi.string().email().allow(null, ''), // opcional
});

// 🧪 Driver en memoria (fallback)
const _RAM = { reservas: [] };

// Helpers comunes
function sanitizeReservaInput(body = {}) {
  return {
    nombre: body.nombre,
    fecha: body.fecha,
    pasajeros: Number(body.pasajeros),
    telefono: String(body.telefono),
    producto: body.producto,
    email_usuario: body.email_usuario || null,
  };
}

/**
 * POST /api/reservas
 * Crea una pre-reserva
 */
async function createReserva(req, res) {
  try {
    const payload = sanitizeReservaInput(req.body);
    const { error, value } = schema.validate(payload, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.details.map(d => d.message),
      });
    }

    // 👉 Si tenés DB:
    // const nueva = await Reserva.create({ ...value, estado: 'pendiente', tenant: req.tenant });

    // 👉 RAM fallback:
    const nueva = {
      id: String(Date.now()),
      ...value,
      estado: 'pendiente',
      tenant: req.tenant,
      createdAt: new Date().toISOString(),
      createdBy: req.user ? req.user.id : null, // si el token viene en el front
    };
    _RAM.reservas.push(nueva);

    return res.status(201).json(nueva);
  } catch (e) {
    console.error('[createReserva] Error:', e);
    return res.status(500).json({ error: 'No se pudo crear la reserva' });
  }
}

/**
 * GET /api/reservas
 * Lista reservas del tenant (protegido por auth).
 */
async function listReservas(req, res) {
  try {
    // 👉 Si tenés DB:
    // const items = await Reserva.find({ tenant: req.tenant }).sort({ createdAt: -1 });

    // 👉 RAM fallback:
    const items = _RAM.reservas
      .filter(r => r.tenant === req.tenant)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    return res.json(items);
  } catch (e) {
    console.error('[listReservas] Error:', e);
    return res.status(500).json({ error: 'No se pudieron listar reservas' });
  }
}

/**
 * GET /api/reservas/:id
 */
async function getReservaById(req, res) {
  try {
    const { id } = req.params;

    // 👉 Si tenés DB:
    // const item = await Reserva.findOne({ _id: id, tenant: req.tenant });

    // 👉 RAM fallback:
    const item = _RAM.reservas.find(r => r.id === id && r.tenant === req.tenant);

    if (!item) return res.status(404).json({ error: 'Reserva no encontrada' });
    return res.json(item);
  } catch (e) {
    console.error('[getReservaById] Error:', e);
    return res.status(500).json({ error: 'No se pudo obtener la reserva' });
  }
}

/**
 * PUT /api/reservas/:id
 * Actualiza campos permitidos (estado, fecha, pasajeros, telefono, email_usuario)
 */
async function updateReserva(req, res) {
  try {
    const { id } = req.params;
    const allowed = ['estado', 'fecha', 'pasajeros', 'telefono', 'email_usuario'];

    // 👉 Si tenés DB:
    // const patch = {};
    // for (const k of allowed) if (k in req.body) patch[k] = req.body[k];
    // const updated = await Reserva.findOneAndUpdate({ _id: id, tenant: req.tenant }, patch, { new: true });
    // if (!updated) return res.status(404).json({ error: 'Reserva no encontrada' });
    // return res.json(updated);

    // 👉 RAM fallback:
    const idx = _RAM.reservas.findIndex(r => r.id === id && r.tenant === req.tenant);
    if (idx < 0) return res.status(404).json({ error: 'Reserva no encontrada' });

    for (const k of allowed) {
      if (k in req.body) {
        _RAM.reservas[idx][k] = k === 'pasajeros' ? Number(req.body[k]) : req.body[k];
      }
    }
    _RAM.reservas[idx].updatedAt = new Date().toISOString();
    return res.json(_RAM.reservas[idx]);
  } catch (e) {
    console.error('[updateReserva] Error:', e);
    return res.status(500).json({ error: 'No se pudo actualizar la reserva' });
  }
}

/**
 * DELETE /api/reservas/:id
 */
async function deleteReserva(req, res) {
  try {
    const { id } = req.params;

    // 👉 Si tenés DB:
    // const r = await Reserva.findOneAndDelete({ _id: id, tenant: req.tenant });
    // if (!r) return res.status(404).json({ error: 'Reserva no encontrada' });
    // return res.json({ ok: true });

    // 👉 RAM fallback:
    const before = _RAM.reservas.length;
    _RAM.reservas = _RAM.reservas.filter(r => !(r.id === id && r.tenant === req.tenant));
    const after = _RAM.reservas.length;

    if (after === before) return res.status(404).json({ error: 'Reserva no encontrada' });
    return res.json({ ok: true });
  } catch (e) {
    console.error('[deleteReserva] Error:', e);
    return res.status(500).json({ error: 'No se pudo eliminar la reserva' });
  }
}

module.exports = {
  createReserva,
  listReservas,
  getReservaById,
  updateReserva,
  deleteReserva,
};
