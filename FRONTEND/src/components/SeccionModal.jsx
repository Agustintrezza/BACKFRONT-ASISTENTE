import { useState, useEffect } from 'react';
import axios from 'axios';
import { Label, TextInput, Textarea, Button, Select } from 'flowbite-react';

const TITULOS_FIJOS = [
  'Guía Turístico',
  'Tipo de Cambio',
  'Preguntas Frecuentes 📚',
  'Contacto 📚',
  'Nosotros 📚'
];

function SeccionModal({ seccion, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [menuItemsRaw, setMenuItemsRaw] = useState('');

  useEffect(() => {
    if (seccion) {
      setTitle(seccion.title || '');
      setLink(seccion.link || '');
      setMenuItemsRaw(
        (seccion.menuItems || [])
          .map((i) => `${i.title}|${i.detail}|${i.link || ''}`)
          .join('\n')
      );
    } else {
      setTitle('');
      setLink('');
      setMenuItemsRaw('');
    }
  }, [seccion]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      link,
      menuItems: menuItemsRaw
        .split('\n')
        .map((line) => {
          const [title, detail, link] = line.split('|');
          return {
            title: title?.trim(),
            detail: detail?.trim(),
            link: link?.trim(),
          };
        })
        .filter((item) => item.title && item.detail),
    };

    const url = seccion
      ? `http://localhost:5000/api/secciones/${seccion._id}`
      : 'http://localhost:5000/api/secciones';

    try {
      seccion
        ? await axios.put(url, payload)
        : await axios.post(url, payload);
      onSuccess();
    } catch (err) {
      console.error('Error al guardar sección:', err);
      alert('No se pudo guardar la sección.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 w-full max-w-2xl">
      <h2 className="text-lg font-semibold mb-2">
        {seccion ? 'Editar Sección' : 'Nueva Sección'}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label value="Título (no editable)" />
          {seccion ? (
            <TextInput value={title} disabled />
          ) : (
            <Select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            >
              <option value="">Seleccionar sección...</option>
              {TITULOS_FIJOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          )}
        </div>

        <div className="sm:col-span-2">
          <Label value="Link (opcional)" />
          <TextInput value={link} onChange={(e) => setLink(e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <Label value="Ítems del menú (uno por línea, formato: título | detalle | link)" />
          <Textarea
            rows={6}
            value={menuItemsRaw}
            onChange={(e) => setMenuItemsRaw(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button color="gray" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          Guardar
        </Button>
      </div>
    </form>
  );
}

export default SeccionModal;
