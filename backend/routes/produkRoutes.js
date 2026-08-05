const express = require('express');
const router = express.Router();
const { getAllProduk, getProdukById, createProduk, updateProduk, deleteProduk } = require('../controllers/produkController');

// GET /api/produk
router.get('/', getAllProduk);

// GET /api/produk/:id
router.get('/:id', getProdukById);

// POST /api/produk
router.post('/', createProduk);

// PUT /api/produk/:id
router.put('/:id', updateProduk);

// DELETE /api/produk/:id
router.delete('/:id', deleteProduk);

module.exports = router;