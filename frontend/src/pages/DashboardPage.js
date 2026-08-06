import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const result = await axios.get('http://localhost:5000/api/dashboard');
            setData(result.data.data);
        } catch (err) {
            console.error('Gagal memuat dashboard');
        } finally {
            setLoading(false);
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
    if (!data) return <div style={styles.center}>Gagal memuat data</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>📊 Dashboard</h1>

            {/* Kartu Ringkasan */}
            <div style={styles.cardGrid}>
                <div style={{...styles.card, borderTop: '4px solid #e91e8c'}}>
                    <div style={styles.cardLabel}>Total Pemasukan</div>
                    <div style={styles.cardValue}>
                        Rp{parseInt(data.totalPemasukan).toLocaleString('id-ID')}
                    </div>
                    <div style={styles.cardNote}>dari order selesai</div>
                </div>
                <div style={{...styles.card, borderTop: '4px solid #2196F3'}}>
                    <div style={styles.cardLabel}>Total Order</div>
                    <div style={styles.cardValue}>{data.totalOrders}</div>
                    <div style={styles.cardNote}>semua order</div>
                </div>
                <div style={{...styles.card, borderTop: '4px solid #4CAF50'}}>
                    <div style={styles.cardLabel}>Total Produk</div>
                    <div style={styles.cardValue}>{data.totalProduk}</div>
                    <div style={styles.cardNote}>produk aktif</div>
                </div>
            </div>

            {/* Status Order & Produk Terlaris */}
            <div style={styles.twoColumn}>

                {/* Status Order */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Status Order</h2>
                    {data.orderPerStatus.length === 0 ? (
                        <p style={styles.empty}>Belum ada order</p>
                    ) : (
                        data.orderPerStatus.map((item, index) => (
                            <div key={index} style={styles.statusRow}>
                                <span style={{
                                    ...styles.badge,
                                    background: getStatusColor(item.status)
                                }}>
                                    {item.status}
                                </span>
                                <span style={styles.statusJumlah}>
                                    {item.jumlah} order
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Produk Terlaris */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>🏆 Produk Terlaris</h2>
                    {data.produkTerlaris.length === 0 ? (
                        <p style={styles.empty}>Belum ada data penjualan</p>
                    ) : (
                        data.produkTerlaris.map((item, index) => (
                            <div key={index} style={styles.larisRow}>
                                <span style={styles.larisRank}>#{index + 1}</span>
                                <span style={styles.larisNama}>{item.nama_produk}</span>
                                <span style={styles.larisJumlah}>{item.total_terjual} terjual</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Order Terbaru */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>🕐 Order Terbaru</h2>
                <table style={styles.table}>
                    <thead>
                    <tr style={styles.tableHeader}>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Nama Pembeli</th>
                        <th style={styles.th}>Total</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Tanggal</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.orderTerbaru.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={styles.emptyRow}>Belum ada order</td>
                        </tr>
                    ) : (
                        data.orderTerbaru.map((order) => (
                            <tr key={order.id} style={styles.tableRow}>
                                <td style={styles.td}>#{order.id}</td>
                                <td style={styles.td}>{order.nama_pembeli}</td>
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
    title: { color: '#e91e8c', marginBottom: '20px' },
    cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' },
    card: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    cardLabel: { fontSize: '14px', color: '#999', marginBottom: '8px' },
    cardValue: { fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '4px' },
    cardNote: { fontSize: '12px', color: '#bbb' },
    twoColumn: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' },
    section: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' },
    sectionTitle: { color: '#333', marginTop: 0, marginBottom: '15px', fontSize: '18px' },
    empty: { color: '#999', textAlign: 'center' },
    statusRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    statusJumlah: { fontWeight: 'bold', color: '#333' },
    larisRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', padding: '8px', background: '#f9f9f9', borderRadius: '4px' },
    larisRank: { fontWeight: 'bold', color: '#e91e8c', minWidth: '30px' },
    larisNama: { flex: 1, color: '#333' },
    larisJumlah: { color: '#999', fontSize: '13px' },
    badge: { color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeader: { background: '#e91e8c', color: 'white' },
    th: { padding: '10px 12px', textAlign: 'left' },
    tableRow: { borderBottom: '1px solid #ddd' },
    td: { padding: '10px 12px' },
    emptyRow: { textAlign: 'center', padding: '20px', color: '#999' },
};

export default DashboardPage;