import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('UserID') !== null);

  const logout = () => {
    sessionStorage.removeItem('UserID');
    setIsLoggedIn(false);
  };

  const setLogin = (id) => {
    sessionStorage.setItem('UserID', id);
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout, setLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
