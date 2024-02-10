import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRef } from 'react';
import Swal from 'sweetalert2';
import defaultProfileImage from '../../public/profile.jpg';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


const Setting = () => {
  
  const userID = sessionStorage.getItem('UserID') || 0;
  const [show, setShow] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [user, setUser] = useState({
    action: 'updateDetail',
    UserID: userID,
    FileFoto: null,
    Username: '',
    Email: '',
    NamaLengkap: '',
    Alamat: '',
  });

  
  const handleFileChange = (files) => {
    const file = files[0];
    if (file) {
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setUser((prevData) => ({
        ...prevData,
        FileFoto: file,
      }));
    }
  };
  

  const handleEditFoto = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('UserID', user.UserID);
    formDataToSend.append('FileFoto', user.FileFoto);
    formDataToSend.append('action', 'UpdateFoto');

    console.log(user);
  
    try {
      const response = await axios.post(`http://localhost/GALERY-VITE/api/editUserProfile.php`, formDataToSend);
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Berhasil Mengupdate!',
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            fetchUserData();
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
      // Show a SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal mengupdate akana.',
      });
      console.error('Error updating data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.entries(user).forEach(([key, value]) => {
      if (key !== 'FileFoto') {
        formDataToSend.append(key, value);
      }
    });

    console.log(formDataToSend);
    console.log(user);

    try {
      const response = await axios.post(`http://localhost/GALERY-VITE/api/editUserProfile.php`, formDataToSend);
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Berhasil Mengupdate!',
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            fetchUserData();
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
      // Show a SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal mengupdate akana.',
      });
      console.error('Error updating data:', error);
    }
  };
  
  
  
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost/GALERY-VITE/api/getProfileDetail.php?user_id=${userID}`);
      const selectedUserData = response.data[0] || {};
      setUser((prevUser) => ({ ...prevUser, ...selectedUserData }));
    } catch (error) {
      console.error('Error fetching User:', error);
    }
  };
  useEffect(() => {
    console.log(user);
    fetchUserData();
  }, [userID]);

  
  return (
      <div className='row'>
        <nav className="col-md-3 d-none d-md-block sidebar">
          <div className="sidebar-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Edit Profile
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Ganti Foto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Pilih Gambar</Form.Label>
            <Form.Control type="file" accept='image/*' onChange={(e) => handleFileChange(e.target.files)}/>
          </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className='rounded-pill' onClick={handleClose}>
              Tutup
            </Button>
            <Button variant="primary" className='rounded-pill' onClick={handleEditFoto}>
              Simpan
            </Button>
          </Modal.Footer>
        </Modal>
      
        <div className='col'>
          <h5 className='mb-3'>Edit Profile</h5>
          <div className='col mb-3'>
            <p className='mb-2'>Foto</p>
            <div className='d-flex align-items-center'>
            <div className='col-2 me-1'>
            <img
              className='border rounded-circle'
              src={imagePreview ? imagePreview : user.FileFoto ? user.FileFoto : "../../public/profile.jpg"}
              alt='Foto'
              style={{ width: '100px' }}
            />
           
          </div>
            <div className='col'>
              <Button variant="light" className='rounded-pill' onClick={handleShow}>
                Ganti
              </Button>
            </div>
          </div>
          <div className="row mb-3">
            <div className="form-group col-md-6">
              <label htmlFor="inputNama">Nama</label>
              <input
                type="text"
                className="form-control"
                id="inputNama"
                name='NamaLengkap'
                placeholder="Nama Lengkap"
                value={user.NamaLengkap}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputUsername">Username</label>
              <input type="text" name='Username' className="form-control" id="inputUsername" placeholder="Username" value={user.Username}  onChange={handleInputChange}/>
            </div>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="inputEmail">Email</label>
            <input type="email" name='Email' className="form-control" id="inputEmail" placeholder="Email" value={user.Email}  onChange={handleInputChange}/>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="inputAddress">Alamat</label>
            <input type="text" name='Alamat' className="form-control" id="inputAddress" placeholder="Alamat" value={user.Alamat}  onChange={handleInputChange}/>
          </div>
        <button className='btn btn-primary' onClick={handleEditSubmit}>Simpan</button>
        </div>
      </div>
    </div>
    
  );
};

export default Setting;
