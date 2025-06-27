import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Modal, Spinner } from 'flowbite-react';
import axios from 'axios';
import { HiArrowLeft, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import SeccionModal from '../components/SeccionModal';

function Secciones() {
  const { categoria } = useParams();
  const navigate = useNavigate();

  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  // 🔧 Función para limpiar texto de emojis, acentos y caracteres especiales
  const clean = (str) =>
    (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Elimina tildes
      .replace(/[^\w\s]/gi, '')        // Elimina emojis y símbolos
      .toLowerCase()
      .trim();

  const fetchSecciones = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/secciones');
      const filtro = res.data.filter((s) =>
        clean(s.title) === clean(decodeURIComponent(categoria))
      );
      setSecciones(filtro);
    } catch (err) {
      console.error('Error cargando secciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecciones();
  }, [categoria]);

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
        <h1 className="text-3xl font-bold">{decodeURIComponent(categoria)}</h1>
        <div className="flex space-x-2">
          <Button
            outline
            color="light"
            onClick={() => navigate('/secciones-entrenadas')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <HiArrowLeft className="mr-2" size={20} /> Volver
          </Button>
          <Button
            gradientDuoTone="greenToBlue"
            onClick={() => {
              setEditingSection(null);
              setShowFormModal(true);
            }}
          >
            + Crear nuevo
          </Button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {secciones.map((s) => (
          <Card
            key={s._id}
            className="relative cursor-pointer shadow-sm hover:shadow-md transition rounded-lg bg-white"
            onClick={() => {
              setSelected(s);
              setViewModal(true);
            }}
          >
            <h2 className="text-xl font-semibold mb-2">{s.title}</h2>
            <p className="text-gray-700 mb-1 truncate">{s.description}</p>

            <div className="absolute bottom-2 right-2 flex space-x-2">
              <HiPencil
                className="text-yellow-500 hover:text-yellow-700"
                size={20}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingSection(s);
                  setShowFormModal(true);
                }}
              />
              <HiTrash
                className="text-red-500 hover:text-red-700"
                size={20}
                onClick={async (e) => {
                  e.stopPropagation();
                  if (confirm('¿Eliminar esta sección?')) {
                    try {
                      await axios.delete(`http://localhost:5000/api/secciones/${s._id}`);
                      fetchSecciones();
                    } catch (err) {
                      console.error('Error eliminando:', err);
                      alert('No se pudo eliminar.');
                    }
                  }
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de detalle */}
      <Modal show={viewModal} size="lg" onClose={() => setViewModal(false)}>
        <div className="p-6 relative">
          <HiX
            className="absolute top-4 right-4 cursor-pointer"
            size={24}
            onClick={() => setViewModal(false)}
          />
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
                        <strong>{item.title}:</strong> {item.detail}{' '}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-1"
                          >
                            (enlace)
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selected.link && (
                <div className="mt-4">
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver enlace
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>

      {/* Modal de creación / edición */}
      <Modal show={showFormModal} size="lg" onClose={() => setShowFormModal(false)}>
        <SeccionModal
          seccion={editingSection}
          onClose={() => setShowFormModal(false)}
          onSuccess={() => {
            setShowFormModal(false);
            fetchSecciones();
          }}
        />
      </Modal>
    </div>
  );
}

export default Secciones;
