import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProdukPage from './pages/ProdukPage';
import OrderPage from './pages/OrderPage';

function App() {
    return (
        <Router>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <span style={styles.brand}>🌸 Bouquet App</span>
                <div style={styles.navLinks}>
                    <Link to="/produk" style={styles.navLink}>Produk</Link>
                    <Link to="/order" style={styles.navLink}>Order</Link>
                </div>
            </nav>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<ProdukPage />} />
                <Route path="/produk" element={<ProdukPage />} />
                <Route path="/order" element={<OrderPage />} />
            </Routes>
        </Router>
    );
}

const styles = {
    navbar: { background: '#e91e8c', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    brand: { color: 'white', fontSize: '20px', fontWeight: 'bold' },
    navLinks: { display: 'flex', gap: '20px' },
    navLink: { color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: '500' },
};

export default App;