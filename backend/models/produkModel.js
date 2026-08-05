const pool = require('../config/db');

// Ambil semua produk beserta nama kategorinya
const getAllProduk = async () => {
    const result = await pool.query(`
        SELECT p.*, k.nama AS nama_kategori 
        FROM produk p
        LEFT JOIN kategori k ON p.kategori_id = k.id
        ORDER BY p.created_at DESC
    `);
    return result.rows;
};

// Ambil satu produk berdasarkan id
const getProdukById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM produk WHERE id = $1',
        [id]
    );
    return result.rows[0];
};

// Tambah produk baru
const createProduk = async (nama, deskripsi, harga, stok, kategori_id, gambar_url) => {
    const result = await pool.query(
        `INSERT INTO produk (nama, deskripsi, harga, stok, kategori_id, gambar_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [nama, deskripsi, harga, stok, kategori_id, gambar_url]
    );
    return result.rows[0];
};

// Update produk berdasarkan id
const updateProduk = async (id, nama, deskripsi, harga, stok, kategori_id, gambar_url) => {
    const result = await pool.query(
        `UPDATE produk 
         SET nama=$1, deskripsi=$2, harga=$3, stok=$4, kategori_id=$5, gambar_url=$6
         WHERE id=$7
         RETURNING *`,
        [nama, deskripsi, harga, stok, kategori_id, gambar_url, id]
    );
    return result.rows[0];
};

// Hapus produk berdasarkan id
const deleteProduk = async (id) => {
    await pool.query('DELETE FROM produk WHERE id = $1', [id]);
};

module.exports = { getAllProduk, getProdukById, createProduk, updateProduk, deleteProduk };