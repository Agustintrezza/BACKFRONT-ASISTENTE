import { useState, useEffect } from 'react';
import axios from 'axios';
import { Label, Button } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import InputWithEmoji from './InputWithEmoji';
import TextareaWithEditor from '../components/TextAreaWithEditor';

function ProductoModal({ producto, category, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [availableDates, setAvailableDates] = useState('');
  const [stock, setStock] = useState('');
  const [categoria, setCategoria] = useState('');

  useEffect(() => {
    if (producto) {
      setTitle(producto.title || '');
      setDescription(producto.description || '');
      setPrice(producto.price || '');
      setDuration(producto.duration || '');
      setLocation(producto.location || '');
      setImage(producto.image || '');
      setAvailableDates((producto.availableDates || []).join(', '));
      setStock(producto.stock || '');
      setCategoria(producto.category || '');
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setDuration('');
      setLocation('');
      setImage('');
      setAvailableDates('');
      setStock('');
      setCategoria(category || '');
    }
  }, [producto, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      return alert('Título y descripción son obligatorios.');
    }

    const payload = {
      title,
      description,
      price: Number(price),
      duration,
      location: location || null,
      image: image || null,
      availableDates: availableDates
        ? availableDates.split(',').map((d) => d.trim())
        : [],
      stock: Number(stock),
      category: categoria?.trim() || 'Sin categoría',
    };

    const url = producto
      ? `http://localhost:5000/api/productos/${producto._id}`
      : 'http://localhost:5000/api/productos';

    try {
      producto
        ? await axios.put(url, payload)
        : await axios.post(url, payload);
      onSuccess();
    } catch (e) {
      console.error('Error guardando producto', e);
      alert('Ocurrió un error.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 w-full max-w-7xl bg-black text-white space-y-6 rounded-lg mx-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-5xl">
            {producto ? '🛠️' : '🧾'}
          </span>
          {producto ? 'Editar Producto' : `Nuevo Producto (${categoria})`}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-red-500 hover:text-red-700 text-3xl font-bold"
        >
          <HiX />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label value="Título" className="label-inputs" />
          <InputWithEmoji value={title} onChange={setTitle} placeholder="Título" />
        </div>
        <div>
          <Label value="Precio" className="label-inputs"/>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input-bg w-full px-3 py-2 label-inputs"
          />
        </div>
        <div>
          <Label value="Duración" className="label-inputs"/>
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Ej: 2hs"
            className="input-bg w-full px-3 py-2"
          />
        </div>
        <div>
          <Label value="Ubicación" className="label-inputs"/>
          <InputWithEmoji value={location} onChange={setLocation} placeholder="Ubicación" />
        </div>
        <div>
          <Label value="Imagen (URL)" className="label-inputs"/>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="input-bg w-full px-3 py-2"
          />
        </div>
        <div>
          <Label value="Stock" className="label-inputs"/>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="input-bg w-full px-3 py-2"
          />
        </div>
        <div className="md:col-span-2">
          <Label value="Fechas disponibles (separadas por coma)" className="label-inputs"/>
          <input
            value={availableDates}
            onChange={(e) => setAvailableDates(e.target.value)}
            placeholder="Ej: 10/08, 15/08, 20/08"
            className="input-bg w-full px-3 py-2"
          />
        </div>
        <div className="md:col-span-2">
          <Label value="Descripción" className="label-inputs"/>
          <TextareaWithEditor value={description} onChange={setDescription} />
        </div>
        <div className="md:col-span-2">
          <Label value="Categoría" className="label-inputs"/>
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            disabled={!!category}
            className="input-bg w-full px-3 py-2"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button className="buttom-custom-red" onClick={onClose}>Cancelar</Button>
        <Button type="submit" className="boton-azul">Guardar</Button>
      </div>
    </form>
  );
}

export default ProductoModal;
