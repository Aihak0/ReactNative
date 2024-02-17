import React, { useState, useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useNavigate } from 'react-router-dom';
import { BiMessageSquareDetail } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { CiMenuKebab } from "react-icons/ci";
import { RiEdit2Line, RiDeleteBinLine } from 'react-icons/ri';

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

  const toggleDropdown = (fotoID) => {
    if (dropdownState[fotoID] == true) {
      closeDropdown(fotoID);
    } else {
      openDropdown(fotoID);
    }
  };
  

  const detailImage = (fotoID) => {
    navigate('/detail/' + fotoID);
  };
  const detailAlbum = (AlbumID) => {
    navigate('/album/' + AlbumID);
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
            fetchImages();
          }
        });
      } else {
        // Show a SweetAlert error message if needed
         console.error('Response:', response.data);
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
      console.log('Data yang diterima:', selectedImageData);

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
                        style={{ width: "20px", height: "20px" }}
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
        <div className='justify-content-start my-2 pb-2'>
        <h5 className='m-2'></h5>
          <div className="image-gallery">
          {images.all.map((image,index) => (
            <div key={index} className='kolom-gambar'>
              <div className='image-container'  onClick={() => detailImage(image.FotoID)}>
                <img src={image.LokasiFileMin} alt={image.JudulFoto}
                    onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.8)')}
                    onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')} />
              </div>
              <div className='d-flex justify-content-between align-items-center'>
                {image.JudulFoto &&
                  <blockquote className="blockquote my-2 "  onClick={() => detailImage(image.FotoID)}>
                    <p className="mb-0 h6 mt-2 ">{image.JudulFoto}</p>
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
                        </ul>
                      )}
                    </a>

                    </>
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-between" style={{ fontSize: "12px" }}>
                <div className='col d-flex align-items-center'>
                  <img
                    src={image.FileFoto ? image.FileFoto : '../../public/profile.jpg'}
                    className="border rounded-circle"
                    style={{ width: "20px", height: "20px" }}
                    alt="Profile"
                  />
                  <p className='m-0 mx-2 text-center'>{image.Username ? image.Username : 'unknown'}</p>
                </div>
                <div className='float-end align-items-center'  onClick={() => detailImage(image.FotoID)}>
                  <div className='d-flex align-items-center'>
                    <span className='d-flex align-items-center me-1'><FaRegHeart className='me-1'/> {image.JumlahLike}</span>
                    <span className='d-flex align-items-center'> 
                      <BiMessageSquareDetail className='me-1'/> {image.JumlahKomentar}
                    </span>
                  </div>
                </div>
              </div>
              
            </div>
          ))}
          </div>
        </div>
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
          <div className="image-gallery">
          {images.all.map((image,index) => (
            <div key={index} className='kolom-gambar'>
              <div className='image-container'  onClick={() => detailImage(image.FotoID)}>
                <img src={image.LokasiFileMin} alt={image.JudulFoto}
                    onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.8)')}
                    onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')} />
              </div>
              <div className='d-flex justify-content-between align-items-center'>
                {image.JudulFoto &&
                  <blockquote className="blockquote my-2"  onClick={() => detailImage(image.FotoID)}>
                    <p className="mb-0 h6 mt-2">{image.JudulFoto}</p>
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
                        </ul>
                      )}
                    </a>
                    </>
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-between" style={{ fontSize: "12px" }}>
                <div className='col d-flex align-items-center'>
                  <img
                    src={image.FileFoto ? image.FileFoto : '../../public/profile.jpg'}
                    className="border rounded-circle"
                    style={{ width: "20px", height: "20px" }}
                    alt="Profile"
                  />
                  <p className='m-0 mx-2 text-center'>{image.Username ? image.Username : 'unknown'}</p>
                </div>
                <div className='float-end align-items-center'  onClick={() => detailImage(image.FotoID)}>
                  <div className='d-flex align-items-center'>
                    <span className='d-flex align-items-center me-1'><FaRegHeart className='me-1'/> {image.JumlahLike}</span>
                    <span className='d-flex align-items-center'> 
                      <BiMessageSquareDetail className='me-1'/> {image.JumlahKomentar}
                    </span>
                  </div>
                </div>
              </div>
              
            </div>
          ))}
          </div>
        </>) : null}
      
    </div>
  );
};

export default ImageGallery;
