
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from './AuthContext';
import { FaAngleDown } from "react-icons/fa6";
import 'bootstrap/dist/css/bootstrap.min.css';


function Header() {
  const { isLoggedIn } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDropdownAlbumOpen, setDropdownAlbumOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownAlbum = () => {
    setDropdownAlbumOpen(!isDropdownAlbumOpen);
  };

  const { logout } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Anda yakin?',
      text: "Anda akan logout!",
      showCancelButton: true,
      confirmButtonText: "Ya"
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('UserID');
        logout();
        Swal.fire({
          title: "Anda Berhasil Logout!",
          icon: "success"
        });
      }
    });
  };


  return (
    <header>
      <div className="App-header">
        <nav className='nav'>
          <ul className="nav-list">
            <li><Link to="/" className="navbar-brand"><img src="../../public/Logo2.png"  width="60" height="60"  alt="Logo" /></Link></li>
            <li className='nav-item mx-3'><Link to="/" className="btn btn-light rounded-pill">Beranda</Link></li>
          </ul>
          <ul className="nav-list-right">
            {isLoggedIn && (
              <>
                <li><Link to="/add-image" className="btn btn-primary rounded-pill">Upload</Link></li>
              </>
            )}
            {!isLoggedIn && (
              <li className='nav-item mx-3'><Link to="/login" className="btn btn-light rounded-pill">Login</Link></li>
            )}
            
            <li>
              <div className="dropdown">
                  <a href='#' className='nav-item mx-3 btn btn-light rounded-pill' onClick={handleDropdownToggle}>
                    <FaAngleDown />
                  </a>
                  {isDropdownOpen && (
                    <ul className="dropdown-menu" style={{right:0}}>
                            <li><Link to="/profile" className="dropdown-item">Profile</Link></li>
                      {isLoggedIn && (
                      <>
                            <li className='border-bottom'></li>
                            <li><Link to="#" className="dropdown-item" onClick={handleLogout}>Logout</Link></li>
                      </>
                          
                      )}
                    </ul>
                    )}
                </div>
            </li>
            <li>
                  <div className="nav-link-profile ">
                    <img src="../../public/profile.jpg" alt="Profile" />
                  </div>
            </li>
          </ul>
        </nav>
      </div>
      <div className='d-flex justify-content-start my-2' style={{ marginLeft: "10%", marginRight: "10%", overflow: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <div className="scroll-container d-flex" style={{ marginRight: "-15px" }}>
          <button className='btn btn-light btn-sm mx-1 rounded-pill'>Makanan</button>
        </div>
      </div>


    </header>
  );
}

export default Header;
