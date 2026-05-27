import "../styles/globals.css"
import Head from "next/head"
import { AuthProvider } from "../context/AuthContext"
import ChatBot from "../components/ChatBot"

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a5c38" />
        <meta name="author" content="SAGECO EVERGREEN" />
        <meta name="robots" content="index,follow" />
        <meta name="format-detection" content="telephone=yes" />
        <meta property="og:site_name" content="SAGECO EVERGREEN" />
        <meta property="og:locale" content="en_UG" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <ChatBot />
    </AuthProvider>
  )
}
