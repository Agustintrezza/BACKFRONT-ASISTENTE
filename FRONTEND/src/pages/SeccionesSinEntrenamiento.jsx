// ✅ src/pages/SeccionesSinEntrenamiento.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Spinner } from 'flowbite-react';
import axios from 'axios';
import { HiArrowLeft, HiPencil, HiTrash, HiX } from 'react-icons/hi';

function SeccionesSinEntrenamiento() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const entrenadas = [
    'Guía Turístico',
    'Tipo de cambio',
    'Preguntas Frecuentes',
    'Nosotros',
    'Contacto',
  ];

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/secciones');
      const sin = res.data.filter(
        (s) => !entrenadas.some((e) => s.title.includes(e))
      );
      setSections(sin);
    } catch (err) {
      console.error('Error cargando secciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Secciones Sin Entrenamiento</h1>
        <div className="flex space-x-2">
          <Button
            outline
            color="light"
            onClick={() => navigate('/categorias-secciones')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <HiArrowLeft className="mr-2" size={20} /> Volver
          </Button>
        </div>
      </div>

      {sections.length === 0 ? (
        <p>No hay secciones sin entrenamiento.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sections.map((sec) => (
            <Card
              key={sec._id}
              className="relative cursor-pointer shadow-sm hover:shadow-md transition rounded-lg bg-white"
              onClick={() => {
                setSelected(sec);
                setViewModal(true);
              }}
            >
              <h2 className="text-xl font-semibold mb-2">{sec.title}</h2>
              <p className="text-gray-700 mb-1 truncate">{sec.description}</p>
            </Card>
          ))}
        </div>
      )}

      <Modal show={viewModal} size="lg" onClose={() => setViewModal(false)}>
        <div className="p-6 relative">
          <HiX className="absolute top-4 right-4 cursor-pointer" size={24} onClick={() => setViewModal(false)} />
          {selected && (
            <>
              <h2 className="text-2xl font-bold mb-4">{selected.title}</h2>
              <p className="text-gray-700 mb-4">{selected.description}</p>
              {selected.menuItems?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Opciones:</h3>
                  <ul className="list-disc list-inside">
                    {selected.menuItems.map((item, idx) => (
                      <li key={idx}>
                        <strong>{item.title}:</strong> {item.detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4">
                <a href={selected.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Ver enlace
                </a>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default SeccionesSinEntrenamiento;