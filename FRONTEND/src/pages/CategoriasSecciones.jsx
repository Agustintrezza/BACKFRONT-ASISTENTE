// src/pages/CategoriasSecciones.jsx
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <Spinner size="xl" className="w-16 h-16 text-purple-600 mb-6"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Secciones</h1>
        <Button
          onClick={() => navigate('/dashboard')}
          className="flex items-center font-medium px-4 py-2 buttom-custom-yellow"
        >
          <HiArrowLeft size={20} className="mr-2 self-center" />
          Volver
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Secciones Entrenadas */}
        <div
          className="cursor-pointer p-6 rounded-lg shadow hover:shadow-lg transition bg-neutral-900 card-custom"
          onClick={() => navigate('/secciones-entrenadas')}
        >
          <div className="flex items-center mb-4">
            <HiCheckCircle size={32} className="text-green-500 mr-2" />
            <h2 className="text-2xl font-semibold">Secciones Entrenadas</h2>
          </div>
          <p className="mb-4">
            Administrá las secciones que están vinculadas a intents.
          </p>
          <ul className="list-disc list-inside mb-4 text-gray-300">
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
          className="cursor-pointer p-6 rounded-lg shadow hover:shadow-lg transition bg-neutral-900 card-custom"
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
