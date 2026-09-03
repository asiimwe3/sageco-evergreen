import "../styles/globals.css"
import Head from "next/head"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { AuthProvider } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AppHeader from "../components/AppHeader"
import AppModeStyles from "../components/AppModeStyles"
import AppBottomNav from "../components/AppBottomNav"
import { useAppMode } from "../hooks/useAppMode"

const ChatBot = dynamic(() => import("../components/ChatBot"), { ssr: false })

// Pages that should render full-screen without Navbar/Footer (chat interfaces)
const FULLSCREEN_ROUTES = ["/ai-broker"]

function AppShell({ Component, pageProps }) {
  const appMode = useAppMode()
  const router = useRouter()
  const isFullscreen = FULLSCREEN_ROUTES.includes(router.pathname)
  // The Home screen renders its own edge-to-edge hero + top bar in App Mode
  const isAppHome = appMode && router.pathname === "/"

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

        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <script async src={'https://www.googletagmanager.com/gtag/js?id=' + process.env.NEXT_PUBLIC_GA4_ID}></script>
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', process.env.NEXT_PUBLIC_GA4_ID, {
                page_path: window.location.pathname,
              });
            `}} />
          </>
        )}

        {/* Facebook Pixel */}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
          <script dangerouslySetInnerHTML={{ __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', process.env.NEXT_PUBLIC_FB_PIXEL_ID);
            fbq('track', 'PageView');
          `}} />
        )}

        {/* Google Tag Manager */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <script dangerouslySetInnerHTML={{ __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', process.env.NEXT_PUBLIC_GTM_ID);
          `}} />
        )}
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
      {appMode  && !isFullscreen && !isAppHome && <AppHeader showBack showSearch showNotif />}

      {/* Page content — fullscreen pages get no wrapper */}
      {isFullscreen ? (
        <Component {...pageProps} />
      ) : (
        <div className={appMode ? "pb-20" : "pb-16 lg:pb-0"}>
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
