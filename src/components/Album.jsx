import React, { useState, useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useNavigate,useParams } from 'react-router-dom';
import { FaPen } from "react-icons/fa";
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const Album = () => {
  const userID = sessionStorage.getItem('UserID') || 0;
  const [dropdownState, setDropdownState] = useState({});
  const [images, setImages] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [albumData, setAlbum] = useState({
    AlbumID:'',
    NamaAlbum: '',
    Deskripsi: '',
    TanggalDibuat: '0-0-0',
    UserID: 0,
    Username: '',
    FileFoto: '',
  });
  const navigate = useNavigate();
  const { id: albumId } = useParams();


  const openDropdown = (fotoID) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [fotoID]: true,
    }));
  };

  const closeDropdown = (fotoID) => {
    setDropdownState((prevState) => ({
      ...prevState,
      [fotoID]: false,
    }));
  };
  const detailImage = (fotoID) => {
    navigate('/detail/'+fotoID);
  };

  const handleEditAlbum = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('AlbumID', albumData.AlbumID);
    formDataToSend.append('NamaAlbum', albumData.NamaAlbum);
    formDataToSend.append('Deskripsi', albumData.Deskripsi);

    console.log(albumData);
  
    try {
      const response = await axios.post(`http://localhost/GALERY-VITE/api/editAlbum.php`, formDataToSend);
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Berhasil Mengupdate!',
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            fetchAlbumDetails();
            handleClose();
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal mengupdate.' + response.data,
        });
      }

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal mengupdate akana.',
      });
      console.error('Error updating data:', error);
    }
  };

  const handleDelete = async (fotoID) => {
    try {
      const response = await axios.post(`http://localhost/GALERY-VITE/api/deleteImage.php?id=${fotoID}`);
      if (response.data.success) {
        // Show a SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Berhasil Menghapus!',
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
           location.reload();
          }
        });
      } else {
        // Show a SweetAlert error message if needed
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Gagal menghapus gambar.',
        });
      }

    } catch (error) {
      // Show a SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal menghapus gambar.',
      });
      console.error('Error inserting data:', error);
    }
  };

  const handleInputEditChange = (e) => {
    const { name, value } = e.target;
    setAlbum((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchAlbumDetails = async () => {
    try {
      const response = await axios.get(`http://localhost/GALERY-VITE/api/getAlbumDetails.php?id_album=${albumId}`);
      const AlbumData = response.data;
      
      const selectedAlbum = AlbumData.AlbumID ? AlbumData[AlbumData.AlbumID] : AlbumData[0];

      // Set state dengan data yang dipilih
      setAlbum(prevAlbumData => ({ ...prevAlbumData, ...selectedAlbum }));
      
    } catch (error) {
      console.error('Error fetching image details:', error);
    }
  };
  

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost/GALERY-VITE/api/getFotoInAlbum.php?id_album=${albumId}`);
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchAlbumDetails();
    fetchImages();
  }, []);

  return (
    <div className='row' >
       <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Ganti Foto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form.Group controlId="formAlbum" className="mb-3">
            <Form.Label>Nama Album</Form.Label>
            <Form.Control type="text" name='NamaAlbum' value={albumData.NamaAlbum} onChange={handleInputEditChange}/>
            <Form.Label>Deskripsi</Form.Label>
            <textarea className="form-control" name="Deskripsi" id="deskripsi" value={albumData.Deskripsi} onChange={handleInputEditChange} cols="30" rows="5"></textarea>
          </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" className='rounded-pill' onClick={handleClose}>
              Tutup
            </Button>
            <Button variant="primary" className='rounded-pill' onClick={handleEditAlbum}>
              Simpan
            </Button>
          </Modal.Footer>
        </Modal>
      <div className='col-3 border text-light me-3' style={{ background: "rgb(255,0,241)", position:"fixed", minHeight:"80%", borderRadius:"20px", 
        background:"linear-gradient(0deg, rgba(255,0,241,0) 0%, rgba(89,18,162,1) 100%)"}}>
        <div className='p-4'>
            <div className='d-flex'>
              <div className='col'>
                <h3>{albumData.NamaAlbum}</h3>
                <p className='blockquote-footer text-light py-2'>{albumData.TanggalDibuat}</p>
              </div>
              { userID == albumData.UserID ? (
              <div className='col-1 align-items-center'>
                <a href='#' className='text-light' onClick={handleShow}><FaPen /></a>
              </div>) : null}
            </div>
            <div className="d-flex justify-content-between mb-3" style={{ fontSize: "16px" }}>
              <div className='col d-flex align-items-center'>
                <img
                  src={albumData.FileFoto ? albumData.FileFoto :'../../public/profile.jpg'}
                  className="border rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                  alt="Profile"
                />
                <p className='m-0 mx-2 text-center'>{albumData.Username ? albumData.Username : 'unknown'}</p>
              </div>    
            </div>
            <div>
              <p>{albumData.Deskripsi}</p>
            </div>
          </div>
        </div>
    <div className='col' style={{marginLeft:"30%"}}>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 4 }}>
        <Masonry gutter="16px">
        {images.map((image) => (
          <div key={image.FotoID} style={{ position: 'relative',}}>
            <div key={image.FotoID} style={{ position: 'relative', width: '100%', marginBottom: '16px',cursor:'pointer'}} onClick={() => detailImage(image.FotoID)}>
              <img
                src={image.LokasiFile}
                style={{ width: '100%', display: 'block', borderRadius: '10px', border: '2px solid #a6a6a6', cursor: 'zoom-in'}}
                alt={image.JudulFoto}
                onMouseEnter={(e) => (  e.currentTarget.style.filter = 'brightness(0.8)')}
                onMouseLeave={(e) => (  e.currentTarget.style.filter = 'brightness(1)')}
              />
              {image.JudulFoto && <p style={{ marginTop: '8px', textAlign: 'center' }} >{image.JudulFoto}</p>}
            </div>
              <div onClick={() => openDropdown(image.FotoID)} style={{ zIndex: -1, width:'30px', height:'30px',fontSize:'19px',textAlign:'center',position: 'absolute', top: '8px', right: '8px', cursor: 'pointer',  backgroundColor: '',zIndex: 1, borderRadius:'50%', transition: 'opacity 0.3s'}} onMouseEnter={(e) => ( e.currentTarget.style.backgroundColor = '#f2f2f2')}
                onMouseLeave={(e) => ( e.currentTarget.style.backgroundColor = '')}>
                <span>&#x022EE;</span>
                {dropdownState[image.FotoID] && (
                  <div
                    onMouseEnter={() => openDropdown(image.FotoID)}
                    onMouseLeave={() => {
                      setTimeout(() => closeDropdown(image.FotoID), 300);
                    }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      background: '#ffffff',
                      boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                      borderRadius: '5px',
                      padding: '8px',
                      zIndex: 2,
                      width:'50px',
                      fontSize:'10px'
                    }}
                  >
                    <a href={`/edit-image/${image.FotoID}`}><p>Edit</p></a>
                    <a href='#'onClick={() => handleDelete(image.FotoID)}><p>Delete</p></a>

                  </div>
                )}

              </div>
          </div>
            
          ))}
        </Masonry>
      </ResponsiveMasonry>  
    </div>
    </div>
  );
};

export default Album;
