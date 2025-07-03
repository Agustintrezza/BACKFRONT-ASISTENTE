import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button, Spinner } from 'flowbite-react';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [allSections, setAllSections] = useState([]);

  const productosEntrenadas = [
    'Tours y Excursiones',
    'Alojamiento',
    'Shows de Tango',
    'Programas',
    'Traslados',
  ];

  const seccionesEntrenadas = [
    'Guía Turístico',
    'Tipo de cambio',
    'Preguntas Frecuentes',
    'Nosotros',
    'Contacto',
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const resProd = await axios.get('http://localhost:5000/api/productos');
        const resSec = await axios.get('http://localhost:5000/api/secciones');
        setAllProducts(resProd.data);
        setAllSections(resSec.data);
      } catch (err) {
        console.error('Error al traer datos:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const countProductosByCategory = (cat) =>
    allProducts.filter((p) => p.category === cat).length;

  const countSeccionesByTitle = (title) =>
    allSections.filter((s) =>
      (s.title || '').toLowerCase().trim().includes(title.toLowerCase().trim())
    ).length;

  const productosSinEntrenar = allProducts.filter(
    (p) => !productosEntrenadas.includes(p.category)
  ).length;

  const seccionesSinEntrenar = allSections.filter(
    (s) =>
      !seccionesEntrenadas.some((ent) =>
        (s.title || '').toLowerCase().includes(ent.toLowerCase())
      )
  ).length;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {loading ? (
        <div className="min-h-[300px] flex justify-center items-center">
          <Spinner size="xl" className="w-16 h-16 text-purple-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD PRODUCTOS */}
          <div className="card-custom p-6 bg-neutral-900 rounded-lg h-auto">
            <h2 className="text-2xl font-bold mb-2 flex justify-between items-center">
              Productos
              <span className="text-3xl ml-2">📦</span>
            </h2>
            <p className="text-gray-300 mb-4">Gestioná tus productos según su entrenamiento.</p>

            <div
              onClick={() => navigate('/productos-entrenados')}
              className="cursor-pointer bg-neutral-800 p-4 rounded-md mb-4 transition transform hover:scale-[1.02] hover:shadow-md hover:shadow-gray-500/30"
            >
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                ✅ Productos Entrenados
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {productosEntrenadas.map((cat) => (
                  <li key={cat}>
                    {cat} (<span className="text-blue-400 font-bold">{countProductosByCategory(cat)}</span>)
                  </li>
                ))}
              </ul>
            </div>

            <div
              onClick={() => navigate('/productos-sin-entrenamiento')}
              className="cursor-pointer bg-neutral-800 p-4 rounded-md transition transform hover:scale-[1.02] hover:shadow-md hover:shadow-gray-500/30"
            >
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                ⚙️ Productos Sin Entrenamiento
              </h3>
              <p className="text-sm text-gray-300">
                Total: <span className="text-red-400 font-bold">{productosSinEntrenar}</span>
              </p>
            </div>
          </div>

          {/* CARD RESERVAS */}
          <div
            onClick={() => navigate('/reservas')}
            className="cursor-pointer card-custom p-6 bg-neutral-900 rounded-lg h-auto transition"
          >
            <h2 className="text-2xl font-bold mb-2 flex justify-between items-center">
              Reservas
              <span className="text-3xl ml-2">📅</span>
            </h2>
            <p className="text-gray-300">Administra las reservas</p>
          </div>

          {/* CARD SECCIONES */}
          <div className="card-custom p-6 bg-neutral-900 rounded-lg h-auto transition">
            <h2 className="text-2xl font-bold mb-2 flex justify-between items-center">
              Secciones
              <span className="text-3xl ml-2">🧩</span>
            </h2>
            <p className="text-gray-300 mb-4">Gestioná las secciones entrenadas o libres.</p>

            <div
              onClick={() => navigate('/secciones-entrenadas')}
              className="cursor-pointer card-shadow bg-neutral-800 p-4 rounded-md mb-4 transition transform hover:scale-[1.02] hover:shadow-md hover:shadow-gray-500/30"
            >
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                ✅ Secciones Entrenadas
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {seccionesEntrenadas.map((sec) => (
                  <li key={sec}>
                    {sec} (<span className="text-blue-400 font-bold">{countSeccionesByTitle(sec)}</span>)
                  </li>
                ))}
              </ul>
            </div>

            <div
              onClick={() => navigate('/secciones-sin-entrenamiento')}
              className="cursor-pointer bg-neutral-800 p-4 rounded-md transition transform hover:scale-[1.02] hover:shadow-md hover:shadow-gray-500/30"
            >
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                🧪 Secciones Sin Entrenamiento
              </h3>
              <p className="text-sm text-gray-300">
                Total: <span className="text-red-400 font-bold">{seccionesSinEntrenar}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
