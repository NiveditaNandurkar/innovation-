import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getChatResponse, SUGGESTED_QUESTIONS } from '../data/chatbot';
import { Icon } from './icons';
import { SpiderEmblem } from './SpiderBits';

interface Message {
  id: number;
  role: 'bot' | 'user';
  text: string;
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);

  const pushMessage = (role: Message['role'], text: string) => {
    idRef.current += 1;
    setMessages((prev) => [...prev, { id: idRef.current, role, text }]);
  };

  useEffect(() => {
    if (messages.length === 0) {
      pushMessage(
        'bot',
        "Hey there, true believer! 🕸️ I'm Miles — your INNOVENTA guide. Ask me about events, registration, certificates, or downloads.",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    pushMessage('user', text);
    setInput('');
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      pushMessage('bot', getChatResponse(text));
    }, 900 + Math.random() * 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send();
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-window glass-strong"
            role="dialog"
            aria-label="INNOVENTA assistant chat"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <div className="chat-window__head">
              <SpiderEmblem size={36} />
              <div style={{ flex: 1 }}>
                <div className="chat-window__title">Miles · INNOVENTA Assistant</div>
                <div className="chat-window__status">
                  <span className="badge-dot" style={{ background: 'var(--ok)', boxShadow: '0 0 8px var(--ok)' }} />
                  Online · Answers instantly
                </div>
              </div>
              <button
                type="button"
                className="icon-btn"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
                style={{ width: 36, height: 36 }}
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            <div className="chat-body" ref={bodyRef}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`chat-msg chat-msg--${msg.role}`}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                >
                  {msg.text}
                  <div className="chat-msg--meta">
                    {msg.role === 'bot' ? 'Miles 🕷️' : 'You'} · just now
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  className="chat-msg chat-msg--bot"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  aria-label="Assistant is typing"
                >
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </motion.div>
              )}
            </div>

            <div className="chat-chips">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button key={q} type="button" onClick={() => send(q)}>
                  {q}
                </button>
              ))}
            </div>

            <form className="chat-input-row" onSubmit={handleSubmit}>
              <div className="field">
                <label className="sr-only" htmlFor="chat-input">
                  Message the assistant
                </label>
                <input
                  id="chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about events, certificates…"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="chat-send"
                aria-label="Send message"
                disabled={!input.trim() || typing}
              >
                <Icon name="send" size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className="chat-fab"
        aria-label={open ? 'Minimize chat' : 'Open INNOVENTA assistant chat'}
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) window.setTimeout(() => inputRef.current?.focus(), 200);
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        {!open && <span className="chat-fab__ping" aria-hidden="true" />}
        <SpiderEmblem size={34} />
        <span
          className="sr-only"
          style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}
        >
          Assistant
        </span>
      </motion.button>
    </>
  );
}