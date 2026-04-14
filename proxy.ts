import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const hostname = request.headers.get('host')
  const url = request.nextUrl
  const path = url.pathname

  // GESTIONE SOTTODOMINIO ADMIN (o localhost)
  if (hostname === 'ap-rent-admin.vercel.app' || hostname?.includes('localhost')) {
    
    // Evita loop: se il path inizia già con /admin, non riscriverlo
    if (path.startsWith('/admin')) {
      return supabaseResponse
    }

    // 1. Permetti sempre login e reset-password
    if (path === '/login' || path === '/reset-password' || path.startsWith('/api/auth')) {
      return NextResponse.rewrite(new URL(`/admin${path}`, request.url))
    }

    // 2. Se NON loggato, rimanda al login (URL pubblico del sottodominio)
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 3. Rewrite alla cartella admin
    // Esempio: localhost:3000/veicoli -> app/admin/veicoli/page.tsx
    return NextResponse.rewrite(new URL(`/admin${path}`, request.url))
  }

  // GESTIONE SITO PUBBLICO
  if (path.startsWith('/site')) return supabaseResponse
  return NextResponse.rewrite(new URL(`/site${path}`, request.url))
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}