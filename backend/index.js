const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Muat konfigurasi dari file .env
dotenv.config();

const pool = require('./config/db');
const produkRoutes = require('./routes/produkRoutes');
const orderRoutes = require('./routes/orderRoutes'); // tambahan baru
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/produk', produkRoutes);
app.use('/api/orders', orderRoutes); // tambahan baru
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

// Route test
app.get('/', (req, res) => {
    res.json({ message: 'Bouquet App API berjalan!' });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});