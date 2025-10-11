// context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getUserFromToken } from "../utils/getUserFromToken";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userFromToken = getUserFromToken();
    if (userFromToken) {
      setUser(userFromToken);
    }
  }, []);

  // 🔐 Función global de logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login"; // Redirige al login
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
