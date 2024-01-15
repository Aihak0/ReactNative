
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';


function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('UserID') !== null);

  const handleLogout = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Anda ingin Logout?',
    }).then((result) => {
      if (result.isConfirmed || result.isDismissed) {
        sessionStorage.removeItem('UserID');
        setIsLoggedIn(false); // Set isLoggedIn to false upon logout
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
              <li><Link to="#" className="nav-link" onClick={handleLogout}>Logout</Link></li>
            </>
          )}
          {!isLoggedIn && (
            <li><Link to="/login" className="nav-link">Login</Link></li>
          )}
          <li><Link to="#" className="nav-link-profile"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAflBMVEX///8AAAClpaWKiorNzc3a2tr4+PjCwsL09PTn5+fd3d3s7Oy7u7u+vr77+/ugoKBSUlJGRkZycnJLS0ubm5sdHR2BgYHIyMhlZWVvb2+rq6sxMTE+Pj6QkJAsLCx6enoSEhJdXV0aGholJSULCwtJSUkuLi6zs7M2NjZBQUFA1vW2AAAEy0lEQVR4nO2c6VbiQBSEaQUFFBcWFQQBd9//BUfpbiCVQLbO3Nuc+n6NzMRTNYTctWm1CCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQogyev2OtISGMcbMpDU0yuDX4Yu0iEaZ/zo0bWkVDdL/M2iepGU0yHDj0FxJ62iMrjVoFtJCGmPsHBppIY3hDZpraSUNMdg6/JCW0hCjrUPTl9bSCP2dQbOUFtMIwz2H5kZaTQN09w2aM2k5DTBOOHyTltMAq4TDE0xOB0mDZi0tKDgjcHhyyWkfDZpzaUmBWaYcnlhyepE2aL6kRQXlNsPhXFpUUF4zHJpT6rpdZhk0Q2lZAfnIdGgupHUFw4eKe3B4Ky0sGD5UdMHhRFpYKLyxcWsKFh+lpQXCh4qrVgcc3klLC4SrKqa/f3wGiz1pbUHwoeIv/H2Bw9NITu+smZ/NDxgwhLUFoee82B7pOTg8heR0mXi3rsDhs6y4EPiqYux+XoPF+JPTM+ek635+BIdTUXUhmFgjuyz7DSx2j1wcA/4t292MZ+BwfOTqGEiEig1Y7r/LiQuBryoGe69hy+ZSTF0IHqyJ1f5r2HaLOjm9yfysYZkYc3LqnyrJYv4aHD4IqQuBiww4LXwHi/GO2nyowInvAhzGuwfmQsUIX8duxqeEuBD4qiIdDp7AYqyjtqxQYWmDw0j3wHzyktUz/AaLcY7aZpmhIvl3njiT00l2qLCAwyi7GT5UZGcsD+BwkPmvdLO20g9knT1wGOEe2OFQYbkDi/Htgbnb8OBoAgdu0e2B+ari8O4T7NdEl5weCxUWHHzHtgfmqoojhREmp5EdUvBp2bHiFkdtcSWnx0OFBUdtUe2B+VBxfAI6B4sxJacuVOSsWGI3I6ZDCk5yXu0ODiNKTmcFFWM3I55DCp+5ocKCo7afvAu0UCRUWLCbEcuobV346Y/djEiSU3/vFYngL2Axjj0wP6rvtPPBQjiKPbAbU4MoDilgk6kcMeyB4UerHBEkp/h4LIv+5BRDXFnU74H5UDE8Lwg+TdUnpy5UrIpfgU037XtgTmaJLj023ZTvgfntyjJrQDgR1p2cug3ZUvnlGByqPqTgQ0WpBjY23VTvgblQcV/uKmy6KU5O82YVB8Cmm+I9MNeVKH2MAptuevfAqt5luN+udg/MCy0/Y8FnjdY9sO8KocKCTTele2CVQoUFm25KR20uVKQ2oIqwBocqk1P/PlR6EGJVqTI5dZ+lVbWrcb9dY3JaNVRYcL9d4R6YDxUVO56p4+z6uhnuNqtcGGByqm7Utn8ErxKpDpa2gDGv/QxEh8oqjMf6spS3pHx1UCOhTN2mqt5EP5F/rfE70l8OEkxeAPzXXtSa//2gQ0XN4W1pUGtzK/VB1FNE7XZFaxXn2HNTtHS6a0LUWqZIO9TysNkrX2sdec2a6ajYdUtsNtX45KSq4A0Kaozk97BNqndz8cxeiBs/AD1MmFcVHzZdHEFtWQs+UXuzrP/310W77Bt5kdrJSDC6FimlFmtc1N7jbbRcFGu1dMaLKR4RyuDlafHft6RzRRXrSJXY3GjYUIrTdzg+y6HgXXqb93s88R40JYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghpAb/AAfZJ8S7sZIFAAAAAElFTkSuQmCC" alt="Profile" /></Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
