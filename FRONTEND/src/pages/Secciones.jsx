import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Modal, Spinner } from 'flowbite-react';
import axios from 'axios';
import { HiArrowLeft, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import SeccionModal from '../components/SeccionModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Secciones() {
  const { categoria } = useParams();
  const navigate = useNavigate();

  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const clean = (str) =>
    (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, '')
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

  const handleDelete = async (seccion) => {
    const confirm = await MySwal.fire({
      title: `¿Eliminar esta sección?`,
      text: `"${seccion.title}" será eliminada permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#171717',
      color: '#f3f4f6',
      iconColor: '#facc15',
      customClass: {
        popup: 'rounded-lg',
        title: 'text-lg font-semibold',
        confirmButton: 'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700',
        cancelButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-gray-700'
      }
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/secciones/${seccion._id}`);
        fetchSecciones();
        MySwal.fire({
          title: 'Eliminado',
          text: `"${seccion.title}" fue eliminado correctamente.`,
          icon: 'success',
          background: '#171717',
          color: '#f3f4f6',
          iconColor: '#4ade80',
          confirmButtonColor: '#3b82f6'
        });
      } catch (err) {
        console.error('Error eliminando:', err);
        MySwal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la sección.',
          icon: 'error',
          background: '#111827',
          color: '#f3f4f6',
          iconColor: '#f87171',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <Spinner size="xl" className="w-16 h-16 text-purple-600 mb-6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{decodeURIComponent(categoria)}</h1>
        <div className="flex space-x-2">
          <Button
            className="flex items-center buttom-custom-yellow font-medium px-4 py-2"
            onClick={() => navigate('/secciones-entrenadas')}
          >
            <HiArrowLeft className="mr-2 self-center" size={20} />
            Volver
          </Button>
          <Button
            className="boton-azul py-2"
            onClick={() => {
              setEditingSection(null);
              setShowFormModal(true);
            }}
          >
            + Crear nuevo
          </Button>
        </div>
      </div>

      {secciones.length === 0 && (
        <div className="bg-yellow-800/30 text-yellow-400 text-center py-4 mb-6 rounded">
          ⚠️ Aún no hay ninguna sección cargada para la categoría <strong className="text-white">{decodeURIComponent(categoria)}</strong>.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {secciones.map((s) => (
          <Card
            key={s._id}
            className="relative cursor-pointer bg-neutral-900 card-productos"
            onClick={() => {
              setSelected(s);
              setViewModal(true);
            }}
          >
            <h2 className="text-xl font-semibold mb-2 text-white">{s.title}</h2>
            <p className="text-gray-400 mb-1 truncate">{s.description}</p>

            <div className="absolute bottom-2 right-2 flex space-x-2">
              <HiPencil
                className="text-yellow-400 hover:text-yellow-600"
                size={20}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingSection(s);
                  setShowFormModal(true);
                }}
              />
              <HiTrash
                className="text-red-400 hover:text-red-600"
                size={20}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(s);
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de detalle */}
      <Modal show={viewModal} size="2xl" className="bg-black" onClose={() => setViewModal(false)}>
        <div className="p-6 relative bg-neutral-900 text-white rounded-lg w-full max-h-[90vh] overflow-y-auto border border-neutral-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{selected?.title}</h2>
            <HiX
              className="text-red-500 hover:text-red-700 cursor-pointer"
              size={32}
              onClick={() => setViewModal(false)}
            />
          </div>

          {selected?.description && (
            <p className="text-gray-300 text-base mb-6">{selected.description}</p>
          )}

          {selected?.menuItems?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Opciones:</h3>
              <ul className="list-disc list-inside space-y-1">
                {selected.menuItems.map((item, idx) => (
                  <li key={idx} className="text-gray-300">
                    <strong className="text-white">{item.title}:</strong> {item.detail}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline ml-1"
                      >
                        (enlace)
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selected?.link && (
            <div className="mt-4">
              <a
                href={selected.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Ver enlace
              </a>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de creación / edición */}
      <Modal show={showFormModal} size="7xl" className="bg-black" onClose={() => setShowFormModal(false)}>
        <div className="bg-neutral-900 text-white p-6 rounded-lg w-full max-h-[90vh] overflow-y-auto">
          <SeccionModal
            seccion={editingSection}
            category={decodeURIComponent(categoria)}
            onClose={() => setShowFormModal(false)}
            onSuccess={() => {
              setShowFormModal(false);
              fetchSecciones();
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default Secciones;
