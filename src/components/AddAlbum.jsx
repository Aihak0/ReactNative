import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './style.css';


const AddAlbum = () => {
  const userID = sessionStorage.getItem('UserID') || 0;
  const TanggalDibuat = new Date().toISOString();
  const [formData, setFormData] = useState({
    NamaAlbum: '',
    Deskripsi: '',
    TanggalDibuat: TanggalDibuat,
    UserID: userID,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("sekske");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await axios.post('http://localhost/GALERY-VITE/api/addAlbum.php', formDataToSend);
      console.log("sip");
      if (response.data.success) {
        // Show a SweetAlert success message
        
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Gambar berhasil ditambahkan!',
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            window.location.href = '/profile';
            
          }
        });
      } else {
        // Show a SweetAlert error message if needed
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal menambahkan gambar.',
        });
      }

    } catch (error) {
      // Show a SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal menambahkan gambar.',
      });
      console.error('Error inserting data:', error);
    }
  };
    return (
        <div className='container mb-4'>
            <h4 className='header'>Tambah Album</h4>
            <p className='blockquote-footer py-2'>Tambahkan album gambar</p>
            <div className='col'>
              <div className="form-group row mb-3">
                <label htmlFor="JudulFoto" className="form-label">Nama Album</label>
                <div className="col">
                  <input
                    className="form-control"
                    type="text"
                    name='NamaAlbum'
                    id='NamaAlbum'
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group row mb-3">
                <label htmlFor="TanggalUnggah" className="form-label">Deskripsi</label>
                <div className="col">
                <textarea className="form-control" name='Deskripsi' id='Deskripsi' onChange={handleInputChange} rows="4" cols="50" alt="Album Description"></textarea>
                </div>
              </div>
              <div className='float-end'>
                  <a href="/"><button type='button' className='btn btn-light mx-3'>Close</button></a>
                  <button type="button" className='btn btn-success' onClick={handleFormSubmit}
                  disabled={!formData.NamaAlbum.trim() || !formData.Deskripsi.trim() } 
                  >Simpan</button>
              </div>

            </div>
        </div>
  );
};

export default AddAlbum;
