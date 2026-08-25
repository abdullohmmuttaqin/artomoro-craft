import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuthError } from '@/lib/admin-auth';
import { createServerSupabaseClient } from '@/lib/server-supabase';
import { enforceAdminRateLimit } from '@/lib/admin-rate-limit';
import { writeAdminAuditLog } from '@/lib/admin-audit';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const rateLimit = enforceAdminRateLimit(request, 'admin:products:delete');
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

  const { id } = await context.params;
  const productId = Number.parseInt(id, 10);

  if (Number.isNaN(productId) || productId <= 0) {
    writeAdminAuditLog(request, {
      action: 'admin.product.delete',
      success: false,
      details: { reason: 'ID produk tidak valid', rawId: id },
    });
    return NextResponse.json({ message: 'ID produk tidak valid.' }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from('produk').delete().eq('id', productId);

    if (error) throw error;

    writeAdminAuditLog(request, {
      action: 'admin.product.delete',
      success: true,
      details: { productId },
    });

    return NextResponse.json({ message: 'Produk berhasil dihapus.' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus produk.';
    writeAdminAuditLog(request, {
      action: 'admin.product.delete',
      success: false,
      details: { productId, message },
    });
    return NextResponse.json({ message }, { status: 500 });
  }
}
