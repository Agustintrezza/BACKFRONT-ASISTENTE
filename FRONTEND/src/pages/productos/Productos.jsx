import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Spinner } from "flowbite-react";
import axios from "axios";
import ProductoModal from "../../components/productos/ProductoModal";
import Swal from "sweetalert2";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaPlusCircle } from "react-icons/fa";

function Productos() {
  const { categoria } = useParams();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/productos?category=${encodeURIComponent(
          categoria
        )}`
      );
      setProductos(res.data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
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
          `http://localhost:5000/api/productos/${producto._id}`
        );
        fetchProductos();
        Swal.fire({
          title: "Eliminado",
          text: `"${producto.title}" fue eliminado correctamente.`,
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
          text: "No se pudo eliminar el producto.",
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
          {decodeURIComponent(categoria)}
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
            <span className="text-sm">Crear nuevo</span>
          </motion.button>

          <motion.button
            onClick={() => navigate("/productos-entrenados")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-500 ease-in-out flex items-center gap-2"
          >
            <span className="text-xl">⬅️</span>
            <span className="text-sm">Volver</span>
          </motion.button>
        </div>
      </motion.div>

      {productos.length === 0 && (
        <motion.div
          className="bg-yellow-200 text-yellow-800 text-center py-4 mb-6 rounded"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          ⚠️ Aún no hay productos cargados para la categoría{" "}
          <strong>{decodeURIComponent(categoria)}</strong>.
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
        {productos.map((p) => (
          <motion.div
            key={p._id}
            className="relative cursor-pointer bg-white text-gray-900 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all flex flex-col justify-between hover:shadow-violet-200"
            whileHover={{ scale: 1.01 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => {
              setSelected(p);
              setViewModal(true);
            }}
          >
            <h2 className="text-xl font-semibold mb-1 flex flex-wrap items-center">
              {[
                ...[...p.title].slice(0, 40), // Trunca a los primeros 40 caracteres visuales
              ]
                .join("")
                .match(/(\p{Emoji}+|[^\p{Emoji}]+)/gu)
                ?.map((part, index) => {
                  const isEmoji = /\p{Emoji}/u.test(part);
                  return isEmoji ? (
                    <span key={index} className="mr-2 text-3xl">
                      {part}
                    </span>
                  ) : (
                    <span
                      key={index}
                      className="text-transparent text-[17px] bg-clip-text bg-gradient-to-r from-black via-blue-900 to-violet-800"
                    >
                      {part}
                    </span>
                  );
                })}
            </h2>
            <p className="text-gray-600 text-sm mb-1 truncate">
              💰 Precio: ${p.price}
            </p>
            <p className="text-gray-600 text-sm mb-1 truncate">
              📦 Stock: {p.stock}
            </p>
            <p className="text-gray-600 text-sm truncate">
              ⏳ Duración: {p.duration}
            </p>
            <div className="absolute bottom-2 right-3 flex space-x-3">
              <motion.span
                whileHover={{ scale: 1.2 }}
                className="cursor-pointer text-yellow-500 text-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(p);
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
                  handleDelete(p);
                }}
              >
                🔥
              </motion.span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Modal
        show={viewModal}
        size="6xl"
        className="bg-black"
        onClose={() => setViewModal(false)}
      >
        <div className="p-6 relative bg-white text-gray-900 rounded-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{selected?.title}</h2>
            <span
              className="text-red-500 hover:text-red-700 cursor-pointer text-2xl"
              onClick={() => setViewModal(false)}
            >
              ❌
            </span>
          </div>

          {selected?.image && (
            <img
              src={selected.image}
              alt={selected.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          {selected?.description && (
            <p className="text-gray-700 text-base mb-6">
              {selected.description}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="border-b border-yellow-400 pb-2">
              <strong>💰 Precio:</strong> ${selected?.price}
            </div>
            <div className="border-b border-yellow-400 pb-2">
              <strong>📦 Stock:</strong> {selected?.stock}
            </div>
            <div className="border-b border-yellow-400 pb-2">
              <strong>⏳ Duración:</strong> {selected?.duration}
            </div>
            <div className="border-b border-yellow-400 pb-2">
              <strong>📍 Ubicación:</strong>{" "}
              {selected?.location || "No especificada"}
            </div>
            <div className="border-b border-yellow-400 pb-2">
              <strong>📂 Categoría:</strong> {selected?.category}
            </div>
            {selected?.availableDates?.length > 0 && (
              <div className="border-b border-yellow-400 pb-2 col-span-2">
                <strong>📅 Fechas disponibles:</strong>{" "}
                {selected.availableDates.join(", ")}
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        show={showFormModal}
        size="7xl"
        className="bg-white"
        onClose={() => setShowFormModal(false)}
      >
        <div className="text-gray-900 p-6 rounded-lg w-full max-h-[100vh] overflow-y-auto">
          <ProductoModal
            producto={selected}
            category={decodeURIComponent(categoria)}
            onClose={() => setShowFormModal(false)}
            onSuccess={() => {
              setShowFormModal(false);
              fetchProductos();
            }}
          />
        </div>
      </Modal>
    </motion.div>
  );
}

export default Productos;
