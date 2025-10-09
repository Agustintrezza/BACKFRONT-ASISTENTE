import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner, Progress } from "flowbite-react";
import axios from "axios";
import Swal from "sweetalert2";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import SeccionEntrenadaModal from "../../../components/secciones/SeccionEntrenadaModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ===== Helpers =====
const slug = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();

function SeccionesEntrenadasDetalle({ planData, allSections = [] }) {
  const { categoria } = useParams();
  const navigate = useNavigate();

  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editSeccion, setEditSeccion] = useState(null);
  const [newSeccion, setNewSeccion] = useState(false);

  // === Totales para ProgressBar ===
  const totalSecciones = allSections.length || 0;
  const maxSecciones = planData?.maxSeccionesTotales || 0;

  // === Cargar secciones ===
  const fetchSecciones = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/secciones`);
      const filtradas = data.filter(
        (s) => (s.sectionKey || slug(s.title)) === decodeURIComponent(categoria)
      );
      setSecciones(filtradas);
    } catch (err) {
      console.error("❌ Error cargando secciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecciones();
  }, [categoria]);

  // === Eliminar sección ===
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
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/secciones/${seccion._id}`);
        fetchSecciones();
        Swal.fire("Eliminado", `"${seccion.title}" fue eliminado.`, "success");
      } catch (err) {
        console.error("Error eliminando sección:", err);
        Swal.fire("Error", "No se pudo eliminar la sección.", "error");
      }
    }
  };

  // === Estado de carga ===
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Spinner size="xl" className="w-16 h-16 text-purple-600" />
      </div>
    );
  }

  const categoriaLabel = secciones[0]?.title || categoria;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-violet-200 dark:from-gray-900 dark:to-gray-800 p-6 text-gray-800 dark:text-gray-100">
      {/* === Header === */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-2">
        <motion.h1
          className="text-3xl font-extrabold text-violet-800 dark:text-violet-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Secciones entrenadas - {categoriaLabel}
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Secciones totales globales creadas
            </p>
            <Progress
              progress={
                maxSecciones
                  ? Math.round((totalSecciones / maxSecciones) * 100)
                  : 0
              }
              size="sm"
              color="purple"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {totalSecciones} / {maxSecciones} secciones usadas
            </span>
          </div>
        </motion.h1>

        <div className="flex gap-2">
          <button
            onClick={() => setNewSeccion(true)}
            className="px-4 py-3 text-sm bg-violet-600 font-bold text-white rounded-lg shadow-md hover:scale-105 transition"
          >
            Nueva Sección
          </button>
          <button
            onClick={() => navigate("/secciones-entrenadas")}
            className="px-4 py-3 text-sm bg-yellow-400 text-black rounded-lg shadow-md font-medium hover:scale-105 transition"
          >
            Volver
          </button>
        </div>
      </div>

      {/* === Lista de secciones === */}
      {secciones.length === 0 ? (
        <p>No hay secciones en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {secciones.map((s) =>
            s.menuItems && s.menuItems.length > 0 ? (
              s.menuItems.map((item, idx) => (
                <motion.div
                  key={`${s._id}-${idx}`}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow hover:shadow-violet-200 dark:hover:shadow-violet-900 flex flex-col justify-between"
                >
                  {/* Título */}
                  <h2 className="text-md font-bold mb-2 text-violet-800 dark:text-violet-400">
                    {item.title || "Sin título"}
                  </h2>

                  {/* Descripción */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow">
                    {item.detail && item.detail.length > 80
                      ? item.detail.substring(0, 80) + "..."
                      : item.detail || "Sin descripción"}
                  </p>

                  {/* Acciones */}
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => setEditSeccion(s)}
                      className="text-xl hover:scale-125 transition"
                      title="Editar sección"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(s)}
                      className="text-xl hover:scale-125 transition"
                      title="Eliminar sección"
                    >
                      🗑️
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                key={s._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow hover:shadow-violet-200 dark:hover:shadow-violet-900 flex flex-col justify-between"
              >
                <h2 className="text-md font-bold mb-2 text-violet-800 dark:text-violet-400">
                  {s.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow">
                  Sin descripción
                </p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setEditSeccion(s)}
                    className="text-xl hover:scale-125 transition"
                    title="Editar sección"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(s)}
                    className="text-xl hover:scale-125 transition"
                    title="Eliminar sección"
                  >
                    🗑️
                  </button>
                </div>
              </motion.div>
            )
          )}
        </div>
      )}

      {/* === Modales === */}
      {editSeccion && (
        <SeccionEntrenadaModal
          seccion={editSeccion}
          category={categoriaLabel}
          onClose={() => setEditSeccion(null)}
          onSuccess={() => {
            setEditSeccion(null);
            fetchSecciones();
          }}
        />
      )}

      {newSeccion && (
        <SeccionEntrenadaModal
          seccion={null}
          category={categoriaLabel}
          onClose={() => setNewSeccion(false)}
          onSuccess={() => {
            setNewSeccion(false);
            fetchSecciones();
          }}
        />
      )}
    </div>
  );
}

export default SeccionesEntrenadasDetalle;
