import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Modal, Spinner } from 'flowbite-react';
import axios from 'axios';
import { HiArrowLeft, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import ProductoModal from '../components/ProductoModal';
import Swal from 'sweetalert2';

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
        `http://localhost:5000/api/productos?category=${encodeURIComponent(categoria)}`
      );
      setProductos(res.data);
    } catch (err) {
      console.error('Error cargando productos:', err);
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
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#171717', // fondo negro (tailwind gray-900)
      color: '#f3f4f6',       // texto gris claro (tailwind gray-100)
      iconColor: '#facc15',   // amarillo (warning)
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
        Swal.fire({
          title: 'Eliminado',
          text: `"${producto.title}" fue eliminado correctamente.`,
          icon: 'success',
          background: '#171717',
          color: '#f3f4f6',
          iconColor: '#4ade80', // verde
          confirmButtonColor: '#3b82f6'
        });
      } catch (err) {
        console.error('Error eliminando:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el producto.',
          icon: 'error',
          background: '#111827',
          color: '#f3f4f6',
          iconColor: '#f87171', // rojo
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <Spinner size="xl" className="w-16 h-16 text-purple-600 mb-6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{decodeURIComponent(categoria)}</h1>
        <div className="flex space-x-2">
          <Button
            className="flex items-center buttom-custom-yellow font-medium px-4 py-2"
            onClick={() => navigate('/productos-entrenados')}
          >
            <HiArrowLeft className="mr-2 self-center" size={20} />
            Volver
          </Button>
          <Button
            className="boton-azul py-2"
            onClick={() => {
              setSelected(null);
              setShowFormModal(true);
            }}
          >
            + Crear nuevo
          </Button>
        </div>
      </div>

      {productos.length === 0 && (
        <div className="bg-yellow-800/30 text-yellow-400 text-center py-4 mb-6 rounded">
          ⚠️ Aún no hay productos cargados para la categoría{' '}
          <strong className="text-white">{decodeURIComponent(categoria)}</strong>.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((p) => (
          <Card
            key={p._id}
            className="relative cursor-pointer bg-neutral-900 card-productos"
            onClick={() => {
              setSelected(p);
              setViewModal(true);
            }}
          >
            <h2 className="text-xl font-semibold mb-2 text-white">{p.title}</h2>
            <p className="text-gray-400 mb-1 truncate">Precio: ${p.price}</p>
            <p className="text-gray-400 mb-1 truncate">Stock: {p.stock}</p>
            <p className="text-gray-400 truncate">Duración: {p.duration}</p>

            <div className="absolute bottom-2 right-2 flex space-x-2">
              <HiPencil
                className="text-yellow-400 hover:text-yellow-600"
                size={20}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(p);
                  setShowFormModal(true);
                }}
              />
              <HiTrash
                className="text-red-400 hover:text-red-600"
                size={20}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(p);
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de detalle */}
      <Modal show={viewModal} size="6xl" className="bg-black" onClose={() => setViewModal(false)}>
        <div className="p-6 relative bg-neutral-900 text-white rounded-lg w-full max-h-[90vh] overflow-y-auto border border-neutral-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{selected?.title}</h2>
            <HiX
              className="text-red-500 hover:text-red-700 cursor-pointer"
              size={32}
              onClick={() => setViewModal(false)}
            />
          </div>

          {selected?.image && (
            <img
              src={selected.image}
              alt={selected.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          {selected?.description && (
            <p className="text-gray-300 text-base mb-6">{selected.description}</p>
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
              <strong>📍 Ubicación:</strong> {selected?.location || 'No especificada'}
            </div>
            <div className="border-b border-yellow-400 pb-2">
              <strong>📂 Categoría:</strong> {selected?.category}
            </div>
            {selected?.availableDates?.length > 0 && (
              <div className="border-b border-yellow-400 pb-2 col-span-2">
                <strong>📅 Fechas disponibles:</strong>{' '}
                {selected.availableDates.join(', ')}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Modal de creación/edición */}
      <Modal show={showFormModal} size="7xl" className="bg-black" onClose={() => setShowFormModal(false)}>
        <div className="bg-neutral-900 text-white p-6 rounded-lg w-full max-h-[90vh] overflow-y-auto">
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
    </div>
  );
}

export default Productos;
