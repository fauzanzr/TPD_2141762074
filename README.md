# Aplikasi Arsip Surat - Proyek Uji Kompetensi BNSP
Aplikasi ini merupakan website yang dibangun untuk memenuhi tugas praktik demonstrasi pada Sertifikasi Kompetensi BNSP skema "Pemrograman Software Komputer".
Dengan menggunakan __React__ sebagai tampilan antarmuka, __Express__ sebagai server aplikasi, dan database MySQL yang dikelola melalui __phpMyAdmin__.

# Tujuan Aplikasi Dikembangkan
Untuk membuat sebuah aplikasi yang mampu memenuhi kebutuhan dari Desa Karangduren dalam pengarsipan surat-surat resmi. Aplikasi ini diharapkan dapat digunakan
untuk mengelola seluruh surat-surat yang telah diarsipkan dalam format PDF.

# Fitur
-  Arsip Surat
    - Mengunggah surat baru dalam format PDF.
    - Menampilkan daftar surat.
    - Mencari surat berdasarkan Judul.
    - Melihat detail, mengunduh, dan mengubah data arsip surat.
    - Menghapus arsip surat.
      
-  Kategori Surat
    - Fitur Tambah, Lihat, Ubah, dan Hapus (CRUD) untuk kategori.
    - Pencegahan Duplikasi pada kategori.

# Langkah Instalasi
1. __Salin Proyek__ ini ke komputer lokal Anda.
```
git clone https://github.com/fauzanzr/TPD_2141762074.git
```
2. __Buat Database Phpmyadmin__ dan jalankan perintah SQL berikut untuk membuat database baru.
```ruby
CREATE TABLE "database_arsipsurat";
```
3. __Import file SQL__ yang terdapat di folder Database ke dalam database yang sudah dibuat pada phpMyAdmin.
        <img width="1000" height="559" alt="image" src="https://github.com/user-attachments/assets/09a802e4-906a-4708-afd3-811511490767" />
5. __Konfigurasi Koneksi Database__ dengan membuka file .\TPD_2141762074\server\server.js kemudian sesuaikan dengan username dan password Phpmyadmin Anda.
```ruby
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "database_arsipsurat"
})
```
4. __Buka dua terminal terpisah__ untuk menjalankan bagian frontend dan backend.<br/>
- untuk bagian frontend pada lokasi
```
..\TPD_2141762074
```
- untuk bagian frontend pada lokasi
```
..\TPD_2141762074\server
```
5. __Install Dependensi__ dengan membuka dua terminal di dalam folder proyek dan jalankan perintah:
```ruby
npm install
```
6. __Jalankan aplikasi__ dengan menggunakan perintah ini pada dua terminal.
```ruby
npm start
```

# Screenshot
<img width="1919" height="867" alt="Screenshot_240" src="https://github.com/user-attachments/assets/06339c83-3ca4-410f-b0b1-84b991368a64" />
<img width="1919" height="857" alt="Screenshot_241" src="https://github.com/user-attachments/assets/607291f7-13df-4922-a962-61ac28f2b26e" />
<img width="1919" height="927" alt="Screenshot_242" src="https://github.com/user-attachments/assets/476eb312-d2bb-4c30-9c29-6f76a2b5e3aa" />
<img width="1919" height="862" alt="Screenshot_243" src="https://github.com/user-attachments/assets/b8faff7b-d068-473b-a41c-0d88db82c861" />
<img width="1919" height="857" alt="Screenshot_245" src="https://github.com/user-attachments/assets/6ac39a1e-50b5-4740-8228-e5332dabb223" />
<img width="1919" height="862" alt="Screenshot_244" src="https://github.com/user-attachments/assets/69690d08-a246-471d-9f30-d552215f4530" />
<img width="1919" height="860" alt="Screenshot_250" src="https://github.com/user-attachments/assets/8e73c568-b9d9-4278-a928-d0f6de00bfce" />
<img width="1919" height="862" alt="Screenshot_246" src="https://github.com/user-attachments/assets/fd9e3d03-e0c6-47db-80fa-d59d77da4020" />
<img width="1919" height="861" alt="Screenshot_247" src="https://github.com/user-attachments/assets/b36192aa-9ff2-4bb3-acba-585904d2d946" />
<img width="1919" height="929" alt="Screenshot_248" src="https://github.com/user-attachments/assets/fde7f144-8e74-4679-b45f-be923b195692" />
<img width="1919" height="863" alt="Screenshot_249" src="https://github.com/user-attachments/assets/68934c00-0066-42c5-b0e2-7055e8223ade" />

# Tentang Pengembang
- Nama : Fauzan Zulfa Ramadhan
- NIM : 2141762074
- Jurusan : Teknologi Informasi
- Prodi : D4 Sistem Informasi Bisnis







