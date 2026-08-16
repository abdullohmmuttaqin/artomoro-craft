# ♛ Artomoro Craft

> *Let Your Feelings Blossom*

Aplikasi web e-commerce untuk toko buket & hantaran eksklusif **Artomoro Craft**, Cilacap.

---

## 🌸 Tentang

Artomoro Craft adalah toko buket dan hantaran eksklusif yang melayani berbagai momen spesial seperti wisuda, pernikahan, anniversary, dan ulang tahun. Aplikasi ini dibangun untuk memudahkan pengelolaan produk, order, dan menampilkan katalog kepada customer.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- CSS Variables (custom brand identity)
- React Router DOM

**Backend:**
- Node.js + Express.js
- JWT Authentication + bcrypt

**Database:**
- PostgreSQL via Supabase (cloud)

---

## 📁 Struktur Project

    bouquet-app/
    ├── backend/
    │   ├── config/         # Koneksi database PostgreSQL
    │   ├── controllers/    # Logic bisnis API
    │   ├── middleware/     # Auth middleware (JWT)
    │   ├── models/         # Query SQL
    │   ├── routes/         # Definisi endpoint API
    │   ├── index.js        # Entry point server
    │   └── package.json
    └── frontend/
        ├── public/
        └── src/
            ├── components/ # Komponen reusable (Navbar)
            ├── pages/      # Halaman aplikasi
            │   ├── LandingPage.js    # Beranda customer
            │   ├── KatalogPage.js    # Katalog produk customer
            │   ├── DashboardPage.js  # Dashboard admin
            │   ├── ProdukPage.js     # Manajemen produk admin
            │   ├── OrderPage.js      # Manajemen order admin
            │   └── LoginPage.js      # Login admin
            ├── services/   # HTTP request ke API
            └── App.js      # Root component & routing

---

## ✅ Progress

### 🎨 Redesign E-Commerce ✅ SELESAI
- [x] Brand identity Artomoro Craft (pink, Georgia font)
- [x] CSS Variables untuk konsistensi warna
- [x] Landing Page dengan hero, koleksi, produk unggulan, CTA
- [x] Katalog Page dengan search & filter kategori
- [x] Navbar customer (Beranda, Katalog, Pesan Sekarang)

### Milestone 1 — Manajemen Produk ✅ SELESAI
- [x] CRUD produk bouquet
- [x] Kategori bouquet
- [x] Search & filter

### Milestone 2 — Transaksi & Order ✅ SELESAI
- [x] Form order
- [x] Status order
- [x] Riwayat transaksi

### Milestone 3 — Dashboard & Laporan ✅ SELESAI
- [x] Total pemasukan
- [x] Produk terlaris
- [x] Status order summary
- [x] Order terbaru

### Milestone 4 — Authentication ✅ SELESAI
- [x] Login admin
- [x] JWT token
- [x] Proteksi route
- [x] Logout

---

## 🚀 Cara Menjalankan

**Backend:**

    cd backend
    npm install
    npm run dev

**Frontend:**

    cd frontend
    npm install
    npm start

Buka browser ke `http://localhost:3000`

**Admin Panel:** `http://localhost:3000/admin`

---

## 🌐 Halaman

| URL | Keterangan |
|-----|-----------|
| `/` | Landing Page (customer) |
| `/katalog` | Katalog Produk (customer) |
| `/admin` | Login Admin |
| `/admin/dashboard` | Dashboard Admin |
| `/admin/produk` | Manajemen Produk |
| `/admin/order` | Manajemen Order |

---

## 👤 Author

**Abd Muttaqin** — [@abdullohmmuttaqin](https://github.com/abdullohmmuttaqin)

📱 Instagram: [@artomorocraft.id](https://www.instagram.com/artomorocraft.id/)
📍 Cilacap, Jawa Tengah