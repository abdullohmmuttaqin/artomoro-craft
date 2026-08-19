const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');

// Import middleware verifikasi JWT
const { verifyToken } = require('../middleware/authMiddleware');

// ===== PROTECTED ROUTES =====
// Dashboard hanya bisa diakses admin yang sudah login
router.get('/', verifyToken, getDashboardData);

module.exports = router;