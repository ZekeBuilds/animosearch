import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, X, Send, BookOpen, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

// ─── Constants ────────────────────────────────────────────────────────────────

const SESSION_KEY = 'animosearch-chat-count'
const MSG_CAP = 20
const MSG_WARN_AT = 18

const WELCOME_MSG = {
  role: 'assistant',
  content:
    'Hello! I\'m the AnimoSearch Assistant. Ask me to suggest theses on any topic, or ask about what AnimoSearch offers.',
  theses: [],
  id: 'welcome',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSessionCount() {
  return parseInt(sessionStorage.getItem(SESSION_KEY) ?? '0', 10)
}

function incrementSessionCount() {
  const next = getSessionCount() + 1
  sessionStorage.setItem(SESSION_KEY, String(next))
  return next
}

function msgId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            opacity: 0.5,
            animation: `chatDotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function ThesisRow({ thesis, onClick }) {
  return (
    <button
      onClick={() => onClick(thesis.slug)}
      className="w-full text-left group"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem',
        padding: '0.5rem 0.625rem',
        marginTop: '0.375rem',
        borderRadius: '0.5rem',
        backgroundColor: 'var(--color-sky-bg)',
        border: '1px solid rgba(0, 94, 58, 0.15)',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 94, 58, 0.07)'
        e.currentTarget.style.borderColor = 'rgba(0, 94, 58, 0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-sky-bg)'
        e.currentTarget.style.borderColor = 'rgba(0, 94, 58, 0.15)'
      }}
    >
      <BookOpen
        size={12}
        style={{ marginTop: 3, flexShrink: 0, color: 'var(--color-primary)' }}
        aria-hidden="true"
      />
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'var(--color-primary)',
            lineHeight: 1.35,
            marginBottom: '0.125rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {thesis.title}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-label)',
            fontSize: '0.6rem',
            color: 'var(--color-ink-muted, #5a6a7e)',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
          }}
        >
          {thesis.author} · {thesis.year} · {thesis.collegeName}
        </p>
      </div>
    </button>
  )
}

function MessageBubble({ msg, onThesisClick }) {
  const isUser = msg.role === 'user'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        animation: 'fadeInUp 0.35s ease both',
      }}
    >
      {!isUser && (
        <span
          style={{
            fontFamily: 'var(--font-label)',
            fontSize: '0.6rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-primary)',
            opacity: 0.7,
            marginBottom: '0.25rem',
            paddingLeft: '0.25rem',
          }}
        >
          Assistant
        </span>
      )}

      <div
        style={{
          maxWidth: '85%',
          padding: '0.625rem 0.875rem',
          borderRadius: isUser ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
          backgroundColor: isUser ? 'var(--color-primary)' : 'var(--color-card, #fff)',
          color: isUser ? '#fff' : 'var(--color-ink)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          lineHeight: 1.6,
          boxShadow: isUser
            ? '0 2px 8px rgba(0, 94, 58, 0.25)'
            : '0 1px 4px rgba(0,0,0,0.07)',
          border: isUser ? 'none' : '1px solid rgba(0,0,0,0.06)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {msg.content}
      </div>

      {/* Thesis suggestions */}
      {!isUser && msg.theses && msg.theses.length > 0 && (
        <div style={{ width: '90%', marginTop: '0.25rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '0.6rem',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: 'var(--color-secondary, #FFB81C)',
              marginBottom: '0.25rem',
              paddingLeft: '0.25rem',
            }}
          >
            Matching Theses
          </p>
          {msg.theses.map((t) => (
            <ThesisRow key={t.slug} thesis={t} onClick={onThesisClick} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatWidget() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [msgCount, setMsgCount] = useState(getSessionCount)
  const [hasUnread, setHasUnread] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const listRef = useRef(null)
  const inputRef = useRef(null)
  const panelRef = useRef(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, loading])

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const handleThesisClick = useCallback(
    (slug) => {
      navigate(`/theses/${slug}`)
      setOpen(false)
    },
    [navigate]
  )

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading || msgCount >= MSG_CAP) return

    setInput('')
    setErrorMsg(null)

    const userMsg = { role: 'user', content: text, id: msgId() }
    setMessages((prev) => [...prev, userMsg])

    const newCount = incrementSessionCount()
    setMsgCount(newCount)
    setLoading(true)

    // Build history from current state (before the new user message is appended).
    // The new message is sent separately as the `message` field — the Edge Function
    // appends it as the final user turn. History is intentionally one turn behind.
    const history = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, content: m.content }))

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { message: text, history },
      })

      if (error) throw error

      if (data?.error) {
        // Server returned a structured error (429, validation, etc.)
        const isRateLimit =
          typeof data.error === 'string' &&
          (data.error.includes('Too many') || data.error.includes('temporarily'))

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.error,
            theses: [],
            id: msgId(),
            isError: true,
          },
        ])

        if (isRateLimit) setErrorMsg(data.error)
        return
      }

      const assistantMsg = {
        role: 'assistant',
        content: data?.reply ?? 'Sorry, I couldn\'t generate a response.',
        theses: data?.suggestedTheses ?? [],
        id: msgId(),
      }

      setMessages((prev) => [...prev, assistantMsg])

      // Show unread badge if panel is closed
      if (!open) setHasUnread(true)
    } catch (err) {
      console.error('Chat error:', err)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong. Please check your connection and try again.',
          theses: [],
          id: msgId(),
          isError: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, loading, msgCount, messages, open])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const atCap = msgCount >= MSG_CAP
  const nearCap = msgCount >= MSG_WARN_AT && msgCount < MSG_CAP
  const remaining = MSG_CAP - msgCount

  return (
    <>
      {/* ── Keyframe injected globally (only once) ── */}
      <style>{`
        @keyframes chatDotPulse {
          0%, 80%, 100% { transform: scale(1); opacity: 0.4; }
          40% { transform: scale(1.4); opacity: 1; }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .chat-panel-enter {
          animation: chatSlideUp 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .chat-panel-bubble:focus-visible {
          outline: 2px solid var(--color-secondary);
          outline-offset: 3px;
        }
        .chat-send-btn:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .chat-panel-enter { animation: none; }
          @keyframes chatDotPulse { from {} to {} }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .chat-textarea {
          outline: none;
        }
        .chat-textarea:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 1px;
          border-color: var(--color-primary) !important;
        }
      `}</style>

      {/* ── Floating bubble button ── */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.75rem',
        }}
      >
        {/* Chat panel */}
        {open && (
          <div
            ref={panelRef}
            role="dialog"
            aria-label="AnimoSearch chat assistant"
            aria-modal="true"
            className="chat-panel-enter"
            style={{
              width: 'min(380px, calc(100vw - 2rem))',
              height: 'min(520px, calc(100vh - 7rem))',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,94,58,0.12)',
              border: '1px solid rgba(0,0,0,0.08)',
              backgroundColor: 'var(--color-card, #fff)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '0.875rem 1rem',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #003d26 100%)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flexShrink: 0,
                borderBottom: '2px solid var(--color-secondary)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <BookOpen size={16} color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#fff',
                    lineHeight: 1.2,
                    letterSpacing: '0.01em',
                  }}
                >
                  AnimoSearch Assistant
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '0.6rem',
                    color: 'rgba(255,255,255,0.65)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginTop: 2,
                  }}
                >
                  Thesis &amp; Research Guide
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.375rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'background 0.15s',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                className="chat-panel-bubble"
              >
                <X size={16} />
              </button>
            </div>

            {/* Rate limit warning */}
            {(nearCap || atCap || errorMsg) && (
              <div
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: atCap ? 'rgba(220,38,38,0.07)' : 'rgba(255,184,28,0.1)',
                  borderBottom: `1px solid ${atCap ? 'rgba(220,38,38,0.2)' : 'rgba(255,184,28,0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexShrink: 0,
                }}
              >
                <AlertCircle
                  size={13}
                  color={atCap ? '#dc2626' : '#92670a'}
                  aria-hidden="true"
                />
                <p
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.03em',
                    color: atCap ? '#dc2626' : '#92670a',
                  }}
                >
                  {atCap
                    ? 'Session limit reached. Refresh the page to start a new session.'
                    : errorMsg
                    ? errorMsg
                    : `${remaining} question${remaining === 1 ? '' : 's'} remaining this session.`}
                </p>
              </div>
            )}

            {/* Message list */}
            <div
              ref={listRef}
              aria-live="polite"
              aria-label="Chat messages"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
                scrollBehavior: 'smooth',
                backgroundColor: 'var(--color-sky-bg, #F4F9F4)',
              }}
            >
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  onThesisClick={handleThesisClick}
                />
              ))}
              {loading && (
                <div style={{ animation: 'fadeInUp 0.3s ease both' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-label)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--color-primary)',
                      opacity: 0.7,
                      marginBottom: '0.25rem',
                      display: 'block',
                      paddingLeft: '0.25rem',
                    }}
                  >
                    Assistant
                  </span>
                  <div
                    style={{
                      display: 'inline-flex',
                      borderRadius: '1rem 1rem 1rem 0.25rem',
                      backgroundColor: 'var(--color-card, #fff)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                      border: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <TypingDots />
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div
              style={{
                padding: '0.75rem',
                borderTop: '1px solid rgba(0,0,0,0.07)',
                backgroundColor: 'var(--color-card, #fff)',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-end',
                flexShrink: 0,
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  atCap
                    ? 'Session limit reached.'
                    : 'Ask about a thesis topic or AnimoSearch…'
                }
                disabled={atCap || loading}
                rows={1}
                aria-label="Chat input"
                className="chat-textarea"
                style={{
                  flex: 1,
                  resize: 'none',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.625rem',
                  border: '1.5px solid rgba(0,94,58,0.2)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  lineHeight: 1.5,
                  color: 'var(--color-ink)',
                  backgroundColor: atCap ? 'rgba(0,0,0,0.03)' : 'var(--color-sky-bg)',
                  maxHeight: 80,
                  overflowY: 'auto',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(0,94,58,0.2)')}
              />
              <button
                onClick={sendMessage}
                disabled={atCap || loading || !input.trim()}
                aria-label="Send message"
                className="chat-send-btn"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '0.625rem',
                  border: 'none',
                  cursor: atCap || loading || !input.trim() ? 'not-allowed' : 'pointer',
                  backgroundColor:
                    atCap || loading || !input.trim()
                      ? 'rgba(0,94,58,0.25)'
                      : 'var(--color-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background-color 0.15s, transform 0.1s',
                }}
                onMouseEnter={(e) => {
                  if (!atCap && !loading && input.trim()) {
                    e.currentTarget.style.backgroundColor = '#004a2e'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    atCap || loading || !input.trim()
                      ? 'rgba(0,94,58,0.25)'
                      : 'var(--color-primary)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                {loading ? (
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Send size={15} />
                )}
              </button>
            </div>

            {/* Footer credit */}
            <div
              style={{
                padding: '0.375rem 0.75rem',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                backgroundColor: 'var(--color-card, #fff)',
                textAlign: 'center',
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.58rem',
                  color: 'var(--color-ink-muted, #8a9ab0)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Powered by Groq · AnimoSearch 2026
              </p>
            </div>
          </div>
        )}

        {/* Bubble trigger button */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
          aria-expanded={open}
          className="chat-panel-bubble"
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,94,58,0.35), 0 2px 8px rgba(0,0,0,0.15)',
            position: 'relative',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)'
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,94,58,0.45), 0 3px 10px rgba(0,0,0,0.18)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,94,58,0.35), 0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          {/* Pulse ring when there's an unread reply */}
          {hasUnread && !open && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: -4,
                borderRadius: '50%',
                border: '2px solid var(--color-secondary)',
                animation: 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
              }}
            />
          )}

          {/* Unread dot */}
          {hasUnread && !open && (
            <span
              aria-label="New message"
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: 'var(--color-secondary)',
                border: '2px solid #fff',
              }}
            />
          )}

          <MessageCircle
            size={22}
            style={{
              transition: 'transform 0.2s ease',
              transform: open ? 'rotate(15deg)' : 'rotate(0deg)',
            }}
          />
        </button>
      </div>
    </>
  )
}
