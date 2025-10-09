function SeccionSinEntrenamientoItem({ seccion, onEdit, onDelete }) {
  // 🔹 Tomamos el primer ítem de la sección
  const firstItem = seccion.menuItems?.[0];

  // 🔹 Título visible:
  // Si el primer ítem tiene título, mostramos ese.
  // Si no, usamos el título de la sección.
  const visibleTitle = firstItem?.title || seccion.title || "Sin título";

  // 🔹 Detalle visible (descripción breve)
  const visibleDetail =
    firstItem?.detail?.length > 120
      ? firstItem.detail.substring(0, 120) + "..."
      : firstItem?.detail || "Sin descripción";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow hover:shadow-violet-200 dark:hover:shadow-violet-900 flex flex-col justify-between transition-all duration-300">
      {/* Título */}
      <h2 className="text-lg font-bold mb-2 text-violet-800 dark:text-violet-400 line-clamp-2">
        {visibleTitle}
      </h2>

      {/* Descripción */}
      <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow line-clamp-4">
        {visibleDetail}
      </p>

      {/* Acciones */}
      <div className="flex gap-2 mt-3 justify-end">
        <button
          onClick={onEdit}
          className="text-lg hover:scale-125 transition-transform duration-200"
          title="Editar sección"
        >
          ✏️
        </button>
        <button
          onClick={onDelete}
          className="text-lg hover:scale-125 transition-transform duration-200"
          title="Eliminar sección"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default SeccionSinEntrenamientoItem;
