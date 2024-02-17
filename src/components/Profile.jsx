import React, { useState,useEffect } from 'react';
import "./style.css";
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus, FaRegHeart } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { CiMenuKebab } from "react-icons/ci";
import { RiEdit2Line, RiDeleteBinLine } from 'react-icons/ri';
import { BiMessageSquareDetail } from "react-icons/bi";
import { LuPlusCircle } from "react-icons/lu";
import moment from 'moment-timezone';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 3,
      width:"300px"
    },
  };

const Profile = () => {
    const [activeTab, setActiveTab] = useState('foto');
    const userID = sessionStorage.getItem('UserID') || 0;
    const [dropdownState, setDropdownState] = useState({});
    const [images, setImages] = useState([]);
    const [albums, setAlbums] = useState([]);
    const navigate = useNavigate();
    const [formDataAlbum, setFormDataAlbum] = useState({
        AlbumID:0 ,
        FotoID: 0,
      });
      const [user, setUser] = useState({
        UserID:0,
        Username: 'Unnamed',
        FileFoto: null,
        Email: '',
        NamaLengkap: '',
        Alamat: '',
      });


      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
        const handleShow = (FotoID, AlbumID) => {
          setFormDataAlbum({
            ...formDataAlbum,
            FotoID: FotoID,
            AlbumID: AlbumID
          })
          setShow(true);
        }
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
    
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      iconColor: 'white',
      customClass: {
        popup: 'colored-toast',
      },
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })

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
    const detailAlbum = (albumID) => {
        navigate('/album/'+albumID);
    };

    const handleSaveToAlbum = async () => {
        try {
            const formDataToSend = new FormData();
            Object.entries(formDataAlbum).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });
            console.log(formDataAlbum);
            const response = await axios.post('http://localhost/GALERY-VITE/api/updateAlbum.php',formDataToSend);
            if (response.data.success) {
               Toast.fire({
                icon: 'success',
                title: response.data.message,
              })
               fetchAlbum();
               fetchImages();
            } else {
              Toast.fire({
                icon: 'error',
                title: response.data.message,
              })
              console.log("gagal");
              console.log(response.data);
            }
    
            } catch (error) {
            console.error('Error inserting data:', error);
            }
        handleClose();
      };

      const handleDeleteConfirmation = (fotoID) => {
        Swal.fire({
          title: 'Apakah Anda yakin menghapus?'+ fotoID,
          text: "Anda tidak akan dapat mengembalikan ini!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Batal'
        }).then(async (result) => {
          if (result.isConfirmed) {
            await handleDelete(fotoID);
          }
        });
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

    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };

    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost/GALERY-VITE/api/getFotoUser.php?user_id=${userID}`);
        setImages(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
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

    const fetchUser = async () => {
        try {
          const response = await axios.get(`http://localhost/GALERY-VITE/api/getProfileDetail.php?user_id=${userID}`);
          const userDataFromApi = response.data;
          const selectedUserData = userDataFromApi.UserID ? userDataFromApi[userDataFromApi.UserID] : userDataFromApi[0];
    
          setUser(prevUserData => ({ ...prevUserData, ...selectedUserData }));
          
        } catch (error) {
          console.error('Error fetching User:', error);
        }
      };

    useEffect(() => {
        fetchAlbum();
        fetchImages();
        fetchUser();
        console.log(user);
      }, []);

  
    return (
        <>
            <div className="ProfileContainer">
                <div className="Profile">
                    <img src={user.FileFoto ? user.FileFoto : "../../public/profile.jpg"} className='border' alt="Profile" />
                    <h1>{user.Username}</h1>
                </div>
            </div>
            <div className="MenuContainer">
            <div className="Menu">
                <a href="#foto" className={activeTab === 'foto' ? 'active' : ''} onClick={() => handleTabClick('foto')}>
                Foto
                </a>
                <a href="#album" className={activeTab === 'album' ? 'active' : ''} onClick={() => handleTabClick('album')}>
                Album
                </a>
            </div>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Pilih Album</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <select name="album" id="" className='form-control' value={formDataAlbum.AlbumID} onChange={(e) =>
                    setFormDataAlbum({
                      ...formDataAlbum,
                      AlbumID: e.target.value
                    })
                  }>
                    {albums.map((album) => (
                      <option key={album.AlbumID} value={album.AlbumID}>{album.NamaAlbum}</option>
                    ))}
                  </select>

              </Modal.Body>
              <Modal.Footer>
                <Button variant="light" className='rounded-pill' onClick={handleClose}>
                  Tutup
                </Button>
                <Button variant="primary" className='rounded-pill' onClick={handleSaveToAlbum} disabled={!formDataAlbum.AlbumID}>
                  Simpan
                </Button>
              </Modal.Footer>
            </Modal>
            <div className="ContainerContent my-4">
              <div  className={`justify-content-start pb-2 foto ${activeTab === 'foto' ? 'active' : ''}`}>
                <h5 className='m-2'></h5>
                  <div className="image-gallery">
                  {images.map((image,index) => (
                    <div key={index} className='kolom-gambar-1'>
                      <div className='image-container-1'  onClick={() => detailImage(image.FotoID)}>
                        <img src={image.LokasiFileMin} alt={image.JudulFoto}
                            onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.8)')}
                            onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')} />
                      </div>
                      <div className='d-flex justify-content-between align-items-center'>
                        {image.JudulFoto &&
                          <blockquote className="blockquote my-2 "  onClick={() => detailImage(image.FotoID)}>
                            <p className="mb-0 h6 mt-2 text-truncate" style={{maxWidth:"160px"}}>{image.JudulFoto}</p>
                          </blockquote>
                        }
                        <div className='float-end'>
                        {userID === image.UserID && (
                          <>
                            <a className='text-dark btn btn-outline-light btn-sm rounded-circle' style={{ position: 'relative', cursor:"pointer"}} onClick={() => toggleDropdown(image.FotoID)}>
                              <CiMenuKebab />
                              {dropdownState[image.FotoID] && (
                                <ul className="list-group text-start" style={{width:"100px", position: 'absolute', top: '100%', right: 0,zIndex:1}}>
                                  <Link to={`/edit-image/${image.FotoID}`} className="list-group-item list-group-item-action">
                                    <RiEdit2Line /> Edit
                                  </Link>

                                  <Link onClick={() => handleDeleteConfirmation(image.FotoID)} className="list-group-item list-group-item-action">
                                    <RiDeleteBinLine /> Delete
                                  </Link>
                                  <Link onClick={() => handleShow(image.FotoID, image.AlbumID)} className="list-group-item list-group-item-action">
                                    <LuPlusCircle /> Album
                                  </Link>
                                </ul>
                              )}
                            </a>

                            </>
                          )}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between" style={{ fontSize: "11px" }}>
                        <div className='col d-flex align-items-center'>
                        <span className=''>{formatTime(image.created_at)}</span>
                        </div>
                        <div className='float-end align-items-center'  onClick={() => detailImage(image.FotoID)}>
                          <div className='d-flex align-items-center'>
                            <span className='d-flex align-items-center me-1'><FaRegHeart className='me-1 text-danger'/> {image.JumlahLike}</span>
                            <span className='d-flex align-items-center'> 
                              <BiMessageSquareDetail className='me-1 '/> {image.JumlahKomentar}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  ))}
                  </div>
                </div>
                <div className={`album ${activeTab === 'album' ? 'active' : ''}`}>
                    <div className='row-a' style={{display: "flex", justifyContent: "space-between", marginBottom:"30px"}}>
                        <div className='col-a-sm-2'>
                            <h3 style={{margin:0, right:0, display:"flex"}}>Album</h3>
                        </div>
                        <div className='col-a-sm-2 text-a-right'>
                            <a href="/add-album">
                                <FaPlus />
                            </a>   
                        </div>
                    </div>
                    <div className='d-grid gap-3' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(262.50px, 1px))' }}>
                      {albums.map((album,index) => (
                        <div key={index} className='' style={{ cursor:"pointer"}} onClick={() => detailAlbum(album.AlbumID)}>
                          <div className=' d-flex' style={{ height:"150px"}}>
                            <div className='col p-0 border me-1' style={{borderRadius:"10px 0 0 10px ", overflow: "hidden"}}>
                                <img src={album.Foto1 ? album.Foto1 :"../../assets/select-image.jpeg"} className='w-100 h-100' alt="Foto" style={{objectFit: "cover",}}/>
                            </div>
                            <div className='col p-0 border ' style={{borderRadius:"0 10px 10px 0 ", overflow: "hidden"}}>
                              <img src={album.Foto2 ? album.Foto2 :"../../assets/select-image.jpeg"} className='w-100 h-100' alt="Foto" style={{objectFit: "cover",}}/>
                            </div>
                          </div>
                          <div className='mx-2'>
                            <blockquote className="blockquote my-2">
                              <p className="mb-0 h6 mt-2">{album.NamaAlbum}</p>
                            </blockquote>
                            <div className="d-flex justify-content-between" style={{ fontSize: "12px" }}>
                              <div className='col d-flex align-items-center'>
                              <span className=''>{formatTime(album.created_at)}</span>
                              </div>    
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                
                </div>
            </div>
            </div>
        </>
    )
}

export default Profile;