// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Swal from 'sweetalert2';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops!',
      text: 'Sepertinya Anda belum login!',
    });
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
