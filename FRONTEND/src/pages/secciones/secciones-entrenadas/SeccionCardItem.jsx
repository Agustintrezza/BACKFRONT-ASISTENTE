import { HiPencil, HiTrash } from "react-icons/hi";

function SeccionCardItem({ seccion, onEdit, onDelete }) {
  // Extraemos título y descripción segura
  const title = seccion?.menuItems?.[0]?.title || seccion?.title || "Sin título";
  const description =
    seccion?.menuItems?.[0]?.detail?.length > 0
      ? seccion.menuItems[0].detail.substring(0, 100) +
        (seccion.menuItems[0].detail.length > 100 ? "..." : "")
      : "Sin descripción";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow hover:shadow-violet-200 dark:hover:shadow-violet-900 flex flex-col justify-between">
      {/* Título */}
      <h2 className="text-lg font-bold mb-2 text-violet-800 dark:text-violet-400">
        {title}
      </h2>

      {/* Descripción */}
      <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow">
        {description}
      </p>

      {/* Botones de acción */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <HiPencil /> Editar
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          <HiTrash /> Eliminar
        </button>
      </div>
    </div>
  );
}

export default SeccionCardItem;
