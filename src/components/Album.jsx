import React, { useState, useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useNavigate,useParams, Link } from 'react-router-dom';
import { FaPen, FaRegHeart } from "react-icons/fa";
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { BiMessageSquareDetail } from "react-icons/bi";
import { CiMenuKebab } from "react-icons/ci";
import { RiEdit2Line, RiDeleteBinLine } from 'react-icons/ri';
import moment from 'moment-timezone';

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
    created_at: '',
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

  const toggleDropdown = (fotoID) => {
    if (dropdownState[fotoID] == true) {
      closeDropdown(fotoID);
    } else {
      openDropdown(fotoID);
    }
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

  const handleDeleteConfirmation = (data, id, name) => {
    const truncatedName = name.length > 20 ? name.slice(0, 20) + '...' : name;
    const title = 'Hapus' + (data === 1 ? ' foto ' + truncatedName : ' album')  + '?';
  
    Swal.fire({
      title: title,
      text: "Anda tidak akan dapat mengembalikan ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await handleDelete(data, id);
      }
    });
  };
  

  const handleDelete = async (data, id) => {
    try {
      let response = null;
      data == 1 ? 
      response = await axios.post(`http://localhost/GALERY-VITE/api/deleteImage.php?id=${id}`)
      : response = await axios.post(`http://localhost/GALERY-VITE/api/deleteAlbum.php?id=${id}`)
    if (response.data.success) {
        // Show a SweetAlert success message
        Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Berhasil Menghapus!',
        }).then((result) => {
        if (result.isConfirmed || result.isDismissed) { 
          data == 1 ? fetchImages() : navigate(-1);
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

  function formatTime(time){
    moment.tz.setDefault('Asia/Jakarta');

    // Mendapatkan waktu saat ini dalam zona waktu WIB
    const waktuKomentar = time; // Ganti dengan waktu komentar yang diterima dari server atau dari sumber lain
    const waktuSekarang = moment();
    const waktuKomentarFormatted = moment(waktuKomentar);
    const selisih = waktuSekarang.diff(waktuKomentarFormatted, 'seconds');

    // Format waktu relatif
    let waktuRelative;
    if (selisih < 60) {
      waktuRelative = "baru saja";
    } else if (selisih < 3600) {
      waktuRelative = Math.floor(selisih / 60) + " menit yang lalu";
    } else if (selisih < 86400) {
      waktuRelative = Math.floor(selisih / 3600) + " jam yang lalu";
    } else if (selisih < 604800) {
      waktuRelative = Math.floor(selisih / 86400) + " hari yang lalu";
    } else if (selisih < 2592000) {
      waktuRelative = Math.floor(selisih / 604800) + " minggu yang lalu";
    } else if (selisih < 31536000) {
      waktuRelative = Math.floor(selisih / 2592000) + " bulan yang lalu";
    } else {
      waktuRelative = Math.floor(selisih / 31536000) + " tahun yang lalu";
    }

    // Menyimpan waktu dalam state
    return waktuRelative;


  }

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
  
  const fetchImages = async () => {
    try {
      const response = await axios.get(`http://localhost/GALERY-VITE/api/getFotoInAlbum.php?id_album=${albumId}`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchAlbumDetails();
    fetchImages();
  }, []);

  return (
    <div className='d-flex'>

       <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Album</Modal.Title>
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
        <div className='col text-dark me-3 border rounded' style={{ 
         }}>
          <div className='p-4'>
              <div className='d-flex justify-content-between'>
                <div className='col'>
                  <h3>{albumData.NamaAlbum}</h3>
                  <p className='blockquote-footer text-dark py-2'>{formatTime(albumData.created_at)}</p>
                </div>
                { userID == albumData.UserID ? (
                <div>
                  <a  className='text-dark mx-1 btn btn-outline-info' onClick={handleShow}><FaPen /></a>
                  <a  className='text-dark mx-1 btn btn-outline-warning' onClick={() => handleDeleteConfirmation(2 ,albumData.AlbumID, albumData.NamaAlbum)}><RiDeleteBinLine /></a>
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
                  {images.length > 0 ? (
                  <>
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
                                    <ul className="list-group text-start" style={{width:"100px", position: 'absolute', top: '100%', right: 0,zIndex:1}}>
                                        <Link to={`/edit-image/${image.FotoID}`} className="list-group-item list-group-item-action">
                                          <RiEdit2Line /> Edit
                                        </Link>

                                        <Link onClick={() => handleDeleteConfirmation(1, image.FotoID, image.JudulFoto)} className="list-group-item list-group-item-action">
                                          <RiDeleteBinLine /> Delete
                                        </Link>
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
                  </>) : (
                    <>
                      <h6 className='text-dark text-center'>Tidak Ada Gambar</h6>
                    </>
                  )}
                  
            </div>
            </div>
          </div>
      
    </div>
  );
};

export default Album;
