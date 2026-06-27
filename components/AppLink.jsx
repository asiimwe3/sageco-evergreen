import Link from 'next/link'
import { useAppMode } from '../hooks/useAppMode'
import { appendAppMode } from '../lib/appMode'

export default function AppLink({ href, children, className, ...rest }) {
  const appMode = useAppMode()
  const finalHref = appMode ? appendAppMode(href) : href
  return <Link href={finalHref} className={className} {...rest}>{children}</Link>
}
