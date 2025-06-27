import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, Spinner } from 'flowbite-react';
import {
  HiArrowLeft,
  HiCheckCircle,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';
import axios from 'axios';

function CategoriasSecciones() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allSections, setAllSections] = useState([]);

  const entrenadas = [
    'Guía Turístico',
    'Tipo de cambio',
    'Preguntas Frecuentes',
    'Nosotros',
    'Contacto',
  ];

  useEffect(() => {
    async function fetchAllSections() {
      try {
        const res = await axios.get('http://localhost:5000/api/secciones');
        setAllSections(res.data);
      } catch (err) {
        console.error('Error al traer secciones:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllSections();
  }, []);

  const normalize = (text) => (text || '').toLowerCase().trim();

  const countByTitle = (title) =>
    allSections.filter((s) =>
      normalize(s.title).includes(normalize(title))
    ).length;

  const untrainedCount = allSections.filter(
    (s) => !entrenadas.some((ent) =>
      normalize(s.title).includes(normalize(ent))
    )
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Secciones</h1>
        <Button
          outline
          color="light"
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <HiArrowLeft size={20} className="mr-2 self-center" />
          Volver
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Secciones Entrenadas */}
        <div
          className="cursor-pointer bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          onClick={() => navigate('/secciones-entrenadas')}
        >
          <div className="flex items-center mb-4">
            <HiCheckCircle size={32} className="text-green-500 mr-2" />
            <h2 className="text-2xl font-semibold">Secciones Entrenadas</h2>
          </div>
          <p className="mb-4">
            Administrá las secciones que están vinculadas a intents.
          </p>
          <ul className="list-disc list-inside mb-4">
            {entrenadas.map((title) => (
              <li key={title}>
                {title} ({countByTitle(title)})
              </li>
            ))}
          </ul>
          <Button>Ver secciones</Button>
        </div>

        {/* Secciones Sin Entrenamiento */}
        <div
          className="cursor-pointer bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          onClick={() => navigate('/secciones-sin-entrenamiento')}
        >
          <div className="flex items-center mb-4">
            <HiOutlineExclamationCircle
              size={32}
              className="text-orange-500 mr-2"
            />
            <h2 className="text-2xl font-semibold">
              Secciones Sin Entrenamiento
            </h2>
          </div>
          <p className="mb-4">
            Secciones que todavía no están asociadas a intents de Rasa.
          </p>
          <p className="mb-4">Total: {untrainedCount}</p>
          <Button>Administrar</Button>
        </div>
      </div>
    </div>
  );
}

export default CategoriasSecciones;
