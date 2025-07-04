// src/pages/SeccionModal.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HiX } from 'react-icons/hi';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import Swal from 'sweetalert2';
import TextareaWithEditor from '../components/TextAreaWithEditor';

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
      setMenuItems(
        seccion.menuItems?.length
          ? seccion.menuItems
          : [{ title: '', detail: '', link: '' }]
      );
    } else {
      setTitle(category || '');
      setMenuItems([{ title: '', detail: '', link: '' }]);
    }
  }, [seccion, category]);

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

  const handleEmojiSelect = (emoji) => {
    const value = emoji.native;
    if (emojiField === 'title') {
      setTitle((prev) => prev + value);
    } else {
      const [index, field] = emojiField.split('.');
      handleMenuItemChange(parseInt(index), field, menuItems[index][field] + value);
    }
    setShowEmoji(false);
  };

  const renderHeading = () => {
    if (seccion) return <>Editar Sección <span className="text-4xl">📝</span></>;
    if (category) return <>Nueva Sección ({category}) <span className="text-4xl">📋</span></>;
    return <>Nueva Sección <span className="text-4xl">📋</span></>;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black text-white p-6 w-full max-w-7xl rounded-lg shadow-xl relative"
    >
      {showEmoji && (
        <div ref={pickerRef} className="absolute z-50 right-4 top-4">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
        </div>
      )}

      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {renderHeading()}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-red-500 hover:text-red-700 text-3xl font-bold"
        >
          <HiX />
        </button>
      </div>

      {/* Título */}
      <div className="mb-6 relative">
        <label className="block mb-1">Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isEntrenada}
          className="w-full bg-neutral-900 border-b border-transparent focus:border-yellow-400 text-white px-3 py-2 pr-10 focus:outline-none"
        />
        <button
          type="button"
          className="absolute top-[30px] right-2 text-yellow-400"
          onClick={() => {
            setShowEmoji(true);
            setEmojiField('title');
          }}
        >
          😊
        </button>
      </div>

      {/* Ítems del menú interno */}
      <div className="mt-6">
        <label className="block mb-2">Ítems del menú interno</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <div key={index} className="p-4 border border-neutral-800 rounded-md space-y-4">
              <div className="relative">
                <input
                  placeholder="Título"
                  value={item.title}
                  onChange={(e) => handleMenuItemChange(index, 'title', e.target.value)}
                  className="bg-neutral-900 border-b border-transparent focus:border-yellow-400 text-white px-3 py-2 pr-10 focus:outline-none w-full"
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-yellow-400"
                  onClick={() => {
                    setShowEmoji(true);
                    setEmojiField(`${index}.title`);
                  }}
                >
                  😊
                </button>
              </div>

              <TextareaWithEditor
                value={item.detail}
                onChange={(val) => handleMenuItemChange(index, 'detail', val)}
              />

              <input
                placeholder="Link"
                value={item.link}
                onChange={(e) => handleMenuItemChange(index, 'link', e.target.value)}
                className="bg-neutral-900 border-b border-transparent focus:border-yellow-400 text-white px-3 py-2 focus:outline-none w-full"
              />
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => removeMenuItem(index)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Eliminar ítem
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addMenuItem}
          className="text-sm text-yellow-400 hover:text-yellow-500 mt-4"
        >
          + Agregar ítem
        </button>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="buttom-custom-red px-4 py-2 rounded"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="boton-azul px-4 py-2 rounded"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}

export default SeccionModal;
