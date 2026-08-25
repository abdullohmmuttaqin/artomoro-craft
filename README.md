# ♛ Artomoro Craft V2

> *Let Your Feelings Blossom*

Aplikasi web e-commerce & katalog interaktif untuk toko buket & hantaran eksklusif **Artomoro Craft**, Cilacap.

---

## 🌸 Tentang Project

**Artomoro Craft V2** adalah platform e-commerce buket pita satin dan hantaran eksklusif. Aplikasi ini dibangun dengan standar arsitektur modern Next.js App Router untuk menghadirkan pengalaman belanja yang cepat, responsif, dan terintegrasi langsung dengan format pemesanan WhatsApp.

---

## 🛠️ Tech Stack Modern

- **Framework:** Next.js 16 (App Router) & TypeScript
- **Styling:** Tailwind CSS v4 & Lucide React Icons
- **Database:** Supabase PostgreSQL (Direct Client Connection)
- **State & Direct Upload:** Base64 Image Processing for Local Uploads

---

## 📁 Struktur Project (App Router)

```bash
bouquet-app/
├── app/
│   ├── admin/
│   │   └── page.tsx           # Management Portal Admin (CRUD Produk & Statistik)
│   ├── katalog/
│   │   ├── [id]/
│   │   │   └── page.tsx       # Detail Produk Dinamis & Form Pemesanan WA
│   │   └── page.tsx           # Katalog Buket + Search Real-Time & Filter Range Harga
│   ├── globals.css            # Brand Variables, Styling Tailwind, & Smooth Scroll
│   ├── layout.tsx             # Root Layout & Navigation Wrapper
│   └── page.tsx               # Landing Page + Modal Pesanan Kustom + Footer
├── components/
│   └── Navbar.tsx             # Responsive Navigation Bar dengan Isolation Rule
├── lib/
│   └── supabase.ts            # Client Connection Supabase
└── types/
    └── index.ts               # Type Definitions TypeScript

```

---

## 🌟 Fitur Utama

### 🛒 Customer Area
- **Landing Page Interaktif:** Hero banner eksklusif, section Tentang Kami, Kontak & Jam Operasional, dan Footer responsif dengan ikon resmi Instagram & TikTok.
- **Modal Pesanan Kustom:** Form pesanan buket kustom di Landing Page yang terformat otomatis langsung ke WhatsApp Admin.
- **Katalog Real-Time & Filter:** Fitur pencarian produk instan berdasarkan nama dan penyaringan rentang budget (Range Harga).
- **Detail Produk Dinamis:** Kalkulasi otomatis total harga berdasarkan kuantitas, input catatan kartu ucapan kustom, dan pengarahan otomatis ke WhatsApp.

### 🔐 Admin Management Portal (/admin)
- **Dashboard Summary:** Ringkasan statistik jumlah koleksi produk, estimasi nilai total inventaris, dan produk stok habis.
- **Upload File Lokal Direct (Base64):** Unggah foto produk dari laptop/HP tanpa ketergantungan API pihak ketiga.
- **Manajemen Produk (CRUD):** Tambah dan hapus buket dengan tampilan tabel ber-zebra striping yang rapi.

---

## 🚀 Cara Menjalankan Project

1. Clone Repository & Install Dependencies:

    ```bash
   git clone https://github.com/abdullohmmuttaqin/artomoro-craft.git
   cd bouquet-app
   npm install
   ```

2. Setup Environment Variables (.env.local):

    ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Jalankan Server Development:

    ```bash
   npm run dev
   ```

4. Buka browser ke:

    ```bash
    http://localhost:3000
    ```

---

## 🌐 Navigasi Halaman

| URL | Keterangan |
| --- | --- |
| / | Beranda Customer & Form Pesanan Kustom |
| /katalog | Katalog Buket, Real-Time Search & Range Filter |
| /katalog/[id] | Detail Buket Dinamis & Opsi Ucapan |
| /admin | Admin Portal Management (Statistik & Product CRUD) |

---

## 👤 Author & Branding

**Abd M Muttaqin** — [@abdullohmmuttaqin](https://github.com/abdullohmmuttaqin)  
🌐 Portfolio: [portopel.vercel.app](https://portopel.vercel.app/)  
📱 Instagram: [@artomorocraft.id](https://www.instagram.com/artomorocraft.id/)  
🎵 TikTok: [@qetcil](https://www.tiktok.com/@qetcil)  
📍 Cilacap, Jawa Tengah, Indonesia