const orderModel = require('../models/orderModel');

// GET /api/orders — ambil semua order
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.getAllOrders();
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/orders/:id — ambil satu order + detail items
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await orderModel.getOrderById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
        }
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/orders — buat order baru
const createOrder = async (req, res) => {
    try {
        const { nama_pembeli, no_telepon, alamat, catatan, items } = req.body;

        // Validasi field wajib
        if (!nama_pembeli || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Nama pembeli dan minimal 1 item wajib diisi!'
            });
        }

        // Hitung total dari semua item
        const total = items.reduce((acc, item) => acc + item.subtotal, 0);

        const orderBaru = await orderModel.createOrder(
            nama_pembeli, no_telepon, alamat, catatan, total, items
        );

        res.status(201).json({
            success: true,
            message: 'Order berhasil dibuat',
            data: orderBaru
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/orders/:id/status — update status order
const updateStatusOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatus = ['pending', 'diproses', 'selesai', 'dibatalkan'];
        if (!validStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status tidak valid!'
            });
        }

        const orderUpdate = await orderModel.updateStatusOrder(id, status);
        res.json({
            success: true,
            message: 'Status order berhasil diupdate',
            data: orderUpdate
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/orders/:id — hapus order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await orderModel.deleteOrder(id);
        res.json({ success: true, message: 'Order berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllOrders, getOrderById, createOrder, updateStatusOrder, deleteOrder };