import React, { useState, useEffect } from 'react';
import './KategoriSurat.css';
import { FaSearch, FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

const KategoriSurat = () => {
  const [kategoriList, setKategoriList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State untuk modal tambah/edit
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [currentKategoriId, setCurrentKategoriId] = useState(null);
  
  // <-- 1. State baru untuk modal konfirmasi hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [kategoriToDelete, setKategoriToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    nama_kategori: '',
    keterangan: ''
  });

  const API_URL = 'http://localhost:5000';

  // Fungsi fetchKategori tetap sama
  const fetchKategori = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/kategori`);
      const data = await response.json();
      setKategoriList(data);
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
      alert("Gagal mengambil data dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);
  
  // Fungsi-fungsi untuk modal Tambah/Edit tetap sama
  const handleOpenFormModal = (mode, kategori = null) => {
    setModalMode(mode);
    if (mode === 'edit' && kategori) {
      setCurrentKategoriId(kategori.id_kategori);
      setFormData({
        nama_kategori: kategori.nama_kategori,
        keterangan: kategori.keterangan || ''
      });
    } else {
      setCurrentKategoriId(null);
      setFormData({ nama_kategori: '', keterangan: '' });
    }
    setIsFormModalOpen(true);
  };
  const handleCloseFormModal = () => setIsFormModalOpen(false);
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleFormSubmit = async (e) => {

    e.preventDefault();
    const url = modalMode === 'add'
      ? `${API_URL}/api/kategori`
      : `${API_URL}/api/kategori/${currentKategoriId}`;
    const method = modalMode === 'add' ? 'POST' : 'PUT';
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert(`Kategori berhasil ${modalMode === 'add' ? 'ditambahkan' : 'diperbarui'}`);
        handleCloseFormModal();
        fetchKategori(); 
      } else {
        const errorData = await response.json();
        alert(`Gagal: ${errorData.message || 'Error Terdapat Duplikasi'}`);
      }
    } catch (error) {
      console.error("Error saat submit form:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    }
  };


  const handleOpenDeleteModal = (kategori) => {
    setKategoriToDelete(kategori);
    setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setKategoriToDelete(null);
    setIsDeleteModalOpen(false);
  };


  const handleConfirmDelete = async () => {
    if (!kategoriToDelete) return;
    
    try {
      const response = await fetch(`${API_URL}/api/kategori/${kategoriToDelete.id_kategori}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Kategori berhasil dihapus.');
        fetchKategori(); 
      } else {
        const errorData = await response.json();
        alert(`Gagal menghapus: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saat menghapus:", error);
      alert("Terjadi kesalahan pada server.");
    } finally {
        handleCloseDeleteModal();
    }
  };

  const filteredKategori = kategoriList.filter(kategori =>
    kategori.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <main className="content"><h1>Memuat data kategori...</h1></main>;
  }

  return (
    <main className="content">
      <div className="content-header">
        <h1>Kategori Surat</h1>
        <p>Berikut ini adalah kategori yang bisa digunakan untuk melabeli surat. <br/>
           Klik "Tambah Kategori Baru" untuk menambahkan kategori baru.</p>
      </div>

      <div className="search-section">
        <label htmlFor="search-kategori">Cari kategori:</label>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            id="search-kategori"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-tambah-bawah" onClick={() => handleOpenFormModal('add')}>
          Tambah Kategori Baru
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID Kategori</th>
              <th>Nama Kategori</th>
              <th>Keterangan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredKategori.map((kategori) => (
              <tr key={kategori.id_kategori}>
                <td>{kategori.id_kategori}</td>
                <td>{kategori.nama_kategori}</td>
                <td>{kategori.keterangan}</td>
                <td className="action-buttons">
                  {/* <-- 4. Tombol Hapus sekarang membuka modal konfirmasi --> */}
                  <button className="btn-hapus" onClick={() => handleOpenDeleteModal(kategori)}> Hapus</button>
                  <button className="btn-edit" onClick={() => handleOpenFormModal('edit', kategori)}> Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {isFormModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalMode === 'add' ? 'Tambah Kategori Baru' : 'Edit Kategori'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="nama_kategori">Nama Kategori</label>
                <input type="text" id="nama_kategori" name="nama_kategori" value={formData.nama_kategori} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="keterangan">Keterangan</label>
                <textarea id="keterangan" name="keterangan" rows="4" value={formData.keterangan} onChange={handleFormChange}></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-batal" onClick={handleCloseFormModal}>Batal</button>
                <button type="submit" className="btn-simpan">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {isDeleteModalOpen && (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Konfirmasi Penghapusan</h2>
                <p>
                    Apakah Anda yakin ingin menghapus kategori:
                    <br />
                    <strong>{kategoriToDelete?.nama_kategori}</strong>?
                    <br />
                    <small>Aksi ini tidak bisa dibatalkan.</small>
                </p>
                <div className="modal-actions">
                    <button type="button" className="btn-batal" onClick={handleCloseDeleteModal}>Batal</button>
                    <button type="button" className="btn-hapus" onClick={handleConfirmDelete}>Hapus</button>
                </div>
            </div>
        </div>
      )}
    </main>
  );
};

export default KategoriSurat;