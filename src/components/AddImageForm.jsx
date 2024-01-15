import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './style.css';

const AddImageForm = () => {
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    JudulFoto: '',
    TanggalUnggah: '',
    AlbumID: 0,
    UserID: 0,
    fileFoto: null,
  });

  const handleImageChange = (files) => {
    const file = files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData((prevData) => ({
        ...prevData,
        fileFoto: file,
      }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleImageChange(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await axios.post('http://localhost/GALERY-VITE/api/addFoto.php', formDataToSend);

      // Check if the request was successful
      if (response.data.success) {
        // Show a SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Gambar berhasil ditambahkan!',
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            window.location.href = '/';
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
          <div className='row-a'>
            <div className='col-a-sm' onDrop={handleDrop} onDragOver={handleDragOver}>
            <input
              type="file"
              id="image-input"
              accept="image/*"
              name='fileFoto'
              onChange={(e) => handleImageChange(e.target.files)}
              style={{ display: 'none' }}
            />
            <label htmlFor="image-input">
              <img
                src={imagePreview || 'assets/select-image.jpeg'}
                id="preview-image"
                alt="Preview"
                style={{ width: '100%', border: '3px solid #adadad', borderRadius: '10px', cursor: 'pointer' }}
              />
            </label>
          </div>
            <div className='col-a'>
              <div className="form-a-group row-a">
                <label htmlFor="JudulFoto" className="col-a-sm-2 col-a-form-label">Judul Foto</label>
                <div className="col-a-sm-10">
                  <input
                    className="form-a-control"
                    type="text"
                    name='JudulFoto'
                    id='JudulFoto'
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-a-group row-a">
                <label for="TanggalUnggah" className="col-a-sm-2 col-a-form-label">Tanggal Unggah</label>
                <div className="col-a-sm-10">
                  <input className="form-a-control" type="date" name='TanggalUnggah' id='TanggalUnggah'  onChange={handleInputChange}/>
                </div>
              </div>
              <div className="form-a-group row-a">
                <label for="AlbumID" className="col-a-sm-2 col-a-form-label">ID Album</label>
                <div className="col-a-sm-10">
                  <input className="form-a-control" type="number" name='AlbumID' id='AlbumID'  onChange={handleInputChange}/>
                </div>
              </div>
              <div className="form-a-group row-a">
                <label for="UserID" className="col-a-sm-2 col-a-form-label">ID User</label>
                <div className="col-a-sm-10">
                  <input className="form-a-control" type="number" name='UserID' id='UserID'  onChange={handleInputChange}/>
                </div>
              </div>
              <a href="/"><button className='btn-a m-a-1'>Close</button></a>
              <button className='btn-a btn-a-success' onClick={handleFormSubmit}>Simpan</button>
            </div>
          </div>
        </form>
  );
};

export default AddImageForm;
