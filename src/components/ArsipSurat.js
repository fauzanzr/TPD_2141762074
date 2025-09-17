import React, { useState, useEffect } from 'react';
import './ArsipSurat.css';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
// Komponen SuratFormModal diasumsikan sudah ada di file terpisah
import SuratFormModal from './SuratFormModal';

const ArsipSurat = () => {
  const [suratList, setSuratList] = useState([]);
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State untuk modal tambah/edit
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // <-- 1. State baru untuk modal konfirmasi hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [suratToDelete, setSuratToDelete] = useState(null);
  
  const API_URL = 'http://localhost:5000';
  
  // Fungsi fetchSurat dan fetchKategori tetap sama...
  const fetchSurat = async () => {
    try {
      const response = await fetch(`${API_URL}/api/arsip`);
      const data = await response.json();
      setSuratList(data);
    } catch (error) {
      console.error("Gagal mengambil data arsip:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchKategori = async () => {
    try {
      const response = await fetch(`${API_URL}/api/kategori`);
      const data = await response.json();
      setKategoriOptions(data);
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
    }
  };

  useEffect(() => {
    fetchSurat();
    fetchKategori();
  }, []);

  // <-- 2. Fungsi baru untuk membuka modal hapus
  const handleOpenDeleteModal = (surat) => {
    setSuratToDelete(surat);
    setIsDeleteModalOpen(true);
  };

  // <-- 3. Fungsi baru untuk menutup modal hapus
  const handleCloseDeleteModal = () => {
    setSuratToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // <-- 4. Logika hapus yang dipicu dari dalam modal
  const handleConfirmDelete = async () => {
    if (!suratToDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/arsip/${suratToDelete.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Surat berhasil dihapus');
        fetchSurat(); // Refresh daftar surat
      } else {
        const data = await response.json();
        alert(`Gagal menghapus surat: ${data.message || 'Error tidak diketahui'}`);
      }
    } catch (error) {
      console.error("Error saat menghapus surat:", error);
      alert('Terjadi kesalahan pada server.');
    } finally {
      handleCloseDeleteModal(); // Tutup modal setelah selesai
    }
  };

  // Fungsi untuk submit form tambah surat (tetap sama)
  const handleAddSubmit = async (formData) => {
    try {
        const response = await fetch(`${API_URL}/api/arsip`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Surat berhasil diarsipkan!');
            setIsFormModalOpen(false);
            fetchSurat();
        } else {
            const errorData = await response.json();
            alert(`Gagal mengarsipkan surat: ${errorData.message || 'Error'}`);
        }
    } catch (error) {
        console.error("Error saat submit form:", error);
        alert('Terjadi kesalahan koneksi ke server.');
    }
  };

  const filteredSurat = suratList.filter(surat =>
    surat.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <main className="content"><h1>Memuat data arsip...</h1></main>;
  }

  return (
    <main className="content">
      <div className="content-header">
        <h1>Arsip Surat</h1>
        <p>Berikut ini adalah surat-surat yang telah terbit dan diarsipkan. <br />
           Klik "Lihat" pada kolom aksi untuk menampilkan surat.</p>
      </div>

      <div className="search-section">
        <label htmlFor="search">Cari surat:</label>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            id="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-arsipkan" onClick={() => setIsFormModalOpen(true)}>Arsipkan Surat</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nomor Surat</th>
              <th>Kategori</th>
              <th>Judul</th>
              <th>Waktu Pengarsipan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredSurat.map((surat) => (
              <tr key={surat.id}>
                <td>{surat.nomor_surat}</td>
                <td>{surat.nama_kategori}</td>
                <td>{surat.judul}</td>
                <td>{new Date(surat.waktu_arsip).toLocaleString('id-ID')}</td>
                <td className="action-buttons">
                  {/* <-- 5. Tombol Hapus sekarang membuka modal --> */}
                  <button className="btn-hapus" onClick={() => handleOpenDeleteModal(surat)}>Hapus</button>
                  <a href={`${API_URL}/uploads/surat/${surat.nama_file}`} download className="btn btn-unduh">Unduh</a>
                  <Link to={`/arsip/${surat.id}`} className="btn btn-lihat">Lihat</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SuratFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleAddSubmit}
        kategoriOptions={kategoriOptions}
        mode="add"
      />

      {/* <-- 6. JSX untuk modal konfirmasi hapus --> */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Konfirmasi Penghapusan</h2>
            <p>
              Apakah Anda yakin ingin menghapus surat ini?
              <br />
              <strong>{suratToDelete?.judul}</strong>
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

export default ArsipSurat;