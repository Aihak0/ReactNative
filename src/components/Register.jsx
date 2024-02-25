// Import necessary React modules and components

import React, { useState } from 'react';
import "./style.css";
import axios from "axios";
import Swal from 'sweetalert2';

// Define the Register component
function Register() {
  // State to manage form input values
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nama_lengkap: '',
    alamat: '',
  });

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit =  async (e) => {
    e.preventDefault();
    try{
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
        const response = await axios.post(`http://localhost/GALERY-VITE/api/register.php`, formDataToSend);
        console.log(response.data);
        if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Berhasil Register!',
            }).then((result) => {
              if (result.isConfirmed || result.isDismissed) {
                window.location.href = '/login';
              }
            });
          } else {
            // Show a SweetAlert error message if needed
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.data.message,
            });
          }
    }catch(error){
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal register.' + error,
          });
          console.error('Error inserting data:', error);

    }
    setFormData(prevState => ({
      ...prevState,
      password: '',
      confirmPassword: ''
    }));
  };

  // JSX for the Register component
  return (
    <div>
      <form onSubmit={handleSubmit}>
      <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card bg-light text-light" style={{borderRadius: "1rem" , background: "rgb(139,103,193)", background: "linear-gradient(0deg, rgba(139,103,193,1) 0%, rgba(255,157,157,1) 100%)" }}>
                <div className="card-body p-5 text-center">

                  <div className="mb-md-5 mt-md-4 pb-3">

                    <h2 className="fw-bold mb-2 text-uppercase">Register</h2>
                    <p className="text-dark-50 mb-3">Mohon lengkapi form berikut!</p>

                    <div className="form-floating form-dark mb-4">
                      <input type="text" id="NamaLengkap" className="form-control" 
                        name="nama_lengkap"
                       value={formData.nama_lengkap}
                       onChange={handleInputChange}
                       required
                      />
                      <label htmlFor="NamaLengkap">Nama Lengkap</label>
                    </div>

                    <div className="form-floating form-dark mb-4">
                      <input type="text" id="Alamat" className="form-control" 
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      required
                      />
                      <label htmlFor="Alamat">Alamat</label>
                    </div>
                    <div className="form-floating form-dark mb-4">
                      <input type="text" id="Username" className="form-control" 
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      />
                      <label htmlFor="Username">Username</label>
                    </div>
                    <div className="form-floating form-dark mb-4">
                      <input type="email" id="Email" className="form-control" 
                       name="email"
                       value={formData.email}
                       onChange={handleInputChange}
                       required
                      />
                      <label htmlFor="Email">Email</label>
                    </div>

                    <div className="form-floating form-dark mb-4">
                      <input type="password" id="Password" className="form-control form-control-lg" 
                          name='password'
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                      />
                      <label className="form-label" htmlFor="Password">Password</label>
                    </div>
                    <div className="form-floating form-dark mb-4">
                      <input type="password" id="confirmPass" className="form-control form-control-lg" 
                          name='confirmPassword'
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                      />
                      <label className="form-label" htmlFor="confirmPass">Confirm password</label>
                    </div>

                    <button className="btn btn-outline-light btn-lg px-5 w-100" type="submit">Register</button>

                  </div>

                  <div>
                    <p className="mb-0">Sudah punya akun? <a href="/login" className="fw-bold link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">Login</a>
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
