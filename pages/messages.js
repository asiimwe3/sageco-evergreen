import { useEffect, useState, useRef, useCallback } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAuth } from "../context/AuthContext"
import SEO from "../components/SEO"

const POLL_INTERVAL = 5000 // 5 seconds

export default function Messages() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const messagesEndRef = useRef(null)
  const pollRef = useRef(null)

  // Determine user role — broker if they have a broker profile, otherwise buyer
  const userRole = profile?.role === 'broker' ? 'broker' : 'buyer'

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/messages`)
    }
  }, [authLoading, user, router])

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!user) return
    try {
      const res = await fetch(`/api/chat/conversations?user_id=${user.id}`)
      const data = await res.json()
      if (data.conversations) {
        setConversations(data.conversations)
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (conversationId) => {
    if (!user || !conversationId) return
    try {
      const res = await fetch(`/api/chat/messages?conversation_id=${conversationId}&user_id=${user.id}&user_role=${userRole}`)
      const data = await res.json()
      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    }
  }, [user, userRole])

  // Initial load
  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user, fetchConversations])

  // Poll for new messages and conversations
  useEffect(() => {
    if (!user) return

    pollRef.current = setInterval(() => {
      fetchConversations()
      if (activeConversation) {
        fetchMessages(activeConversation.id)
      }
    }, POLL_INTERVAL)

    return () => clearInterval(pollRef.current)
  }, [user, activeConversation, fetchConversations, fetchMessages])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load conversation from URL query
  useEffect(() => {
    if (router.query.conversation && conversations.length > 0) {
      const conv = conversations.find(c => c.id === router.query.conversation)
      if (conv) {
        setActiveConversation(conv)
        fetchMessages(conv.id)
      }
    }
  }, [router.query.conversation, conversations])

  const handleSelectConversation = (conv) => {
    setActiveConversation(conv)
    setMessages([])
    fetchMessages(conv.id)
    // Update URL without full navigation
    router.push(`/messages?conversation=${conv.id}`, undefined, { shallow: true })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConversation || !user) return

    setSending(true)
    setError("")

    // Optimistic update — show message immediately
    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      conversation_id: activeConversation.id,
      sender_id: user.id,
      sender_role: userRole,
      content: newMessage.trim(),
      message_type: 'text',
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, optimisticMsg])
    const msgContent = newMessage.trim()
    setNewMessage("")

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: activeConversation.id,
          sender_id: user.id,
          sender_role: userRole,
          content: msgContent
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send')
      }

      // Refresh messages to get the real message ID
      fetchMessages(activeConversation.id)
    } catch (err) {
      setError(err.message)
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id))
    } finally {
      setSending(false)
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' })
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getOtherPersonName = (conv) => {
    if (userRole === 'broker') return conv.buyer_name || conv.buyer_email || "Buyer"
    return conv.broker_name || conv.broker_email || "Broker"
  }

  const getUnreadCount = (conv) => {
    if (userRole === 'broker') return conv.broker_unread_count || 0
    return conv.buyer_unread_count || 0
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <SEO
        title="Messages — Chat with Brokers & Buyers"
        description="Chat directly with verified brokers and property buyers on SAGECO Evergreen."
        path="/messages"
      />
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <section className="bg-primary text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-green-100 mt-1">
            {userRole === 'broker' ? 'Chat with buyers interested in your properties' : 'Chat with brokers about properties you\'re interested in'}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex h-[70vh]">
          {/* ── Conversation List ── */}
          <div className={`${activeConversation ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-gray-100`}>
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Conversations
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm font-medium">No conversations yet</p>
                  <p className="text-xs mt-1">
                    {userRole === 'broker'
                      ? 'Buyers will appear here when they message you'
                      : 'Browse brokers and start a conversation'}
                  </p>
                  {userRole === 'buyer' && (
                    <Link href="/brokers" className="inline-block mt-4 text-primary text-sm font-semibold hover:underline">
                      Find a broker →
                    </Link>
                  )}
                </div>
              ) : (
                conversations.map(conv => {
                  const unread = getUnreadCount(conv)
                  const isActive = activeConversation?.id === conv.id
                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className={`w-full p-4 border-b border-gray-50 text-left transition hover:bg-gray-50 ${isActive ? 'bg-green-50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${isActive ? 'bg-primary' : 'bg-green-400'}`}>
                          {getOtherPersonName(conv)?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm text-gray-800 truncate">{getOtherPersonName(conv)}</p>
                            <span className="text-xs text-gray-400 shrink-0 ml-2">{formatTime(conv.last_message_at)}</span>
                          </div>
                          {conv.property_title && (
                            <p className="text-xs text-primary font-medium truncate mt-0.5">{conv.property_title}</p>
                          )}
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {conv.last_message || 'No messages yet'}
                          </p>
                          {unread > 0 && (
                            <span className="inline-block mt-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                              {unread} new
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* ── Chat Window ── */}
          <div className={`${activeConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
            {activeConversation ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-3">
                  <button
                    onClick={() => { setActiveConversation(null); router.push('/messages', undefined, { shallow: true }) }}
                    className="md:hidden p-1 rounded-lg hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    {getOtherPersonName(activeConversation)?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{getOtherPersonName(activeConversation)}</p>
                    {activeConversation.property_title && (
                      <p className="text-xs text-primary font-medium">{activeConversation.property_title}</p>
                    )}
                  </div>
                  {activeConversation.property_id && (
                    <Link
                      href={`/property/${activeConversation.property_id}`}
                      className="text-xs bg-green-50 text-primary px-3 py-1.5 rounded-full font-semibold hover:bg-green-100 transition"
                    >
                      View Property
                    </Link>
                  )}
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-8">
                      <p className="text-sm">No messages yet. Say hello! 👋</p>
                    </div>
                  ) : (
                    messages.map(msg => {
                      const isMine = msg.sender_id === user.id
                      const isSystem = msg.message_type === 'system'
                      if (isSystem) {
                        return (
                          <div key={msg.id} className="text-center">
                            <span className="text-xs text-gray-400 bg-gray-200 px-3 py-1 rounded-full">
                              {msg.content}
                            </span>
                          </div>
                        )
                      }
                      return (
                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${isMine ? 'bg-primary text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'}`}>
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                            <p className={`text-xs mt-1 ${isMine ? 'text-green-100' : 'text-gray-400'}`}>
                              {formatTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Error message */}
                {error && (
                  <div className="px-4 py-2 bg-red-50 text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Message input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 focus:border-primary focus:outline-none text-base"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-400">
                  <svg className="w-20 h-20 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm font-medium">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
