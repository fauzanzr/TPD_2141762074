// src/components/LihatSurat.js

import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import './LihatSurat.css';
import SuratFormModal from './SuratFormModal';

const LihatSurat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surat, setSurat] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [kategoriOptions, setKategoriOptions] = useState([]);

  const API_URL = 'http://localhost:5000';

  const fetchDetailSurat = async () => {
    try {
      const response = await fetch(`${API_URL}/api/arsip/${id}`);
      if (!response.ok) {
        throw new Error('Surat tidak ditemukan');
      }
      const data = await response.json();
      setSurat(data);
    } catch (error) {
      console.error("Gagal mengambil detail surat:", error);
      setSurat(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchKategori = async () => {
    try {
      const response = await fetch(`${API_URL}/api/kategori`);
      const data = await response.json();
      setKategoriOptions(data);
    } catch (error)
    {
      console.error("Gagal mengambil data kategori:", error);
    }
  };

  useEffect(() => {
    fetchDetailSurat();
    fetchKategori();
  }, [id]);

  const handleEditSubmit = async (formData) => {
    try {
        const response = await fetch(`${API_URL}/api/arsip/${id}`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Surat berhasil diperbarui!');
            setIsEditModalOpen(false);
            fetchDetailSurat();
        } else {
            const errorData = await response.json();
            alert(`Gagal memperbarui surat: ${errorData.message || 'Error'}`);
        }
    } catch (error) {
        console.error("Error saat edit form:", error);
        alert('Terjadi kesalahan koneksi ke server.');
    }
  };


  if (loading) {
    return <main className="content"><h1>Memuat data surat...</h1></main>;
  }

  if (!surat) {
    return (
      <main className="content">
        <h1>Surat Tidak Ditemukan</h1>
        <p>Data surat dengan ID {id} tidak dapat ditemukan. Mungkin telah dihapus.</p>
        <button onClick={() => navigate('/')} className="btn-kembali">Kembali ke Arsip</button>
      </main>
    );
  }

  const fileUrl = `${API_URL}/uploads/surat/${surat.nama_file}`;

  return (
    <main className="content">
      <div className="lihat-surat-container">
        <h1 className="page-title">
          Arsip Surat &gt;&gt; Lihat
        </h1>
        <div className="surat-details">
          <p><strong>Nomor:</strong> {surat.nomor_surat}</p>
          <p><strong>Kategori:</strong> {surat.nama_kategori}</p>
          <p><strong>Judul:</strong> {surat.judul}</p>
          <p><strong>Waktu Unggah:</strong> {new Date(surat.waktu_arsip).toLocaleString('id-ID')}</p>
        </div>

        <div className="file-viewer">
          <iframe 
            src={fileUrl} 
            title={`Tampilan File - ${surat.judul}`}
            style={{ border: 'none', width: '100%', height: '100%' }}
          >
            <p>Browser Anda tidak mendukung pratinjau PDF. Silakan unduh file untuk melihatnya.</p>
          </iframe>
        </div>

        <div className="action-bar">
          <button onClick={() => navigate('/')} className="btn-kembali"> &lt;&lt; Kembali</button>
          <a href={fileUrl} download className="btn-unduh-detail">Unduh</a>
          <button onClick={() => setIsEditModalOpen(true)} className="btn-edit-file">Edit/Ganti File</button>
        </div>
      </div>
      
      <SuratFormModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={surat}
        kategoriOptions={kategoriOptions}
        mode="edit"
      />
    </main>
  );
};

export default LihatSurat;