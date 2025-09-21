import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner } from "flowbite-react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import ProductoSinEntrenamientoItem from "./ProductoSinEntrenamientoItem";

const slug = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();

function ProductosSinEntrenamientoDetalle() {
  const { categoriaKey } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductos() {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:5000/api/productos");
        const filtrados = data.filter(
          (p) => slug(p?.category) === categoriaKey
        );
        setProductos(filtrados);
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, [categoriaKey]);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-violet-800 dark:text-violet-400">
          Productos sin entrenamiento - {categoriaKey}
        </h1>
        <button
          onClick={() => navigate("/productos-sin-entrenamiento")}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg shadow-md hover:shadow-lg"
        >
          ⬅️ Volver a categorías
        </button>
      </div>

      {/* Lista */}
      {productos.length === 0 ? (
        <p>No hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map((p) => (
            <ProductoSinEntrenamientoItem
              key={p._id}
              producto={p}
              onEdit={() => console.log("Editar", p)}
              onDelete={() => console.log("Eliminar", p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductosSinEntrenamientoDetalle;
