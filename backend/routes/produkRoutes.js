const express = require('express');
const router = express.Router();
const {
    getAllProduk,
    getProdukById,
    createProduk,
    updateProduk,
    deleteProduk
} = require('../controllers/produkController');

// Import middleware — buat verifikasi JWT token
const { verifyToken } = require('../middleware/authMiddleware');

// ===== PUBLIC ROUTES =====
// GET boleh diakses siapa aja (customer perlu lihat produk)
router.get('/', getAllProduk);
router.get('/:id', getProdukById);

// ===== PROTECTED ROUTES =====
// POST, PUT, DELETE hanya bisa diakses kalau sudah login (ada JWT token)
// verifyToken dipasang sebagai middleware — dijalankan SEBELUM controller
// Kalau token tidak valid, request berhenti di sini dan balik error 401/403
router.post('/', verifyToken, createProduk);
router.put('/:id', verifyToken, updateProduk);
router.delete('/:id', verifyToken, deleteProduk);

module.exports = router;