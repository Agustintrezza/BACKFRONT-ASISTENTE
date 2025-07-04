import { Navbar as FlowbiteNavbar, Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '⚠️ ¿Cerrar sesión?',
      text: '👋 Vas a salir del panel de administración del chatbot.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '✅ Sí, cerrar sesión',
      cancelButtonText: '❌ Cancelar',
      background: '#171717',
      color: '#f3f4f6',
      iconColor: '#facc15',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'rounded-lg border-2 border-red-500 shadow-lg',
        title: 'text-lg font-semibold',
        confirmButton: 'bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700',
        cancelButton: 'bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800',
      }
    });

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      navigate('/login');
      window.location.reload();
    }
  };

  return (
    <FlowbiteNavbar fluid rounded className="shadow-md navbar-container bg-neutral-900">
      <FlowbiteNavbar.Brand href="/">
        <img
          src="/asistente-logo.png"
          className="mr-2 h-16 sm:h-10"
          alt="Chatbot Logo"
        />
        <span
          className="self-center whitespace-nowrap font-semibold text-2xl tracking-wide text-white"
          style={{
            background: 'linear-gradient(to right, #8b5cf6, #ffffff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          CHATBOT ADMIN
        </span>
      </FlowbiteNavbar.Brand>

      <FlowbiteNavbar.Toggle />

      <FlowbiteNavbar.Collapse>
        <div className="flex items-center text-md gap-5 font-medium">
          <FlowbiteNavbar.Link
            className="navbar-navlink text-white hover:text-yellow-300 transition font-medium"
            onClick={() => navigate('/productos')}
          >
            📦 Productos
          </FlowbiteNavbar.Link>
          <FlowbiteNavbar.Link
            className="navbar-navlink text-white hover:text-yellow-300 transition font-medium"
            onClick={() => navigate('/categorias-secciones')}
          >
            🧩 Secciones
          </FlowbiteNavbar.Link>
          <FlowbiteNavbar.Link
            className="navbar-navlink text-white hover:text-yellow-300 transition font-medium"
            onClick={() => navigate('/reservas')}
          >
            📅 Reservas
          </FlowbiteNavbar.Link>
          <Button
            onClick={handleLogout}
            color="failure"
            size="sm"
            className="ml-4 bg-red-500 logout-button"
          >
            Logout
          </Button>
        </div>
      </FlowbiteNavbar.Collapse>
    </FlowbiteNavbar>
  );
}

export default Navbar;
