const { Pool } = require('pg');
require('dotenv').config();

// Pool = kumpulan koneksi database yang dikelola otomatis
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // wajib untuk koneksi ke Supabase
    }
});

// Test koneksi saat pertama kali file ini dipanggil
pool.connect((err, client, release) => {
    if (err) {
        console.error('Gagal konek ke database:', err.message);
    } else {
        console.log('Berhasil konek ke database Supabase!');
        release(); // lepas koneksi kembali ke pool
    }
});

module.exports = pool;