// src/pages/SeccionesEntrenadas.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, Button, Spinner } from 'flowbite-react';
import axios from 'axios';
import { HiArrowLeft } from 'react-icons/hi';

// Categorías entrenadas
const entrenadas = [
  'Guía Turístico',
  'Tipo de cambio',
  'Preguntas Frecuentes',
  'Nosotros',
  'Contacto',
];

// Emojis asociados
const emojis = {
  'Guía Turístico': '🧭',
  'Tipo de cambio': '💱',
  'Preguntas Frecuentes': '📚',
  'Nosotros': '🧑‍🤝‍🧑',
  'Contacto': '📞',
};

function SeccionesEntrenadas() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const { data } = await axios.get('http://localhost:5000/api/secciones');
        const cnt = {};
        entrenadas.forEach((t) => (cnt[t] = 0));

        data.forEach((s) => {
          const normalizedTitle = s.title?.toLowerCase().replace(/[📚]/gu, '').trim();
          const match = entrenadas.find(
            (t) => t.toLowerCase().trim() === normalizedTitle
          );
          if (match) cnt[match]++;
        });

        setCounts(cnt);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

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
        <h1 className="text-3xl font-bold">Secciones Entrenadas</h1>
        <Button
          onClick={() => navigate('/categorias-secciones')}
          className="flex items-center font-medium px-4 py-2 buttom-custom-yellow"
        >
          <HiArrowLeft size={20} className="mr-2 self-center" />
          Volver
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {entrenadas.map((t) => (
          <Card
            key={t}
            className="cursor-pointer bg-neutral-900 card-productos"
            onClick={() => navigate(`/secciones/${encodeURIComponent(t)}`)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{t}</h2>
              <span className="text-4xl">{emojis[t]}</span>
            </div>
            <p className="mt-2 mb-4 text-gray-400">
              Total de registros: <span className="text-blue-500">{counts[t] || 0}</span>
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SeccionesEntrenadas;
