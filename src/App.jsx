import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import List from './components/List';
import Header from './components/Header';
import Footer from './components/Footer';
import AddImageForm from './components/AddImageForm';
import EditImage from './components/EditImage';
import Register from './components/Register';
import Login from './components/Login';
import DetailImage from './components/DetailImage';
import { AuthProvider } from './components/AuthContext';
import Profile from './components/Profile';
import Setting from './components/Setting';
import AddAlbum from './components/AddAlbum';
import Album from './components/Album';
import FilterButtons from './components/FilterButton';
import './App.css';

function App() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };
 

  return (
    <Router>
       <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <>
                <Header />
                <FilterButtons selectedFilter={selectedFilter} handleFilterChange={handleFilterChange}  />
                <div className="container p-0" style={{ marginTop: '140px'}}>
                  <List  selectedFilter={selectedFilter} />
                </div>
                <div className='container' style={{marginTop:"auto"}}>
                  <Footer />
                </div>
              </>
              }
            />
            <Route
              path="/add-image"
                  element={
                    <>
                      <Header />
                      <div className="container p-0" style={{ marginTop: '140px' }}>
                        <AddImageForm />
                      </div>
                      <div className='container' style={{marginTop:"auto"}}>
                        <Footer />
                      </div>
                    </>
                  }
                />
            <Route
              path="/add-album"
                  element={
                    <>
                      <Header />
                      <div className="container p-0" style={{ marginTop: '140px' }}>
                        <AddAlbum />
                      </div>
                      <div className='container' style={{marginTop:"auto"}}>
                        <Footer />
                      </div>
                    </>
                  }
                />
            <Route
              path="/edit-image/:id"
              element={
                <>
                  <Header />
                  <div className="container p-0" style={{ marginTop: '140px' }}>
                    <EditImage />
                  </div>
                  <div className='container' style={{marginTop:"auto"}}>
                    <Footer />
                  </div>
                </>
              }
            />
            <Route
              path="/detail/:id"
              element={
                <>
                  <Header />
                  <div className="container p-0" style={{ marginTop: '140px' }}>
                    <DetailImage />
                  </div>
                  <div className='container' style={{marginTop:"auto"}}>
                    <Footer />
                  </div>
                </>
              }
            />
            <Route
              path="/album/:id"
              element={
                <>
                  <Header />
                  <div className="container p-0" style={{ marginTop: '100px' }}>
                    <Album />
                  </div>
                  <div className='container' style={{marginTop:"auto"}}>
                    <Footer />
                  </div>
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <Header />
                  <div className="container p-0" style={{ marginTop: '140px' }}>
                    <Profile />
                  </div>
                  <div className='container' style={{marginTop:"auto"}}>
                    <Footer />
                  </div>
                </>
              }
            />
            <Route
              path="/setting"
              element={
                <>
                  <Header />
                  <div className="container p-0" style={{ marginTop: '100px' }}>
                    <Setting />
                  </div>
                  <div className='container' style={{marginTop:"auto"}}>
                    <Footer />
                  </div>
                </>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route
              path="/login"
              element={<Login />}
            />
          </Routes>
       </AuthProvider>
    </Router>
  );
}

export default App;
