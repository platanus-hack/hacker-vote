import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/utils/supabase'
import { TARGET_DATE } from '@/components/CountdownServer'

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createMiddlewareClient(request)

    await supabase.auth.getSession()

    if (request.nextUrl.pathname === '/winners') {
      const now = new Date()
      const targetDate = new Date(TARGET_DATE)
      const isVotingEnded = now.getTime() > targetDate.getTime()

      if (!isVotingEnded) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    return response
  } catch (e) {
    if (request.nextUrl.pathname === '/winners') {
      const now = new Date()
      const targetDate = new Date(TARGET_DATE)
      const isVotingEnded = now.getTime() > targetDate.getTime()

      if (!isVotingEnded) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    return NextResponse.next({
      request: { headers: request.headers },
    })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
