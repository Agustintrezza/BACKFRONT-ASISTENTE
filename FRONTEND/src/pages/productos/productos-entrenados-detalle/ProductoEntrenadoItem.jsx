function ProductoEntrenadoItem({ producto, onEdit, onDelete }) {
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
        <div className="flex gap-2 mt-4">
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg shadow-md hover:scale-105 transition"
            title="Editar producto"
          >
            ✏️ Editar
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg shadow-md hover:scale-105 transition"
            title="Eliminar producto"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    );
  }
  
  export default ProductoEntrenadoItem;
  