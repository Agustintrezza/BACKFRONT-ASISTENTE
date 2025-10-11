import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner, TextInput, Select, Button } from "flowbite-react";
import { HiRefresh, HiDownload } from "react-icons/hi";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import ReservaCard from "./ReservasCard";
import { useUserPlan } from "../../hooks/useUserPlan";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Reservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [seleccionadas, setSeleccionadas] = useState([]);

  const planInfo = useUserPlan();

  const maxReservas = planInfo?.maxReservas || 5;
  const planName = planInfo?.planName || "Básico";
  const alcanzadoMaximo = reservas.length >= maxReservas;
  const restantes = maxReservas - reservas.length;
  const cercaDelLimite = restantes > 0 && restantes <= 2;

  const fetchReservas = async () => {
    try {
      const res = await axios.get(`${API_URL}/reservas`);
      setReservas(res.data);
    } catch (error) {
      console.error("Error al obtener reservas:", error);
      Swal.fire("Error", "No se pudieron cargar las reservas", "error");
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await axios.patch(`${API_URL}/reservas/${id}`, { estado: nuevoEstado });
      setReservas((prev) =>
        prev.map((r) => (r._id === id ? { ...r, estado: nuevoEstado } : r))
      );
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el estado", error);
    }
  };

  const eliminarReserva = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar reserva?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/reservas/${id}`);
      setReservas((prev) => prev.filter((r) => r._id !== id));
      Swal.fire("Eliminada", "Reserva eliminada correctamente", "success");
    } catch {
      Swal.fire("Error", "No se pudo eliminar la reserva.", "error");
    }
  };

  const eliminarSeleccionadas = async () => {
    if (seleccionadas.length === 0) return;

    const confirm = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar reservas seleccionadas?",
      text: `Se eliminarán ${seleccionadas.length} reservas.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
    });

    if (!confirm.isConfirmed) return;

    try {
      await Promise.all(
        seleccionadas.map((id) => axios.delete(`${API_URL}/reservas/${id}`))
      );
      setReservas((prev) => prev.filter((r) => !seleccionadas.includes(r._id)));
      setSeleccionadas([]);
      Swal.fire("Eliminadas", "Reservas eliminadas correctamente.", "success");
    } catch {
      Swal.fire("Error", "No se pudieron eliminar las reservas.", "error");
    }
  };

  const descargarExcel = async () => {
    try {
      if (seleccionadas.length > 0) {
        const data = reservas
          .filter((r) => seleccionadas.includes(r._id))
          .map((r) => ({
            Cliente: r.nombre,
            Fecha: r.fecha,
            Hora: r.hora || "",
            Pasajeros: r.pasajeros,
            Teléfono: r.telefono,
            Email: r.email || "",
            Producto: r.producto,
            Estado: r.estado,
          }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reservas");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "reservas_seleccionadas.xlsx");
      } else {
        const response = await axios.get(`${API_URL}/reservas/descargar/excel`, {
          responseType: "blob",
        });
        saveAs(response.data, "reservas.xlsx");
      }
    } catch {
      Swal.fire("Error", "No se pudo generar el archivo Excel", "error");
    }
  };

  const toggleSeleccion = (id) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const reservasFiltradas = reservas.filter((reserva) => {
    const nombreCoincide = reserva.nombre
      .toLowerCase()
      .includes(filtroNombre.toLowerCase());
    const fechaCoincide = reserva.fecha.includes(filtroFecha);
    const estadoCoincide =
      filtroEstado === "" || reserva.estado === filtroEstado;
    return nombreCoincide && fechaCoincide && estadoCoincide;
  });

  if (loading || planInfo.loading) {
    return (
      <div className="flex justify-center py-10 bg-white dark:bg-gray-900">
        <Spinner size="xl" />
      </div>
    );
  }

  let alertaColor = "";
  let alertaTexto = "";
  if (alcanzadoMaximo) {
    alertaColor = "red";
    alertaTexto = `⚠️ Alcanzaste el máximo de ${maxReservas} reservas (${planName}). Se elimina las última creada.`;
  } else if (cercaDelLimite) {
    alertaColor = "yellow";
    alertaTexto = `⚠️ Solo quedan ${restantes} reservas disponibles (${planName}).`;
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-violet-800 dark:text-violet-400 mb-2">
            📋 Reservas
          </h1>

          {alertaTexto ? (
            <div
              className={`px-3 py-2 border rounded-lg text-sm font-medium break-words ${
                alertaColor === "red"
                  ? "bg-red-100 border-red-400 text-red-700"
                  : "bg-yellow-100 border-yellow-400 text-yellow-800"
              }`}
            >
              {alertaTexto}
            </div>
          ) : (
            <div className="px-3 py-2 bg-green-50 border border-green-400 text-green-700 rounded-lg text-sm font-medium">
              📊 {reservas.length}/{maxReservas} reservas activas — Plan{" "}
              <b>{planName}</b>
            </div>
          )}
        </div>

        {/* Botones más compactos y adaptables */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            onClick={descargarExcel}
            color="blue"
            size="sm"
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm py-1.5 w-full sm:w-auto"
          >
            <HiDownload className="text-lg" /> Descargar
          </Button>

          <motion.button
            onClick={() => navigate("/dashboard")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
          >
            ⬅️ Volver
          </motion.button>
        </div>
      </div>

      {/* FILTROS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-5">
        <div className="sm:col-span-2 flex gap-2">
          <TextInput
            placeholder="Buscar nombre"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            className="text-sm flex-1"
          />
          <TextInput
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="text-sm flex-1"
          />
        </div>

        <Select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="text-sm"
        >
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="atendida">Atendida</option>
          <option value="cerrada">Cerrada</option>
        </Select>

        <Button
          color="gray"
          size="sm"
          onClick={() => {
            setFiltroNombre("");
            setFiltroFecha("");
            setFiltroEstado("");
          }}
          className="bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm"
        >
          <HiRefresh className="mr-1" /> Limpiar
        </Button>
      </div>

      {/* GRID */}
      {reservasFiltradas.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          No hay reservas registradas.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {reservasFiltradas.map((reserva) => (
              <ReservaCard
                key={reserva._id}
                reserva={reserva}
                cambiarEstado={cambiarEstado}
                eliminarReserva={eliminarReserva}
                seleccionada={seleccionadas.includes(reserva._id)}
                toggleSeleccion={() => toggleSeleccion(reserva._id)}
              />
            ))}
          </div>

          {seleccionadas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-5 py-2 rounded-full shadow-lg flex gap-3 items-center z-50 text-sm"
            >
              <span>
                {seleccionadas.length} seleccionada
                {seleccionadas.length > 1 && "s"}
              </span>
              <Button
                size="xs"
                className="bg-red-500 hover:bg-red-600"
                onClick={eliminarSeleccionadas}
              >
                🗑️ Eliminar
              </Button>
              <Button
                size="xs"
                className="bg-blue-500 hover:bg-blue-600"
                onClick={descargarExcel}
              >
                📥 Descargar
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
