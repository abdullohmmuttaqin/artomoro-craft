const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateStatusOrder,
    deleteOrder
} = require('../controllers/orderController');

// Import middleware verifikasi JWT
const { verifyToken } = require('../middleware/authMiddleware');

// ===== PROTECTED ROUTES =====
// Semua endpoint order wajib login
// Customer order lewat WA, bukan langsung lewat API
router.get('/', verifyToken, getAllOrders);
router.get('/:id', verifyToken, getOrderById);
router.post('/', verifyToken, createOrder);
router.put('/:id/status', verifyToken, updateStatusOrder);
router.delete('/:id', verifyToken, deleteOrder);

module.exports = router;