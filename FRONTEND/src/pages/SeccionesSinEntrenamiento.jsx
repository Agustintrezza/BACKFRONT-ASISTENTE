import { useEffect, useState } from 'react';
import { Card, Button, Modal, Spinner } from 'flowbite-react';
import { HiArrowLeft, HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SeccionModal from '../components/SeccionModal';

const entrenadas = [
  'Guía Turístico',
  'Tipo de Cambio',
  'Preguntas Frecuentes',
  'Nosotros',
  'Contacto',
];

export default function SeccionesSinEntrenamiento() {
  const navigate = useNavigate();
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSeccion, setSelectedSeccion] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  const fetchSecciones = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/secciones');
      const filtradas = data.filter(
        (s) => !entrenadas.includes(s.title.replace(/\s*📚|\s*📘/, '').trim())
      );
      setSecciones(filtradas);
    } catch (err) {
      console.error('Error al traer secciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecciones();
  }, []);

  const handleSuccess = () => {
    setShowModal(false);
    setSelectedSeccion(null);
    fetchSecciones();
  };

  return (
    <div className="min-h-screen p-8 bg-black text-white">
      {/* Encabezado superior */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Secciones Sin Entrenamiento</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate('/categorias-secciones')}
            className="flex items-center buttom-custom-yellow font-medium px-4 py-2"
          >
            <HiArrowLeft size={20} className="mr-2 self-center" />
            Volver
          </Button>
          <Button
  className="boton-azul flex items-center"
  onClick={() => setShowModal(true)}
>
  <HiPlus className="mr-2" />
  Nueva Sección
</Button>
        </div>
      </div>

      {/* Contenido principal */}
      {loading ? (
        <div className="min-h-[200px] flex justify-center items-center">
          <Spinner size="xl" className="w-16 h-16 text-purple-600"/>
        </div>
      ) : secciones.length === 0 ? (
        <p className="text-gray-400">No hay secciones sin entrenamiento por el momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {secciones.map((s) => (
            <Card
              key={s._id}
              className="relative cursor-pointer bg-neutral-900 text-white card-productos"
              onClick={() => {
                setSelectedSeccion(s);
                setViewModal(true);
              }}
            >
              <h2 className="text-xl font-semibold mb-2">{s.title}</h2>
              <p className="text-gray-400">{s.menuItems?.length || 0} ítems</p>

              {/* Iconos editar / eliminar */}
              <div className="absolute bottom-2 right-2 flex space-x-2">
                <HiPencil
                  className="text-yellow-400 hover:text-yellow-600"
                  size={20}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSeccion(s);
                    setShowModal(true);
                  }}
                />
                <HiTrash
                  className="text-red-400 hover:text-red-600"
                  size={20}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (confirm('¿Eliminar esta sección?')) {
                      try {
                        await axios.delete(`http://localhost:5000/api/secciones/${s._id}`);
                        fetchSecciones();
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

      {/* Modal de creación / edición */}
      <Modal show={showModal} size="lg" onClose={() => setShowModal(false)}>
        <div className="bg-white p-6 rounded-lg">
          <SeccionModal
            seccion={selectedSeccion}
            onClose={() => {
              setShowModal(false);
              setSelectedSeccion(null);
            }}
            onSuccess={handleSuccess}
          />
        </div>
      </Modal>

      {/* Modal de vista rápida */}
      <Modal show={viewModal} size="lg" onClose={() => setViewModal(false)}>
        <div className="p-6 relative bg-white rounded-lg text-black">
          <HiX
            className="absolute top-4 right-4 cursor-pointer"
            size={24}
            onClick={() => setViewModal(false)}
          />
          {selectedSeccion && (
            <>
              <h2 className="text-2xl font-bold mb-4">{selectedSeccion.title}</h2>
              <p className="text-gray-700 mb-4">{selectedSeccion.description}</p>
              {selectedSeccion.menuItems?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Opciones:</h3>
                  <ul className="list-disc list-inside">
                    {selectedSeccion.menuItems.map((item, idx) => (
                      <li key={idx}>
                        <strong>{item.title}:</strong> {item.detail}{' '}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-1"
                          >
                            (enlace)
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedSeccion.link && (
                <div className="mt-4">
                  <a
                    href={selectedSeccion.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver enlace
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
