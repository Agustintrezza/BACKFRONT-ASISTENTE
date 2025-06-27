// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    { title: 'Productos', path: '/productos', description: 'Gestiona tus productos' },
    { title: 'Reservas', path: '/reservas', description: 'Administra las reservas' },
    // 👉 Redirige Secciones hacia CategoríasSecciones
    { title: 'Secciones', path: '/categorias-secciones', description: 'Gestiona tus secciones' },
  ];

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          onClick={() => navigate(card.path)}
          className="cursor-pointer p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
          <p>{card.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
