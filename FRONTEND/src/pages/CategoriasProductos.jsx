import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, Spinner } from 'flowbite-react';
import axios from 'axios';
import { HiArrowLeft } from 'react-icons/hi';

function CategoriasProductos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const entrenadas = [
    'Tours y Excursiones',
    'Alojamiento',
    'Shows de Tango',
    'Programas',
    'Traslados',
  ];

  useEffect(() => {
    async function fetchAllProducts() {
      try {
        const res = await axios.get('http://localhost:5000/api/productos');
        setAllProducts(res.data);
      } catch (err) {
        console.error('Error al traer productos:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllProducts();
  }, []);

  const countByCategory = (cat) =>
    allProducts.filter((p) => p.category === cat).length;

  const untrainedCount = allProducts.filter(
    (p) => !entrenadas.includes(p.category)
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" className="w-16 h-16 text-purple-600 mb-6"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Titular y botón Volver */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        <Button
          onClick={() => navigate('/dashboard')}
          className="flex items-center font-medium px-4 py-2 buttom-custom-yellow"
        >
          <HiArrowLeft size={20} className="mr-2 self-center" />
          Volver
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Productos Entrenados */}
        <div
          className="cursor-pointer p-6 rounded-lg shadow hover:shadow-lg transition bg-neutral-900 card-custom"
          onClick={() => navigate('/productos-entrenados')}
        >
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-2">✅</span>
            <h2 className="text-2xl font-semibold">Productos Entrenados</h2>
          </div>
          <p className="mb-4">
            Aquí administrás los productos correspondientes a las categorías entrenadas.
          </p>
          <ul className="list-disc list-inside mb-4">
            {entrenadas.map((cat) => (
              <li key={cat}>
                {cat} (<span className="text-blue-500">{countByCategory(cat)}</span>)
              </li>
            ))}
          </ul>
          <Button>Ver categorías</Button>
        </div>

        {/* Productos Sin Entrenamiento */}
        <div
          className="cursor-pointer p-6 rounded-lg shadow hover:shadow-lg transition bg-neutral-900 card-custom"
          onClick={() => navigate('/productos-sin-entrenamiento')}
        >
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-2">⚠️</span>
            <h2 className="text-2xl font-semibold">Productos Sin Entrenamiento</h2>
          </div>
          <p className="mb-4">
            Aquellos productos no asociados a intents específicos.
          </p>
          <p className="mb-4">
            Total: <span className="text-red-400 font-semibold">{untrainedCount}</span>
          </p>
          <Button>Administrar</Button>
        </div>
      </div>
    </div>
  );
}

export default CategoriasProductos;
