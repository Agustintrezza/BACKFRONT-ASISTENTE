import { useState, useEffect } from "react";
import axios from "axios";
import { Label, Button } from "flowbite-react";
import { HiX } from "react-icons/hi";
import Swal from "sweetalert2";
import InputWithEmoji from "../inputs-emojis/InputWithEmoji";
import TextareaWithEditor from "../inputs-emojis/TextAreaWithEditor";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import clientConfig from "../../../client-config.json";

// ===== Helpers =====
const slug = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();

const SPECIAL_LABELS = clientConfig.sections?.special || [];
const SPECIAL_KEYS = clientConfig.sections?.specialKeys?.length
  ? clientConfig.sections.specialKeys
  : SPECIAL_LABELS.map(slug);

const labelToKey = Object.fromEntries(
  SPECIAL_LABELS.map((lbl, i) => [lbl, SPECIAL_KEYS[i] || slug(lbl)])
);
const keyToLabel = Object.fromEntries(
  SPECIAL_LABELS.map((lbl, i) => [SPECIAL_KEYS[i] || slug(lbl), lbl])
);

function SeccionEntrenadaModal({ seccion, category, onClose, onSuccess }) {
  const derivedKey =
    seccion?.sectionKey ||
    (category ? labelToKey[category] : null) ||
    slug(seccion?.title || category || "");

  const visibleLabel = keyToLabel[derivedKey] || category || seccion?.title || "";

  const [sectionTitle, setSectionTitle] = useState(visibleLabel);
  const [itemTitle, setItemTitle] = useState("");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    setSectionTitle(visibleLabel);
    if (seccion) {
      setItemTitle(seccion.menuItems?.[0]?.title || "");
      setDetail(seccion.menuItems?.[0]?.detail || "");
    } else {
      setItemTitle("");
      setDetail("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seccion?._id, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemTitle.trim() || !detail.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Debés completar el título del ítem y el contenido.",
        confirmButtonColor: "#facc15",
      });
    }

    const payload = {
      title: visibleLabel,
      sectionKey: derivedKey,
      menuItems: [
        {
          title: itemTitle.trim(),
          detail: detail.trim(),
          link: "",
        },
      ],
    };

    const url = seccion
      ? `http://localhost:5000/api/secciones/${seccion._id}`
      : `http://localhost:5000/api/secciones`;

    try {
      if (seccion) await axios.put(url, payload);
      else await axios.post(url, payload);

      Swal.fire({
        icon: "success",
        title: "¡Guardado!",
        text: "La tarjeta fue guardada correctamente.",
        confirmButtonColor: "#3b82f6",
      });

      onSuccess();
    } catch (err) {
      console.error("Error al guardar tarjeta:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar.",
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
      className="fixed inset-0 z-50 bg-gray-200 dark:bg-gray-900 flex justify-center items-center px-2"
    >
      <div className="relative w-full max-w-6xl rounded-3xl bg-gradient-to-br from-white via-violet-50 to-violet-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 shadow-xl p-10 overflow-y-auto max-h-[95vh] text-gray-900 dark:text-gray-100">
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
          className="space-y-10"
        >
          <h2 className="text-4xl font-extrabold flex justify-center items-center gap-3 text-center">
            <span className="text-5xl">🧩</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-violet-700 to-violet-700 dark:from-white dark:via-violet-400 dark:to-purple-400">
              {seccion ? "Editar Tarjeta" : "Nueva Tarjeta"}
              {sectionTitle && (
                <span className="text-xl font-bold text-violet-700 dark:text-violet-300 ml-2">
                  ({sectionTitle})
                </span>
              )}
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label
                value="Título del ítem"
                className="text-violet-800 dark:text-violet-300 font-semibold mb-1"
              />
              <InputWithEmoji
                value={itemTitle}
                onChange={setItemTitle}
                placeholder="Ej: Ingresa los detalles del registro"
              />
            </div>

            <div>
              <Label
                value="Contenido / respuesta"
                className="text-violet-800 dark:text-violet-300 font-semibold mb-1"
              />
              <TextareaWithEditor
                value={detail}
                onChange={setDetail}
                rows={10}
              />
            </div>
          </div>

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

export default SeccionEntrenadaModal;
