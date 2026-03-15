import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const ADMIN_PASSWORD =
  process.env.NODE_ENV === 'production'
    ? process.env.ADMIN_PASSWORD
    : (process.env.ADMIN_PASSWORD || 'admin1234');

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { ok } = checkRateLimit(ip, 'auth');
  if (!ok) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }
  try {
    const { password } = await request.json();
    if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
      const res = NextResponse.json({ ok: true });
      res.cookies.set('admin_session', password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });
      return res;
    }
    return NextResponse.json({ ok: false }, { status: 401 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
