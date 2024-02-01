import React, { useState, useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const ImageGallery = () => {
  const [dropdownState, setDropdownState] = useState({});
  const [images, setImages] = useState([]);
  const [imageOrientations, setImageOrientations] = useState({});
  const navigate = useNavigate();

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

  const getImageOrientation = async (url, fotoID) => {
    const img = new Image();
    img.src = url;

    return new Promise((resolve, reject) => {
      img.onload = function () {
        const width = this.width;
        const height = this.height;
        resolve({ [fotoID]: height > width ? 'portrait' : 'landscape' });
      };

      img.onerror = function () {
        reject(new Error('Failed to load image'));
      };
    });
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost/GALERY-VITE/api/getFoto.php');
        setImages(response.data);

        // Fetch image orientations
        const orientationPromises = response.data.map((image) => getImageOrientation(image.LokasiFile, image.FotoID));
        Promise.all(orientationPromises)
          .then((orientations) => {
            const orientationObject = orientations.reduce((acc, current) => ({ ...acc, ...current }), {});
            setImageOrientations(orientationObject);
          })
          .catch((error) => console.error('Error fetching image orientations:', error));
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className=''>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 5 }}>
        <Masonry gutter="16px">
          {images.map((image) => (
            <div key={image.FotoID} style={{ position: 'relative' }}>
              <div key={image.FotoID} style={{ position: 'relative', width: '100%', marginBottom: '16px', cursor: 'pointer' }} onClick={() => detailImage(image.FotoID)}>
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
                  className={imageOrientations[image.FotoID] === 'portrait' ? 'portrait-image' : 'landscape-image'}
                />
                {image.JudulFoto &&
                  <blockquote className="blockquote my-2">
                    <p className="mb-0 h6 mt-2">{image.JudulFoto}</p>
                  </blockquote>
                }
                <div className="d-flex align-items-center" style={{ fontSize: "12px" }}>
                  <img
                    src="../../public/profile.jpg"
                    className="border rounded-circle"
                    style={{ width: "30px", height: "30px" }}
                    alt="Profile"
                  />
                  <p className='m-0 mx-2 text-center'>Nama</p>
                </div>
              </div>
              <div onClick={() => openDropdown(image.FotoID)} style={{ zIndex: -1, width: '30px', height: '30px', fontSize: '19px', textAlign: 'center', position: 'absolute', top: '8px', right: '8px', cursor: 'pointer', backgroundColor: '', zIndex: 1, borderRadius: '50%', transition: 'opacity 0.3s' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f2f2f2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}>
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
                      width: '50px',
                      fontSize: '10px'
                    }}
                  >
                    <a href={`/edit-image/${image.FotoID}`}><p>Edit</p></a>
                    <a href='#' onClick={() => handleDelete(image.FotoID)}><p>Delete</p></a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default ImageGallery;
