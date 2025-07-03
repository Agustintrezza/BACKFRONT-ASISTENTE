import { useState, useEffect } from 'react';
import axios from 'axios';
import { HiX } from 'react-icons/hi';

const entrenadas = [
  'Guía Turístico',
  'Tipo de Cambio',
  'Preguntas Frecuentes',
  'Nosotros',
  'Contacto',
];

function SeccionModal({ seccion, category, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [menuItems, setMenuItems] = useState([{ title: '', detail: '', link: '' }]);

  const isEntrenada =
    !!category || (seccion && entrenadas.includes(seccion.title?.trim()));

  useEffect(() => {
    if (seccion) {
      setTitle(seccion.title || '');
      setDescription(seccion.description || '');
      setLink(seccion.link || '');
      setMenuItems(
        seccion.menuItems?.length
          ? seccion.menuItems
          : [{ title: '', detail: '', link: '' }]
      );
    } else {
      setTitle(category || '');
      setDescription('');
      setLink('');
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

    if (!title.trim() || !description.trim()) {
      return alert('Título y descripción son obligatorios.');
    }

    const payload = {
      title,
      description,
      link,
      menuItems: menuItems.filter(
        (item) =>
          item.title.trim() || item.detail.trim() || item.link.trim()
      ),
    };

    const url = seccion
      ? `http://localhost:5000/api/secciones/${seccion._id}`
      : 'http://localhost:5000/api/secciones';

    try {
      seccion
        ? await axios.put(url, payload)
        : await axios.post(url, payload);
      onSuccess();
    } catch (e) {
      console.error('Error guardando sección', e);
      alert('Ocurrió un error.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black text-white p-6 w-full max-w-6xl rounded-lg shadow-xl"
    >
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {seccion
            ? 'Editar Sección'
            : category
            ? `Nueva Sección (${category})`
            : 'Nueva Sección'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-red-500 hover:text-red-700 text-3xl font-bold"
        >
          <HiX />
        </button>
      </div>

      {/* Título y Link */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isEntrenada}
            className="w-full bg-neutral-900 border-b border-yellow-400 text-white px-3 py-2 focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-1">Link principal</label>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full bg-neutral-900 border-b border-yellow-400 text-white px-3 py-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Descripción */}
      <div className="mt-4">
        <label className="block mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full bg-neutral-900 border-b border-yellow-400 text-white px-3 py-2 focus:outline-none"
        />
      </div>

      {/* Ítems del menú interno */}
      <div className="mt-6">
        <label className="block mb-2">Ítems del menú interno</label>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2"
          >
            <input
              placeholder="Título"
              value={item.title}
              onChange={(e) =>
                handleMenuItemChange(index, 'title', e.target.value)
              }
              className="bg-neutral-900 border-b border-yellow-400 text-white px-3 py-2 focus:outline-none"
            />
            <input
              placeholder="Detalle"
              value={item.detail}
              onChange={(e) =>
                handleMenuItemChange(index, 'detail', e.target.value)
              }
              className="bg-neutral-900 border-b border-yellow-400 text-white px-3 py-2 focus:outline-none"
            />
            <input
              placeholder="Link"
              value={item.link}
              onChange={(e) =>
                handleMenuItemChange(index, 'link', e.target.value)
              }
              className="bg-neutral-900 border-b border-yellow-400 text-white px-3 py-2 focus:outline-none"
            />
            <div className="sm:col-span-3 text-right">
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
        <button
          type="button"
          onClick={addMenuItem}
          className="text-sm text-yellow-400 hover:text-yellow-500 mt-2"
        >
          + Agregar ítem
        </button>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}

export default SeccionModal;
