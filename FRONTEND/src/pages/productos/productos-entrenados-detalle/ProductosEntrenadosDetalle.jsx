import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner, Progress } from "flowbite-react";
import axios from "axios";
import Swal from "sweetalert2";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import ProductoModal from "../../../components/productos/ProductoModal";

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

function ProductosEntrenadosDetalle({ planData, allProducts = [] }) {
  const { categoria } = useParams();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editProducto, setEditProducto] = useState(null);
  const [newProducto, setNewProducto] = useState(false);

  const totalProductos = allProducts.length || 0;
  const maxProductos = planData?.maxProductosTotales || 0;

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/productos`);
      const filtrados = data.filter(
        (p) => (p.categoryKey || slug(p.category)) === decodeURIComponent(categoria)
      );
      setProductos(filtrados);
    } catch (err) {
      console.error("Error cargando productos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoria]);

  const handleDelete = async (producto) => {
    const confirm = await Swal.fire({
      title: `¿Eliminar "${producto.title}"?`,
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
        await axios.delete(`${API_URL}/productos/${producto._id}`);
        fetchProductos();
        Swal.fire("Eliminado", `"${producto.title}" fue eliminado.`, "success");
      } catch (err) {
        console.error("Error eliminando producto:", err);
        Swal.fire("Error", "No se pudo eliminar el producto.", "error");
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

  const categoriaLabel = productos[0]?.category || categoria;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-violet-200 dark:from-gray-900 dark:to-gray-800 p-6 text-gray-800 dark:text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-2">
        <motion.h1
          className="text-3xl font-extrabold text-violet-800 dark:text-violet-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Productos entrenados - {categoriaLabel}
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Productos totales globales creados
            </p>
            <Progress
              progress={
                maxProductos
                  ? Math.round((totalProductos / maxProductos) * 100)
                  : 0
              }
              size="sm"
              color="purple"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {totalProductos} / {maxProductos} productos usados
            </span>
          </div>
        </motion.h1>

        <div className="flex gap-2">
          <button
            onClick={() => setNewProducto(true)}
            className="px-4 py-3 text-sm bg-violet-600 font-bold text-white rounded-lg shadow-md hover:scale-105 transition"
          >
            Nuevo Producto
          </button>
          <button
            onClick={() => navigate("/productos-entrenados")}
            className="px-4 py-3 text-sm bg-yellow-400 text-black rounded-lg shadow-md font-medium hover:scale-105 transition"
          >
            Volver
          </button>
        </div>
      </div>

      {/* Lista */}
      {productos.length === 0 ? (
        <p>No hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map((p) => (
            <motion.div
              key={p._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow hover:shadow-violet-200 dark:hover:shadow-violet-900 flex flex-col justify-between"
            >
              {/* Título */}
              <h2 className="text-md font-bold mb-2 text-violet-800 dark:text-violet-400">
                {p.title}
              </h2>

              {/* Descripción preview (100 chars) */}
              <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow">
                {p.description && p.description.length > 80
                  ? p.description.substring(0, 80) + "..."
                  : p.description || "Sin descripción"}
              </p>

              {/* Acciones alineadas a la izquierda */}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setEditProducto(p)}
                  className="text-xl hover:scale-125 transition"
                  title="Editar producto"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  className="text-xl hover:scale-125 transition"
                  title="Eliminar producto"
                >
                  🗑️
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modales */}
      {editProducto && (
        <ProductoModal
          producto={editProducto}
          mode="producto"
          onClose={() => setEditProducto(null)}
          onSuccess={() => {
            setEditProducto(null);
            fetchProductos();
          }}
        />
      )}

      {newProducto && (
        <ProductoModal
          producto={{ category: categoriaLabel }}
          mode="producto"
          onClose={() => setNewProducto(false)}
          onSuccess={() => {
            setNewProducto(false);
            fetchProductos();
          }}
        />
      )}
    </div>
  );
}

export default ProductosEntrenadosDetalle;
