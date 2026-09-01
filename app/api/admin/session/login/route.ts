import { NextRequest, NextResponse } from 'next/server';
import { enforceAdminRateLimit } from '@/lib/admin-rate-limit';
import { writeAdminAuditLog } from '@/lib/admin-audit';
import { createAdminSessionToken, setAdminSessionCookie } from '@/lib/admin-session';

interface LoginBody {
  key?: string;
}

export async function POST(request: NextRequest) {
  const rateLimit = enforceAdminRateLimit(request, 'admin:session:login');
  if (!rateLimit.ok) {
    writeAdminAuditLog(request, {
      action: 'admin.rate_limited',
      success: false,
      details: { retryAfterSeconds: rateLimit.retryAfterSeconds, remaining: rateLimit.remaining, limit: rateLimit.limit },
    });
    return NextResponse.json(
      { message: 'Terlalu banyak percobaan login. Coba lagi beberapa saat.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    );
  }

  const configuredKey = process.env.ADMIN_DASHBOARD_KEY;
  if (!configuredKey) {
    return NextResponse.json({ message: 'ADMIN_DASHBOARD_KEY belum dikonfigurasi di server.' }, { status: 500 });
  }

  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ message: 'Body request tidak valid.' }, { status: 400 });
  }

  const submittedKey = (body.key ?? '').trim();
  if (!submittedKey) {
    return NextResponse.json({ message: 'Kunci admin wajib diisi.' }, { status: 400 });
  }

  if (submittedKey !== configuredKey) {
    writeAdminAuditLog(request, {
      action: 'admin.auth.failed',
      success: false,
      details: { reason: 'Dashboard key mismatch' },
    });
    return NextResponse.json({ message: 'Kunci admin tidak valid.' }, { status: 401 });
  }

  try {
    const token = createAdminSessionToken();
    const response = NextResponse.json({ message: 'Login admin berhasil.' });
    setAdminSessionCookie(response, token);

    writeAdminAuditLog(request, {
      action: 'admin.session.login',
      success: true,
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal membuat sesi admin.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
