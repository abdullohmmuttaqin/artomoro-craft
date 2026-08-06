const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateStatusOrder,
    deleteOrder
} = require('../controllers/orderController');

// GET /api/orders
router.get('/', getAllOrders);

// GET /api/orders/:id
router.get('/:id', getOrderById);

// POST /api/orders
router.post('/', createOrder);

// PUT /api/orders/:id/status
router.put('/:id/status', updateStatusOrder);

// DELETE /api/orders/:id
router.delete('/:id', deleteOrder);

module.exports = router;