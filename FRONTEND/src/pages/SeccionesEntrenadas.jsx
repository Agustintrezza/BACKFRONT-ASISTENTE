import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, Button, Spinner } from 'flowbite-react';
import axios from 'axios';
import { HiArrowLeft, HiCheckCircle } from 'react-icons/hi';

const entrenadas = [
  'Guía Turístico',
  'Tipo de cambio',
  'Preguntas Frecuentes',
  'Nosotros',
  'Contacto',
];

function SeccionesEntrenadas() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const { data } = await axios.get('http://localhost:5000/api/secciones');

        // Normalizamos ambos lados para comparar correctamente
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
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="xl" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Secciones Entrenadas</h1>
        <Button outline onClick={() => navigate('/categorias-secciones')} className="flex items-center text-blue-600 hover:text-blue-800">
          <HiArrowLeft size={20} className="mr-2 self-center" /> Volver
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {entrenadas.map((t) => (
          <Card key={t} className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate(`/secciones/${encodeURIComponent(t)}`)}>
            <div className="flex items-center mb-4">
              <HiCheckCircle size={32} className="text-green-500 mr-2" />
              <h2 className="text-xl font-semibold">{t}</h2>
            </div>
            <p>Total registros: {counts[t] || 0}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SeccionesEntrenadas;
