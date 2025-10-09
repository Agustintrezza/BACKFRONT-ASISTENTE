import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner, Progress } from "flowbite-react";
import axios from "axios";
import Swal from "sweetalert2";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import ProductoModal from "../../../components/productos/ProductoModal";

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

  const totalSecciones = allSections.length || 0;
  const maxSecciones = planData?.maxSeccionesTotales || 0;

  useEffect(() => {
    async function fetchSecciones() {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:5000/api/secciones");
        const filtradas = data.filter(
          (s) => (s.sectionKey || slug(s.title)) === categoria
        );
        setSecciones(filtradas);
      } catch (err) {
        console.error("❌ Error cargando secciones:", err);
      } finally {
        setLoading(false);
      }
    }
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
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:5000/api/secciones/${seccion._id}`
        );
        setSecciones((prev) => prev.filter((s) => s._id !== seccion._id));
        Swal.fire("Eliminado", `"${seccion.title}" fue eliminado.`, "success");
      } catch (err) {
        console.error("Error eliminando sección:", err);
        Swal.fire("Error", "No se pudo eliminar la sección.", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Spinner size="xl" className="w-16 h-16 text-purple-600" />
      </div>
    );
  }

  const categoriaLabel = secciones[0]?.category || categoria;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-violet-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 p-6">
      {/* Header */}
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
            onClick={() => navigate("/secciones-entrenadas")}
            className="px-4 py-3 text-sm bg-yellow-400 text-black rounded-lg shadow-md font-medium hover:scale-105 transition"
          >
            ⬅️ Volver
          </button>
        </div>
      </div>

      {/* Lista */}
      {secciones.length === 0 ? (
        <p>No hay secciones en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {secciones.map((s) => (
            <motion.div
              key={s._id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow hover:shadow-violet-200 dark:hover:shadow-violet-900 flex flex-col justify-between"
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="text-lg font-bold mb-2 text-violet-800 dark:text-violet-400">
                {s.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow">
                {s.description
                  ? s.description.length > 100
                    ? s.description.substring(0, 100) + "..."
                    : s.description
                  : "Sin descripción"}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditSeccion(s)}
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(s)}
                  className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  🗑️
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal edición */}
      {editSeccion && (
        <ProductoModal
          producto={editSeccion}
          mode="seccion"
          onClose={() => setEditSeccion(null)}
          onSuccess={async () => {
            setEditSeccion(null);
            try {
              const { data } = await axios.get(
                "http://localhost:5000/api/secciones"
              );
              const filtradas = data.filter(
                (s) => (s.sectionKey || slug(s.title)) === categoria
              );
              setSecciones(filtradas);
            } catch (err) {
              console.error("❌ Error recargando secciones:", err);
            }
          }}
        />
      )}
    </div>
  );
}

export default SeccionesEntrenadasDetalle;
