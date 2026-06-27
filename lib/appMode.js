export const APP_MODE_PARAM   = 'app'
export const APP_MODE_VALUE   = 'true'
export const SAGECO_UA_MARKER = 'SagecoApp'

export function detectAppModeClient() {
  if (typeof window === 'undefined') return false
  if (navigator.userAgent.includes(SAGECO_UA_MARKER)) return true
  const params = new URLSearchParams(window.location.search)
  return params.get(APP_MODE_PARAM) === APP_MODE_VALUE
}

export function appendAppMode(href) {
  try {
    const isRelative = !href.startsWith('http')
    const url = new URL(href, isRelative ? 'https://x.x' : undefined)
    url.searchParams.set(APP_MODE_PARAM, APP_MODE_VALUE)
    return isRelative ? url.pathname + url.search + url.hash : url.toString()
  } catch {
    const sep = href.includes('?') ? '&' : '?'
    return `${href}${sep}${APP_MODE_PARAM}=${APP_MODE_VALUE}`
  }
}
