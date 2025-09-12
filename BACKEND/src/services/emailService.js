const nodemailer = require('nodemailer');
require('dotenv').config();

const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER; // correo de la agencia

// Crear transporter (ejemplo con Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_SENDER,
    pass: EMAIL_PASSWORD,
  },
});

/**
 * Enviar email de reserva
 * @param {Object} reserva - datos de la reserva
 */
async function sendReservaEmail(reserva) {
  const { nombre, fecha, pasajeros, telefono, producto, email_usuario } = reserva;

  const htmlBody = `
    <h2>📋 Detalles de la Reserva</h2>
    <ul>
      <li><strong>👤 Nombre:</strong> ${nombre}</li>
      <li><strong>📅 Fecha:</strong> ${fecha}</li>
      <li><strong>👥 Pasajeros:</strong> ${pasajeros}</li>
      <li><strong>📞 Teléfono:</strong> ${telefono}</li>
      <li><strong>🏷️ Producto:</strong> ${producto}</li>
      <li><strong>📧 Email:</strong> ${email_usuario || "No informado"}</li>
    </ul>
    <p>✉️ Gracias por confiar en nosotros.</p>
  `;

  try {
    // ✅ Email a la agencia
    await transporter.sendMail({
      from: EMAIL_SENDER,
      to: EMAIL_RECEIVER,
      subject: "🛎️ Nueva Reserva Recibida",
      html: htmlBody,
    });

    // ✅ Copia al usuario (si puso email)
    if (email_usuario) {
      await transporter.sendMail({
        from: EMAIL_SENDER,
        to: email_usuario,
        subject: "📨 Copia de tu Reserva - Ethereal Tours",
        html: htmlBody,
      });
    }

    console.log("[EMAIL] ✅ Emails enviados correctamente");
  } catch (error) {
    console.error("[EMAIL] ❌ Error al enviar email:", error);
  }
}

module.exports = { sendReservaEmail };
