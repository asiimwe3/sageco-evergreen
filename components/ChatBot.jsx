import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const QUICK_REPLIES = [
  "Show available properties",
  "List brokers",
  "Green projects",
  "Career openings",
  "How to book a viewing?",
];

const AVATAR = "/chatbot-avatar.jpg";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm the SAGECO Evergreen assistant. I can help you find properties, connect with brokers, or answer any questions. What can I help you with?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: newMessages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.error || "Sorry, something went wrong." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't connect. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button — compact, doesn't overlap content */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-lg border-2 border-green-600 overflow-hidden hover:scale-105 transition-transform bg-green-700"
        aria-label="Chat with us"
      >
        {open ? (
          <div className="w-full h-full bg-green-700 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ) : (
          <>
            <Image
              src={AVATAR}
              alt="SAGECO Chat Assistant"
              width={56}
              height={56}
              className="object-cover w-full h-full"
            />
            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200" style={{ maxHeight: "65vh" }}>
          {/* Header */}
          <div className="bg-green-700 text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-green-400 shrink-0">
              <Image
                src={AVATAR}
                alt="SAGECO Assistant"
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="font-semibold text-sm">SAGECO Support</p>
              <p className="text-xs text-green-200">Always up to date • Replies instantly</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-green-200 hover:text-white transition"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-green-300 shrink-0 mb-1">
                    <Image src={AVATAR} alt="Bot" width={28} height={28} className="object-cover w-full h-full" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-green-700 text-white rounded-br-sm"
                      : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-green-300 shrink-0">
                  <Image src={AVATAR} alt="Bot" width={28} height={28} className="object-cover w-full h-full" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-2xl rounded-bl-sm">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 1 && (
            <div className="px-3 py-2 flex gap-2 flex-wrap bg-gray-50 border-t border-gray-100">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-xs bg-white border border-green-200 text-green-700 px-3 py-1 rounded-full hover:bg-green-50 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-green-500"
              placeholder="Ask anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={loading}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="w-9 h-9 bg-green-700 hover:bg-green-800 disabled:opacity-40 text-white rounded-full flex items-center justify-center transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
