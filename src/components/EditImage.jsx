import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './style.css';

const EditImage = () => {
  const { id: imageId } = useParams();

  const [imageData, setImageData] = useState({
    FotoID:'',
    JudulFoto: '',
    TanggalUnggah: '',
    AlbumID: 0,
    UserID: 0,
  });
  
  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost/GALERY-VITE/api/getImageDetails.php?id=${imageId}`);
        const imageDataFromApi = response.data;
        
        // Pilih data yang sesuai dengan FotoID jika ada, atau gunakan data dengan kunci 0 jika FotoID kosong
        const selectedImageData = imageDataFromApi.FotoID ? imageDataFromApi[imageDataFromApi.FotoID] : imageDataFromApi[0];
  
        // Set state dengan data yang dipilih
        setImageData(prevImageData => ({ ...prevImageData, ...selectedImageData }));
        
      } catch (error) {
        console.error('Error fetching image details:', error);
      }
    };
  
    fetchImageDetails();
  }, [imageId]);
  

  useEffect(() => {
    // Lakukan tindakan apa pun yang diperlukan setelah LokasiFile berubah
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
        // Show a SweetAlert error message if needed
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal mengupdate gambar.',
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
    <div className='row-a'>
      <div className='col-a-sm'>
        <img
          src={imageData.LokasiFile ? imageData.LokasiFile : '../../assets/select-image.jpeg'}
          id="preview-image"
          alt="Preview"
          style={{ width: '100%', border: '3px solid #adadad', borderRadius: '10px'}}
        />
      </div>
      <div className='col-a'>
      <form>
        <div className="form-a-group row-a">
          <label htmlFor="JudulFoto" className="col-a-sm-2 col-a-form-label">Judul Foto</label>
          <div className="col-a-sm-10">
            <input
              className="form-a-control"
              type="text"
              name='JudulFoto'
              id='JudulFoto'
              value={imageData.JudulFoto}
              onChange={handleInputChange} 
            />
          </div>
        </div>
        <div className="form-a-group row-a">
          <label htmlFor="TanggalUnggah" className="col-a-sm-2 col-a-form-label">Tanggal Unggah</label>
          <div className="col-a-sm-10">
            <input className="form-a-control" type="date" name='TanggalUnggah' id='TanggalUnggah' value={imageData.TanggalUnggah} onChange={handleInputChange} />
          </div>
        </div>
        <div className="form-a-group row-a">
          <label htmlFor="AlbumID" className="col-a-sm-2 col-a-form-label">ID Album</label>
          <div className="col-a-sm-10">
            <input className="form-a-control" type="number" name='AlbumID' id='AlbumID'  value={imageData.AlbumID} onChange={handleInputChange} />
          </div>
        </div>
        <div className="form-a-group row-a">
          <label htmlFor="UserID" className="col-a-sm-2 col-a-form-label">ID User</label>
          <div className="col-a-sm-10">
            <input className="form-a-control" type="number" name='UserID' id='UserID' value={imageData.UserID} onChange={handleInputChange} />
          </div>
        </div>
        <a href="/"><button className='btn-a m-a-1'>Close</button></a>
        <button className='btn-a btn-a-success' onClick={handleEditSubmit}>Simpan</button>
      </form>
      </div>
    </div>
  );
};

export default EditImage;
