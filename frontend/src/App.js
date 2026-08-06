import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ProdukPage from './pages/ProdukPage';
import OrderPage from './pages/OrderPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

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

    // Kalau belum login, tampilkan LoginPage
    if (!admin) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <Router>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <Link to="/" style={styles.brand}>🌸 Bouquet App</Link>
                <div style={styles.navLinks}>
                    <Link to="/" style={styles.navLink}>Dashboard</Link>
                    <Link to="/produk" style={styles.navLink}>Produk</Link>
                    <Link to="/order" style={styles.navLink}>Order</Link>
                </div>
                <div style={styles.adminInfo}>
                    <span style={styles.adminName}>👤 {admin.username}</span>
                    <button style={styles.btnLogout} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/produk" element={<ProdukPage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

const styles = {
    navbar: { background: '#e91e8c', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    brand: { color: 'white', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none' },
    navLinks: { display: 'flex', gap: '20px' },
    navLink: { color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: '500' },
    adminInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
    adminName: { color: 'white', fontSize: '14px' },
    btnLogout: { background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid white', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
};

export default App;