import { useState, useEffect } from 'react';
import axios from 'axios';
import { Label, Button } from 'flowbite-react';
import { HiX } from 'react-icons/hi';

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

  const inputClass =
    'w-full bg-neutral-900 text-white border-0 border-b border-yellow-400 focus:ring-0 focus:border-yellow-400 outline-none px-3 py-2 appearance-none rounded-none';

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 w-full max-w-7xl bg-black text-white space-y-6 rounded-lg mx-auto relative"
    >
      {/* Título + Botón X */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
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
          <Label value="Título" className="text-white" />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Escribí el título"
            className={inputClass}
          />
        </div>

        <div>
          <Label value="Precio" className="text-white" />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="Precio 💲"
            className={inputClass}
            style={{ backgroundColor: '#171717', color: '#fff' }}
          />
        </div>

        <div>
          <Label value="Duración" className="text-white" />
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Ej: 2hs"
            className={inputClass}
          />
        </div>

        <div>
          <Label value="Ubicación" className="text-white" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ciudad, zona, etc."
            className={inputClass}
          />
        </div>

        <div>
          <Label value="Imagen (URL)" className="text-white" />
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className={inputClass}
          />
        </div>

        <div>
          <Label value="Stock" className="text-white" />
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            placeholder="Unidades disponibles"
            className={inputClass}
            style={{ backgroundColor: '#171717', color: '#fff' }}
          />
        </div>

        <div className="md:col-span-2">
          <Label
            value="Fechas disponibles (separadas por coma)"
            className="text-white"
          />
          <input
            value={availableDates}
            onChange={(e) => setAvailableDates(e.target.value)}
            placeholder="Ej: 10/08, 15/08, 20/08"
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <Label value="Descripción" className="text-white" />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Descripción completa del producto"
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <Label value="Categoría" className="text-white" />
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            disabled={!!category}
            placeholder="Categoría del producto"
            className={inputClass}
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

export default ProductoModal;
