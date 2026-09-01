import { NextRequest, NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '@/lib/admin-session';
import { writeAdminAuditLog } from '@/lib/admin-audit';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ message: 'Logout admin berhasil.' });
  clearAdminSessionCookie(response);

  writeAdminAuditLog(request, {
    action: 'admin.session.logout',
    success: true,
  });

  return response;
}
