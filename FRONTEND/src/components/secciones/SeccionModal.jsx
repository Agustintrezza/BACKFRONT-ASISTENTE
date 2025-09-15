import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Label, Button, Table } from "flowbite-react";
import { HiX, HiPencil, HiTrash } from "react-icons/hi";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import TextareaWithEditor from "../inputs-emojis/TextAreaWithEditor";
import InputWithEmoji from "../inputs-emojis/InputWithEmoji";
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

// Labels visibles + keys
const SPECIAL_LABELS = clientConfig.sections?.special || [];
const SPECIAL_KEYS = clientConfig.sections?.specialKeys?.length
  ? clientConfig.sections.specialKeys
  : SPECIAL_LABELS.map(slug);

const keyToLabel = Object.fromEntries(
  SPECIAL_LABELS.map((lbl, i) => [SPECIAL_KEYS[i] || slug(lbl), lbl])
);
const labelToKey = Object.fromEntries(
  SPECIAL_LABELS.map((lbl, i) => [lbl, SPECIAL_KEYS[i] || slug(lbl)])
);
const specialKeySet = new Set(SPECIAL_KEYS);

function SeccionModal({ seccion, category, sectionKey, onClose, onSuccess }) {
  // Derivar la key estable de esta sección
  const derivedKey =
    sectionKey ||
    seccion?.sectionKey ||
    (category ? labelToKey[category] : null) ||
    slug(seccion?.title || category || "");

  const isEntrenada = specialKeySet.has(derivedKey);

  const [title, setTitle] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [itemTitle, setItemTitle] = useState("");
  const [itemDetail, setItemDetail] = useState("");
  const [itemLink, setItemLink] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiField, setEmojiField] = useState("");
  const pickerRef = useRef();

  useEffect(() => {
    if (seccion) {
      setTitle(seccion.title || keyToLabel[derivedKey] || "");
      setMenuItems(seccion.menuItems || []);
    } else {
      // Prefill con el label visible si vino por route
      setTitle(category || keyToLabel[derivedKey] || "");
      setMenuItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seccion?._id, category, sectionKey]);

  const handleEmojiSelect = (emoji) => {
    const value = emoji.native;
    switch (emojiField) {
      case "title":
        setTitle((prev) => prev + value);
        break;
      case "itemTitle":
        setItemTitle((prev) => prev + value);
        break;
      case "itemDetail":
        setItemDetail((prev) => prev + value);
        break;
      default:
        break;
    }
    setShowEmoji(false);
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const handleAddOrUpdateItem = () => {
    const trimmedTitle = itemTitle.trim();
    const trimmedDetail = itemDetail.trim();
    const trimmedLink = itemLink.trim();
    if (!trimmedTitle && !trimmedDetail && !trimmedLink) return;

    const item = { title: trimmedTitle, detail: trimmedDetail, link: trimmedLink };

    const updatedItems = [...menuItems];
    if (editingIndex !== null) {
      updatedItems[editingIndex] = item;
    } else {
      updatedItems.push(item);
    }

    setMenuItems(updatedItems);
    setEditingIndex(null);
    setItemTitle("");
    setItemDetail("");
    setItemLink("");
  };

  const handleEditItem = (index) => {
    const item = menuItems[index];
    setItemTitle(item.title || "");
    setItemDetail(item.detail || "");
    setItemLink(item.link || "");
    setEditingIndex(index);
  };

  const handleDeleteItem = (index) => {
    const updated = menuItems.filter((_, i) => i !== index);
    setMenuItems(updated);
    if (index === editingIndex) {
      setEditingIndex(null);
      setItemTitle("");
      setItemDetail("");
      setItemLink("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // IMPORTANTE: siempre mandar la key estable
    const payload = {
      title,
      sectionKey: derivedKey,
      menuItems,
    };

    try {
      if (seccion) {
        await axios.put(`http://localhost:5000/api/secciones/${seccion._id}`, payload);
      } else {
        await axios.post("http://localhost:5000/api/secciones", payload);
      }
      onSuccess();
    } catch (err) {
      console.error("❌ Error al guardar la sección:", err.response?.data || err.message);
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
      <div className="relative w-full max-w-7xl rounded-3xl bg-gradient-to-br from-white via-violet-50 to-violet-100 shadow-xl p-10 overflow-y-auto max-h-[95vh]">
        {showEmoji && (
          <div ref={pickerRef} className="absolute z-50 right-5 top-5">
            <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
          </div>
        )}

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
          <h2 className="text-4xl font-extrabold flex justify-center items-center gap-3">
            <span className="text-5xl">📂</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-violet-700 to-violet-700">
              {seccion ? "Editar Sección" : "Nueva Sección"}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna izquierda: formulario + item */}
            <div className="space-y-4 bg-gray-50 border border-gray-300 rounded-xl p-6 shadow-sm">
              <Label value="Título de la sección" className="text-violet-800 font-semibold mb-1" />
              <InputWithEmoji
                value={title}
                onChange={setTitle}
                placeholder="Ej: Preguntas Frecuentes"
                disabled={isEntrenada} // entrenada: se edita contenido, no el nombre
                onEmojiClick={() => {
                  setShowEmoji(true);
                  setEmojiField("title");
                }}
              />

              <Label value="Título del ítem" className="text-violet-800 font-semibold mt-2" />
              <InputWithEmoji
                value={itemTitle}
                onChange={setItemTitle}
                placeholder="Título del ítem"
                onEmojiClick={() => {
                  setShowEmoji(true);
                  setEmojiField("itemTitle");
                }}
              />

              <Label value="Detalle del ítem" className="text-violet-800 font-semibold mt-2" />
              <TextareaWithEditor value={itemDetail} onChange={setItemDetail} rows={5} />

              <input
                type="text"
                value={itemLink}
                onChange={(e) => setItemLink(e.target.value)}
                placeholder="Link (opcional)"
                className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm shadow-sm"
              />

              <Button
                type="button"
                color="success"
                className="mt-4 w-full rounded-full shadow-md font-semibold"
                onClick={handleAddOrUpdateItem}
              >
                {editingIndex !== null ? "✅ Actualizar ítem" : "➕ Agregar ítem"}
              </Button>
            </div>

            {/* Columna derecha: tabla ítems */}
            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm overflow-x-auto">
              <h3 className="text-xl font-semibold mb-4 text-violet-800">Ítems agregados</h3>
              {menuItems.length > 0 ? (
                <Table striped>
                  <Table.Head>
                    <Table.HeadCell>Título</Table.HeadCell>
                    <Table.HeadCell>Detalle</Table.HeadCell>
                    <Table.HeadCell>Acciones</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {menuItems.map((item, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{truncateText(item.title)}</Table.Cell>
                        <Table.Cell>{truncateText(item.detail)}</Table.Cell>
                        <Table.Cell>
                          <button
                            onClick={() => handleEditItem(index)}
                            className="text-blue-600 text-xl hover:underline me-2"
                            type="button"
                          >
                            <HiPencil />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(index)}
                            className="text-red-600 text-xl hover:underline"
                            type="button"
                          >
                            <HiTrash />
                          </button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              ) : (
                <p className="text-sm text-gray-500">No hay ítems agregados todavía.</p>
              )}
            </div>
          </div>

          {/* Botones finales */}
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
              Guardar sección
            </Button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}

export default SeccionModal;
