const pool = require('../config/db');

const getDashboardData = async (req, res) => {
    try {
        // Total pemasukan dari order yang selesai
        const totalPemasukan = await pool.query(
            `SELECT COALESCE(SUM(total), 0) AS total 
             FROM orders WHERE status = 'selesai'`
        );

        // Total semua order
        const totalOrders = await pool.query(
            'SELECT COUNT(*) AS total FROM orders'
        );

        // Total produk
        const totalProduk = await pool.query(
            'SELECT COUNT(*) AS total FROM produk'
        );

        // Order per status
        const orderPerStatus = await pool.query(
            `SELECT status, COUNT(*) AS jumlah 
             FROM orders GROUP BY status`
        );

        // Produk terlaris (dari order_items)
        const produkTerlaris = await pool.query(
            `SELECT nama_produk, SUM(jumlah) AS total_terjual
             FROM order_items
             GROUP BY nama_produk
             ORDER BY total_terjual DESC
             LIMIT 5`
        );

        // Order terbaru (5 terakhir)
        const orderTerbaru = await pool.query(
            `SELECT * FROM orders 
             ORDER BY created_at DESC 
             LIMIT 5`
        );

        res.json({
            success: true,
            data: {
                totalPemasukan: totalPemasukan.rows[0].total,
                totalOrders: totalOrders.rows[0].total,
                totalProduk: totalProduk.rows[0].total,
                orderPerStatus: orderPerStatus.rows,
                produkTerlaris: produkTerlaris.rows,
                orderTerbaru: orderTerbaru.rows
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboardData };