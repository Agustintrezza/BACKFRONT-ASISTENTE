import { useEffect, useState } from 'react';
import { Card, Button, Spinner } from 'flowbite-react';
import { HiArrowLeft, HiPlus, HiTrash, HiPencil } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SeccionModal from '../components/SeccionModal';
import { Modal } from 'flowbite-react';

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
            onClick={() => openModal()}
          >
            <HiPlus className="mr-2" />
            Nueva Sección
          </Button>
        </div>
      </div>

      {/* Contenido principal */}
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
              className="relative bg-neutral-900 text-white card-productos"
            >
              <h2 className="text-xl font-semibold mb-2">{s.title}</h2>
              <p className="text-gray-400">{s.menuItems?.length || 0} ítems</p>
              <div className="absolute top-2 right-2 flex gap-2">
                <HiPencil
                  className="text-yellow-400 hover:text-yellow-600 cursor-pointer"
                  size={20}
                  onClick={() => openModal(s)}
                />
                <HiTrash
                  className="text-red-400 hover:text-red-600 cursor-pointer"
                  size={20}
                  onClick={async () => {
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

      {/* Modal de creación/edición */}
      <Modal show={showFormModal} size="6xl" onClose={() => setShowFormModal(false)}>
        <div className="bg-black text-white p-6 rounded-lg w-full max-h-[90vh] overflow-y-auto">
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
