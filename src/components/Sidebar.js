import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { FaStar, FaArchive, FaInfoCircle } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="sidebar">
      <div className="menu-header">
        <h3>Menu</h3>
        <p>-------</p>
      </div>
      <ul className="nav-menu">
        <li className={currentPath === '/' ? 'nav-item active' : 'nav-item'}>
          <Link to="/" title="Arsip">
            <FaStar className="nav-icon" />
            <span className="nav-label">Arsip</span>
          </Link>
        </li>
        <li className={currentPath === '/kategori' ? 'nav-item active' : 'nav-item'}>
          <Link to="/kategori" title="Kategori Surat">
            <FaArchive className="nav-icon" />
            <span className="nav-label">Kategori Surat</span>
          </Link>
        </li>
        <li className={currentPath === '/about' ? 'nav-item active' : 'nav-item'}>
          <Link to="/about" title="About">
            <FaInfoCircle className="nav-icon" />
            <span className="nav-label">About</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;