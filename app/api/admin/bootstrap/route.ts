import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuthError } from '@/lib/admin-auth';
import { createServerSupabaseClient } from '@/lib/server-supabase';
import { enforceAdminRateLimit } from '@/lib/admin-rate-limit';
import { writeAdminAuditLog } from '@/lib/admin-audit';

export async function GET(request: NextRequest) {
  const rateLimit = enforceAdminRateLimit(request, 'admin:bootstrap:get');
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

  const authError = getAdminAuthError(request);
  if (authError) {
    writeAdminAuditLog(request, {
      action: 'admin.auth.failed',
      success: false,
      details: { reason: authError },
    });
    return NextResponse.json({ message: authError }, { status: 401 });
  }

  try {
    const supabase = createServerSupabaseClient();

    const [{ data: kategori, error: kategoriError }, { data: produk, error: produkError }] = await Promise.all([
      supabase.from('kategori').select('*'),
      supabase.from('produk').select('*').order('id', { ascending: false }),
    ]);

    if (kategoriError) throw kategoriError;
    if (produkError) throw produkError;

    writeAdminAuditLog(request, {
      action: 'admin.bootstrap',
      success: true,
      details: {
        kategoriCount: kategori?.length ?? 0,
        produkCount: produk?.length ?? 0,
      },
    });

    return NextResponse.json({
      kategori: kategori ?? [],
      produk: produk ?? [],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memuat data admin.';
    writeAdminAuditLog(request, {
      action: 'admin.bootstrap',
      success: false,
      details: { message },
    });
    return NextResponse.json({ message }, { status: 500 });
  }
}
