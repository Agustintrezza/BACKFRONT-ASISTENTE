// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    { title: 'Productos', emoji: '📦', path: '/productos', description: 'Gestiona tus productos' },
    { title: 'Reservas', emoji: '📅', path: '/reservas', description: 'Administra las reservas' },
    { title: 'Secciones', emoji: '📚', path: '/categorias-secciones', description: 'Gestiona tus secciones' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className="cursor-pointer card-custom p-6 bg-neutral-900 rounded-lg hover:shadow-lg transition h-auto"
          >
            <h2 className="text-2xl font-bold mb-2 flex justify-between items-center">
              {card.title}
              <span className="text-3xl ml-2">{card.emoji}</span>
            </h2>
            <p className="text-gray-300">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
