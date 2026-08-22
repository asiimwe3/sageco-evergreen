import "../styles/globals.css"
import Head from "next/head"
import dynamic from "next/dynamic"
import { AuthProvider } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AppHeader from "../components/AppHeader"
import AppModeStyles from "../components/AppModeStyles"
import { useAppMode } from "../hooks/useAppMode"

const ChatBot = dynamic(() => import("../components/ChatBot"), { ssr: false })

function AppShell({ Component, pageProps }) {
  const appMode = useAppMode()

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
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="geo.region" content="UG" />
        <meta name="geo.placename" content="Kyenjojo, Uganda" />
        <meta name="geo.position" content="0.6426;30.6286" />
        <meta name="ICBM" content="0.6426, 30.6286" />
        <meta name="format-detection" content="telephone=yes" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" hrefLang="en-UG" href="https://sageco-evergreen-co.vercel.app" />
      </Head>

      {/* Inject app-mode performance CSS */}
      {appMode && <AppModeStyles />}

      {/* Navigation — full Navbar for web, compact AppHeader for WebView */}
      {!appMode && <Navbar />}
      {appMode  && <AppHeader showBack showSearch showNotif />}

      {/* Page content */}
      <div className="pb-16 lg:pb-0">
      <Component {...pageProps} />

      </div>

      {/* Footer — hidden in app mode */}
      {!appMode && <Footer />}

      {/* ChatBot — hidden in app mode */}
      {!appMode && <ChatBot />}

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
