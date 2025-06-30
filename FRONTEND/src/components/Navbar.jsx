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
    <FlowbiteNavbar fluid rounded className="shadow-md navbar-container">
      <FlowbiteNavbar.Brand href="/">
        <img
          src="/asistente-logo.png"
          className="mr-3 h-10 sm:h-10"
          alt="Chatbot Logo"
        />
        <span className="self-center navbar-title whitespace-nowrap font-semibold">
          Chatbot Admin
        </span>
      </FlowbiteNavbar.Brand>

      <FlowbiteNavbar.Toggle />

      <FlowbiteNavbar.Collapse>
        <div className="flex items-center text-md gap-5">
          <FlowbiteNavbar.Link className="navbar-navlink" onClick={() => navigate('/productos')}>
            Productos
          </FlowbiteNavbar.Link>
          <FlowbiteNavbar.Link className="navbar-navlink" onClick={() => navigate('/categorias-secciones')}>
            Secciones
          </FlowbiteNavbar.Link>
          <FlowbiteNavbar.Link className="navbar-navlink" onClick={() => navigate('/reservas')}>
            Reservas
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
