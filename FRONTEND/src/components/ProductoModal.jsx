import { useState, useEffect } from 'react';
import axios from 'axios';
import { Label, TextInput, Textarea, Button } from 'flowbite-react';

function ProductoModal({ producto, category, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [availableDates, setAvailableDates] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (producto) {
      setTitle(producto.title || '');
      setDescription(producto.description || '');
      setPrice(producto.price);
      setDuration(producto.duration);
      setLocation(producto.location);
      setImage(producto.image);
      setAvailableDates((producto.availableDates || []).join(', '));
      setStock(producto.stock);
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setDuration('');
      setLocation('');
      setImage('');
      setAvailableDates('');
      setStock('');
    }
  }, [producto]);

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
      category: category?.trim() || 'Sin categoría',
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
      className="p-4 space-y-4 w-full max-w-2xl"
    >
      <h2 className="text-lg font-semibold mb-2">
        {producto ? 'Editar Producto' : `Nuevo Producto (${category})`}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label value="Título" />
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label value="Precio" />
          <TextInput type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <Label value="Duración" />
          <TextInput value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
        <div>
          <Label value="Ubicación" />
          <TextInput value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div>
          <Label value="Imagen (URL)" />
          <TextInput value={image} onChange={(e) => setImage(e.target.value)} />
        </div>
        <div>
          <Label value="Stock" />
          <TextInput type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <Label value="Fechas disponibles (coma)" />
          <TextInput value={availableDates} onChange={(e) => setAvailableDates(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label value="Descripción" />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={2} />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button color="gray" onClick={onClose}>Cancelar</Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">Guardar</Button>
      </div>
    </form>
  );
}

export default ProductoModal;
