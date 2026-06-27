import { NextResponse } from 'next/server'

const SAGECO_UA_MARKER = 'SagecoApp'
const APP_MODE_PARAM   = 'app'
const APP_MODE_VALUE   = 'true'

export function middleware(request) {
  const ua = request.headers.get('user-agent') ?? ''
  const { searchParams, pathname } = request.nextUrl
  const isAppUA     = ua.includes(SAGECO_UA_MARKER)
  const hasAppParam = searchParams.get(APP_MODE_PARAM) === APP_MODE_VALUE

  // If WebView UA detected but no app param yet — redirect once to add param
  if (isAppUA && !hasAppParam) {
    const url = request.nextUrl.clone()
    url.searchParams.set(APP_MODE_PARAM, APP_MODE_VALUE)
    return NextResponse.redirect(url)
  }

  // Pass x-app-mode header downstream for SSR use
  if (hasAppParam) {
    const res = NextResponse.next()
    res.headers.set('x-app-mode', '1')
    return res
  }

  return NextResponse.next()
}

export const config = {
  // Exclude static assets, images, favicon, AND api routes from middleware
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|robots.txt|sitemap).*)'],
}
