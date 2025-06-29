import { useState, useEffect } from 'react';
import axios from 'axios';
import { Label, TextInput, Textarea, Button } from 'flowbite-react';

function SeccionModal({ seccion, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [menuItems, setMenuItems] = useState([{ title: '', detail: '', link: '' }]);

  useEffect(() => {
    if (seccion) {
      setTitle(seccion.title || '');
      setDescription(seccion.description || '');
      setLink(seccion.link || '');
      setMenuItems(seccion.menuItems?.length ? seccion.menuItems : [{ title: '', detail: '', link: '' }]);
    } else {
      setTitle('');
      setDescription('');
      setLink('');
      setMenuItems([{ title: '', detail: '', link: '' }]);
    }
  }, [seccion]);

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
      menuItems: menuItems.filter(item => item.title.trim() || item.detail.trim() || item.link.trim()),
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
    <form onSubmit={handleSubmit} className="p-4 space-y-4 w-full max-w-2xl">
      <h2 className="text-lg font-semibold mb-2">
        {seccion ? 'Editar Sección' : 'Nueva Sección'}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label value="Título" />
          <TextInput value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label value="Link principal" />
          <TextInput value={link} onChange={e => setLink(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label value="Descripción" />
          <Textarea value={description} onChange={e => setDescription(e.target.value)} required rows={2} />
        </div>

        <div className="sm:col-span-2">
          <Label value="Ítems del menú interno" />
          {menuItems.map((item, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
              <TextInput
                placeholder="Título"
                value={item.title}
                onChange={(e) => handleMenuItemChange(index, 'title', e.target.value)}
              />
              <TextInput
                placeholder="Detalle"
                value={item.detail}
                onChange={(e) => handleMenuItemChange(index, 'detail', e.target.value)}
              />
              <TextInput
                placeholder="Link"
                value={item.link}
                onChange={(e) => handleMenuItemChange(index, 'link', e.target.value)}
              />
              <div className="sm:col-span-3 text-right">
                <Button color="red" size="xs" onClick={() => removeMenuItem(index)}>
                  Eliminar ítem
                </Button>
              </div>
            </div>
          ))}
          <Button color="gray" size="xs" onClick={addMenuItem}>
            + Agregar ítem
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button color="gray" onClick={onClose}>Cancelar</Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">Guardar</Button>
      </div>
    </form>
  );
}

export default SeccionModal;