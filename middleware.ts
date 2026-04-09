import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host');
  const url = request.nextUrl;

  // Se l'utente entra da ap-rent-admin.vercel.app o localhost:3000 con prefisso admin
  if (hostname === 'ap-rent-admin.vercel.app') {
    return NextResponse.rewrite(new URL(`/admin${url.pathname}`, request.url));
  }

  // Per il dominio principale o localhost
  return NextResponse.rewrite(new URL(`/site${url.pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};