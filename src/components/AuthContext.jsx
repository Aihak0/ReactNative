import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('UserID') !== null);
  const navigate = useNavigate();

  const logout = () => {
    navigate('/');
    sessionStorage.removeItem('UserID');
    sessionStorage.removeItem('Username');
    sessionStorage.removeItem('FileFoto');
    setIsLoggedIn(false);
  };

  const setLogin = (id, Username, FileFoto) => {
    sessionStorage.setItem('UserID', id);
    sessionStorage.setItem('Username', Username);
    sessionStorage.setItem('FileFoto', FileFoto);
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout, setLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
