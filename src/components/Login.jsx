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
      setFormData(prevState => ({
        ...prevState,
        password: ''
      }));
  
      if (response.data.success) {
        setLogin(response.data.id, response.data.Username, response.data.FileFoto);
  
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            navigate('/');
            setFormData(prevState => ({
              ...prevState,
              username: '',
              password: ''
            }));
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
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

  };

  return (
      <form onSubmit={handleSubmit}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card bg-light text-light" style={{borderRadius: "1rem" , background: "rgb(139,103,193)", background: "linear-gradient(0deg, rgba(139,103,193,1) 0%, rgba(255,157,157,1) 100%)" }}>
                <div className="card-body p-5 text-center">

                  <div className="mb-md-5 mt-md-4 pb-3">

                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                    <p className="text-dark-50 mb-3">Mohon masukan usernaem dan passsword!</p>

                    <div className="form-floating form-dark mb-4">
                      <input type="text" id="typeEmailX" className="form-control" 
                      name="username"
                       value={formData.username}
                       onChange={handleInputChange}
                       required
                      />
                      <label htmlFor="typeEmailX">Username</label>
                    </div>

                    <div className="form-floating form-dark mb-4">
                      <input type="password" id="typePasswordX" className="form-control form-control-lg" 
                          name='password'
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                      />
                      <label className="form-label" htmlFor="typePasswordX">Password</label>
                    </div>

                    <p className="small mb-3 pb-lg-2"><a className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="#!">Lupa password?</a></p>

                    <button className="btn btn-outline-light btn-lg px-5 w-100" type="submit">Login</button>

                  </div>

                  <div>
                    <p className="mb-0">Tidak punya akun? <a href="/register" className="fw-bold link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">Register</a>
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
  );
}

export default Login;
