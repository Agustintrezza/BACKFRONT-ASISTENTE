import { useState, useEffect } from "react";
import axios from "axios";
import { Label, Button } from "flowbite-react";
import { HiX } from "react-icons/hi";
import Swal from "sweetalert2";
import InputWithEmoji from "../inputs-emojis/InputWithEmoji";
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

function CategoriaModal({ categoria, onClose, onSuccess }) {
  const [title, setTitle] = useState("");

  // Prefill si es edición
  useEffect(() => {
    if (categoria) {
      setTitle(categoria.categoria || "");
    } else {
      setTitle("");
    }
  }, [categoria]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Campo obligatorio",
        text: "El título de la categoría es obligatorio.",
        confirmButtonColor: "#facc15",
      });
    }

    const categoriaKey = slug(title);

    try {
      if (categoria) {
        // 👉 EDITAR
        await axios.put(
          `http://localhost:5000/api/productos/categoria/${categoria.key}`,
          { category: title, categoryKey: categoriaKey }
        );
        Swal.fire({
          icon: "success",
          title: "¡Categoría actualizada!",
          text: `La categoría fue actualizada correctamente.`,
          confirmButtonColor: "#3b82f6",
        });
      } else {
        // 👉 CREAR
        await axios.post("http://localhost:5000/api/productos", {
          title: `Categoría ${title}`,
          category: title,
          categoryKey: categoriaKey,
        });
        Swal.fire({
          icon: "success",
          title: "¡Categoría creada!",
          text: `La categoría "${title}" fue creada correctamente.`,
          confirmButtonColor: "#3b82f6",
        });
      }

      onSuccess();
    } catch (err) {
      console.error("Error guardando categoría", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la categoría.",
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
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-8 text-gray-900 dark:text-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-red-500 hover:text-red-700"
          title="Cerrar"
        >
          <HiX />
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-violet-700 dark:text-violet-400">
            {categoria ? "Editar Categoría" : "Nueva Categoría"}
          </h2>

          <div>
            <Label value="Título de la categoría" className="mb-2 block" />
            <InputWithEmoji
              value={title}
              onChange={setTitle}
              placeholder="Ej: Promociones"
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-6 py-2 rounded-lg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-violet-600 text-white px-6 py-2 rounded-lg"
            >
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default CategoriaModal;
