// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ArsipSurat from './components/ArsipSurat';
import KategoriSurat from './components/KategoriSurat';
import About from './components/About';
import LihatSurat from './components/LihatSurat';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        
        
        <div className="main-content-area">
          <Routes>
            <Route path="/" element={<ArsipSurat />} />
            <Route path="/kategori" element={<KategoriSurat />} />
            <Route path="/about" element={<About />} />
            <Route path="/arsip/:id" element={<LihatSurat />} /> 
          </Routes>
        </div>
        
      </div>
    </BrowserRouter>
  );
}

export default App;