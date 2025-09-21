import { HiPencil, HiTrash } from "react-icons/hi";

function ProductoSinEntrenamientoItem({ producto, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow hover:shadow-violet-200 dark:hover:shadow-violet-900 flex flex-col justify-between">
      {/* Título */}
      <h2 className="text-lg font-bold mb-2 text-violet-800 dark:text-violet-400">
        {producto.title}
      </h2>

      {/* Descripción preview */}
      <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow">
        {producto.description && producto.description.length > 200
          ? producto.description.substring(0, 200) + "..."
          : producto.description || "Sin descripción"}
      </p>

      {/* Botones de acción */}
      <div className="flex">
        <button
          onClick={onEdit}
          className="flex items-center text-lg gap-1 me-2 py-2 text-white rounded-lg transition"
        >
             ✏️
        </button>
        <button
          onClick={onDelete}
          className="flex items-center py-2 text-lg text-white rounded-lg first-line:transition"
        >
            🗑️
        </button>
      </div>
    </div>
  );
}

export default ProductoSinEntrenamientoItem;
