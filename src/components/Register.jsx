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
    // Add your registration logic here (e.g., send data to a server)
    try{
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
        const response = await axios.post(`http://localhost/GALERY-VITE/api/register.php`, formDataToSend);
        if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Berhasil Registrasi Silahkan Login!',
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
              text: 'Gagal Register.'+response.data,
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
    console.log('Form submitted:', formData);
    // Reset form data after submission
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      nama_lengkap: '',
      alamat: '',
    });
  };

  // JSX for the Register component
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='center-a'>
        <div className='col-a-sm '>
            <h2>Register</h2>
            <div className="form-a-group">
                <label className="col-a-sm-1 col-a-form-label">
                Nama Lengkap:
                </label>
                <input
                    type="text"
                    className='form-a-control'
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-a-group">
                <label className="col-a-sm-1 col-a-form-label">
                Alamat:
                </label>
                <input
                    type="text"
                    className='form-a-control'
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-a-group">
                <label className="col-a-sm-1 col-a-form-label">
                Username:
                </label>
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
                <label className="col-a-sm-1 col-a-form-label">
                Email:
                </label>
                <input
                      type="email"
                      name="email"
                      className='form-a-control'
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                />
            </div>
            <div className="form-a-group">
                <label className="col-a-sm-1 col-a-form-label">
                Password:
                </label>
                <input
                    type="password"
                    name="password"
                    className='form-a-control'
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-a-group">
                <label className="col-a-sm-1 col-a-form-label">
                Confirm Password:
                </label>
                <input
                    type="password"
                    name="confirmPassword"
                    className='form-a-control'
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <a href="/login"><p>Sudah Punya Akun?</p></a>
        <button className="btn-a btn-a-success" type="submit">Register</button>
        </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
