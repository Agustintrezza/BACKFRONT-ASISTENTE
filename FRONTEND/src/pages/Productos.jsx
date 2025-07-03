// src/pages/Productos.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Modal, Spinner } from 'flowbite-react';
import axios from 'axios';
import { HiArrowLeft, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import ProductoModal from '../components/ProductoModal';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" className="w-16 h-16 text-purple-600 mb-6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{decodeURIComponent(categoria)}</h1>
        <div className="flex space-x-2">
          <Button className="boton-azul py-2" onClick={() => {
            setSelected(null);
            setShowFormModal(true);
          }}>
            + Crear nuevo
          </Button>
          <Button
            onClick={() => navigate('/productos-entrenados')}
            className="flex items-center buttom-custom-yellow font-medium px-4 py-2"
          >
            <HiArrowLeft className="mr-2 self-center" size={20} />
            Volver
          </Button>
        </div>
      </div>

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
                onClick={async (e) => {
                  e.stopPropagation();
                  if (confirm('¿Eliminar este producto?')) {
                    try {
                      await axios.delete(`http://localhost:5000/api/productos/${p._id}`);
                      fetchProductos();
                    } catch (err) {
                      console.error('Error eliminando:', err);
                      alert('No se pudo eliminar.');
                    }
                  }
                }}
              />
            </div>
          </Card>
        ))}
      </div>

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

      <Modal show={showFormModal} size="6xl" onClose={() => setShowFormModal(false)}>
        <div className="bg-black text-white p-6 rounded-lg w-full max-h-[90vh] overflow-y-auto">
          <ProductoModal
            producto={selected}
            category={categoria}
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
