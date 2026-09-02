# ArtomoroCraft

Website katalog dan pemesanan buket ArtomoroCraft, dibangun dengan Next.js App Router dan Supabase.

## Fitur

### Customer

- Beranda brand dengan informasi kontak dan jam operasional.
- Form pemesanan custom yang menghasilkan pesan WhatsApp.
- Katalog dengan pencarian, filter kategori, dan filter harga.
- Halaman detail produk dengan kalkulasi jumlah dan total harga.
- Produk yang diarsipkan tidak ditampilkan kepada customer.

### Admin

- Login username/password untuk role `admin` atau `founder`.
- Signed session berbasis HMAC dengan cookie `httpOnly`.
- CRUD produk dan kategori.
- Archive dan restore produk yang masih digunakan histori pesanan.
- Validasi payload produk dan gambar JPG, PNG, atau WEBP maksimal 2 MB.
- Rate limiting dan audit log untuk aktivitas admin.
- Foreign key protection agar histori pesanan tidak rusak.

## Tech Stack

- Next.js 16 App Router
- TypeScript
- React 19
- Tailwind CSS v4
- Lucide React
- Supabase PostgreSQL

## Struktur Proyek

```text
bouquet-app/
├── app/
│   ├── admin/page.tsx                 # Dashboard admin dan CRUD katalog
│   ├── api/admin/                     # API session, produk, dan kategori
│   ├── katalog/page.tsx               # Daftar katalog customer
│   ├── katalog/[id]/page.tsx          # Detail produk dan pemesanan
│   ├── globals.css                    # Styling global
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Beranda customer
├── components/Navbar.tsx              # Navigasi responsive
├── lib/
│   ├── admin-audit.ts                 # Audit log aktivitas admin
│   ├── admin-auth.ts                  # Validasi akses berdasarkan role
│   ├── admin-product-validation.ts    # Validasi produk dan gambar
│   ├── admin-rate-limit.ts             # Rate limiting endpoint admin
│   ├── admin-session.ts               # Signed session cookie
│   ├── server-supabase.ts             # Supabase client server-side
│   └── supabase.ts                    # Supabase client customer
├── supabase/migrations/               # Migration database
├── types/index.ts                     # Shared TypeScript types
├── .env.example                       # Template environment variables
├── next.config.ts                     # Konfigurasi Next.js
├── package.json                       # Script dan dependencies
└── tsconfig.json                      # Konfigurasi TypeScript
```

## Environment Variables

Salin `.env.example` menjadi `.env.local`, kemudian isi nilai sebenarnya:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-admin-password
FOUNDER_USERNAME=founder
FOUNDER_PASSWORD=change-this-founder-password

ADMIN_SESSION_SECRET=change-this-session-secret
ADMIN_SESSION_TTL_SECONDS=28800
ADMIN_RATE_LIMIT_MAX=30
ADMIN_RATE_LIMIT_WINDOW_SECONDS=60
```

`SUPABASE_SERVICE_ROLE_KEY`, password, dan session secret hanya boleh berada di server environment. Jangan expose atau commit `.env.local`.

## Database Migration

Untuk mengaktifkan archive produk, jalankan migration berikut di Supabase SQL Editor atau melalui migration workflow Supabase:

```sql
alter table public.produk
  add column if not exists is_active boolean not null default true;

create index if not exists produk_is_active_idx on public.produk (is_active);
```

Migration tersimpan di [supabase/migrations/20260902_add_product_archive.sql](supabase/migrations/20260902_add_product_archive.sql).

Produk yang sudah direferensikan oleh `order_items` tidak boleh dihapus permanen. Gunakan archive melalui dashboard atau SQL berikut:

```sql
update public.produk
set is_active = false
where id in (1, 2);
```

Archive menyembunyikan produk dari customer tanpa menghapus histori order.

## Menjalankan Secara Lokal

```bash
git clone https://github.com/abdullohmmuttaqin/artomoro-craft.git
cd bouquet-app
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Validasi

```bash
npm run lint
npm run build
```

## Route Utama

| Route | Fungsi |
| --- | --- |
| `/` | Beranda customer dan form pesanan custom |
| `/katalog` | Daftar produk, pencarian, dan filter |
| `/katalog/[id]` | Detail produk dan pemesanan WhatsApp |
| `/admin` | Dashboard admin dan manajemen katalog |

## Catatan Production

- Gunakan password dan secret yang berbeda dari development.
- Set environment variables melalui secret manager platform deployment.
- Jalankan database migration sebelum deploy versi archive.
- Pastikan backup dan recovery Supabase aktif.
- Rate limiter saat ini berbasis memory proses; untuk multi-instance gunakan storage terdistribusi.
- Audit log saat ini ditulis ke server log dan sebaiknya diteruskan ke log management production.
