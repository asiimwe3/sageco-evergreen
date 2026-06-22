import "../styles/globals.css"
import { AuthProvider } from "../context/AuthContext"
import dynamic from "next/dynamic"

const ChatBot = dynamic(() => import("../components/ChatBot"), { ssr: false })

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ChatBot />
    </AuthProvider>
  )
}
