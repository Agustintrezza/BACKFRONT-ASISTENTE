import { useState, useEffect } from "react";
import axios from "axios";
import { Label, Button } from "flowbite-react";
import { HiX } from "react-icons/hi";
import Swal from "sweetalert2";
import InputWithEmoji from "../inputs-emojis/InputWithEmoji";
import TextareaWithEditor from "../inputs-emojis/TextAreaWithEditor";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// ===== Helpers =====
const slug = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();

function ProductoModal({
  producto,
  onClose,
  onSuccess,
  mode = "producto",
  categoriaKey,
  categoriaLabel,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Prefill si es edición
  useEffect(() => {
    if (mode === "producto" && producto) {
      setTitle(producto.title || "");
      setDescription(producto.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [producto, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "El título y la descripción son obligatorios.",
        confirmButtonColor: "#facc15",
      });
    }

    // Determinar categoría
    const category = producto?.category || categoriaLabel || "Sin categoría";
    const key = producto?.categoryKey || categoriaKey || slug(category);

    const payload = { title, description, category, categoryKey: key };

    try {
      if (producto?._id) {
        // 👉 Editar
        await axios.put(
          `http://localhost:5000/api/productos/${producto._id}`,
          payload
        );
        Swal.fire({
          icon: "success",
          title: "¡Producto actualizado!",
          text: `El producto "${title}" fue actualizado correctamente.`,
          confirmButtonColor: "#3b82f6",
        });
      } else {
        // 👉 Crear
        await axios.post("http://localhost:5000/api/productos", payload);
        Swal.fire({
          icon: "success",
          title: "¡Producto creado!",
          text: `El producto "${title}" fue creado correctamente en la categoría "${category}".`,
          confirmButtonColor: "#3b82f6",
        });
      }

      onSuccess();
    } catch (err) {
      console.error("Error guardando producto", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el producto.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center px-2"
    >
      <div className="relative w-full max-w-3xl rounded-3xl bg-gradient-to-br from-white via-violet-50 to-violet-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 shadow-xl p-10 overflow-y-auto max-h-[95vh] text-gray-900 dark:text-gray-100">
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
          className="space-y-8"
        >
          <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-black via-violet-700 to-violet-700 dark:from-white dark:via-violet-400 dark:to-purple-400">
            {producto ? "Editar Producto" : "Nuevo Producto"}
          </h2>

          {/* Campos */}
          <div>
            <Label value="Título del producto" className="mb-2 block" />
            <InputWithEmoji
              value={title}
              onChange={setTitle}
              placeholder="Escribí un título atractivo..."
            />
          </div>
          <div>
            <Label value="Descripción" className="mb-2 block" />
            <TextareaWithEditor
              value={description}
              onChange={setDescription}
              rows={6}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-violet-600 to-purple-700 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
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
