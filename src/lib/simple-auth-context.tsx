import { createContext, useContext, useEffect, useState } from "react";

type SimpleAuthContextType = {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  skipLogin: () => void;
  logout: () => void;
};

const SimpleAuthContext = createContext<SimpleAuthContextType>({
  isAuthenticated: false,
  username: null,
  login: () => false,
  skipLogin: () => {},
  logout: () => {},
});

export const useSimpleAuth = () => useContext(SimpleAuthContext);

export function SimpleAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Check local storage for authentication on initial load
  useEffect(() => {
    const storedAuth = localStorage.getItem("simpleAuth");
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setIsAuthenticated(authData.isAuthenticated);
      setUsername(authData.username);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Check against hardcoded admin credentials
    if (username === "klaasvaakie" && password === "Leatherman@24") {
      setIsAuthenticated(true);
      setUsername(username);

      // Store authentication in local storage
      localStorage.setItem(
        "simpleAuth",
        JSON.stringify({
          isAuthenticated: true,
          username,
        }),
      );

      return true;
    }
    return false;
  };

  const skipLogin = () => {
    setIsAuthenticated(true);
    setUsername("guest");

    // Store authentication in local storage
    localStorage.setItem(
      "simpleAuth",
      JSON.stringify({
        isAuthenticated: true,
        username: "guest",
      }),
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);

    // Remove authentication from local storage
    localStorage.removeItem("simpleAuth");
  };

  return (
    <SimpleAuthContext.Provider
      value={{
        isAuthenticated,
        username,
        login,
        skipLogin,
        logout,
      }}
    >
      {children}
    </SimpleAuthContext.Provider>
  );
}
