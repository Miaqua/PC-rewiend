import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await fetch('https://phppracticesecond-production.up.railway.app/api/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (!res.ok) {
            throw new Error('Unauthorized');
          }

          const data = await res.json();
          setUser(data.data); // важно: user из response
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Ошибка при загрузке пользователя:', err);
          setUser(null);
          setIsAuthenticated(false);
          setToken(null);
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  
    try {
      const res = await fetch('https://phppracticesecond-production.up.railway.app/api/user', {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });
  
      if (!res.ok) throw new Error('Не удалось получить пользователя');
  
      const data = await res.json();
      setUser(data.data);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Ошибка при логине:', err);
      setUser(null);
      setIsAuthenticated(false);
      setToken(null);
      localStorage.removeItem('token');
      return false;
    }
  };
  

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
