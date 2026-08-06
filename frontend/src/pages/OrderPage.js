import React, { useState, useEffect } from 'react';
import { getAllOrders, createOrder, updateStatusOrder, deleteOrder } from '../services/orderService';
import { getAllProduk } from '../services/produkService';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [produk, setProduk] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // State form order
    const [form, setForm] = useState({
        nama_pembeli: '',
        no_telepon: '',
        alamat: '',
        catatan: ''
    });

    // State items yang dipesan
    const [items, setItems] = useState([
        { produk_id: '', nama_produk: '', harga: 0, jumlah: 1, subtotal: 0 }
    ]);

    useEffect(() => {
        fetchOrders();
        fetchProduk();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const result = await getAllOrders();
            setOrders(result.data);
        } catch (err) {
            console.error('Gagal memuat orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchProduk = async () => {
        try {
            const result = await getAllProduk();
            setProduk(result.data);
        } catch (err) {
            console.error('Gagal memuat produk');
        }
    };

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle perubahan item — saat produk dipilih, isi harga otomatis
    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;

        // Kalau yang berubah adalah produk_id, isi harga otomatis
        if (field === 'produk_id') {
            const produkDipilih = produk.find(p => p.id === parseInt(value));
            if (produkDipilih) {
                newItems[index].nama_produk = produkDipilih.nama;
                newItems[index].harga = produkDipilih.harga;
                newItems[index].subtotal = produkDipilih.harga * newItems[index].jumlah;
            }
        }

        // Kalau yang berubah jumlah, hitung ulang subtotal
        if (field === 'jumlah') {
            newItems[index].subtotal = newItems[index].harga * parseInt(value || 0);
        }

        setItems(newItems);
    };

    // Tambah baris item baru
    const tambahItem = () => {
        setItems([...items, { produk_id: '', nama_produk: '', harga: 0, jumlah: 1, subtotal: 0 }]);
    };

    // Hapus baris item
    const hapusItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    // Hitung total keseluruhan
    const hitungTotal = () => {
        return items.reduce((acc, item) => acc + item.subtotal, 0);
    };

    const resetForm = () => {
        setForm({ nama_pembeli: '', no_telepon: '', alamat: '', catatan: '' });
        setItems([{ produk_id: '', nama_produk: '', harga: 0, jumlah: 1, subtotal: 0 }]);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createOrder({ ...form, items });
            fetchOrders();
            resetForm();
            alert('Order berhasil dibuat!');
        } catch (err) {
            alert('Gagal membuat order: ' + err.message);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateStatusOrder(id, status);
            fetchOrders();
        } catch (err) {
            alert('Gagal update status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin mau hapus order ini?')) {
            try {
                await deleteOrder(id);
                fetchOrders();
            } catch (err) {
                alert('Gagal menghapus order');
            }
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#FF9800',
            diproses: '#2196F3',
            selesai: '#4CAF50',
            dibatalkan: '#f44336'
        };
        return colors[status] || '#999';
    };

    if (loading) return <div style={styles.center}>Loading...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>📋 Manajemen Order</h1>
                <button style={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Tutup Form' : '+ Buat Order Baru'}
                </button>
            </div>

            {/* Form Order Baru */}
            {showForm && (
                <div style={styles.formContainer}>
                    <h2>Form Order Baru</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Data Pembeli */}
                        <h3>Data Pembeli</h3>
                        <div style={styles.formGrid}>
                            <input
                                style={styles.input}
                                name="nama_pembeli"
                                placeholder="Nama Pembeli *"
                                value={form.nama_pembeli}
                                onChange={handleFormChange}
                                required
                            />
                            <input
                                style={styles.input}
                                name="no_telepon"
                                placeholder="No. Telepon"
                                value={form.no_telepon}
                                onChange={handleFormChange}
                            />
                            <input
                                style={styles.input}
                                name="alamat"
                                placeholder="Alamat"
                                value={form.alamat}
                                onChange={handleFormChange}
                            />
                            <input
                                style={styles.input}
                                name="catatan"
                                placeholder="Catatan"
                                value={form.catatan}
                                onChange={handleFormChange}
                            />
                        </div>

                        {/* Item Pesanan */}
                        <h3>Item Pesanan</h3>
                        {items.map((item, index) => (
                            <div key={index} style={styles.itemRow}>
                                <select
                                    style={styles.select}
                                    value={item.produk_id}
                                    onChange={(e) => handleItemChange(index, 'produk_id', e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Produk</option>
                                    {produk.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.nama} - Rp{p.harga.toLocaleString('id-ID')} (Stok: {p.stok})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    style={{...styles.input, width: '80px'}}
                                    type="number"
                                    min="1"
                                    value={item.jumlah}
                                    onChange={(e) => handleItemChange(index, 'jumlah', e.target.value)}
                                />
                                <span style={styles.subtotal}>
                                    Rp{item.subtotal.toLocaleString('id-ID')}
                                </span>
                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        style={styles.btnDelete}
                                        onClick={() => hapusItem(index)}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}

                        <button type="button" style={styles.btnSecondary} onClick={tambahItem}>
                            + Tambah Item
                        </button>

                        <div style={styles.totalBox}>
                            <strong>Total: Rp{hitungTotal().toLocaleString('id-ID')}</strong>
                        </div>

                        <div style={styles.formButtons}>
                            <button type="submit" style={styles.btnPrimary}>Buat Order</button>
                            <button type="button" style={styles.btnSecondary} onClick={resetForm}>Batal</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabel Order */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                    <tr style={styles.tableHeader}>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Nama Pembeli</th>
                        <th style={styles.th}>No. Telepon</th>
                        <th style={styles.th}>Total</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Tanggal</th>
                        <th style={styles.th}>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={styles.emptyRow}>
                                Belum ada order. Buat order pertama!
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id} style={styles.tableRow}>
                                <td style={styles.td}>#{order.id}</td>
                                <td style={styles.td}>{order.nama_pembeli}</td>
                                <td style={styles.td}>{order.no_telepon || '-'}</td>
                                <td style={styles.td}>Rp{parseInt(order.total).toLocaleString('id-ID')}</td>
                                <td style={styles.td}>
                                        <span style={{
                                            ...styles.badge,
                                            background: getStatusColor(order.status)
                                        }}>
                                            {order.status}
                                        </span>
                                </td>
                                <td style={styles.td}>
                                    {new Date(order.created_at).toLocaleDateString('id-ID')}
                                </td>
                                <td style={styles.td}>
                                    <select
                                        style={styles.selectStatus}
                                        value={order.status}
                                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="diproses">Diproses</option>
                                        <option value="selesai">Selesai</option>
                                        <option value="dibatalkan">Dibatalkan</option>
                                    </select>
                                    <button
                                        style={styles.btnDelete}
                                        onClick={() => handleDelete(order.id)}
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
    center: { textAlign: 'center', marginTop: '50px', fontSize: '18px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    title: { color: '#e91e8c', margin: 0 },
    formContainer: { background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' },
    input: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' },
    select: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', flex: 1 },
    selectStatus: { padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', marginRight: '5px' },
    itemRow: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' },
    subtotal: { minWidth: '120px', fontWeight: 'bold', color: '#e91e8c' },
    totalBox: { background: '#fff3f9', padding: '15px', borderRadius: '4px', marginTop: '10px', marginBottom: '10px', fontSize: '18px', color: '#e91e8c' },
    formButtons: { display: 'flex', gap: '10px', marginTop: '10px' },
    tableContainer: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeader: { background: '#e91e8c', color: 'white' },
    th: { padding: '12px', textAlign: 'left' },
    tableRow: { borderBottom: '1px solid #ddd' },
    td: { padding: '12px' },
    emptyRow: { textAlign: 'center', padding: '20px', color: '#999' },
    badge: { color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
    btnPrimary: { background: '#e91e8c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
    btnSecondary: { background: '#999', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
    btnDelete: { background: '#f44336', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
};

export default OrderPage;