const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const path = require('path')
const multer = require('multer')
const fs = require('fs')

const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.use(express.json())

const port = 5000

// Koneksi Database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "database_arsipsurat"
})


db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database as id', db.threadId);
});

// KONFIGURASI MULTER (FILE UPLOAD)

const storageSurat = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/surat/')
    },
    filename: (req, file, cb) => {
        // Membuat nama file unik dengan menambahkan timestamp
        const uniqueName = Date.now() + '-' + path.extname(file.originalname)
        cb(null, uniqueName)
    }
})
const uploadSurat = multer({ storage: storageSurat })


const storageFoto = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/foto/')
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + path.extname(file.originalname)
        cb(null, uniqueName)
    }
})
const uploadFoto = multer({ storage: storageFoto })



// API ROUTES (ENDPOINT)

// GET: Mendapatkan semua kategori
app.get('/api/kategori', (req, res) => {
    const sql = "SELECT * FROM kategori_surat";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(result);
    });
});

// POST: Menambah kategori baru
app.post('/api/kategori', (req, res) => {
    const { nama_kategori, keterangan } = req.body;
    const sql = "INSERT INTO kategori_surat (nama_kategori, keterangan) VALUES (?, ?)";
    db.query(sql, [nama_kategori, keterangan], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Kategori berhasil ditambahkan", id: result.insertId });
    });
});

// PUT: Mengedit kategori
app.put('/api/kategori/:id', (req, res) => {
    const { nama_kategori, keterangan } = req.body;
    const { id } = req.params;
    const sql = "UPDATE kategori_surat SET nama_kategori = ?, keterangan = ? WHERE id_kategori = ?";
    db.query(sql, [nama_kategori, keterangan, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Kategori berhasil diperbarui" });
    });
});

// DELETE: Menghapus kategori
app.delete('/api/kategori/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM kategori_surat WHERE id_kategori = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Gagal menghapus kategori karena mungkin masih digunakan oleh surat lain." });
        return res.json({ message: "Kategori berhasil dihapus" });
    });
});

// GET: Mendapatkan semua arsip surat (dengan nama kategori)
app.get('/api/arsip', (req, res) => {
    const sql = `
        SELECT a.id, a.nomor_surat, k.nama_kategori, a.judul, a.waktu_arsip, a.nama_file 
        FROM arsip_surat AS a 
        JOIN kategori_surat AS k ON a.id_kategori = k.id_kategori
        ORDER BY a.waktu_arsip DESC`;
//...
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(result);
    });
});

// POST: Mengarsipkan surat baru (dengan file upload)
app.post('/api/arsip', uploadSurat.single('fileSurat'), (req, res) => {
    const { nomor_surat, id_kategori, judul } = req.body;
    const nama_file = req.file.filename;
    
    const sql = "INSERT INTO arsip_surat (nomor_surat, id_kategori, judul, nama_file) VALUES (?, ?, ?, ?)";
    db.query(sql, [nomor_surat, id_kategori, judul, nama_file], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Surat berhasil diarsipkan" });
    });
});

// GET: Mendapatkan DETAIL SATU arsip surat berdasarkan ID
app.get('/api/arsip/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT a.id, a.nomor_surat, k.nama_kategori, a.judul, a.waktu_arsip, a.nama_file 
        FROM arsip_surat AS a 
        JOIN kategori_surat AS k ON a.id_kategori = k.id_kategori
        WHERE a.id = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "Surat tidak ditemukan" });
        return res.json(result[0]);
    });
});

// DELETE: Menghapus arsip surat (beserta filenya)
app.delete('/api/arsip/:id', (req, res) => {
    const { id } = req.params;

    const findFileSql = "SELECT nama_file FROM arsip_surat WHERE id = ?";
    db.query(findFileSql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "Surat tidak ditemukan" });

        const fileName = result[0].nama_file;
        const filePath = path.join(__dirname, 'public/uploads/surat', fileName);

        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error("Gagal menghapus file fisik:", unlinkErr);
            
            const deleteSql = "DELETE FROM arsip_surat WHERE id = ?";
            db.query(deleteSql, [id], (dbErr, dbResult) => {
                if (dbErr) return res.status(500).json({ error: dbErr.message });
                return res.json({ message: "Surat dan file terkait berhasil dihapus" });
            });
        });
    });
});

// POST: Mengedit/Update arsip surat (dengan kemungkinan ganti file)
app.post('/api/arsip/:id', uploadSurat.single('fileSurat'), (req, res) => {
    const { id } = req.params;
    const { nomor_surat, id_kategori, judul } = req.body;
    
    let sql = "UPDATE arsip_surat SET nomor_surat = ?, id_kategori = ?, judul = ? WHERE id = ?";
    let params = [nomor_surat, id_kategori, judul, id];

    if (req.file) {
        const nama_file_baru = req.file.filename;
        db.query("SELECT nama_file FROM arsip_surat WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result.length > 0) {
                const nama_file_lama = result[0].nama_file;
                const filePath = path.join(__dirname, 'public/uploads/surat', nama_file_lama);
                
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            sql = "UPDATE arsip_surat SET nomor_surat = ?, id_kategori = ?, judul = ?, nama_file = ? WHERE id = ?";
            params = [nomor_surat, id_kategori, judul, nama_file_baru, id];
            
            db.query(sql, params, (updateErr, updateResult) => {
                if (updateErr) return res.status(500).json({ error: updateErr.message });
                return res.json({ message: "Surat berhasil diperbarui dengan file baru" });
            });
        });
    } else {
        db.query(sql, params, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ message: "Data surat berhasil diperbarui" });
        });
    }
});

// GET: Mendapatkan data about
app.get('/api/about', (req, res) => {
    const sql = "SELECT * FROM about WHERE id = 1";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(result[0] || {});
    });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});