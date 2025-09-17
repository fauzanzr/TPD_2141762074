import React, { useState, useEffect } from 'react';


const SuratFormModal = ({ isOpen, onClose, onSubmit, initialData, kategoriOptions, mode }) => {
  const [formData, setFormData] = useState({
    nomor_surat: '',
    id_kategori: '',
    judul: '',
    fileSurat: null
  });

  useEffect(() => {
    
    if (mode === 'edit' && initialData) {
      setFormData({
        nomor_surat: initialData.nomor_surat || '',
        id_kategori: initialData.id_kategori || '',
        judul: initialData.judul || '',
        fileSurat: null 
      });
    } else {
      
      setFormData({ nomor_surat: '', id_kategori: '', judul: '', fileSurat: null });
    }
  }, [isOpen, initialData, mode]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "fileSurat") {
      setFormData(prev => ({ ...prev, fileSurat: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    dataToSend.append('nomor_surat', formData.nomor_surat);
    dataToSend.append('id_kategori', formData.id_kategori);
    dataToSend.append('judul', formData.judul);
    
    
    if (formData.fileSurat) {
        dataToSend.append('fileSurat', formData.fileSurat);
    }

    onSubmit(dataToSend);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{mode === 'add' ? 'Arsipkan Surat' : 'Edit Arsip Surat'}</h2>
        <form onSubmit={handleLocalSubmit}>
          <div className="form-group">
            <label htmlFor="nomor_surat">Nomor Surat</label>
            <input type="text" id="nomor_surat" name="nomor_surat" value={formData.nomor_surat} onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="id_kategori">Kategori</label>
            <select id="id_kategori" name="id_kategori" value={formData.id_kategori} onChange={handleFormChange} required>
              <option value="">Pilih Kategori...</option>
              {kategoriOptions.map(kat => (
                <option key={kat.id_kategori} value={kat.id_kategori}>{kat.nama_kategori}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="judul">Judul</label>
            <input type="text" id="judul" name="judul" value={formData.judul} onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="fileSurat">File Surat (PDF, DOCX)</label>
            <input type="file" id="fileSurat" name="fileSurat" onChange={handleFormChange} required={mode === 'add'} />
            {mode === 'edit' && <small>Kosongkan jika tidak ingin mengganti file.</small>}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-batal" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-simpan">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuratFormModal;