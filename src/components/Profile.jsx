import React, { useState,useEffect } from 'react';
import "./style.css";
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus } from "react-icons/fa";
import Modal from 'react-modal';

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
    let subtitle;
    const [activeTab, setActiveTab] = useState('foto');
    const userID = sessionStorage.getItem('UserID') || 0;
    const [dropdownState, setDropdownState] = useState({});
    const [images, setImages] = useState([]);
    const [albums, setAlbums] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        AlbumID:0 ,
        FotoID: 0,
      });


    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal(photoId) {

        setFormData({
              ...formData,
              FotoID: photoId
            })
      setIsOpen(true);
    }
  
    function afterOpenModal() {
    }
  
    function closeModal() {
      setIsOpen(false);
    }
    


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
    const detailAlbum = (albumID) => {
        navigate('/album/'+albumID);
    };

    const handleSaveToAlbum = async () => {
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });
            console.log(formData);
            const response = await axios.post('http://localhost/GALERY-VITE/api/updateAlbum.php',formDataToSend);
            if (response.data.success) {
               console.log("berhasil");
               fetchAlbum();
               fetchImages();
            } else {
              console.log("gagal");
              console.log(response.data);
            }
    
            } catch (error) {
            console.error('Error inserting data:', error);
            }
        closeModal();
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

    useEffect(() => {
        fetchAlbum();
        fetchImages();
      }, []);

      const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#644f75',
        cursor: 'pointer',
        padding: '20px',
        height: '200px',
        color: 'white',
        borderRadius: '10px',
        textAlign: 'center',
      };
      
      const redBoxStyle = {
        width: '100%',
        height: '125px', // Set tinggi sesuai kebutuhan Anda
      };
  
    return (
        <>
            <div className="ProfileContainer">
                <div className="Profile">
                    <img src="../../public/profile.jpg" alt="Profile" />
                    <h1>Nama</h1>
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
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <h4>Pilih Album</h4>
                <select name="album" id="" className='form-a-control'  onChange={(e) =>
                    setFormData({
                    ...formData,
                    AlbumID: e.target.value
                    })
                }>
                    {albums.map((album) => (
                        <option key={album.AlbumID} value={album.AlbumID}>{album.NamaAlbum}</option>
                    ))}
                </select>
                <button onClick={handleSaveToAlbum}>Simpan</button>
            </Modal>
            <div className="ContainerContent">
                <div className={`foto ${activeTab === 'foto' ? 'active' : ''}`}>
                <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 5 }}>
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
                                <a href='#' onClick={() => openModal(image.FotoID)}>
                                    <p>+ Album</p>
                                </a>

                                </div>
                            )}

                            </div>
                        </div>
                        
                        ))}
                    </Masonry>
                    </ResponsiveMasonry>
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
                    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 4 }}>
                        <Masonry gutter='16px'>
                            {albums.map((album) => (
                                <div key={album.AlbumID} style={containerStyle} onClick={() => detailAlbum(album.AlbumID)}>
                                    <div style={redBoxStyle}>
                                    <img style={{ width: '100%', height: '100%', borderRadius:"10px", objectFit: 'cover'
                                    }} src={album.LokasiFile ? album.LokasiFile : '../../assets/select-image.jpeg'} alt="" />
                                    </div>
                                    <h5 style={{ marginBottom: '5px' }}>{album.NamaAlbum}</h5>
                                </div>
                            ))}
                        </Masonry>
                    </ResponsiveMasonry>
                
                </div>
            </div>
            </div>
        </>
    )
}

export default Profile;