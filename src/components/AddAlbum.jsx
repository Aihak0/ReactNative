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
        <form>
            <div className='col-a'>
              <div className="form-a-group row-a">
                <label htmlFor="JudulFoto" className="col-a-sm-2 col-a-form-label">Nama Album</label>
                <div className="col-a-sm-10">
                  <input
                    className="form-a-control"
                    type="text"
                    name='NamaAlbum'
                    id='NamaAlbum'
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-a-group row-a">
                <label htmlFor="TanggalUnggah" className="col-a-sm-2 col-a-form-label">Deskripsi</label>
                <div className="col-a-sm-10">
                <textarea className="form-a-control" name='Deskripsi' id='Deskripsi' onChange={handleInputChange} rows="4" cols="50" alt="Album Description"></textarea>
                </div>
              </div>
              <button type="button" className='btn-a m-a-1' onClick={() => window.location.href = '/'}>Close</button>
            <button type="button" className='btn-a btn-a-success' onClick={handleFormSubmit}>Simpan</button>

            </div>
        </form>
  );
};

export default AddAlbum;
