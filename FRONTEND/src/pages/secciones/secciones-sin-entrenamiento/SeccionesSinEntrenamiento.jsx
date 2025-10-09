import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Progress } from "flowbite-react";
import axios from "axios";
import Swal from "sweetalert2";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import clientConfig from "../../../../client-config.json";
import CategoriaModalSecciones from "../../../components/secciones/CategoriaModalSecciones";

// ==============================
// 🔧 Configuración base
// ==============================
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ==============================
// 🔠 Helpers
// ==============================
const slug = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();

const TRAINED_KEYS = new Set(
  (clientConfig.sections?.specialKeys?.length
    ? clientConfig.sections.specialKeys
    : clientConfig.sections?.special || []
  ).map(slug)
);

const getCategoryKey = (s) =>
  s?.categoryKey || s?.sectionKey || slug(s?.title);

// ==============================
// 💡 Componente principal
// ==============================
function SeccionesSinEntrenamiento({ planData }) {
  const navigate = useNavigate();
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const maxComodines = planData?.maxSeccionesComodines || 0;

  // ==============================
  // 🧠 Cargar secciones desde backend
  // ==============================
  useEffect(() => {
    async function fetchSecciones() {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/secciones`);
        // Filtra secciones sin entrenamiento
        const sin = data.filter((s) => !TRAINED_KEYS.has(getCategoryKey(s)));
        console.log("🟣 Secciones sin entrenamiento:", sin);
        setSecciones(sin);
      } catch (err) {
        console.error("❌ Error cargando secciones:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSecciones();
  }, [refreshKey]);

  // ==============================
  // 📦 Agrupar por categoría
  // ==============================
  const categorias = secciones.reduce((acc, s) => {
    const key = getCategoryKey(s);
    const categoryKey = s.categoryKey || s.sectionKey || key;

    // Evita contar las categorías puras como secciones
    if (!acc[categoryKey]) {
      acc[categoryKey] = {
        categoria: s.category || s.title || key,
        key: categoryKey,
        count: 0,
      };
    }

    // Si tiene menú (ítem real), contarlo
    if (Array.isArray(s.menuItems) && s.menuItems.length > 0) {
      acc[categoryKey].count += s.menuItems.length;
    }
    return acc;
  }, {});

  const categoriasArr = Object.entries(categorias).map(([key, obj]) => ({
    key,
    ...obj,
  }));

  const totalCategorias = categoriasArr.length;

  // ==============================
  // 🗑️ Eliminar categoría
  // ==============================
  const handleDeleteCategoria = async (cat) => {
    const confirm = await Swal.fire({
      title: `¿Eliminar categoría "${cat.categoria}"?`,
      text: "Se eliminarán todas las secciones dentro de esta categoría.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const url = `${API_URL}/secciones/categoria/${cat.key}`;
      console.log("🟢 DELETE URL:", url);

      const res = await axios.delete(url);
      console.log("🟢 DELETE Response:", res.data);

      // Refresca lista
      setSecciones((prev) => prev.filter((s) => getCategoryKey(s) !== cat.key));

      Swal.fire("Eliminada", "Categoría eliminada correctamente.", "success");
    } catch (err) {
      console.error("❌ Error eliminando categoría:", err);
      Swal.fire("Error", "No se pudo eliminar la categoría.", "error");
    }
  };

  // ==============================
  // ⏳ Loading spinner
  // ==============================
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="xl" className="w-16 h-16 text-purple-600" />
      </div>
    );

  // ==============================
  // 🧩 Render principal
  // ==============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-violet-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-2">
        <motion.h1
          className="text-3xl font-extrabold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800 dark:from-white dark:via-violet-400 dark:to-purple-400">
            Secciones Sin Entrenamiento ({totalCategorias})
          </span>

          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Categorías creadas (comodines)
            </p>
            <Progress
              progress={
                maxComodines
                  ? Math.round((totalCategorias / maxComodines) * 100)
                  : 0
              }
              size="sm"
              color="purple"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {totalCategorias} / {maxComodines} categorías usadas
            </span>
          </div>
        </motion.h1>

        {/* BOTONES SUPERIORES */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setCategoriaEditar(null);
              setShowModal(true);
            }}
            disabled={totalCategorias >= maxComodines}
            className={`py-3 px-4 text-sm rounded-lg font-semibold shadow-md hover:scale-105 transition ${
              totalCategorias >= maxComodines
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-violet-600 text-white"
            }`}
          >
            Crear Categoría
          </button>

          <button
            onClick={() => navigate("/secciones-entrenadas")}
            className="py-3 px-4 text-sm bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:scale-105 transition"
          >
            Ir a entrenadas
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="py-3 px-4 text-sm bg-yellow-400 text-black rounded-lg font-medium shadow-md hover:scale-105 transition"
          >
            Volver
          </button>
        </div>
      </div>

      {/* CARDS DE CATEGORÍAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categoriasArr.map((cat) => (
          <motion.div
            key={cat.key}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow hover:shadow-violet-200 dark:hover:shadow-violet-900"
          >
            <div
              className="cursor-pointer"
              onClick={() =>
                navigate(
                  `/secciones-sin-entrenamiento/${encodeURIComponent(cat.key)}`
                )
              }
            >
              <h2 className="text-xl font-bold mb-2 text-violet-800 dark:text-violet-400">
                {cat.categoria}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {cat.count} secciones sin entrenar
              </p>
            </div>

            <div className="flex mt-3">
              <button
                onClick={() => {
                  console.log("🟣 Editar categoría:", cat);
                  setCategoriaEditar(cat);
                  setShowModal(true);
                }}
                className="p-2 text-lg"
                title="Editar categoría"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDeleteCategoria(cat)}
                className="p-2 text-lg"
                title="Eliminar categoría"
              >
                🗑️
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL DE CATEGORÍAS */}
      {showModal && (
        <CategoriaModalSecciones
          categoria={categoriaEditar}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            console.log("🟢 onSuccess => recargando lista de categorías");
            setShowModal(false);
            setRefreshKey((prev) => prev + 1);
          }}
        />
      )}
    </div>
  );
}

export default SeccionesSinEntrenamiento;
