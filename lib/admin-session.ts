import crypto from 'crypto';
import { NextResponse } from 'next/server';

export type AdminSessionRole = 'admin' | 'founder';

export interface AdminSessionPayload {
  role: AdminSessionRole;
  exp: number;
}

export const adminSessionCookieName = 'admin_session';
const ADMIN_SESSION_COOKIE = adminSessionCookieName;
const ADMIN_SESSION_TTL_SECONDS = Number.parseInt(process.env.ADMIN_SESSION_TTL_SECONDS ?? '28800', 10);

const getSessionSecret = () => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET belum dikonfigurasi di environment server.');
  }
  return secret;
};

const createSignature = (payload: string, secret: string) => {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
};

const parseToken = (token: string) => {
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;

  const payloadBuffer = Buffer.from(encodedPayload, 'base64url');
  const payload = payloadBuffer.toString('utf8');
  return { encodedPayload, payload, signature };
};

export const getAdminSessionPayload = (token: string | undefined): AdminSessionPayload | null => {
  if (!token) return null;

  const secret = getSessionSecret();
  const parsed = parseToken(token);
  if (!parsed) return null;

  const expectedSignature = createSignature(parsed.encodedPayload, secret);
  const provided = Buffer.from(parsed.signature, 'utf8');
  const expected = Buffer.from(expectedSignature, 'utf8');

  if (provided.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(provided, expected)) return null;

  try {
    const payload = JSON.parse(parsed.payload) as Partial<AdminSessionPayload>;
    if (payload.role !== 'admin' && payload.role !== 'founder') return null;
    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return {
      role: payload.role,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
};

export const createAdminSessionToken = (role: AdminSessionRole = 'admin') => {
  const secret = getSessionSecret();
  const exp = Math.floor(Date.now() / 1000) + Math.max(300, ADMIN_SESSION_TTL_SECONDS);
  const payload: AdminSessionPayload = { role, exp };
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = createSignature(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
};

export const verifyAdminSessionToken = (token: string | undefined) => {
  return getAdminSessionPayload(token) !== null;
};

export const setAdminSessionCookie = (response: NextResponse, token: string) => {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.max(300, ADMIN_SESSION_TTL_SECONDS),
  });
};

export const clearAdminSessionCookie = (response: NextResponse) => {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
};
