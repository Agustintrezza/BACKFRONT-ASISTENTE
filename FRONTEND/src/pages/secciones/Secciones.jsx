import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "flowbite-react";
import axios from "axios";
import Swal from "sweetalert2";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";

import SeccionModal from "../../components/secciones/SeccionModal";
import SeccionEntrenadaModal from "../../components/secciones/SeccionEntrenadaModal";

const SECCIONES_ENTRENADAS = [
  "Guía Turístico",
  "Tipo de Cambio",
  "Preguntas Frecuentes",
  "Nosotros",
  "Contacto",
];

function Secciones() {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const decodedCategoria = decodeURIComponent(categoria);
  const esEntrenada = SECCIONES_ENTRENADAS.includes(decodedCategoria);

  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [maxLength, setMaxLength] = useState(45);

  useEffect(() => {
    const updateMaxLength = () => {
      const width = window.innerWidth;
      if (width < 1424) {
        setMaxLength(30); // menor a 'lg'
      } else {
        setMaxLength(45); // lg o mayor
      }
    };

    updateMaxLength(); // Inicial

    window.addEventListener("resize", updateMaxLength);
    return () => window.removeEventListener("resize", updateMaxLength);
  }, []);

  const fetchSecciones = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/secciones`);
      const filtradas = res.data.filter((s) => s.title === decodedCategoria);
      setSecciones(filtradas);
    } catch (err) {
      console.error("Error cargando secciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecciones();
  }, [categoria]);

  const handleDelete = async (seccion) => {
    const confirm = await Swal.fire({
      title: `¿Eliminar "${seccion.title}"?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#171717",
      color: "#f3f4f6",
      iconColor: "#facc15",
      customClass: {
        popup: "rounded-lg",
        title: "text-lg font-semibold",
        confirmButton:
          "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700",
        cancelButton:
          "bg-blue-600 text-white px-4 py-2 rounded hover:bg-gray-700",
      },
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:5000/api/secciones/${seccion._id}`
        );
        fetchSecciones();
        Swal.fire({
          title: "Eliminado",
          text: `"${seccion.title}" fue eliminado correctamente.`,
          icon: "success",
          background: "#171717",
          color: "#f3f4f6",
          iconColor: "#4ade80",
          confirmButtonColor: "#3b82f6",
        });
      } catch (err) {
        console.error("Error eliminando:", err);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la sección.",
          icon: "error",
          background: "#111827",
          color: "#f3f4f6",
          iconColor: "#f87171",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" className="w-16 h-16 text-purple-600" />
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-white to-violet-200 text-gray-800 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800">
          {decodedCategoria}
        </h1>

        <div className="flex gap-3">
          <motion.button
            onClick={() => {
              setSelected(null);
              setShowFormModal(true);
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-violet-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-500 ease-in-out flex items-center gap-2"
          >
            <FaPlusCircle className="text-yellow-300 text-2xl" />
            <span className="text-sm">Crear nueva</span>
          </motion.button>

          <motion.button
            onClick={() => navigate("/secciones-entrenadas")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-500 ease-in-out flex items-center gap-2"
          >
            <span className="text-xl">⬅️</span>
            <span className="text-sm">Volver</span>
          </motion.button>
        </div>
      </motion.div>

      {secciones.length === 0 && (
        <motion.div
          className="bg-yellow-200 text-yellow-800 text-center py-4 mb-6 rounded"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          ⚠️ Aún no hay datos para la sección{" "}
          <strong>{decodedCategoria}</strong>.
        </motion.div>
      )}

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {secciones.map((s) => (
          <motion.div
            key={s._id}
            className="relative cursor-pointer bg-white text-gray-900 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all flex flex-col justify-between hover:shadow-violet-200"
            whileHover={{ scale: 1.01 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => {
              setSelected(s);
              setViewModal(true);
            }}
          >
            <h2 className="text-xl font-semibold mb-3 flex flex-wrap items-center gap-2">
              {(() => {
                const fullTitle = esEntrenada
                  ? s.menuItems?.[0]?.title || s.title
                  : s.title;
                const match = fullTitle?.match(
                  /^(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{Emoji})+/gu
                );
                const emoji = match ? match[0] : "";
                let text = fullTitle?.slice(emoji.length) || "";

                if (text.length > maxLength) {
                  text = text.slice(0, maxLength).trimEnd() + "...";
                }

                return (
                  <>
                    <span>{emoji}</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800">
                      {text}
                    </span>
                  </>
                );
              })()}
            </h2>
            <p className="text-gray-600 text-sm min-h-[70px]">
              {esEntrenada
                ? s.menuItems?.[0]?.detail?.slice(0, 140) +
                    (s.menuItems?.[0]?.detail?.length > 80 ? "..." : "") ||
                  "Sin contenido"
                : `🧩Ítems: ${s.menuItems?.length || 0}`}
            </p>
            <div className="absolute bottom-2 right-3 flex space-x-3">
              <motion.span
                whileHover={{ scale: 1.2 }}
                className="cursor-pointer text-yellow-500 text-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(s);
                  setShowFormModal(true);
                }}
              >
                ✏️
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.2 }}
                className="cursor-pointer text-red-500 text-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(s);
                }}
              >
                🔥
              </motion.span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {viewModal && selected && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="p-6 bg-white text-gray-900 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {esEntrenada
                  ? selected.menuItems?.[0]?.title || selected.title
                  : selected.title}
              </h2>
              <span
                className="text-red-500 hover:text-red-700 cursor-pointer text-2xl"
                onClick={() => setViewModal(false)}
              >
                ❌
              </span>
            </div>
            {esEntrenada ? (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-xl text-gray-800">
                {selected.menuItems?.[0]?.detail ? (
                  <p className="leading-relaxed">
                    {selected.menuItems[0].detail}
                  </p>
                ) : (
                  <p className="italic text-gray-500">Sin contenido cargado.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {selected.menuItems?.map((item, idx) => (
                  <div key={idx} className="p-4 border border-gray-300 rounded">
                    <h3 className="text-base font-semibold mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 mb-1">{item.detail}</p>
                    {item.link && (
                      <a
                        href={item.link}
                        className="text-blue-500 underline break-all"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.link}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showFormModal &&
        (esEntrenada ? (
          <SeccionEntrenadaModal
            seccion={selected}
            category={decodedCategoria}
            onClose={() => setShowFormModal(false)}
            onSuccess={() => {
              setShowFormModal(false);
              fetchSecciones();
            }}
          />
        ) : (
          <SeccionModal
            seccion={selected}
            category={decodedCategoria}
            onClose={() => setShowFormModal(false)}
            onSuccess={() => {
              setShowFormModal(false);
              fetchSecciones();
            }}
          />
        ))}
    </motion.div>
  );
}

export default Secciones;
