import React, { useState, useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useNavigate } from 'react-router-dom';
import { BiMessageSquareDetail } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import axios from 'axios';
import Swal from 'sweetalert2';

const ImageGallery = ({selectedFilter }) => {
  const [dropdownState, setDropdownState] = useState({});
  const [images, setImages] = useState({
    all:[
    ],
    fav:[
    ],
    album:[
    ]
  });
  const navigate = useNavigate();
  const userID = sessionStorage.getItem('UserID') || 0;

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
    navigate('/detail/' + fotoID);
  };
  const detailAlbum = (AlbumID) => {
    navigate('/album/' + AlbumID);
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
     
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal menghapus gambar.',
      });
      console.error('Error inserting data:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost/GALERY-VITE/api/getFoto.php');
      const selectedImageData = response.data ? response.data : [];
  
      // Menampilkan data yang diterima dari server di console
      console.log('Data yang diterima:', selectedImageData);
  
      // Set state dengan data yang diterima dari server
      setImages(selectedImageData);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };
  
  useEffect(() => {
    fetchImages();
  }, []);
  
  

  return (
    
    <div className='pb-3'>
        { selectedFilter == 'all' ? (
        <>
          <div className='justify-content-start my-2 pb-2 border-bottom '>
          <h5 className='m-2'>Album</h5>
          <div className='d-flex overflow-auto mb-3'>
            {images.album.map((image,index) => (
              <div key={index} className='me-3' style={{width: "250px", cursor:"pointer"}} onClick={() => detailAlbum(image.AlbumID)}>
                <div className=' d-flex' style={{ width: "250px",height:"150px"}}>
                  <div className='col p-0 border me-1' style={{borderRadius:"10px 0 0 10px ", overflow: "hidden"}}>
                      <img src={image.Foto1 ? image.Foto1 :"../../assets/select-image.jpeg"} className='w-100 h-100' alt="Foto" style={{objectFit: "cover",}}/>
                  </div>
                  <div className='col p-0 border ' style={{borderRadius:"0 10px 10px 0 ", overflow: "hidden"}}>
                    <img src={image.Foto2 ? image.Foto2 :"../../assets/select-image.jpeg"} className='w-100 h-100' alt="Foto" style={{objectFit: "cover",}}/>
                  </div>
                </div>
                <div className='mx-2'>
                  <blockquote className="blockquote my-2">
                    <p className="mb-0 h6 mt-2">{image.NamaAlbum}</p>
                  </blockquote>
                  <div className="d-flex justify-content-between" style={{ fontSize: "12px" }}>
                    <div className='col d-flex align-items-center'>
                      <img
                        src={image.UserFoto ? image.UserFoto : '../../public/profile.jpg'}
                        className="border rounded-circle"
                        style={{ width: "30px", height: "30px" }}
                        alt="Profile"
                      />
                      <p className='m-0 mx-2 text-center'>{image.Username ? image.Username : 'unknown'}</p>
                    </div>    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <h5 className='m-2'>More</h5>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 5 }}>
          <Masonry gutter="16px">
            {images.all.map((image,index) => (
              <div key={index} style={{ position: 'relative', marginBottom: '16px', cursor: 'pointer' }} onClick={() => detailImage(image.FotoID)}>
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
                {image.JudulFoto &&
                  <blockquote className="blockquote my-2">
                    <p className="mb-0 h6 mt-2">{image.JudulFoto}</p>
                  </blockquote>
                }
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
                  <div className='col-3 right d-flex align-items-center'>
                    <span className='d-flex align-items-center me-1'><FaRegHeart className='me-1'/> {image.JumlahLike}</span>
                    <span className='d-flex align-items-center'> 
                      <BiMessageSquareDetail className='me-1'/> {image.JumlahKomentar}
                    </span>
                  </div>
                </div>
                {userID === image.UserID && (
                  <div onClick={() => openDropdown(image.FotoID)} style={{ position: 'absolute', top: '8px', right: '8px', cursor: 'pointer', backgroundColor: '', borderRadius: '50%', transition: 'opacity 0.3s' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f2f2f2')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}>
                    <span>&#x022EE;</span>
                    {dropdownState[image.FotoID] && (
                      <div onMouseEnter={() => openDropdown(image.FotoID)} onMouseLeave={() => { setTimeout(() => closeDropdown(images.all.FotoID), 300); }} style={{ position: 'absolute', top: '100%', right: 0, background: '#ffffff', boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)', borderRadius: '5px', padding: '8px', width: '50px', fontSize: '10px' }}>
                        <a href={`/edit-image/${image.FotoID}`}><p>Edit</p></a>
                        <a href='#' onClick={() => handleDelete(image.FotoID)}><p>Delete</p></a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
        </>
        ) : selectedFilter == 'album' ? (
        <>
        <div className='d-flex overflow-auto mb-3'>
            {images.album.map((image,index) => (
              <div key={index} className='me-3' style={{width: "250px", cursor:"pointer"}} onClick={() => detailAlbum(image.AlbumID)}>
                <div className=' d-flex' style={{ width: "250px",height:"150px"}}>
                  <div className='col p-0 border me-1' style={{borderRadius:"10px 0 0 10px ", overflow: "hidden"}}>
                      <img src={image.Foto1 ? image.Foto1 :"../../assets/select-image.jpeg"} className='w-100 h-100' alt="Foto" style={{objectFit: "cover",}}/>
                  </div>
                  <div className='col p-0 border ' style={{borderRadius:"0 10px 10px 0 ", overflow: "hidden"}}>
                    <img src={image.Foto2 ? image.Foto2 :"../../assets/select-image.jpeg"} className='w-100 h-100' alt="Foto" style={{objectFit: "cover",}}/>
                  </div>
                </div>
                <div className='mx-2'>
                  <blockquote className="blockquote my-2">
                    <p className="mb-0 h6 mt-2">{image.NamaAlbum}</p>
                  </blockquote>
                  <div className="d-flex justify-content-between" style={{ fontSize: "12px" }}>
                    <div className='col d-flex align-items-center'>
                      <img
                        src={image.UserFoto ? image.UserFoto : '../../public/profile.jpg'}
                        className="border rounded-circle"
                        style={{ width: "30px", height: "30px" }}
                        alt="Profile"
                      />
                      <p className='m-0 mx-2 text-center'>{image.Username ? image.Username : 'unknown'}</p>
                    </div>    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>) : selectedFilter == 'fav' ? (
        <>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 5 }}>
          <Masonry gutter="16px">
            {images.fav.map((image,index) => (
              <div key={index} style={{ position: 'relative', marginBottom: '16px', cursor: 'pointer' }} onClick={() => detailImage(image.FotoID)}>
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
                {image.JudulFoto &&
                  <blockquote className="blockquote my-2">
                    <p className="mb-0 h6 mt-2">{image.JudulFoto}</p>
                  </blockquote>
                }
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
                  <div className='col-3 right d-flex align-items-center'>
                    <span className='d-flex align-items-center me-1'><FaRegHeart className='me-1'/> {image.JumlahLike}</span>
                    <span className='d-flex align-items-center'> 
                      <BiMessageSquareDetail className='me-1'/> {image.JumlahKomentar}
                    </span>
                  </div>
                </div>
                {userID === image.UserID && (
                  <div onClick={() => openDropdown(image.FotoID)} style={{ position: 'absolute', top: '8px', right: '8px', cursor: 'pointer', backgroundColor: '', borderRadius: '50%', transition: 'opacity 0.3s' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f2f2f2')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}>
                    <span>&#x022EE;</span>
                    {dropdownState[image.FotoID] && (
                      <div onMouseEnter={() => openDropdown(image.FotoID)} onMouseLeave={() => { setTimeout(() => closeDropdown(images.all.FotoID), 300); }} style={{ position: 'absolute', top: '100%', right: 0, background: '#ffffff', boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)', borderRadius: '5px', padding: '8px', width: '50px', fontSize: '10px' }}>
                        <a href={`/edit-image/${image.FotoID}`}><p>Edit</p></a>
                        <a href='#' onClick={() => handleDelete(image.FotoID)}><p>Delete</p></a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
        </>) : null}
      
    </div>
  );
};

export default ImageGallery;
