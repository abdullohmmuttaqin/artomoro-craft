const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Muat konfigurasi dari file .env
dotenv.config();

const pool = require('./config/db'); // koneksi database

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());           // izinkan request dari frontend (React)
app.use(express.json());   // izinkan server baca request body format JSON

// Route test — buat cek server jalan
app.get('/', (req, res) => {
    res.json({ message: 'Bouquet App API berjalan!' });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});