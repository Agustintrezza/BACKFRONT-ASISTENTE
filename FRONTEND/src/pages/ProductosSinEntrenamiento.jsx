// src/pages/ProductosSinEntrenamiento.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Spinner } from 'flowbite-react';
import axios from 'axios';
import { HiArrowLeft, HiPencil, HiTrash, HiX } from 'react-icons/hi';

function ProductosSinEntrenamiento() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/productos');
      // Filtramos sólo los que NO pertenecen a categorías entrenadas
      const entrenadas = ['Tours y Excursiones', 'Alojamiento', 'Shows de Tango', 'Programas', 'Traslados'];
      const sin = res.data.filter(p => !entrenadas.includes(p.category));
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Encabezado superior: título + botones */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Productos Sin Entrenamiento</h1>
        <div className="flex space-x-2">
          <Button
            outline
            color="light"
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <HiArrowLeft className="mr-2" size={20} />
            Volver
          </Button>
          <Button
            gradientDuoTone="greenToBlue"
            onClick={() => navigate('/productos-sin-entrenamiento/nuevo')}
          >
            + Crear nuevo
          </Button>
        </div>
      </div>

      {/* Grid de productos sin entrenamiento */}
      {productos.length === 0 ? (
        <p>No hay productos sin entrenamiento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map(p => (
            <Card
              key={p._id}
              className="relative cursor-pointer shadow-sm hover:shadow-md transition rounded-lg bg-white"
              onClick={() => {
                setSelected(p);
                setViewModal(true);
              }}
            >
              <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
              <p className="text-gray-700 mb-1">Precio: ${p.price}</p>
              <p className="text-gray-700 mb-1">Stock: {p.stock}</p>
              <p className="text-gray-700">Duración: {p.duration}</p>

              {/* Iconos editar / eliminar */}
              <div className="absolute bottom-2 right-2 flex space-x-2">
                <HiPencil
                  className="text-yellow-500 hover:text-yellow-700"
                  size={20}
                  onClick={e => {
                    e.stopPropagation();
                    navigate(`/productos-sin-entrenamiento/${p._id}/editar`);
                  }}
                />
                <HiTrash
                  className="text-red-500 hover:text-red-700"
                  size={20}
                  onClick={async e => {
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
      )}

      {/* Modal para ver detalle */}
      <Modal show={viewModal} size="lg" onClose={() => setViewModal(false)}>
        <div className="p-6 relative">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Precio:</strong> ${selected.price}
                </div>
                <div>
                  <strong>Stock:</strong> {selected.stock}
                </div>
                <div>
                  <strong>Duración:</strong> {selected.duration}
                </div>
                <div>
                  <strong>Categoría:</strong> {selected.category}
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default ProductosSinEntrenamiento;
