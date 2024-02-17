import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './style.css';

const EditImage = () => {
  const { id: imageId } = useParams();
  const userID = sessionStorage.getItem('UserID') || 0;
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  const [imageData, setImageData] = useState({
    FotoID:'',
    JudulFoto: '',
    DeskripsiFoto: '',
    AlbumID: 0,
    UserID: 0,
  });

  const fetchAlbum = async () => {
    try {
      const response = await axios.get(`http://localhost/GALERY-VITE/api/getAlbumUser.php?user_id=${userID}`);
      setAlbums(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };
  
  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost/GALERY-VITE/api/getImageDetails.php?id=${imageId}&UserID=${userID}&action=getDetailEditFoto`);
       
        if (response.data.error) {
          Swal.fire({
            icon: 'warning',
            title: response.data.error === "1" ? 'Hmm?' : 'Ngapain?',
            width: 400,
            text: response.data.message,
            backdrop: `
              rgba(0,0,123,0.4)
              url(${response.data.error === "1" ? "../../public/shocked-surprised.gif" : "../../public/sus-cat-cat-stare.gif"})
              top
            `,
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/');
            }
          });
          
          
        } else {
          const imageDataFromApi = response.data;
          const selectedImageData = imageDataFromApi.FotoID ? imageDataFromApi[imageDataFromApi.FotoID] : imageDataFromApi[0];

          console.log(response.data);
    
          setImageData(prevImageData => ({ ...prevImageData, ...selectedImageData }));
          
        }
      
      } catch (error) {
        console.error('Error fetching image details:', error);
      }
    };
  
    fetchImageDetails();
  }, [imageId]);
  

  useEffect(() => {
    fetchAlbum();
    console.log('LokasiFile berubah:', imageData.LokasiFile);
  }, [imageData.LokasiFile]);
  

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(imageData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });


    try {
      const response = await axios.post(`http://localhost/GALERY-VITE/api/editImage.php`, formDataToSend);
      if (response.data.success) {
        // Show a SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Gambar berhasil Diupdate!',
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            window.location.href = '/';
          }
        });
      } else {
       
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal mengupdate gambar.' + response.data,
        });
      }

    } catch (error) {
      // Show a SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal mengupdate gambar.',
      });
      console.error('Error inserting data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setImageData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
    <h4 className='header'>Edit Foto</h4>
    <p className='blockquote-footer py-2'>Edit Detail Gambar</p>
    <div className='row mb-3'>
      <div className='col-3 me-3' style={{height: "100%"}}>
        <div style={{width: "100%", height: "70vh", display: 'block'}}>
          <img
            src={imageData.LokasiFile ? imageData.LokasiFile : '../../assets/select-image.jpeg'}
            id="preview-image"
            alt="Preview"
            className='rounded border border-secondary bg-light'
            style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: "contain" }}
          />
        </div>
      </div>
      <div className='col'>
      <form>
        <div className="form-group row mb-3">
          <label htmlFor="JudulFoto" className="form-label">Judul Foto</label>
          <div className="col">
            <input
              className="form-control"
              type="text"
              name='JudulFoto'
              id='JudulFoto'
              value={imageData.JudulFoto}
              onChange={handleInputChange} 
            />
          </div>
        </div>
        <div className="form-group row mb-3">
          <label htmlFor="DeskripsiFoto" className="form-label">Deskripsi</label>
          <div className="col">
            <textarea className="form-control" name="DeskripsiFoto" id="DeskripsiFoto" cols="10" rows="5" value={imageData.DeskripsiFoto} onChange={handleInputChange}>
            </textarea>
          </div>
        </div>
        <div className="form-group row mb-3">
          <label htmlFor="AlbumID" className="form-label">Album</label>
          <div className="">
          <select
              className='form-select selectpicker'
              name="AlbumID"
              id="AlbumID"
              onChange={handleInputChange}
              data-live-search="true" 
          >
              {albums.length > 0 ? (
                  <>
                      <option value="0">Pilih</option>
                      {albums.map((album) => (
                          <option key={album.AlbumID} value={album.AlbumID} selected={imageData.AlbumID == album.AlbumID}>{album.NamaAlbum}</option>
                      ))}
                  </>
              ) : (
                  <option value="0" disabled>Anda tidak memiliki album</option>
              )}
          </select>

          </div>
        </div>
        <div className='float-end'>
          <a href="/"><button className='btn btn-light mx-3'>Close</button></a>
          <button className='btn btn-success' onClick={handleEditSubmit}>Simpan</button>
        </div>
      </form>
      </div>
    </div>
    </>
  );
};

export default EditImage;
