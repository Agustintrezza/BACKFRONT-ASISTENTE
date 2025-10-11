import { Checkbox } from "flowbite-react";
import {
  HiCheck,
  HiX,
  HiRefresh,
  HiOutlineTrash,
  HiDownload,
} from "react-icons/hi";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Swal from "sweetalert2";

function ReservaCard({
  reserva,
  cambiarEstado,
  eliminarReserva,
  seleccionada,
  toggleSeleccion,
  descargarReserva,
}) {
  const productoTruncado =
    reserva.producto.length > 80
      ? reserva.producto.substring(0, 80) + "..."
      : reserva.producto;

  const showTooltip = reserva.producto.length > 80;

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-400 text-yellow-900";
      case "atendida":
        return "bg-green-500 text-green-100";
      case "cerrada":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  const glowHover = (color) => ({
    scale: 1.2,
    textShadow: `0 0 8px ${color}, 0 0 12px ${color}`,
  });

  const handleDescargar = async () => {
    const confirm = await Swal.fire({
      icon: "info",
      title: "¿Descargar reserva?",
      text: "¿Deseás descargar los datos de esta reserva?",
      showCancelButton: true,
      confirmButtonText: "Sí, descargar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3b82f6",
    });

    if (confirm.isConfirmed && descargarReserva) {
      descargarReserva(reserva);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`relative bg-white dark:bg-gray-800 border ${
        seleccionada
          ? "border-violet-400 shadow-md"
          : "border-gray-200 dark:border-gray-700"
      } rounded-xl p-3 shadow-sm hover:shadow-sm hover:shadow-violet-200 dark:hover:shadow-violet-900 transition-all duration-200 flex flex-col justify-between overflow-visible`}
    >
      {/* ENCABEZADO */}
      <div className="flex justify-between items-start mb-2">
        <div className="pr-3">
          <h2 className="text-[15px] font-bold text-violet-800 dark:text-violet-400 leading-snug">
            👤 {reserva.nombre}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${getEstadoColor(
              reserva.estado
            )}`}
          >
            {reserva.estado}
          </span>
          <Checkbox checked={seleccionada} onChange={toggleSeleccion} />
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-x-2 text-[12.5px] text-gray-700 dark:text-gray-300 mb-2">
        <p className="flex items-center gap-1">
          <span className="text-[17px]">👥</span>
          <span className="font-semibold text-violet-700 dark:text-violet-300">
            Pasajeros:
          </span>{" "}
          {reserva.pasajeros}
        </p>

        <p className="flex items-center gap-1.5 break-words">
          <span className="text-[17px]">📞</span>
          <span className="font-semibold text-violet-700 dark:text-violet-300">
            Teléfono:
          </span>{" "}
          <span className="break-all">{reserva.telefono}</span>
        </p>

        {reserva.email && (
          <p className="col-span-2 flex items-center gap-1.5 truncate">
            <span className="text-[17px]">📧</span>
            <span className="font-semibold text-violet-700 dark:text-violet-300">
              Email:
            </span>{" "}
            {reserva.email}
          </p>
        )}

        {/* Producto con tooltip usando Tippy */}
        <div className="col-span-2 flex items-center gap-1.5">
  <span className="text-[17px]">🎯</span>
  <span className="font-semibold text-violet-700 dark:text-violet-300">
    Producto:
  </span>{" "}
  {showTooltip ? (
    <Tippy
      content={
        <span className="block text-xs text-gray-100 max-w-xs">
          {reserva.producto}
        </span>
      }
      placement="top"
      theme="dark"
      animation="shift-away"
      arrow={true}
      appendTo={() => document.body}
      zIndex={999999}
      popperOptions={{
        modifiers: [
          {
            name: "preventOverflow",
            options: {
              boundary: "viewport",
              padding: 10,
            },
          },
        ],
      }}
    >
      <span
        className="cursor-pointer inline-block truncate max-w-[95%] align-middle text-gray-700 dark:text-gray-300"
        style={{
          lineHeight: "1.4em",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {productoTruncado}
      </span>
    </Tippy>
  ) : (
    <span className="inline-block max-w-[95%] truncate align-middle">
      {productoTruncado}
    </span>
  )}
</div>

        {/* Fecha */}
        <p className="col-span-2 flex items-center gap-1.5">
          <span className="text-[17px]">📅</span>
          <span className="font-semibold text-violet-700 dark:text-violet-300">
            Fecha:
          </span>{" "}
          {reserva.fecha}
        </p>
      </div>

      {/* BOTONERA */}
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
        {/* Botones de estado */}
        <div className="flex gap-2">
          <Tippy content="Marcar como pendiente" placement="top" theme="dark">
            <motion.button
              whileHover={glowHover("rgba(250, 204, 21, 1)")}
              onClick={() => cambiarEstado(reserva._id, "pendiente")}
              className="text-yellow-400 hover:text-yellow-300 transition-transform"
            >
              <HiRefresh className="text-[19px]" />
            </motion.button>
          </Tippy>

          <Tippy content="Marcar como atendida" placement="top" theme="dark">
            <motion.button
              whileHover={glowHover("rgba(34,197,94,1)")}
              onClick={() => cambiarEstado(reserva._id, "atendida")}
              className="text-green-500 hover:text-green-400 transition-transform"
            >
              <HiCheck className="text-[19px]" />
            </motion.button>
          </Tippy>

          <Tippy content="Marcar como cerrada" placement="top" theme="dark">
            <motion.button
              whileHover={glowHover("rgba(239,68,68,1)")}
              onClick={() => cambiarEstado(reserva._id, "cerrada")}
              className="text-red-500 hover:text-red-400 transition-transform"
            >
              <HiX className="text-[19px]" />
            </motion.button>
          </Tippy>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <Tippy content="Descargar reserva" placement="top" theme="dark">
            <motion.button
              whileHover={glowHover("rgba(59,130,246,1)")}
              onClick={handleDescargar}
              className="text-blue-500 hover:text-blue-400 transition-transform"
            >
              <HiDownload className="text-[19px]" />
            </motion.button>
          </Tippy>

          <Tippy content="Eliminar reserva" placement="top" theme="dark">
            <motion.button
              whileHover={glowHover("rgba(239,68,68,1)")}
              onClick={() => eliminarReserva(reserva._id)}
              className="text-red-500 hover:text-red-400 transition-transform"
            >
              <HiOutlineTrash className="text-[19px]" />
            </motion.button>
          </Tippy>
        </div>
      </div>
    </motion.div>
  );
}

export default ReservaCard;
