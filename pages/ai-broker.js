import Head from "next/head"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

export default function AIBroker() {
  const [messages, setMessages] = useState([{ role: 'bot', text: "Hi! I'm the SAGECO EVERGREEN AI Broker. How can I help you today?" }])
  const [input, setInput] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => { chatEndRef?.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const quickQueries = [
    "Find land in Kyenjojo under 5 million",
    "How do I book a viewing?",
    "Register as a broker",
    "Tell me about investment options",
  ]

  async function send(text) {
    const msg = text || input
    if (!msg.trim() || loading) return
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai-broker/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, user_phone: phone })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'bot', text: data.reply || "I couldn't process that. Please try again." }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: "Connection error. Please try again." }])
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>AI Broker — WhatsApp & Web | SAGECO EVERGREEN</title>
        <meta name="description" content="Meet your AI Real Estate Broker — available 24/7 on WhatsApp and Web. Natural-language property search, intent parsing, and broker followups." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16 px-4 text-center">
          <div className="inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-3">🤖 Available 24/7</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Real Estate Broker</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">Natural-language property search via WhatsApp and Web. Parses intent, finds matches, and creates broker follow-up tasks automatically.</p>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: "💬", title: "Natural Language", desc: "Just type what you're looking for — no forms or filters." },
              { icon: "🔍", title: "Smart Property Search", desc: "AI parses your intent and searches our property database." },
              { icon: "📋", title: "Auto Follow-ups", desc: "Leads are captured and assigned to brokers automatically." },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm text-center">
                <div className="text-3xl mb-2">{f.icon}</div>
                <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-gray-500 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-green-700 text-white px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
              <div>
                <div className="font-bold">SAGECO AI Broker</div>
                <div className="text-xs text-green-100">● Online</div>
              </div>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${m.role === 'user' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 shadow-sm border'}`}>
                    <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              ))}
              {loading && <div className="flex justify-start"><div className="bg-white rounded-2xl px-4 py-2 shadow-sm border text-gray-400 text-sm">Typing...</div></div>}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t bg-white">
              <div className="flex flex-wrap gap-2 mb-2">
                {quickQueries.map((q, i) => (
                  <button key={i} onClick={() => send(q)} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-green-100">{q}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="tel" placeholder="Your phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} className="w-32 border rounded-lg px-2 py-2 text-sm" />
                <input type="text" placeholder="Ask me anything..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
                <button onClick={() => send()} disabled={loading} className="bg-green-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-800 disabled:opacity-50">Send</button>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-green-50 rounded-xl p-6 text-center">
            <h3 className="font-bold text-green-700 mb-2">💬 Also on WhatsApp</h3>
            <p className="text-gray-600 text-sm mb-3">Chat with our AI broker directly on WhatsApp — 24/7.</p>
            <a href="https://wa.me/256750414366" target="_blank" rel="noopener" className="inline-block bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700">Chat on WhatsApp</a>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-green-700 font-bold hover:underline">← Back to Home</Link>
          </div>
        </div>
      </div>
    </>
  )
}