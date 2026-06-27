import { NextResponse } from 'next/server'

const SAGECO_UA_MARKER = 'SagecoApp'
const APP_MODE_PARAM   = 'app'
const APP_MODE_VALUE   = 'true'

export function middleware(request) {
  const ua = request.headers.get('user-agent') ?? ''
  const { searchParams } = request.nextUrl
  const isAppUA    = ua.includes(SAGECO_UA_MARKER)
  const hasAppParam = searchParams.get(APP_MODE_PARAM) === APP_MODE_VALUE

  if (isAppUA && !hasAppParam) {
    const url = request.nextUrl.clone()
    url.searchParams.set(APP_MODE_PARAM, APP_MODE_VALUE)
    const res = NextResponse.rewrite(url)
    res.headers.set('x-app-mode', '1')
    return res
  }
  if (hasAppParam) {
    const res = NextResponse.next()
    res.headers.set('x-app-mode', '1')
    return res
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
