import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import List from './components/List';
import Header from './components/Header';
import AddImageForm from './components/AddImageForm';
import EditImage from './components/EditImage';
import Register from './components/Register';
import Login from './components/Login';
import DetailImage from './components/DetailImage';
import { AuthProvider } from './components/AuthContext';
import Profile from './components/Profile';
import AddAlbum from './components/AddAlbum';
import Album from './components/Album';
import './App.css';

function App() {
 

  return (
    <Router>
       <AuthProvider>

        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <div className="container">
                    <List />
                  </div>
                </>
              }
            />
            <Route
              path="/add-image"

                  element={
                    <>
                      <Header />
                      <div className="container">
                        <AddImageForm />
                      </div>
                    </>
                  }
                />
            <Route
              path="/add-album"

                  element={
                    <>
                      <Header />
                      <div className="container">
                        <AddAlbum />
                      </div>
                    </>
                  }
                />
            <Route
              path="/edit-image/:id"
              element={
                <>
                  <Header />
                  <div className="container">
                    <EditImage />
                  </div>
                </>
              }
            />
            <Route
              path="/detail/:id"
              element={
                <>
                  <Header />
                  <div className="container">
                    <DetailImage />
                  </div>
                </>
              }
            />
            <Route
              path="/album/:id"
              element={
                <>
                  <Header />
                  <div className="container">
                    <Album />
                  </div>
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <Header />
                  <div className="container">
                    <Profile />
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
        </div>
       </AuthProvider>
    </Router>
  );
}

export default App;
