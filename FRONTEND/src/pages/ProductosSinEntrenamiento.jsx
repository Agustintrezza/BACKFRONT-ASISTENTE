import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Spinner } from 'flowbite-react';
import axios from 'axios';
import { HiArrowLeft, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import ProductoModal from '../components/ProductoModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function ProductosSinEntrenamiento() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selected, setSelected] = useState(null);

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
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <Spinner size="xl" className="w-16 h-16 text-purple-600 mb-6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Productos Sin Entrenamiento</h1>
        <div className="flex space-x-2">
          <Button
            className="boton-azul py-2"
            onClick={() => {
              setSelected(null);
              setShowFormModal(true);
            }}
          >
            + Crear nuevo
          </Button>
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center buttom-custom-yellow font-medium px-4 py-2"
          >
            <HiArrowLeft className="mr-2 self-center" size={20} />
            Volver
          </Button>
        </div>
      </div>

      {productos.length === 0 ? (
        <p className="text-gray-400">No hay productos sin entrenamiento.</p>
      ) : (
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
              <p className="text-gray-400 mb-1">Precio: ${p.price}</p>
              <p className="text-gray-400 mb-1">Stock: {p.stock}</p>
              <p className="text-gray-400">Duración: {p.duration}</p>

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
      )}

      {/* Modal detalle */}
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

      {/* Modal creación / edición */}
      <Modal show={showFormModal} size="6xl" onClose={() => setShowFormModal(false)}>
        <div className="bg-black text-white p-6 rounded-lg w-full max-h-[90vh] overflow-y-auto">
          <ProductoModal
            producto={selected}
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

export default ProductosSinEntrenamiento;
