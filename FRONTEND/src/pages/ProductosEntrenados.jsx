import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Spinner } from 'flowbite-react';
import { HiArrowLeft } from 'react-icons/hi';
import axios from 'axios';

const entrenadas = [
  'Tours y Excursiones',
  'Alojamiento',
  'Shows de Tango',
  'Programas',
  'Traslados'
];

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
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* 📌 Título y botón en el mismo renglón, extremos opuestos */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Productos Entrenados</h1>
        <Button
          outline
          color="light"
          onClick={() => navigate('/productos')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <HiArrowLeft size={20} className="mr-2 self-center" />
          Volver
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {entrenadas.map(cat => (
          <Card
            key={cat}
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/productos/${encodeURIComponent(cat)}`)}
          >
            <h2 className="text-xl font-semibold">{cat}</h2>
            <p className="mt-2 mb-4 text-gray-600">
              Total de productos: {counts[cat] || 0}
            </p>
            <div className="flex justify-between">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/productos/${encodeURIComponent(cat)}`);
                }}
              >
                Ver productos
              </Button>
              <Button
                size="sm"
                gradientDuoTone="greenToBlue"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/productos/${encodeURIComponent(cat)}/nuevo`);
                }}
              >
                + Crear
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ProductosEntrenados;
