import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  Badge,
  Button,
  Spinner,
  TextInput,
  Select,
} from "flowbite-react";
import { HiCheck, HiXCircle, HiRefresh } from "react-icons/hi";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

export default function Reservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const fetchReservas = async () => {
    try {
      const res = await axios.get(`${API_URL}/reservas`);
      setReservas(res.data);
    } catch (error) {
      console.error("Error al obtener reservas:", error);
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
      console.error("Error al cambiar estado:", error);
    }
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

  if (loading) {
    return (
      <div className="flex justify-center py-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📋 Reservas</h1>

        {/* Botón volver */}
        <motion.button
          onClick={() => navigate("/dashboard")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-500 ease-in-out flex items-center gap-2"
        >
          <span className="text-xl">⬅️</span>
          <span className="text-sm">Volver</span>
        </motion.button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="sm:col-span-2 flex gap-4">
          <TextInput
            placeholder="Buscar por nombre"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            className="w-1/2 bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
          />
          <TextInput
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="w-1/2 bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
          />
        </div>
        <Select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="atendida">Atendida</option>
          <option value="cerrada">Cerrada</option>
        </Select>
        <Button
          color="gray"
          onClick={() => {
            setFiltroNombre("");
            setFiltroFecha("");
            setFiltroEstado("");
          }}
          className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Limpiar
        </Button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <Table hoverable={true} className="text-gray-900 dark:text-gray-200">
          <Table.Head className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
            <Table.HeadCell>Cliente</Table.HeadCell>
            <Table.HeadCell>Fecha</Table.HeadCell>
            <Table.HeadCell>Hora</Table.HeadCell>
            <Table.HeadCell>Pasajeros</Table.HeadCell>
            <Table.HeadCell>Teléfono</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Producto</Table.HeadCell>
            <Table.HeadCell>Estado</Table.HeadCell>
            <Table.HeadCell>Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {reservasFiltradas.map((reserva) => (
              <Table.Row
                key={reserva._id}
                className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Table.Cell>{reserva.nombre}</Table.Cell>
                <Table.Cell>{reserva.fecha}</Table.Cell>
                <Table.Cell>{reserva.hora || "-"}</Table.Cell>
                <Table.Cell>{reserva.pasajeros}</Table.Cell>
                <Table.Cell>{reserva.telefono}</Table.Cell>
                <Table.Cell>{reserva.email || "-"}</Table.Cell>
                <Table.Cell>
                  {reserva.producto.length > 40
                    ? reserva.producto.substring(0, 40) + "..."
                    : reserva.producto}
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    color={
                      reserva.estado === "cerrada"
                        ? "gray"
                        : reserva.estado === "atendida"
                        ? "success"
                        : "warning"
                    }
                  >
                    {reserva.estado}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="flex flex-wrap gap-2">
                  {reserva.estado !== "pendiente" && (
                    <Button
                      color="warning"
                      size="xs"
                      onClick={() => cambiarEstado(reserva._id, "pendiente")}
                    >
                      <HiRefresh className="mr-1" />
                      Pendiente
                    </Button>
                  )}
                  {reserva.estado !== "atendida" && (
                    <Button
                      color="green"
                      size="xs"
                      onClick={() => cambiarEstado(reserva._id, "atendida")}
                    >
                      <HiCheck className="mr-1" />
                      Atendida
                    </Button>
                  )}
                  {reserva.estado !== "cerrada" && (
                    <Button
                      color="gray"
                      size="xs"
                      onClick={() => cambiarEstado(reserva._id, "cerrada")}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                    >
                      <HiXCircle className="mr-1" />
                      Cerrar
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
