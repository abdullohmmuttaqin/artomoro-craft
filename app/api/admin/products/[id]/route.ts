import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuthError } from '@/lib/admin-auth';
import { createServerSupabaseClient } from '@/lib/server-supabase';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const authError = getAdminAuthError(request);
  if (authError) {
    return NextResponse.json({ message: authError }, { status: 401 });
  }

  const { id } = await context.params;
  const productId = Number.parseInt(id, 10);

  if (Number.isNaN(productId) || productId <= 0) {
    return NextResponse.json({ message: 'ID produk tidak valid.' }, { status: 400 });
  }

  try {
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from('produk').delete().eq('id', productId);

    if (error) throw error;

    return NextResponse.json({ message: 'Produk berhasil dihapus.' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus produk.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
