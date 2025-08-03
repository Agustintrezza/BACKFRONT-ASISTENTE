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

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
