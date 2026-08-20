import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// Pages - Customer
import LandingPage from './pages/LandingPage';
import KatalogPage from './pages/KatalogPage';

// Pages - Admin
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProdukPage from './pages/ProdukPage';
import OrderPage from './pages/OrderPage';

function App() {
    const [admin, setAdmin] = useState(null);

    // Cek localStorage saat app pertama dibuka
    useEffect(() => {
        const savedAdmin = localStorage.getItem('admin');
        if (savedAdmin) {
            setAdmin(JSON.parse(savedAdmin));
        }
    }, []);

    const handleLogin = (adminData) => {
        setAdmin(adminData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        setAdmin(null);
    };

    return (
        <Router>
            <Routes>
                {/* ===== CUSTOMER ROUTES ===== */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/katalog" element={<KatalogPage />} />

                {/* ===== ADMIN ROUTES ===== */}
                <Route
                    path="/admin"
                    element={
                        admin
                            ? <Navigate to="/admin/dashboard" />
                            : <LoginPage onLogin={handleLogin} />
                    }
                />
                <Route
                    path="/admin/dashboard"
                    element={
                        admin
                            ? <AdminLayout admin={admin} onLogout={handleLogout}><DashboardPage /></AdminLayout>
                            : <Navigate to="/admin" />
                    }
                />
                <Route
                    path="/admin/produk"
                    element={
                        admin
                            ? <AdminLayout admin={admin} onLogout={handleLogout}><ProdukPage /></AdminLayout>
                            : <Navigate to="/admin" />
                    }
                />
                <Route
                    path="/admin/order"
                    element={
                        admin
                            ? <AdminLayout admin={admin} onLogout={handleLogout}><OrderPage /></AdminLayout>
                            : <Navigate to="/admin" />
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

// Layout khusus admin — navbar admin + konten
const AdminLayout = ({ admin, onLogout, children }) => {
    return (
        <div>
            <nav style={styles.adminNavbar}>
                <div style={styles.adminBrandGroup}>
                    <span style={styles.adminBrand}>♛ ArtomoroCraft — Admin</span>
                    <a href="/" style={styles.btnLihatToko}>🌸 Lihat Toko</a>
                </div>
                <div style={styles.adminLinks}>
                    <Link to="/admin/dashboard" style={styles.adminLink}>Dashboard</Link>
                    <Link to="/admin/produk" style={styles.adminLink}>Produk</Link>
                    <Link to="/admin/order" style={styles.adminLink}>Order</Link>
                </div>
                <div style={styles.adminRight}>
                    <span style={styles.adminName}>👤 {admin.username}</span>
                    <button style={styles.btnLogout} onClick={onLogout}>Logout</button>
                </div>
            </nav>
            <div>{children}</div>
        </div>
    );
};

const styles = {
    adminNavbar: {
        background: 'var(--primary)',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    adminBrand: {
        color: 'var(--white)',
        fontSize: '16px',
        fontFamily: 'Georgia, serif',
        fontWeight: 'bold',
    },
    adminBrandGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    btnLihatToko: {
        background: 'rgba(255,255,255,0.15)',
        color: 'var(--white)',
        border: '1px solid rgba(255,255,255,0.5)',
        padding: '5px 12px',
        borderRadius: 'var(--radius)',
        fontSize: '12px',
        textDecoration: 'none',
    },
    adminLinks: {
        display: 'flex',
        gap: '24px',
    },
    adminLink: {
        color: 'var(--white)',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
    },
    adminRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    adminName: {
        color: 'var(--white)',
        fontSize: '13px',
    },
    btnLogout: {
        background: 'rgba(255,255,255,0.2)',
        color: 'var(--white)',
        border: '1px solid var(--white)',
        padding: '6px 14px',
        borderRadius: 'var(--radius)',
        fontSize: '13px',
    },
};

export default App;