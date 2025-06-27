import { Navbar as FlowbiteNavbar, Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <FlowbiteNavbar fluid rounded className="bg-white shadow-md">
      <FlowbiteNavbar.Brand href="/">
        <img
          src="https://flowbite.com/docs/images/logo.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Chatbot Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold">
          Chatbot Admin
        </span>
      </FlowbiteNavbar.Brand>
      <FlowbiteNavbar.Toggle />
      <FlowbiteNavbar.Collapse>
        <FlowbiteNavbar.Link href="/servicios">
          Servicios
        </FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link href="/reservas">
          Reservas
        </FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link href="/calendario">
          Calendario
        </FlowbiteNavbar.Link>
        <Button onClick={handleLogout} color="failure" size="sm" className="ml-4">
          Logout
        </Button>
      </FlowbiteNavbar.Collapse>
    </FlowbiteNavbar>
  );
}

export default Navbar;
