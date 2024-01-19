
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from './AuthContext';
import { FaAngleDown } from "react-icons/fa6";


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
    <header className="App-header">
      <nav className='nav'>
        <ul className="nav-list">
          <li><Link to="/" className="nav-logo">Galery</Link></li>
          <li><Link to="/" className="nav-link">Beranda</Link></li>
          <li><Link to="#" className="nav-link">#</Link></li>
        </ul>
        <ul className="nav-list-right">
          {isLoggedIn && (
            <>
              <li><Link to="/add-image" className="nav-link">Tambah Gambar</Link></li>
            </>
          )}
          {!isLoggedIn && (
            <li><Link to="/login" className="nav-link">Login</Link></li>
          )}
          <li><div className="dropdown">
                <div className="nav-link" onClick={handleDropdownAlbum}>
                  <FaAngleDown />
                </div>
                {isDropdownAlbumOpen && (
                  <ul className="dropdown-menu" style={{right:0}}>
                    {isLoggedIn && (
                      <>
                        <li><Link to="#" className="nav-link" onClick={handleLogout}>Logout</Link></li>
                      </>
                    )}
                  </ul>
                )}
              </div>
          </li>
          <li><div className="dropdown">
                <div className="nav-link-profile" onClick={handleDropdownToggle}>
                  <img src="../../public/profile.jpg" alt="Profile" />
                </div>
                {isDropdownOpen && (
                  <ul className="dropdown-menu">
                    <li><Link to="/profile">Profil</Link></li>
                    {isLoggedIn && (
                      <>
                        <li><Link to="#" className="nav-link" onClick={handleLogout}>Logout</Link></li>
                      </>
                    )}
                  </ul>
                )}
              </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
