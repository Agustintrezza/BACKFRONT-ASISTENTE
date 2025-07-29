import { useState, useEffect } from 'react';
import axios from 'axios';
import { Label, Button } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import Swal from 'sweetalert2';
import InputWithEmoji from './InputWithEmoji';
import TextareaWithEditor from './TextAreaWithEditor';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function SeccionEntrenadaModal({ seccion, onClose, onSuccess }) {
  const [sectionTitle, setSectionTitle] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const [detail, setDetail] = useState('');

  useEffect(() => {
    if (seccion) {
      setSectionTitle(seccion.title || '');
      setItemTitle(seccion.menuItems?.[0]?.title || '');
      setDetail(seccion.menuItems?.[0]?.detail || '');
    } else {
      setSectionTitle('');
      setItemTitle('');
      setDetail('');
    }
  }, [seccion]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemTitle.trim() || !detail.trim()) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Debés completar el título del ítem y el contenido.',
        confirmButtonColor: '#facc15',
      });
    }

    const payload = {
      title: sectionTitle.trim(),
      menuItems: [
        {
          title: itemTitle.trim(),
          detail: detail.trim(),
          link: '',
        },
      ],
    };

    const url = seccion
      ? `http://localhost:5000/api/secciones/${seccion._id}`
      : `http://localhost:5000/api/secciones`;

    try {
      if (seccion) await axios.put(url, payload);
      else await axios.post(url, payload);

      Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'La tarjeta fue guardada correctamente.',
        confirmButtonColor: '#3b82f6',
      });

      onSuccess();
    } catch (err) {
      console.error('Error al guardar tarjeta:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-gray-200 flex justify-center items-center px-2"
    >
      <div className="relative w-full max-w-6xl rounded-3xl bg-gradient-to-br from-white via-violet-50 to-violet-100 shadow-xl p-10 overflow-y-auto max-h-[95vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-3xl text-red-500 hover:text-red-700 transition"
          title="Cerrar"
        >
          <HiX />
        </button>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-10 text-gray-900"
        >
          <h2 className="text-4xl font-extrabold flex justify-center items-center gap-3 text-center">
            <span className="text-5xl">🧩</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-violet-700 to-violet-700">
              {seccion ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
              {sectionTitle && (
                <span className="text-xl font-bold text-violet-700 ml-2">
                  ({sectionTitle})
                </span>
              )}
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label
                value="Título del ítem"
                className="text-violet-800 font-semibold mb-1"
              />
              <InputWithEmoji
                value={itemTitle}
                onChange={setItemTitle}
                placeholder="Ej: Ingresa los detalles del registro"
              />
            </div>

            <div>
              <Label
                value="Contenido / respuesta"
                className="text-violet-800 font-semibold mb-1"
              />
              <TextareaWithEditor
                value={detail}
                onChange={setDetail}
                rows={10}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-2">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
            >
              Guardar
            </Button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}

export default SeccionEntrenadaModal;
