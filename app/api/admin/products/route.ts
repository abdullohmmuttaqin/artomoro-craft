import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuthError } from '@/lib/admin-auth';
import { createServerSupabaseClient } from '@/lib/server-supabase';
import { validateProductPayload } from '@/lib/admin-product-validation';
import { enforceAdminRateLimit } from '@/lib/admin-rate-limit';
import { writeAdminAuditLog } from '@/lib/admin-audit';

interface CreateProductBody {
  nama?: string;
  harga?: number;
  stok?: number;
  deskripsi?: string | null;
  gambar_url?: string | null;
  kategori_id?: number;
}

export async function POST(request: NextRequest) {
  const rateLimit = enforceAdminRateLimit(request, 'admin:products:post');
  if (!rateLimit.ok) {
    writeAdminAuditLog(request, {
      action: 'admin.rate_limited',
      success: false,
      details: { retryAfterSeconds: rateLimit.retryAfterSeconds, remaining: rateLimit.remaining, limit: rateLimit.limit },
    });
    return NextResponse.json(
      { message: 'Terlalu banyak request admin. Coba lagi beberapa saat.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    );
  }

  const authError = getAdminAuthError(request, ['admin', 'founder']);
  if (authError) {
    writeAdminAuditLog(request, {
      action: 'admin.auth.failed',
      success: false,
      details: { reason: authError },
    });
    return NextResponse.json({ message: authError }, { status: 401 });
  }

  let body: CreateProductBody;

  try {
    body = (await request.json()) as CreateProductBody;
  } catch {
    return NextResponse.json({ message: 'Body request tidak valid.' }, { status: 400 });
  }

  const nama = (body.nama ?? '').trim();
  const validationError = validateProductPayload({
    nama,
    harga: body.harga,
    stok: body.stok,
    deskripsi: body.deskripsi,
    gambar_url: body.gambar_url,
    kategori_id: body.kategori_id,
  });

  if (validationError) {
    writeAdminAuditLog(request, {
      action: 'admin.product.create',
      success: false,
      details: { reason: validationError },
    });
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();

    const harga = body.harga as number;
    const stok = body.stok as number;

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

    writeAdminAuditLog(request, {
      action: 'admin.product.create',
      success: true,
      details: { nama, kategoriId: payload.kategori_id },
    });

    return NextResponse.json({ message: 'Produk berhasil dibuat.' }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menambahkan produk.';
    writeAdminAuditLog(request, {
      action: 'admin.product.create',
      success: false,
      details: { nama, message },
    });
    return NextResponse.json({ message }, { status: 500 });
  }
}
