import { useState, useRef, useEffect } from "react"
import SEO from '../components/SEO'

export default function AIBroker() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm the SAGECO EVERGREEN AI Broker 🤖\n\nI can help you find properties, book viewings, register as a broker, or answer questions about real estate in Uganda.\n\nWhat are you looking for today?" }
  ])
  const [input, setInput] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { chatEndRef?.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

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
      <SEO
        title="AI Property Broker - 24/7 Property Search"
        description="Chat with SAGECO EVERGREEN AI Broker for 24/7 natural-language property search on WhatsApp and Web. Find land and homes in Uganda instantly."
        keywords="AI real estate broker Uganda, property chatbot, AI property search Uganda, WhatsApp property assistant"
        path="/ai-broker"
      />

      {/* Full-screen ChatGPT-style chat layout */}
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Minimal header bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-700 rounded-full flex items-center justify-center text-white text-lg">🤖</div>
            <div>
              <div className="font-bold text-gray-800 text-sm">SAGECO AI Broker</div>
              <div className="text-xs text-green-600 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                Online 24/7
              </div>
            </div>
          </div>
          <a href="https://wa.me/256750414366" target="_blank" rel="noopener"
            className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-medium hover:bg-green-100 transition flex items-center gap-1">
            💬 WhatsApp
          </a>
        </div>

        {/* Chat messages area — takes remaining space */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'bot' && (
                  <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white text-sm shrink-0 mr-3 mt-1">🤖</div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${m.role === 'user'
                  ? 'bg-green-700 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white text-sm shrink-0 mr-3 mt-1">🤖</div>
                <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Suggestion chips + input bar — fixed at bottom */}
        <div className="shrink-0 bg-white border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4 py-3">
            {/* Quick queries — only show at start */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 mb-3 justify-center">
                {quickQueries.map((q, i) => (
                  <button key={i} onClick={() => send(q)}
                    className="bg-gray-100 hover:bg-green-50 hover:text-green-700 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition border border-gray-200">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input row */}
            <div className="flex items-end gap-2">
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-28 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-600 shrink-0"
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask me anything about property in Uganda..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600"
                autoFocus
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-green-800 disabled:opacity-40 transition shrink-0"
              >
                {loading ? '...' : 'Send →'}
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
              AI Broker can help with property search, bookings, broker registration & more
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
