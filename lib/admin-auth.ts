import { NextRequest } from 'next/server';

const ADMIN_KEY_HEADER = 'x-admin-key';

export const getAdminAuthError = (request: NextRequest) => {
  const configuredKey = process.env.ADMIN_DASHBOARD_KEY;

  if (!configuredKey) {
    return 'ADMIN_DASHBOARD_KEY belum dikonfigurasi di environment server.';
  }

  const requestKey = request.headers.get(ADMIN_KEY_HEADER);

  if (!requestKey || requestKey !== configuredKey) {
    return 'Akses admin ditolak. Kunci admin tidak valid.';
  }

  return null;
};

export const adminAuthHeaderName = ADMIN_KEY_HEADER;
