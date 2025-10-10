const Reserva = require("../models/Reservas");
const clientConfig = require("../config/plans-config.json");
const ExcelJS = require("exceljs");

// 📥 Crear nueva reserva (con eliminación automática si se supera el límite)
const crearReserva = async (req, res) => {
  try {
    const { plan = "basic", clienteId } = req.body;

    // Límite según plan
    const maxPermitidas = clientConfig[plan]?.maxReservas || 20;

    // Filtrar por cliente si se usa clienteId
    const filtro = clienteId ? { clienteId } : {};
    const cantidadActual = await Reserva.countDocuments(filtro);

    let eliminadaAuto = false;

    // Si alcanza el límite → eliminar la más antigua
    if (cantidadActual >= maxPermitidas) {
      const reservaEliminada = await Reserva.findOneAndDelete(filtro).sort({
        fecha_creacion: 1,
      });
      eliminadaAuto = true;

      console.log(
        `🔄 Límite alcanzado (${maxPermitidas}). Eliminada reserva más antigua: ${reservaEliminada?._id}`
      );
    }

    // Crear nueva reserva
    const nuevaReserva = new Reserva(req.body);
    await nuevaReserva.save();

    console.log(`✅ Reserva creada correctamente para plan ${plan}`);
    res.status(201).json({
      reserva: nuevaReserva,
      eliminadaAuto,
      mensaje: eliminadaAuto
        ? `Se alcanzó el máximo de ${maxPermitidas} reservas. Se eliminó la más antigua.`
        : "Reserva creada correctamente.",
    });
  } catch (error) {
    console.error("❌ Error al crear la reserva:", error);
    res.status(500).json({ error: "Error al crear la reserva" });
  }
};

// 📋 Obtener todas las reservas
const obtenerReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find().sort({ fecha_creacion: -1 });
    res.status(200).json(reservas);
  } catch (error) {
    console.error("❌ Error al obtener las reservas:", error);
    res.status(500).json({ error: "Error al obtener las reservas" });
  }
};

// 📄 Obtener una reserva por ID
const obtenerReservaPorId = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }
    res.status(200).json(reserva);
  } catch (error) {
    console.error("❌ Error al buscar la reserva:", error);
    res.status(500).json({ error: "Error al buscar la reserva" });
  }
};

// 🔄 Actualizar estado de la reserva
const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const reserva = await Reserva.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );

    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    console.log(`🔁 Estado actualizado a "${estado}" para reserva ${reserva._id}`);
    res.status(200).json(reserva);
  } catch (error) {
    console.error("❌ Error al actualizar el estado:", error);
    res.status(500).json({ error: "Error al actualizar el estado" });
  }
};

// 🗑️ Eliminar una reserva
const eliminarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByIdAndDelete(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    console.log(`🗑️ Reserva eliminada: ${reserva._id}`);
    res.status(200).json({ mensaje: "Reserva eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar la reserva:", error);
    res.status(500).json({ error: "Error al eliminar la reserva" });
  }
};

// 📦 Descargar reservas (Excel)
const descargarReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find().sort({ fecha_creacion: -1 });
    if (!reservas.length) {
      return res.status(404).json({ error: "No hay reservas para descargar" });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Reservas");

    sheet.columns = [
      { header: "Cliente", key: "nombre", width: 25 },
      { header: "Fecha", key: "fecha", width: 15 },
      { header: "Hora", key: "hora", width: 10 },
      { header: "Pasajeros", key: "pasajeros", width: 10 },
      { header: "Teléfono", key: "telefono", width: 18 },
      { header: "Email", key: "email", width: 25 },
      { header: "Producto", key: "producto", width: 40 },
      { header: "Estado", key: "estado", width: 15 },
      { header: "Fecha creación", key: "fecha_creacion", width: 20 },
    ];

    reservas.forEach((r) => {
      sheet.addRow({
        nombre: r.nombre,
        fecha: r.fecha,
        hora: r.hora || "",
        pasajeros: r.pasajeros,
        telefono: r.telefono,
        email: r.email || "",
        producto: r.producto,
        estado: r.estado,
        fecha_creacion: new Date(r.fecha_creacion).toLocaleString("es-AR"),
      });
    });

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).alignment = { horizontal: "center" };

    const buffer = await workbook.xlsx.writeBuffer();

    res
      .status(200)
      .set({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="reservas.xlsx"',
      })
      .send(buffer);

    console.log("📤 Archivo Excel enviado correctamente.");
  } catch (error) {
    console.error("❌ Error al generar archivo Excel:", error);
    res.status(500).json({ error: "Error al generar archivo Excel" });
  }
};

module.exports = {
  crearReserva,
  obtenerReservas,
  obtenerReservaPorId,
  actualizarEstado,
  eliminarReserva,
  descargarReservas,
};
