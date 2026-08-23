const pool = require('../config/db');

// Ambil semua order beserta jumlah item-nya
const getAllOrders = async () => {
    const result = await pool.query(`
        SELECT o.*, COUNT(oi.id) AS jumlah_item
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `);
    return result.rows;
};

// Ambil satu order beserta detail item-nya
const getOrderById = async (id) => {
    const order = await pool.query(
        'SELECT * FROM orders WHERE id = $1', [id]
    );
    const items = await pool.query(
        'SELECT * FROM order_items WHERE order_id = $1', [id]
    );
    return { ...order.rows[0], items: items.rows };
};

// Buat order baru beserta item-itemnya
const createOrder = async (nama_pembeli, no_telepon, alamat, catatan, total, items) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Cek stok semua item SEBELUM insert apapun
        // Kalau salah satu item stoknya kurang, batalkan semua
        for (const item of items) {
            const cekStok = await client.query(
                'SELECT stok, nama FROM produk WHERE id = $1',
                [item.produk_id]
            );

            // Produk tidak ditemukan
            if (cekStok.rows.length === 0) {
                throw new Error(`Produk dengan id ${item.produk_id} tidak ditemukan`);
            }

            const stokTersedia = cekStok.rows[0].stok;
            const namaProduk = cekStok.rows[0].nama;

            // Stok tidak cukup
            if (item.jumlah > stokTersedia) {
                throw new Error(
                    `Stok ${namaProduk} tidak cukup. Tersedia: ${stokTersedia}, diminta: ${item.jumlah}`
                );
            }
        }

        // Semua stok aman — lanjut insert order
        const orderResult = await client.query(
            `INSERT INTO orders (nama_pembeli, no_telepon, alamat, catatan, total)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [nama_pembeli, no_telepon, alamat, catatan, total]
        );
        const orderId = orderResult.rows[0].id;

        // Insert setiap item ke tabel order_items
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, produk_id, nama_produk, harga, jumlah, subtotal)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [orderId, item.produk_id, item.nama_produk, item.harga, item.jumlah, item.subtotal]
            );

            // Kurangi stok produk
            await client.query(
                'UPDATE produk SET stok = stok - $1 WHERE id = $2',
                [item.jumlah, item.produk_id]
            );
        }

        await client.query('COMMIT');
        return orderResult.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

// Update status order
const updateStatusOrder = async (id, status) => {
    const result = await pool.query(
        'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
    );
    return result.rows[0];
};

// Hapus order
const deleteOrder = async (id) => {
    await pool.query('DELETE FROM orders WHERE id = $1', [id]);
};

module.exports = { getAllOrders, getOrderById, createOrder, updateStatusOrder, deleteOrder };