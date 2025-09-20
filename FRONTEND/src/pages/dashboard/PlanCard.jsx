// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Progress } from "flowbite-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

// --- Secciones ---
const SECTION_LABELS = clientConfig.sections?.special || [];
const SECTION_KEYS = clientConfig.sections?.specialKeys?.length
  ? clientConfig.sections.specialKeys
  : SECTION_LABELS.map(slug);
const specialKeySet = new Set(SECTION_KEYS);

// --- Productos ---
const PRODUCT_LABELS = clientConfig.sections?.trained || [];
const PRODUCT_KEYS = clientConfig.products?.trainedKeys?.length
  ? clientConfig.products.trainedKeys
  : PRODUCT_LABELS.map(slug);
const trainedProductKeySet = new Set(PRODUCT_KEYS);

const emojiVariants = {
  animate: {
    x: [0, 3, 0],
    transition: { repeat: Infinity, repeatDelay: 2, duration: 0.8 },
  },
};

const Card = ({ title, icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    whileHover={{ scale: 1.01 }}
    className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-violet-200 dark:hover:shadow-violet-800 flex flex-col"
  >
    <div>
      <h2 className="text-lg font-semibold mb-3 flex justify-between items-center px-3 py-2 rounded-md bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 text-black dark:text-white">
        {title}
        <motion.span
          className="text-3xl ml-2"
          variants={emojiVariants}
          animate="animate"
        >
          {icon}
        </motion.span>
      </h2>
      {children}
    </div>
  </motion.div>
);

function PlanCard({ planData, allProducts, allSections }) {
  // Productos sin entrenar (comodines) → mismos criterios que en vistas
  const productosSinEntrenar = allProducts.filter(
    (p) => !trainedProductKeySet.has(p?.categoryKey || slug(p?.category))
  );

  // Secciones sin entrenar (comodines)
  const seccionesSinEntrenar = allSections.filter(
    (s) => !specialKeySet.has(s?.sectionKey || slug(s?.title))
  );

  // Datos gráficos
  const productChartData = [
    { name: "Usados", value: allProducts.length },
    {
      name: "Disponibles",
      value: Math.max(
        0,
        (planData?.maxProductosTotales || 0) - allProducts.length
      ),
    },
  ];
  const sectionChartData = [
    { name: "Usadas", value: allSections.length },
    {
      name: "Disponibles",
      value: Math.max(
        0,
        (planData?.maxSeccionesTotales || 0) - allSections.length
      ),
    },
  ];
  const COLORS = ["#8b5cf6", "#e9d5ff"];

  return (
    <Card title={`Tu Plan: ${planData?.name || "Sin plan"}`} icon="📊">
      {/* Tipo de plan */}
      <p className="text-sm font-medium text-violet-700 dark:text-violet-300 mb-3">
        Tipo de plan:{" "}
        <span className="font-bold capitalize">{planData?.name}</span>
      </p>

      {/* 🔹 Dos columnas iguales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Columna izquierda → métricas + comodines */}
        <ul className="space-y-1 text-sm text-gray-800 dark:text-gray-200">
          <li>
            📦 Productos: {allProducts.length} / {planData?.maxProductosTotales}
            <Progress
              progress={
                ((allProducts.length / planData?.maxProductosTotales) * 100) || 0
              }
              color="purple"
              size="sm"
              className="mt-0.5"
            />
          </li>
          <li>
            🧩 Secciones: {allSections.length} / {planData?.maxSeccionesTotales}
            <Progress
              progress={
                ((allSections.length / planData?.maxSeccionesTotales) * 100) || 0
              }
              color="purple"
              size="sm"
              className="mt-0.5"
            />
          </li>
          <li>
            ⭐ Productos Comodines: {productosSinEntrenar.length} /{" "}
            {planData?.maxProductosComodines}
            <Progress
              progress={
                ((productosSinEntrenar.length /
                  planData?.maxProductosComodines) *
                  100) || 0
              }
              color="purple"
              size="sm"
              className="mt-0.5"
            />
          </li>
          <li>
            🔖 Secciones Comodines: {seccionesSinEntrenar.length} /{" "}
            {planData?.maxSeccionesComodines}
            <Progress
              progress={
                ((seccionesSinEntrenar.length /
                  planData?.maxSeccionesComodines) *
                  100) || 0
              }
              color="purple"
              size="sm"
              className="mt-0.5"
            />
          </li>
          <li>👥 Usuarios: {planData?.maxUsers}</li>
          <li>💬 Consultas: {planData?.maxConsultas}</li>
          <li>📞 Conversaciones: {planData?.maxConversaciones}</li>
          <li>🗓️ Reservas: {planData?.maxReservas}</li>
        </ul>

        {/* Columna derecha → gráficos lado a lado, un poco más grandes */}
        <div className="flex flex-row justify-center items-center gap-6">
          <div className="w-32 h-32">
            <h3 className="text-xs font-semibold mb-1 text-violet-800 dark:text-violet-400 text-center">
              Productos
            </h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={productChartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={40}
                >
                  {productChartData.map((entry, index) => (
                    <Cell
                      key={`prod-cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-32 h-32">
            <h3 className="text-xs font-semibold mb-1 text-violet-800 dark:text-violet-400 text-center">
              Secciones
            </h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={sectionChartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={40}
                >
                  {sectionChartData.map((entry, index) => (
                    <Cell
                      key={`sec-cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PlanCard;
