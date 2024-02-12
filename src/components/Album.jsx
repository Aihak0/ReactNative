import React, { useState, useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useNavigate,useParams } from 'react-router-dom';
import { FaPen } from "react-icons/fa";
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { BiMessageSquareDetail } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { CiMenuKebab } from "react-icons/ci";

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
    <div className='d-flex'>
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
        <div className='col text-light me-3' style={{ background: "rgb(255,0,241)", minHeight:"80%", borderRadius:"20px", 
          background:"linear-gradient(0deg, rgba(255,0,241,0) 200px, rgba(89,18,162,1) )"}}>
          <div className='p-4'>
              <div className='d-flex justify-content-between'>
                <div className='col'>
                  <h3>{albumData.NamaAlbum}</h3>
                  <p className='blockquote-footer text-light py-2'>{albumData.TanggalDibuat}</p>
                </div>
                { userID == albumData.UserID ? (
                <div>
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
                <div className='col'></div>
              </div>
              
              <div>
                <p>{albumData.Deskripsi}</p>
              </div>
              <div className='col bg-light p-3 rounded'>
              <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 5 }}>
                <Masonry gutter="16px">
                  {images.map((image) => (
                    <div key={image.FotoID} style={{ position: 'relative', marginBottom: '16px', cursor: 'pointer' }}>
                    <div onClick={() => detailImage(image.FotoID)}>
                      <img
                        src={image.LokasiFile}
                        style={{
                          width: '100%',
                          display: 'block',
                          borderRadius: '10px',
                          cursor: 'zoom-in',
                        }}
                        alt={image.JudulFoto}
                        onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.8)')}
                        onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
                        className="ok"
                        />
                        </div>
                        <div className='text-dark'>
                        <div className='d-flex justify-content-between align-items-center'>
                          {image.JudulFoto &&
                            <blockquote className="blockquote my-2"  onClick={() => detailImage(image.FotoID)}>
                              <p className="mb-0 h6 mt-2">{image.JudulFoto}</p>
                            </blockquote>
                          }
                          <div className='col-1'>
                          {userID === image.UserID && (
                            <>
                              <a  className='text-dark' onClick={() => toggleDropdown(image.FotoID)}>
                              <CiMenuKebab />
                              </a>
                              {dropdownState[image.FotoID] && (
                                    <ul className="dropdown-menu" style={{right:0,zIndex:1}}>
                                      <li><Link to={`/edit-image/${image.FotoID}`} className="dropdown-item">Edit</Link></li>
                                      <li><Link onClick={() => handleDelete(image.FotoID)} className="dropdown-item">Delete</Link></li>
                                    </ul>
                              )}
                              </>
                            )}
                          </div>
                      </div>
                      <div className="d-flex justify-content-between" style={{ fontSize: "12px" }}>
                        <div className='col d-flex align-items-center'>
                          <img
                            src={image.FileFoto ? image.FileFoto : '../../public/profile.jpg'}
                            className="border rounded-circle"
                            style={{ width: "30px", height: "30px" }}
                            alt="Profile"
                            />
                          <p className='m-0 mx-2 text-center'>{image.Username ? image.Username : 'unknown'}</p>
                        </div>
                        <div className='col-3 right d-flex align-items-center'  onClick={() => detailImage(image.FotoID)}>
                          <span className='d-flex align-items-center me-1'><FaRegHeart className='me-1'/> {image.JumlahLike}</span>
                          <span className='d-flex align-items-center'> 
                            <BiMessageSquareDetail className='me-1'/> {image.JumlahKomentar}
                          </span>
                        </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            </div>
            </div>
          </div>
      
    </div>
  );
};

export default Album;
