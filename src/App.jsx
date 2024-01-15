import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import List from './components/List';
import Header from './components/Header';
import AddImageForm from './components/AddImageForm';
import EditImage from './components/EditImage';
import Register from './components/Register';
import Login from './components/Login';
import DetailImage from './components/DetailImage';
import './App.css';

function App() {
 

  return (
    <Router>
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
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
