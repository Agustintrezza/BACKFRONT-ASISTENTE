import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Label, Button } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import Swal from 'sweetalert2';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import TextareaWithEditor from './TextAreaWithEditor';
import InputWithEmoji from './InputWithEmoji';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const entrenadas = [
  'Guía Turístico',
  'Tipo de Cambio',
  'Preguntas Frecuentes',
  'Nosotros',
  'Contacto',
];

function SeccionModal({ seccion, category, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [menuItems, setMenuItems] = useState([{ title: '', detail: '', link: '' }]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiField, setEmojiField] = useState('');
  const pickerRef = useRef();

  const isEntrenada =
    !!category || (seccion && entrenadas.includes(seccion.title?.trim()));

  useEffect(() => {
    if (seccion) {
      setTitle(seccion.title || '');
      setMenuItems(seccion.menuItems?.length ? seccion.menuItems : [{ title: '', detail: '', link: '' }]);
    } else {
      setTitle(category || '');
      setMenuItems([{ title: '', detail: '', link: '' }]);
    }
  }, [seccion, category]);

  const handleEmojiSelect = (emoji) => {
    const value = emoji.native;
    if (emojiField === 'title') {
      setTitle((prev) => prev + value);
    } else {
      const [index, field] = emojiField.split('.');
      const updated = [...menuItems];
      updated[parseInt(index)][field] += value;
      setMenuItems(updated);
    }
    setShowEmoji(false);
  };

  const handleMenuItemChange = (index, field, value) => {
    const updated = [...menuItems];
    updated[index][field] = value;
    setMenuItems(updated);
  };

  const addMenuItem = () => {
    setMenuItems([...menuItems, { title: '', detail: '', link: '' }]);
  };

  const removeMenuItem = (index) => {
    const updated = menuItems.filter((_, i) => i !== index);
    setMenuItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campo obligatorio',
        text: 'El título es obligatorio.',
        confirmButtonColor: '#facc15'
      });
    }

    const payload = {
      title,
      menuItems: menuItems.filter(
        (item) => item.title.trim() || item.detail.trim() || item.link.trim()
      ),
    };

    const url = seccion
      ? `http://localhost:5000/api/secciones/${seccion._id}`
      : 'http://localhost:5000/api/secciones';

    try {
      seccion
        ? await axios.put(url, payload)
        : await axios.post(url, payload);

      Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'La sección fue guardada correctamente.',
        confirmButtonColor: '#3b82f6'
      });

      onSuccess();
    } catch (e) {
      console.error('Error guardando sección', e);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar la sección.',
        confirmButtonColor: '#ef4444'
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
      <div className="relative w-full max-w-5xl rounded-3xl bg-gradient-to-br from-white via-violet-50 to-violet-100 shadow-xl p-10 overflow-y-auto">
        {/* Picker de emojis */}
        {showEmoji && (
          <div ref={pickerRef} className="absolute z-50 right-5 top-5">
            <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
          </div>
        )}

        {/* Botón cerrar */}
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
          {/* Título */}
          <div className="!text-start">
            <h2 className="text-4xl font-extrabold flex justify-center items-center gap-3">
              <span className="text-5xl me-2">📋</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-violet-700 to-violet-700">
                {seccion ? 'Editar Sección' : `Nueva Sección (${category})`}
              </span>
            </h2>
          </div>

          {/* Campo título */}
          <div>
            <Label value="Título de la sección" className="text-violet-800 font-semibold mb-1" />
            <InputWithEmoji
              value={title}
              onChange={setTitle}
              placeholder="Título de la sección..."
              disabled={isEntrenada}
              onEmojiClick={() => {
                setShowEmoji(true);
                setEmojiField('title');
              }}
            />
          </div>

          {/* Menú interno */}
          <div className="space-y-6">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-6 bg-white shadow-md space-y-4"
              >
                <InputWithEmoji
                  value={item.title}
                  onChange={(val) => handleMenuItemChange(index, 'title', val)}
                  placeholder="Título del ítem"
                  onEmojiClick={() => {
                    setShowEmoji(true);
                    setEmojiField(`${index}.title`);
                  }}
                />
                <TextareaWithEditor
                  value={item.detail}
                  onChange={(val) => handleMenuItemChange(index, 'detail', val)}
                  rows={8}
                />
                <input
                  type="text"
                  value={item.link}
                  onChange={(e) => handleMenuItemChange(index, 'link', e.target.value)}
                  placeholder="Link (opcional)"
                  className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm shadow-md focus:ring-2 focus:ring-violet-400 focus:outline-none"
                />
                <div className="text-end">
                  <button
                    type="button"
                    onClick={() => removeMenuItem(index)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Eliminar ítem
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addMenuItem}
              className="text-sm text-yellow-500 hover:text-yellow-600"
            >
              + Agregar ítem
            </button>
          </div>

          {/* Botones */}
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

export default SeccionModal;
