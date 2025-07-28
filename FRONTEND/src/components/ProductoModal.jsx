import { useState, useEffect } from 'react';
import axios from 'axios';
import { Label, Button } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import Swal from 'sweetalert2';
import InputWithEmoji from './InputWithEmoji';
import TextareaWithEditor from './TextAreaWithEditor';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function ProductoModal({ producto, category, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoria, setCategoria] = useState('');

  useEffect(() => {
    if (producto) {
      setTitle(producto.title || '');
      setDescription(producto.description || '');
      setCategoria(producto.category || '');
    } else {
      setTitle('');
      setDescription('');
      setCategoria(category || '');
    }
  }, [producto, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'El título y la descripción son obligatorios.',
        confirmButtonColor: '#facc15',
      });
    }

    const payload = {
      title,
      description,
      price: 0,
      duration: '',
      location: null,
      image: null,
      availableDates: [],
      stock: 0,
      category: categoria?.trim() || 'Sin categoría',
    };

    const url = producto
      ? `http://localhost:5000/api/productos/${producto._id}`
      : `http://localhost:5000/api/productos`;

    try {
      producto
        ? await axios.put(url, payload)
        : await axios.post(url, payload);

      Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'El producto fue guardado correctamente.',
        confirmButtonColor: '#3b82f6',
      });

      onSuccess();
    } catch (e) {
      console.error('Error guardando producto', e);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar el producto.',
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
      <div className="relative w-full max-w-5xl rounded-3xl bg-gradient-to-br from-white via-violet-50 to-violet-100 shadow-xl p-10 overflow-y-auto">
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
              <span className="text-5xl me-2">📁</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-violet-700 to-violet-700">
                {producto ? 'Editar Producto' : `Nuevo Producto (${categoria})`}
              </span>
            </h2>
            {/* <p className="text-sm mt-2 text-gray-600">Completá los datos del producto</p> */}
          </div>

          {/* Campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Título */}
            <div className="md:col-span-2">
              <Label value="Título del producto" className="text-violet-800 font-semibold mb-1" />
              <InputWithEmoji
                value={title}
                onChange={setTitle}
                placeholder="Escribí un título atractivo..."
              />
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <Label value="Descripción detallada" className="text-violet-800 font-semibold mb-1" />
              <TextareaWithEditor
                value={description}
                onChange={setDescription}
                rows={14} // más grande aún
              />
            </div>

            {/* Categoría */}
            <div className="md:col-span-2">
              <Label value="Categoría" className="text-violet-800 font-semibold mb-0" />
              <input
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
                disabled={!!category}
                className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm shadow-md focus:ring-2 focus:ring-violet-400 focus:outline-none bg-white"
              />
            </div>
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

export default ProductoModal;
