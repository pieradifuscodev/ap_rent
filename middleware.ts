import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host');
  const isAuthenticated = request.cookies.get('admin_session');
  const url = request.nextUrl;

  // Se l'host è quello dell'admin
  if (hostname === 'ap-rent-admin.vercel.app') {
    // 1. Permetti accesso a login e API auth
    if (url.pathname === '/login' || url.pathname.startsWith('/api/auth')) {
      return NextResponse.rewrite(new URL(`/admin${url.pathname}`, request.url));
    }

    // 2. Protezione: se non autenticato, vai a /login
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. Se autenticato, mostra le pagine della cartella /admin
    return NextResponse.rewrite(new URL(`/admin${url.pathname}`, request.url));
  }

  // Altrimenti (Sito pubblico), mostra le pagine della cartella /site
  return NextResponse.rewrite(new URL(`/site${url.pathname}`, request.url));
}

// Questa configurazione è fondamentale per evitare i 404 sui file di sistema
export const config = {
  matcher: [
    /*
     * Esclude tutti i percorsi che iniziano con:
     * - api (rotte API)
     * - _next/static (file statici)
     * - _next/image (ottimizzazione immagini)
     * - favicon.ico (icona browser)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};