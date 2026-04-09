import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Recupera l'utente (più sicuro di getSession nel middleware)
  const { data: { user } } = await supabase.auth.getUser()

  const hostname = request.headers.get('host')
  const url = request.nextUrl

  // Gestione Sottodominio ADMIN
  if (hostname === 'ap-rent-admin.vercel.app' || hostname?.includes('localhost')) {
    
    // 1. Permetti sempre l'accesso a login e reset-password
    if (url.pathname === '/login' || url.pathname === '/reset-password' || url.pathname.startsWith('/api/auth')) {
      return NextResponse.rewrite(new URL(`/admin${url.pathname}`, request.url))
    }

    // 2. Se NON c'è un utente loggato, rimanda al login
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 3. Se loggato, mostra le pagine admin
    return NextResponse.rewrite(new URL(`/admin${url.pathname}`, request.url))
  }

  // Gestione SITO PUBBLICO
  return NextResponse.rewrite(new URL(`/site${url.pathname}`, request.url))
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}