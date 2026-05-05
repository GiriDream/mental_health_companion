import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token is valid on app start
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');

    if (savedUser && savedToken && loginTime) {
      const now = new Date().getTime();
      const elapsed = now - parseInt(loginTime);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      if (elapsed < sevenDays) {
        // Token still valid
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } else {
        // Token expired - clear and go to login
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('loginTime');
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (user?.theme) {
      document.body.className = user.theme === 'ocean' ? 'theme-ocean'
                              : user.theme === 'sunset' ? 'theme-sunset'
                              : '';
    } else {
      document.body.className = '';
    }
  }, [user?.theme]);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
    localStorage.setItem('loginTime', new Date().getTime().toString());
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('loginTime');
  };

  const updateProfileContext = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Show nothing while checking auth
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#071210',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '2px solid rgba(78,202,139,0.15)',
          borderTop: '2px solid #4eca8b',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateProfileContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);