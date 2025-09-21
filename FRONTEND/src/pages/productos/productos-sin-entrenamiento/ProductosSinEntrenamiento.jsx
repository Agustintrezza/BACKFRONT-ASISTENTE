import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Progress } from "flowbite-react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import clientConfig from "../../../../client-config.json";
import ModalCategoria from "../../../components/productos/CategoriaModal";
import Swal from "sweetalert2";

const slug = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();

const PRODUCT_LABELS = clientConfig.sections?.trained || [];
const PRODUCT_KEYS =
  clientConfig.products?.trainedKeys?.length
    ? clientConfig.products.trainedKeys
    : PRODUCT_LABELS.map(slug);

const TRAINED_PRODUCT_KEY_SET = new Set(PRODUCT_KEYS);
const getProductKey = (p) => p?.categoryKey || slug(p?.category);

function ProductosSinEntrenamiento({ planData }) {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);

  const maxComodines = planData?.maxProductosComodines || 0;

  useEffect(() => {
    async function fetchProductos() {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:5000/api/productos");
        const sin = data.filter(
          (p) => !TRAINED_PRODUCT_KEY_SET.has(getProductKey(p))
        );
        setProductos(sin);
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, []);

  // Agrupamos por categoría
  const categorias = productos.reduce((acc, p) => {
    const key = getProductKey(p);
    if (!acc[key]) acc[key] = { categoria: p.category || key, count: 0 };
    acc[key].count += 1;
    return acc;
  }, {});

  const categoriasArr = Object.entries(categorias).map(([key, obj]) => ({
    key,
    ...obj,
  }));

  const totalCategorias = categoriasArr.length;

  // Eliminar categoría
  const handleDeleteCategoria = async (cat) => {
    const confirm = await Swal.fire({
      title: `¿Eliminar categoría "${cat.categoria}"?`,
      text: "Se eliminarán todos los productos de esta categoría.",
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
          `http://localhost:5000/api/productos/categoria/${cat.key}`
        );
        setProductos((prev) =>
          prev.filter((p) => getProductKey(p) !== cat.key)
        );
        Swal.fire("Eliminada", `Categoría eliminada correctamente.`, "success");
      } catch (err) {
        console.error("Error eliminando categoría:", err);
        Swal.fire("Error", "No se pudo eliminar la categoría.", "error");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-violet-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-2">
        <motion.h1
          className="text-4xl font-extrabold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-[30px] bold text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800 dark:from-white dark:via-blue-400 dark:to-violet-400">
            Productos Sin Entrenamiento ({totalCategorias})
          </span>

          {/* Subtítulo y progress */}
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

        {/* Botones */}
        <div className="flex flex-wrap gap-2 ml-4">

          {/* Crear categoría */}
          <button
            onClick={() => {
              setCategoriaEditar(null);
              setShowCategoriaModal(true);
            }}
            disabled={totalCategorias >= maxComodines}
            className={`py-3 px-4 text-sm rounded-lg font-semibold shadow-md hover:scale-105 transition
              ${
                totalCategorias >= maxComodines
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white"
              }`}
          >
            Crear Categoría
          </button>

          {/* Ir a entrenados */}
          <button
            onClick={() => navigate("/productos-entrenados")}
            className="py-3 px-4 text-sm bg-violet-600 text-white rounded-lg font-semibold shadow-md hover:scale-105 transition"
          >
            Ir a entrenados
          </button>

          {/* Volver */}
          <button
            onClick={() => navigate("/dashboard")}
            className="py-3 px-4 text-sm bg-yellow-400 text-black rounded-lg font-medium shadow-md hover:scale-105 transition"
          >
           Volver
          </button>
        </div>
      </div>

      {/* Cards por categoría */}
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
                navigate(`/productos-sin-entrenamiento/${encodeURIComponent(cat.key)}`)
              }
            >
              <h2 className="text-xl font-bold mb-2 text-violet-800 dark:text-violet-400">
                {cat.categoria}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {cat.count} productos sin entrenar
              </p>
            </div>

            {/* Botones editar/eliminar */}
            <div className="flex">
              <button
                onClick={() => {
                  setCategoriaEditar(cat);
                  setShowCategoriaModal(true);
                }}
                className="p-2 text-white rounded-l hover:scale-105 transition"
                title="Editar categoría"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDeleteCategoria(cat)}
                className="p-2 text-white rounded-lg hover:scale-105 transition"
                title="Eliminar categoría"
              >
                🗑️
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal de Categoría */}
      {showCategoriaModal && (
        <ModalCategoria
          categoria={categoriaEditar}
          onClose={() => setShowCategoriaModal(false)}
          onSuccess={async () => {
            setShowCategoriaModal(false);
            try {
              const { data } = await axios.get("http://localhost:5000/api/productos");
              const sin = data.filter(
                (p) => !TRAINED_PRODUCT_KEY_SET.has(getProductKey(p))
              );
              setProductos(sin);
            } catch (err) {
              console.error("Error recargando productos:", err);
            }
          }}
        />
      )}
    </div>
  );
}

export default ProductosSinEntrenamiento;
