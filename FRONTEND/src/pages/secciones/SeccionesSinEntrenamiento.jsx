import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Spinner } from "flowbite-react";
import axios from "axios";
import { HiX } from "react-icons/hi";
import SeccionModal from "../../components/secciones/SeccionModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";
import clientConfig from "../../../client-config.json";

const MySwal = withReactContent(Swal);

// ===== Helpers =====
const slug = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();

// Labels visibles (UI)
const SPECIAL_LABELS = clientConfig.sections?.special || [];

// Keys estables
const SPECIAL_KEYS = clientConfig.sections?.specialKeys?.length
  ? clientConfig.sections.specialKeys
  : SPECIAL_LABELS.map(slug);

// Set para membership
const specialKeySet = new Set(SPECIAL_KEYS);

function SeccionesSinEntrenamiento() {
  const navigate = useNavigate();
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchSecciones = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/secciones");
      const sin = res.data.filter((s) => {
        const key = s?.sectionKey || slug(s?.title);
        return !specialKeySet.has(key);
      });
      setSecciones(sin);
    } catch (err) {
      console.error("Error cargando secciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecciones();
  }, []);

  const handleDelete = async (seccion) => {
    const confirm = await MySwal.fire({
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
        MySwal.fire({
          title: "Eliminado",
          text: `"${seccion.title}" fue eliminada correctamente.`,
          icon: "success",
          background: "#171717",
          color: "#f3f4f6",
          iconColor: "#4ade80",
          confirmButtonColor: "#3b82f6",
        });
      } catch (err) {
        console.error("Error eliminando:", err);
        MySwal.fire({
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-violet-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
        <Spinner size="xl" className="w-16 h-16 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-white to-violet-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-2">
        <motion.h1
          className="text-4xl font-extrabold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800 dark:from-white dark:via-violet-400 dark:to-purple-500">
            Secciones Sin Entrenamiento
          </span>
        </motion.h1>

        <div className="flex flex-wrap gap-2">
          <motion.button
            onClick={() => {
              setSelected(null);
              setShowFormModal(true);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <FaPlusCircle className="text-yellow-300 text-2xl" />
            <span className="text-sm">Crear sección</span>
          </motion.button>

          <motion.button
            onClick={() => navigate("/secciones-entrenadas")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-violet-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span className="text-xl">🧠</span>
            <span className="text-sm">Ir a entrenadas</span>
          </motion.button>

          <motion.button
            onClick={() => navigate("/dashboard")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span className="text-xl">⬅️</span>
            <span className="text-sm">Volver</span>
          </motion.button>
        </div>
      </div>

      {secciones.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No hay secciones sin entrenamiento.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {secciones.map((s, i) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl p-5 shadow transition-all flex flex-col justify-between hover:shadow-violet-200 dark:hover:shadow-violet-900"
              onClick={() => {
                setSelected(s);
                setViewModal(true);
              }}
            >
              <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800 dark:from-white dark:via-violet-400 dark:to-purple-500">
                {s.title}
              </h2>
              <div className="text-sm space-y-1">
                <p>
                  🧾 <strong>Ítems:</strong> {s.menuItems?.length || 0}
                </p>
              </div>
              <div className="flex justify-end gap-4 mt-4 text-xl">
                <span
                  role="button"
                  className="hover:text-yellow-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(s);
                    setShowFormModal(true);
                  }}
                >
                  ✏️
                </span>
                <span
                  role="button"
                  className="hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(s);
                  }}
                >
                  🔥
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Vista previa */}
      <Modal
        show={viewModal}
        size="lg"
        onClose={() => setViewModal(false)}
      >
        <div className="p-6 relative bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg">
          <HiX
            className="absolute top-4 right-4 cursor-pointer"
            size={24}
            onClick={() => setViewModal(false)}
          />
          {selected && (
            <>
              <h2 className="text-2xl font-bold mb-4">{selected.title}</h2>
              {selected.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {selected.description}
                </p>
              )}
              {selected.menuItems?.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {selected.menuItems.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.title}:</strong> {item.detail}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 text-blue-500 hover:underline"
                        >
                          (enlace)
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {selected.link && (
                <div className="mt-4">
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Ver enlace
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>

      {/* Modal Formulario */}
      <Modal
        show={showFormModal}
        size="6xl"
        onClose={() => setShowFormModal(false)}
      >
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg w-full max-h-[90vh] overflow-y-auto">
          <SeccionModal
            seccion={selected}
            onClose={() => setShowFormModal(false)}
            onSuccess={() => {
              setShowFormModal(false);
              fetchSecciones();
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default SeccionesSinEntrenamiento;
