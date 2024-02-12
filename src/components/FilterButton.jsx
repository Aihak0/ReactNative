import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Filter = ({ selectedFilter, handleFilterChange }) => {

  return (
    <div className='filter-buttons' style={{ position: 'fixed', top: '73px', left: 0, width: '100%', zIndex: 10, backgroundColor: 'white', padding: '10px 0' }}>
        <div className='container' style={{ overflow: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <input type="radio" className="btn-check" id="btn-radio-all" autoComplete="off" checked={selectedFilter === 'all'} onChange={() => handleFilterChange('all')} />
        <label className="btn btn-light btn-sm me-2 rounded-pill" htmlFor="btn-radio-all">Semua</label>

        <input type="radio" className="btn-check" id="btn-radio-album" autoComplete="off" checked={selectedFilter === 'album'} onChange={() => handleFilterChange('album')} />
        <label className="btn btn-light btn-sm me-2 rounded-pill" htmlFor="btn-radio-album">Album</label>

        <input type="radio" className="btn-check" id="btn-radio-fav" autoComplete="off" checked={selectedFilter === 'fav'} onChange={() => handleFilterChange('fav')} />
        <label className="btn btn-light btn-sm me-2 rounded-pill" htmlFor="btn-radio-fav">Terfavorit</label>
      </div>

    </div>
  );
};

export default Filter;
