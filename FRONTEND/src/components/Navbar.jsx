import { Navbar as FlowbiteNavbar, Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import './styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
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
