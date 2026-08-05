const produkModel = require('../models/produkModel');

// GET /api/produk — ambil semua produk
const getAllProduk = async (req, res) => {
    try {
        const produk = await produkModel.getAllProduk();
        res.json({
            success: true,
            data: produk
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET /api/produk/:id — ambil satu produk
const getProdukById = async (req, res) => {
    try {
        const { id } = req.params;
        const produk = await produkModel.getProdukById(id);
        if (!produk) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan'
            });
        }
        res.json({
            success: true,
            data: produk
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// POST /api/produk — tambah produk baru
const createProduk = async (req, res) => {
    try {
        const { nama, deskripsi, harga, stok, kategori_id, gambar_url } = req.body;

        // Validasi field wajib
        if (!nama || !harga || !stok) {
            return res.status(400).json({
                success: false,
                message: 'Nama, harga, dan stok wajib diisi!'
            });
        }

        const produkBaru = await produkModel.createProduk(
            nama, deskripsi, harga, stok, kategori_id, gambar_url
        );
        res.status(201).json({
            success: true,
            message: 'Produk berhasil ditambahkan',
            data: produkBaru
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// PUT /api/produk/:id — update produk
const updateProduk = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, deskripsi, harga, stok, kategori_id, gambar_url } = req.body;

        const produkUpdate = await produkModel.updateProduk(
            id, nama, deskripsi, harga, stok, kategori_id, gambar_url
        );

        if (!produkUpdate) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'Produk berhasil diupdate',
            data: produkUpdate
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE /api/produk/:id — hapus produk
const deleteProduk = async (req, res) => {
    try {
        const { id } = req.params;
        await produkModel.deleteProduk(id);
        res.json({
            success: true,
            message: 'Produk berhasil dihapus'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getAllProduk, getProdukById, createProduk, updateProduk, deleteProduk };