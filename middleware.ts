import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  const hostname = request.headers.get('host')
  const url = request.nextUrl

  // Gestione Sottodominio ADMIN
  if (hostname === 'ap-rent-admin.vercel.app') {
    // Permetti sempre l'accesso a login e reset-password
    if (url.pathname === '/login' || url.pathname === '/reset-password' || url.pathname.startsWith('/api/auth')) {
      return NextResponse.rewrite(new URL(`/admin${url.pathname}`, request.url))
    }

    // Se NON c'è una sessione, rimanda al login
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Se loggato, mostra le pagine admin
    return NextResponse.rewrite(new URL(`/admin${url.pathname}`, request.url))
  }

  // Gestione SITO PUBBLICO
  return NextResponse.rewrite(new URL(`/site${url.pathname}`, request.url))
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}