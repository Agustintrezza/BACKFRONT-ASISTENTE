import { useEffect, useState } from 'react';
import { Card, Button, Spinner, Modal } from 'flowbite-react';
import { HiArrowLeft, HiPlus, HiTrash, HiPencil, HiX } from 'react-icons/hi';
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
  const [showFormModal, setShowFormModal] = useState(false);
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

  const openModal = (seccion = null) => {
    setSelectedSeccion(seccion);
    setShowFormModal(true);
  };

  return (
    <div className="min-h-screen p-8 bg-black text-white">
      {/* Encabezado */}
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
            onClick={() => openModal()}
          >
            <HiPlus className="mr-2" />
            Nueva Sección
          </Button>
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="min-h-[200px] flex justify-center items-center">
          <Spinner size="xl" className="w-16 h-16 text-purple-600" />
        </div>
      ) : secciones.length === 0 ? (
        <p className="text-gray-400">No hay secciones sin entrenamiento por el momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {secciones.map((s) => (
            <Card
              key={s._id}
              className="relative bg-neutral-900 text-white card-productos cursor-pointer"
              onClick={() => {
                setSelectedSeccion(s);
                setViewModal(true);
              }}
            >
              <h2 className="text-xl font-semibold mb-2">{s.title}</h2>
              <p className="text-gray-400">{s.menuItems?.length || 0} ítems</p>
              <div className="absolute top-2 right-2 flex gap-2 z-10">
                <HiPencil
                  className="text-yellow-400 hover:text-yellow-600 cursor-pointer"
                  size={20}
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(s);
                  }}
                />
                <HiTrash
                  className="text-red-400 hover:text-red-600 cursor-pointer"
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

      {/* Modal de detalle */}
      <Modal show={viewModal} size="2xl" className="bg-black" onClose={() => setViewModal(false)}>
        <div className="p-6 relative bg-neutral-900 text-white rounded-lg w-full max-h-[90vh] overflow-y-auto border border-neutral-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{selectedSeccion?.title}</h2>
            <HiX
              className="text-red-500 hover:text-red-700 cursor-pointer"
              size={32}
              onClick={() => setViewModal(false)}
            />
          </div>

          {selectedSeccion?.description && (
            <p className="text-gray-300 text-base mb-6">{selectedSeccion.description}</p>
          )}

          {selectedSeccion?.menuItems?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Opciones:</h3>
              <ul className="list-disc list-inside space-y-1">
                {selectedSeccion.menuItems.map((item, idx) => (
                  <li key={idx} className="text-gray-300">
                    <strong className="text-white">{item.title}:</strong> {item.detail}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline ml-1"
                      >
                        (enlace)
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedSeccion?.link && (
            <div className="mt-4">
              <a
                href={selectedSeccion.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Ver enlace
              </a>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de creación/edición */}
      <Modal className='bg-black'  show={showFormModal} size="6xl" onClose={() => setShowFormModal(false)}>
        <div className="bg-neutral-900 text-white p-6 rounded-lg w-full max-h-[90vh] overflow-y-auto">
          <SeccionModal
            seccion={selectedSeccion}
            onClose={() => setShowFormModal(false)}
            onSuccess={() => {
              setShowFormModal(false);
              fetchSecciones();
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
