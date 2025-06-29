import { useEffect, useState } from 'react';
import { Card, Button, Spinner } from 'flowbite-react';
import { HiArrowLeft, HiPlus } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SeccionModal from '../components/SeccionModal';

const entrenadas = [
  'Guía Turístico',
  'Tipo de Cambio',
  'Preguntas Frecuentes',
  'Nosotros',
  'Contacto'
];

export default function SeccionesSinEntrenamiento() {
  const navigate = useNavigate();
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSeccion, setSelectedSeccion] = useState(null);

  useEffect(() => {
    async function fetchSecciones() {
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
    }
    fetchSecciones();
  }, []);

  const handleSuccess = () => {
    setShowModal(false);
    setSelectedSeccion(null);
    setLoading(true);
    axios.get('http://localhost:5000/api/secciones')
      .then(res => {
        const filtradas = res.data.filter(
          (s) => !entrenadas.includes(s.title.replace(/\s*📚|\s*📘/, '').trim())
        );
        setSecciones(filtradas);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Secciones sin Entrenamiento</h1>
        <div className="flex gap-2">
          <Button outline onClick={() => navigate('/categorias-secciones')} className="flex items-center text-blue-600 hover:text-blue-800">
            <HiArrowLeft size={20} className="mr-2 self-center" /> Volver
          </Button>
          <Button color="green" onClick={() => setShowModal(true)} className="flex items-center">
            <HiPlus className="mr-2" /> Nueva Sección
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[200px] flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      ) : secciones.length === 0 ? (
        <p className="text-gray-500">No hay secciones sin entrenamiento por el momento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {secciones.map((s) => (
            <Card
              key={s._id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => {
                setSelectedSeccion(s);
                setShowModal(true);
              }}
            >
              <h2 className="text-xl font-semibold">{s.title}</h2>
              <p>{s.menuItems?.length || 0} ítems</p>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full">
            <SeccionModal
              seccion={selectedSeccion}
              onClose={() => {
                setShowModal(false);
                setSelectedSeccion(null);
              }}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
