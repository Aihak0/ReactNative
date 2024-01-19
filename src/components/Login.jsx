import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Login() {
  const { setLogin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          formDataToSend.append(key, value);
        });
      const response = await axios.post('http://localhost/GALERY-VITE/api/login.php', formDataToSend);

      if (response.data.success) {

        setLogin(response.data.id);
        
            // Rest of the code
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            navigate('/');
          }
        });
      } else {
        // Login failed
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Login failed. Please check your credentials.'+response.data,
        });
      }
    } catch (error) {
      // Handle network or server errors
      console.error('Error logging in:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to log in. Please try again later.',
      });
    }

    // Reset form data after submission
    setFormData({
      username: '',
      password: '',
    });
  };

  return (
      <form onSubmit={handleSubmit}>
        <div className='center-a'>
          <div className='col-a-sm '>
            <h2>Login</h2>
            <div className="form-a-group">
              <label className="col-a-sm-1 col-a-form-label">Username:</label>
              <input
                type="text"
                className='form-a-control'
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-a-group">
              <label className="col-a-sm-1 col-a-form-label">Password:</label>
              <input
                type="password"
                name="password"
                className='form-a-control'
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <a href="/register"><p>Tidak Punya Akun?</p></a>
            <button className="btn-a btn-a-success" type="submit">Login</button>
          </div>
        </div>
      </form>
  );
}

export default Login;
