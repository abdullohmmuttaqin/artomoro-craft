import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuthError } from '@/lib/admin-auth';
import { createServerSupabaseClient } from '@/lib/server-supabase';

interface CreateProductBody {
  nama?: string;
  harga?: number;
  stok?: number;
  deskripsi?: string | null;
  gambar_url?: string | null;
  kategori_id?: number;
}

export async function POST(request: NextRequest) {
  const authError = getAdminAuthError(request);
  if (authError) {
    return NextResponse.json({ message: authError }, { status: 401 });
  }

  let body: CreateProductBody;

  try {
    body = (await request.json()) as CreateProductBody;
  } catch {
    return NextResponse.json({ message: 'Body request tidak valid.' }, { status: 400 });
  }

  const nama = (body.nama ?? '').trim();
  const harga = body.harga;
  const stok = body.stok;

  if (!nama || typeof harga !== 'number' || typeof stok !== 'number') {
    return NextResponse.json({ message: 'Nama, harga, dan stok wajib diisi dengan format valid.' }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();

    const payload = {
      nama,
      harga,
      stok,
      deskripsi: body.deskripsi ?? null,
      gambar_url: body.gambar_url ?? null,
      kategori_id: typeof body.kategori_id === 'number' ? body.kategori_id : null,
    };

    let { error } = await supabase.from('produk').insert([payload]);

    if (error && error.code === 'PGRST204') {
      const fallbackRes = await supabase.from('produk').insert([
        {
          nama_produk: nama,
          harga,
          stok,
          deskripsi: payload.deskripsi,
          gambar_url: payload.gambar_url,
          kategori_id: payload.kategori_id,
        },
      ]);
      error = fallbackRes.error;
    }

    if (error) throw error;

    return NextResponse.json({ message: 'Produk berhasil dibuat.' }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menambahkan produk.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
