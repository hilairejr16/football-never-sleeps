import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SECRET;
  if (!secret) return NextResponse.next();

  const auth = request.headers.get('authorization') ?? '';
  if (auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const sep = decoded.indexOf(':');
      const password = sep >= 0 ? decoded.slice(sep + 1) : decoded;
      if (password === secret) return NextResponse.next();
    } catch {}
  }

  return new NextResponse('Admin credentials required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="GoalRush Admin"' },
  });
}

export const config = { matcher: '/admin/:path*' };
