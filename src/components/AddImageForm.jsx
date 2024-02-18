import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './style.css';

const AddImageForm = () => {
  const userID = sessionStorage.getItem('UserID') || 0;
  const [imagePreview, setImagePreview] = useState('');
  const TanggalUnggah = new Date().toISOString();
  const [albums, setAlbums] = useState([]);
  const [formData, setFormData] = useState({
    JudulFoto: '',
    TanggalUnggah: TanggalUnggah,
    DeskripsiFoto: '',
    AlbumID: 0,
    UserID: userID,
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
          text: 'Gagal menambahkan gambar.' + response.data,
        });
      }

    } catch (error) {
      // Show a SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal menambahkan gambar.'+ error,
      });
      console.error('Error inserting data:', error);
      console.error( response);
    }
  };
  const fetchAlbum = async () => {
    try {
      const response = await axios.get(`http://localhost/GALERY-VITE/api/getAlbumUser.php?user_id=${userID}`);
      setAlbums(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };
  useEffect(() => {
    fetchAlbum();
  }, []);
    return (
      <>
      <div className='container mb-3' style={{padding:"0"}}>
        <h4 className='header'>Upload Foto</h4>
        <p className='blockquote-footer py-2'>Upload Foto atau Gambar</p>
        <form>
          <div className='row'>
          <div className='col-3 me-3' style={{height: "100%"}} onDrop={handleDrop} onDragOver={handleDragOver}>
            <input
              type="file"
              id="image-input"
              accept="image/*"
              name='fileFoto'
              onChange={(e) => handleImageChange(e.target.files)}
              style={{display: 'none'}}
            />
            <label htmlFor="image-input" style={{width: "100%", height: "70vh", display: 'block'}}>
              <img
                src={imagePreview || 'assets/select-image.jpeg'}
                id="preview-image"
                alt="Preview"
                className='rounded border border-secondary bg-light'
                style={{width: '100%', height: '100%', borderRadius: '10px', cursor: 'pointer', objectFit: "contain"}}
                />
            </label>
          </div>

            <div className='col'>
              <div className="form-group row mb-3">
                <label htmlFor="JudulFoto" className="form-label">Judul Foto</label>
                <div className="">
                  <input
                    className="form-control"
                    type="text"
                    name='JudulFoto'
                    id='JudulFoto'
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="DeskripsiFoto" className="form-label">Deskripsi Foto</label>
                <div className="">
                  <textarea className="form-control" name="DeskripsiFoto" id="DeskripsiFoto" cols="10" rows="5" onChange={handleInputChange}></textarea>
                </div>
              </div>
              <div className="form-group row mb-3">
                <label htmlFor="AlbumID" className="form-label">Album</label>
                <div className="">
                  <select className='form-select' name="AlbumID" id="AlbumID" onChange={handleInputChange}>
                    <option value="">Pilih</option>
                    {albums.map((album) => (
                        <option key={album.AlbumID} value={album.AlbumID}>{album.NamaAlbum}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='float-end'>
                  <a href="/"><button type='button' className='btn btn-light mx-3'>Close</button></a>
                  <button type="button" className='btn btn-success' onClick={handleFormSubmit}
                  disabled={!formData.fileFoto || !formData.JudulFoto.trim() || !formData.DeskripsiFoto.trim() } 
                  >Simpan</button>
              </div>
            </div>
          </div>
        </form>
      </div>
      </>
  );
};

export default AddImageForm;
