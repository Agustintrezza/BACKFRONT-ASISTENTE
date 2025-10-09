import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Spinner, Progress } from "flowbite-react";
import axios from "axios";
import Swal from "sweetalert2";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import SeccionSinEntrenamientoItem from "./SeccionSinEntrenamientoItem";
import SeccionEntrenadaModal from "../../../components/secciones/SeccionEntrenadaModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function SeccionesSinEntrenamientoDetalle({ planData }) {
  const { categoriaKey } = useParams();
  const navigate = useNavigate();

  const [secciones, setSecciones] = useState([]);
  const [categoriaReal, setCategoriaReal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editSeccion, setEditSeccion] = useState(null);
  const [newSeccion, setNewSeccion] = useState(false);

  const maxSecciones = planData?.maxSeccionesTotales || 0;

  // ==============================
  // 🔹 Cargar secciones del backend
  // ==============================
  const fetchSecciones = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/secciones`);
      console.log("🟣 Todas las secciones:", data);

      const categoria = data.find(
        (s) => s.categoryKey === categoriaKey && (!s.menuItems || s.menuItems.length === 0)
      );
      setCategoriaReal(categoria || null);

      const filtradas = data.filter(
        (s) => s.categoryKey === categoriaKey && s.menuItems && s.menuItems.length > 0
      );

      console.log("🟣 Secciones dentro de la categoría:", filtradas);
      setSecciones(filtradas);
    } catch (err) {
      console.error("❌ Error cargando secciones:", err);
    } finally {
      setLoading(false);
    }
  }, [categoriaKey]);

  useEffect(() => {
    fetchSecciones();
  }, [fetchSecciones]);

  // ==============================
  // 🗑️ Eliminar sección
  // ==============================
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

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/secciones/${seccion._id}`);
      setSecciones((prev) => prev.filter((s) => s._id !== seccion._id));
      Swal.fire("Eliminado", `"${seccion.title}" fue eliminado.`, "success");
    } catch (err) {
      console.error("❌ Error eliminando sección:", err);
      Swal.fire("Error", "No se pudo eliminar la sección.", "error");
    }
  };

  // ==============================
  // 🧠 Label de la categoría
  // ==============================
  const categoriaLabel =
    categoriaReal?.category || categoriaReal?.title || categoriaKey;

  // ==============================
  // 🧩 Render principal
  // ==============================
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Spinner size="xl" className="w-16 h-16 text-purple-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-violet-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-2">
        <motion.h1
          className="text-3xl font-extrabold text-violet-800 dark:text-violet-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Secciones sin entrenamiento - {categoriaLabel}
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Secciones creadas
            </p>
            <Progress
              progress={
                maxSecciones
                  ? Math.round((secciones.length / maxSecciones) * 100)
                  : 0
              }
              size="sm"
              color="purple"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {secciones.length} / {maxSecciones} secciones usadas
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
            onClick={() => navigate("/secciones-sin-entrenamiento")}
            className="px-4 py-3 text-sm bg-yellow-400 text-black rounded-lg shadow-md font-medium hover:scale-105 transition"
          >
            Volver a categorías
          </button>
        </div>
      </div>

      {/* LISTADO */}
      {secciones.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No hay secciones en esta categoría por el momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {secciones.map((s) => (
            <SeccionSinEntrenamientoItem
              key={s._id}
              seccion={s}
              onEdit={() => setEditSeccion(s)}
              onDelete={() => handleDelete(s)}
            />
          ))}
        </div>
      )}

      {/* MODALES */}
      {editSeccion && (
        <SeccionEntrenadaModal
          seccion={editSeccion}
          category={categoriaKey}
          onClose={() => setEditSeccion(null)}
          onSuccess={() => {
            setEditSeccion(null);
            fetchSecciones(); // ✅ refresca después de editar
          }}
        />
      )}

      {newSeccion && (
        <SeccionEntrenadaModal
          seccion={null}
          category={categoriaKey}
          onClose={() => setNewSeccion(false)}
          onSuccess={() => {
            setNewSeccion(false);
            fetchSecciones(); // ✅ refresca automáticamente después de crear
          }}
        />
      )}
    </div>
  );
}

export default SeccionesSinEntrenamientoDetalle;
