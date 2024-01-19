import React, { useState, useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useNavigate,useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Album = () => {
  const [dropdownState, setDropdownState] = useState({});
  const [images, setImages] = useState([]);
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
  

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost/GALERY-VITE/api/getFotoInAlbum.php?id_album=${albumId}`);
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
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

                </div>
              )}

            </div>
        </div>
          
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default Album;
