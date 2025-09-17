import React from 'react';
import './About.css'; 
import profileImage from '../assets/images/foto_profil.jpg'; 

const About = () => {

  const profileData = {
    nama: 'Fauzan Zulfa Ramadhan',
    prodi: 'D4-SIB Sistem Informasi Bisnis',
    nim: '2141762074',
    tanggal: '15 September 2025'
  };

  return (
    <main className="content-header">
      <h1>About</h1>
      <div className="about-card">
        <div className="photo-container">
          <img src={profileImage} alt="Foto Profil" />
        </div>
        <div className="details-container">
          <p className="intro">Aplikasi ini dibuat oleh:</p>
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Nama</span>
              <span className="value">: {profileData.nama}</span>
            </div>
            <div className="detail-item">
              <span className="label">Prodi</span>
              <span className="value">: {profileData.prodi}</span>
            </div>
            <div className="detail-item">
              <span className="label">NIM</span>
              <span className="value">: {profileData.nim}</span>
            </div>
            <div className="detail-item">
              <span className="label">Tanggal</span>
              <span className="value">: {profileData.tanggal}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;