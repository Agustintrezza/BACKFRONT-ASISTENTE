import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Modal, Spinner } from 'flowbite-react';
import axios from 'axios';
import { HiX } from 'react-icons/hi';
import ProductoModal from '../components/ProductoModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaPlusCircle } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

function ProductosSinEntrenamiento() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [categoriaFijada, setCategoriaFijada] = useState(null);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/productos');
      const entrenadas = [
        'Tours y Excursiones',
        'Alojamiento',
        'Shows de Tango',
        'Programas',
        'Traslados',
      ];
      const sin = res.data.filter((p) => !entrenadas.includes(p.category));
      setProductos(sin);
    } catch (err) {
      console.error('Error cargando productos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const productosAgrupados = productos.reduce((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const handleDelete = async (producto) => {
    const confirm = await MySwal.fire({
      title: `¿Eliminar "${producto.title}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#171717',
      color: '#f3f4f6',
      iconColor: '#facc15',
      customClass: {
        popup: 'rounded-lg',
        title: 'text-lg font-semibold',
        confirmButton: 'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700',
        cancelButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-gray-700'
      }
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/productos/${producto._id}`);
        fetchProductos();
        MySwal.fire({
          title: 'Eliminado',
          text: `"${producto.title}" fue eliminado correctamente.`,
          icon: 'success',
          background: '#171717',
          color: '#f3f4f6',
          iconColor: '#4ade80',
          confirmButtonColor: '#3b82f6'
        });
      } catch (err) {
        console.error('Error eliminando:', err);
        MySwal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el producto.',
          icon: 'error',
          background: '#111827',
          color: '#f3f4f6',
          iconColor: '#f87171',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-white text-gray-900">
        <Spinner size="xl" className="w-16 h-16 text-purple-600 mb-6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-white to-violet-200 text-gray-900">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-2">
        <motion.h1
          className="text-4xl font-extrabold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800">
            Productos Sin Entrenamiento
          </span>
        </motion.h1>

        <div className="flex flex-wrap gap-2">
          <motion.button
            onClick={() => {
              setSelected(null);
              setCategoriaFijada(null); // ← permite elegir o crear nueva
              setShowFormModal(true);
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-500 ease-in-out flex items-center gap-2"
          >
            <FaPlusCircle className="text-yellow-300 text-2xl" />
            <span className="text-sm">Crear producto</span>
          </motion.button>

          <motion.button
            onClick={() => navigate('/productos-entrenados')}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-violet-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-500 ease-in-out flex items-center gap-2"
          >
            <span className="text-xl">🧠</span>
            <span className="text-sm">Ir a entrenados</span>
          </motion.button>

          <motion.button
            onClick={() => navigate('/dashboard')}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-500 ease-in-out flex items-center gap-2"
          >
            <span className="text-xl">⬅️</span>
            <span className="text-sm">Volver</span>
          </motion.button>
        </div>
      </div>

      {productos.length === 0 ? (
        <p className="text-gray-600">No hay productos sin entrenamiento.</p>
      ) : (
        Object.entries(productosAgrupados).map(([categoria, lista]) => (
          <div key={categoria} className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-violet-800">{categoria}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {lista.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="cursor-pointer bg-white text-gray-900 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all flex flex-col justify-between hover:shadow-violet-200"
                  onClick={() => {
                    setSelected(p);
                    setViewModal(true);
                  }}
                >
                  <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-black via-blue-800 to-violet-800">
                    {p.title}
                  </h2>
                  <div className="text-sm space-y-1">
                    <p>💰 <strong>Precio:</strong> ${p.price}</p>
                    <p>📦 <strong>Stock:</strong> {p.stock}</p>
                    <p>🕒 <strong>Duración:</strong> {p.duration}</p>
                  </div>
                  <div className="flex justify-end gap-4 mt-4 text-xl">
                    <span
                      role="button"
                      className="hover:text-yellow-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(p);
                        setCategoriaFijada(p.category); // ← mantiene categoría al editar
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
                        handleDelete(p);
                      }}
                    >
                      🔥
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Modal vista previa */}
      <Modal show={viewModal} size="lg" onClose={() => setViewModal(false)}>
        <div className="p-6 relative bg-white rounded-lg">
          <HiX
            className="absolute top-4 right-4 cursor-pointer"
            size={24}
            onClick={() => setViewModal(false)}
          />
          {selected && (
            <>
              <h2 className="text-2xl font-bold mb-4">{selected.title}</h2>
              {selected.image && (
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <p className="text-gray-700 mb-4">{selected.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Precio:</strong> ${selected.price}</div>
                <div><strong>Stock:</strong> {selected.stock}</div>
                <div><strong>Duración:</strong> {selected.duration}</div>
                <div><strong>Categoría:</strong> {selected.category}</div>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Modal formulario */}
      <Modal
        show={showFormModal}
        size="6xl"
        onClose={() => setShowFormModal(false)}
        className="bg-white bg-opacity-100"
        theme={{
          root: {
            base: "fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-full bg-white bg-opacity-100",
          }
        }}
      >
        <div className="bg-white text-gray-900 p-6 rounded-lg w-full max-h-[90vh] overflow-y-auto">
          <ProductoModal
            producto={selected}
            category={categoriaFijada}
            onClose={() => setShowFormModal(false)}
            onSuccess={() => {
              setShowFormModal(false);
              fetchProductos();

              if (!categoriaFijada) {
                const nuevaCategoria = selected?.category || productos[0]?.category;
                if (nuevaCategoria) setCategoriaFijada(nuevaCategoria);
              }
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default ProductosSinEntrenamiento;
