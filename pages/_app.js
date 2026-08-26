import "../styles/globals.css"
import Head from "next/head"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { AuthProvider } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AppHeader from "../components/AppHeader"
import AppModeStyles from "../components/AppModeStyles"
import { useAppMode } from "../hooks/useAppMode"

const ChatBot = dynamic(() => import("../components/ChatBot"), { ssr: false })

// Pages that should render full-screen without Navbar/Footer (chat interfaces)
const FULLSCREEN_ROUTES = ["/ai-broker"]

function AppShell({ Component, pageProps }) {
  const appMode = useAppMode()
  const router = useRouter()
  const isFullscreen = FULLSCREEN_ROUTES.includes(router.pathname)

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content={
            appMode
              ? "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"
              : "width=device-width,initial-scale=1"
          }
        />
        {appMode && <meta name="apple-mobile-web-app-capable" content="yes" />}
        {/* Global SEO meta tags */}
        <meta name="theme-color" content="#0f766e" />
        <meta name="author" content="SAGECO EVERGREEN Company Ltd" />
        <meta name="publisher" content="DeryCode Technologies" />
        <meta name="creator" content="DeryCode Technologies" />
        <meta name="generator" content="Built by DeryCode Technologies — https://derycode.publicvm.com" />
        <meta name="x-built-by" content="DeryCode Technologies" />
        {/* Google Search Console verification — replace with your code */}
        {process.env.GOOGLE_SITE_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.GOOGLE_SITE_VERIFICATION} />
        )}
        {/* Bing Webmaster verification — replace with your code */}
        {process.env.BING_SITE_VERIFICATION && (
          <meta name="msvalidate.01" content={process.env.BING_SITE_VERIFICATION} />
        )}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="geo.region" content="UG" />
        <meta name="geo.placename" content="Kyenjojo, Uganda" />
        <meta name="geo.position" content="0.6426;30.6286" />
        <meta name="ICBM" content="0.6426, 30.6286" />
        <meta name="format-detection" content="telephone=yes" />
        <link rel="manifest" href="/manifest.json" />
        {/* Performance: preconnect to external resources */}
        <link rel="preconnect" href="https://unpkg.com" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <link rel="preconnect" href="https://emldbjqegftrngxypeca.supabase.co" />
        <link rel="dns-prefetch" href="https://emldbjqegftrngxypeca.supabase.co" />
        <link rel="dns-prefetch" href="https://server.arcgisonline.com" />
        <link rel="dns-prefetch" href="https://pay.pesapal.com" />
        <link rel="alternate" hrefLang="en-UG" href="https://sageco-evergreen-co.vercel.app" />
      </Head>

      {/* Inject app-mode performance CSS */}
      {appMode && <AppModeStyles />}

      {/* Navigation — hidden on fullscreen chat pages */}
      {!appMode && !isFullscreen && <Navbar />}
      {appMode  && !isFullscreen && <AppHeader showBack showSearch showNotif />}

      {/* Page content — fullscreen pages get no wrapper */}
      {isFullscreen ? (
        <Component {...pageProps} />
      ) : (
        <div className="pb-16 lg:pb-0">
          <Component {...pageProps} />
        </div>
      )}

      {/* Footer — hidden in app mode and on fullscreen pages */}
      {!appMode && !isFullscreen && <Footer />}

      {/* ChatBot — hidden in app mode and on fullscreen pages (AI broker IS the chat) */}
      {!appMode && !isFullscreen && <ChatBot />}

      {/* Android bottom nav safe-area spacer */}
      {appMode && (
        <div aria-hidden="true" style={{ height: "env(safe-area-inset-bottom, 16px)" }} />
      )}
    </>
  )
}

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppShell Component={Component} pageProps={pageProps} />
    </AuthProvider>
  )
}
