import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host');
  const isAuthenticated = request.cookies.get('admin_session');
  const url = request.nextUrl;

  if (hostname === 'ap-rent-admin.vercel.app') {
    // Permetti l'accesso alla pagina di login e all'API di auth
    if (url.pathname === '/login' || url.pathname.startsWith('/api/auth')) {
      return NextResponse.rewrite(new URL(`/admin${url.pathname}`, request.url));
    }

    // Se non autenticato, reindirizza al login
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.rewrite(new URL(`/admin${url.pathname}`, request.url));
  }

  return NextResponse.rewrite(new URL(`/site${url.pathname}`, request.url));
}