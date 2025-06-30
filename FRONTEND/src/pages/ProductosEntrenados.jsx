import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Spinner } from 'flowbite-react';
import { HiArrowLeft } from 'react-icons/hi';
import axios from 'axios';

// Categorías entrenadas
const entrenadas = [
  'Tours y Excursiones',
  'Alojamiento',
  'Shows de Tango',
  'Programas',
  'Traslados'
];

// Emojis por categoría
const emojis = {
  'Tours y Excursiones': '🗺️',
  'Alojamiento': '🏨',
  'Shows de Tango': '💃',
  'Programas': '📝',
  'Traslados': '🚐',
};

function ProductosEntrenados() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const { data } = await axios.get('http://localhost:5000/api/productos');
        const cnt = {};
        entrenadas.forEach(cat => (cnt[cat] = 0));
        data.forEach(p => {
          if (entrenadas.includes(p.category)) {
            cnt[p.category]++;
          }
        });
        setCounts(cnt);
      } catch (e) {
        console.error('Error fetching products:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" className="w-16 h-16 mb-6 text-purple-600"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Título y botón */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Productos Entrenados</h1>
        <Button
          onClick={() => navigate('/productos')}
          className="flex items-center buttom-custom-yellow font-medium px-4 py-2"
        >
          <HiArrowLeft size={20} className="mr-2 self-center" />
          Volver
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {entrenadas.map(cat => (
          <Card
            key={cat}
            className="cursor-pointer bg-neutral-900 card-productos"
            onClick={() => navigate(`/productos/${encodeURIComponent(cat)}`)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{cat}</h2>
              <span className="text-4xl">{emojis[cat]}</span>
            </div>
            <p className="mt-2 mb-4 text-gray-400">
              Total de productos: <span className="text-blue-500">{counts[cat] || 0}</span>
            </p>
            <div className="flex justify-between">
              {/* Botones opcionales */}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ProductosEntrenados;
