const Joi = require("joi");
const nodemailer = require("nodemailer");

// ⛳ Si tenés un modelo de Mongo, descomentá esto y usalo en lugar del RAM driver.
// const Reserva = require("../models/Reserva");

const schema = Joi.object({
  nombre: Joi.string().min(3).max(120).required(),
  fecha: Joi.string().trim().required(), // validado en Rasa como DD/MM/AAAA
  pasajeros: Joi.number().integer().min(1).max(15).required(),
  telefono: Joi.string().pattern(/^\d{8,15}$/).required(),
  producto: Joi.string().min(2).max(200).required(),
  email_usuario: Joi.string().email().allow(null, ""), // opcional
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
 * Crea una pre-reserva y envía emails
 */
async function createReserva(req, res) {
  try {
    const payload = sanitizeReservaInput(req.body);
    const { error, value } = schema.validate(payload, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: error.details.map(d => d.message),
      });
    }

    // 👉 RAM fallback (si no hay DB)
    const nueva = {
      id: String(Date.now()),
      ...value,
      estado: "pendiente",
      tenant: req.tenant || "default",
      createdAt: new Date().toISOString(),
    };
    _RAM.reservas.push(nueva);

    // ✅ Responder rápido al bot
    res.status(201).json(nueva);

    // 🚀 Enviar email en background
    setImmediate(async () => {
      try {
        const EMAIL_SENDER = process.env.EMAIL_SENDER;
        const EMAIL_PASS = process.env.EMAIL_PASSWORD;
        const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: EMAIL_SENDER, pass: EMAIL_PASS },
        });

        const htmlBody = `
          <h2>📋 Detalles de la Reserva</h2>
          <p>Se registró una nueva solicitud con los siguientes datos:</p>
          <ul>
            <li><b>👤 Nombre:</b> ${nueva.nombre}</li>
            <li><b>📅 Fecha:</b> ${nueva.fecha}</li>
            <li><b>👥 Pasajeros:</b> ${nueva.pasajeros}</li>
            <li><b>📞 Teléfono:</b> ${nueva.telefono}</li>
            <li><b>🏷️ Producto:</b> ${nueva.producto}</li>
            <li><b>📧 Email usuario:</b> ${nueva.email_usuario || "No informado"}</li>
          </ul>
          <p>⚠️ Estado actual: <b>${nueva.estado}</b></p>
          <p>Gracias por confiar en nosotros ✨</p>
        `;

        // Email a la agencia
        await transporter.sendMail({
          from: EMAIL_SENDER,
          to: EMAIL_RECEIVER,
          subject: "🛎️ Nueva Reserva Recibida",
          html: htmlBody,
        });

        // Copia al usuario
        if (nueva.email_usuario) {
          await transporter.sendMail({
            from: EMAIL_SENDER,
            to: nueva.email_usuario,
            subject: "📨 Confirmación de tu Reserva",
            html: `
              <h2>✅ Confirmación de tu Reserva</h2>
              <p>Hola ${nueva.nombre}, tu solicitud se registró correctamente.</p>
              ${htmlBody}
              <p>Pronto nos pondremos en contacto para confirmar los detalles.</p>
            `,
          });
        }

        console.log("[EMAIL] ✅ Mails enviados correctamente.");
      } catch (e) {
        console.error("[EMAIL] ❌ Error al enviar correo:", e);
      }
    });
  } catch (e) {
    console.error("[createReserva] Error:", e);
    return res.status(500).json({ error: "No se pudo crear la reserva" });
  }
}

/**
 * GET /api/reservas
 * Lista reservas del tenant
 */
async function listReservas(req, res) {
  try {
    const items = _RAM.reservas
      .filter(r => r.tenant === (req.tenant || "default"))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    return res.json(items);
  } catch (e) {
    console.error("[listReservas] Error:", e);
    return res.status(500).json({ error: "No se pudieron listar reservas" });
  }
}

/**
 * GET /api/reservas/:id
 */
async function getReservaById(req, res) {
  try {
    const { id } = req.params;
    const item = _RAM.reservas.find(r => r.id === id && r.tenant === (req.tenant || "default"));

    if (!item) return res.status(404).json({ error: "Reserva no encontrada" });
    return res.json(item);
  } catch (e) {
    console.error("[getReservaById] Error:", e);
    return res.status(500).json({ error: "No se pudo obtener la reserva" });
  }
}

/**
 * PUT /api/reservas/:id
 */
async function updateReserva(req, res) {
  try {
    const { id } = req.params;
    const allowed = ["estado", "fecha", "pasajeros", "telefono", "email_usuario"];

    const idx = _RAM.reservas.findIndex(r => r.id === id && r.tenant === (req.tenant || "default"));
    if (idx < 0) return res.status(404).json({ error: "Reserva no encontrada" });

    for (const k of allowed) {
      if (k in req.body) {
        _RAM.reservas[idx][k] = k === "pasajeros" ? Number(req.body[k]) : req.body[k];
      }
    }
    _RAM.reservas[idx].updatedAt = new Date().toISOString();
    return res.json(_RAM.reservas[idx]);
  } catch (e) {
    console.error("[updateReserva] Error:", e);
    return res.status(500).json({ error: "No se pudo actualizar la reserva" });
  }
}

/**
 * DELETE /api/reservas/:id
 */
async function deleteReserva(req, res) {
  try {
    const { id } = req.params;
    const before = _RAM.reservas.length;
    _RAM.reservas = _RAM.reservas.filter(r => !(r.id === id && r.tenant === (req.tenant || "default")));
    const after = _RAM.reservas.length;

    if (after === before) return res.status(404).json({ error: "Reserva no encontrada" });
    return res.json({ ok: true });
  } catch (e) {
    console.error("[deleteReserva] Error:", e);
    return res.status(500).json({ error: "No se pudo eliminar la reserva" });
  }
}

module.exports = {
  createReserva,
  listReservas,
  getReservaById,
  updateReserva,
  deleteReserva,
};
