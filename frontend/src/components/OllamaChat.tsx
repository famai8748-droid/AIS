// ============================================================
// OllamaChat — Live chat widget (original design)
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../api/client';
import { formatMarkdown } from '../utils/markdown';
import type { ChatMessage } from '../types';

const QUICK_CHIPS = [
  { label: '💡 อธิบายเรื่องสแควร์รูทแบบง่ายๆ', msg: 'ช่วยอธิบายเรื่องสแควร์รูท (Square Root) แบบเข้าใจง่ายให้หน่อย' },
  { label: '🎨 ชอบวาดรูปควรเรียนสาขาไหน', msg: 'ชอบวาดรูปและออกแบบ ควรเลือกเรียนสาขาอะไรและทำงานอะไรได้บ้าง' },
  { label: '✏️ ขอโจทย์คณิต ม.3 สองข้อ', msg: 'ขอโจทย์ฝึกฝนคณิตศาสตร์ ม.3 เรื่องรากที่สอง สัก 2 ข้อพร้อมเฉลย' },
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init',
  role: 'ai',
  content: 'สวัสดีครับ! ผมคือ <strong>AI ครูผู้ช่วย (Ollama Gemma 2)</strong> ยินดีตอบทุกข้อสงสัยเรื่องบทเรียน ช่วยโจทย์ฝึกฝน หรือแนะนำการค้นหาตัวตนครับ พิมพ์ถามเข้ามาได้เลยครับ! 😊',
};

const TypewriterMessage = ({ content, containerRef, onComplete }: { content: string, containerRef: React.RefObject<HTMLDivElement>, onComplete: () => void }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 4;
      setDisplayed(content.slice(0, i));
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
      if (i >= content.length) {
        clearInterval(interval);
        onComplete();
      }
    }, 10);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: formatMarkdown(displayed) }} />;
};

export function OllamaChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyRef.current) historyRef.current.scrollTop = historyRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isSending) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: text };
    const loadingMsg: ChatMessage = { id: `l-${Date.now()}`, role: 'ai', content: '', isLoading: true };
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput('');
    setIsSending(true);
    try {
      const data = await api.chatOllama(text);
      setMessages(prev => prev.map(m =>
        m.id === loadingMsg.id ? { ...m, content: data.reply, source: data.source, isLoading: false, isTyping: true } : m
      ));
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === loadingMsg.id ? { ...m, content: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Ollama API', isLoading: false, isTyping: true } : m
      ));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="glass-panel" style={{ marginTop: '32px', padding: '24px 32px', borderColor: 'rgba(0,230,118,0.25)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #00E676 0%, #00E5FF 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#070D19', fontWeight: 700,
          }}>
            💬
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>สนทนาสดกับ AI ครูผู้ช่วย (Ollama Gemma 2 Live Chat)</h3>
            <p style={{ fontSize: '12px', color: '#64748B' }}>พิมพ์คำถาม ข้อสงสัยเรื่องการเรียน หรือปรึกษาแนะแนวอาชีพ คุยกับโมเดล AI ในเครื่องได้โดยตรง</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse-dot" />
          <span style={{ fontSize: '12px', color: '#00E676', fontFamily: 'monospace' }}>Ollama 5G Local Edge</span>
        </div>
      </div>

      {/* Quick Chips */}
      <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#64748B' }}>คำถามแนะนำ:</span>
        {QUICK_CHIPS.map(chip => (
          <button
            key={chip.label}
            className="chat-chip"
            style={{
              fontSize: '12px', padding: '4px 10px',
              background: 'rgba(15,23,42,0.8)', color: '#CBD5E1',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,230,118,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(15,23,42,0.8)')}
            onClick={() => sendMessage(chip.msg)}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Chat History */}
      <div
        id="chat-history-box"
        ref={historyRef}
        style={{
          height: '256px', overflowY: 'auto', padding: '16px',
          background: 'rgba(2,6,23,0.7)', borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '16px',
          marginBottom: '16px',
        }}
      >
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'ai' && (
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#00E676', fontWeight: 700, fontSize: '12px',
              }}>
                AI
              </div>
            )}

            {msg.isLoading ? (
              <div className="chat-bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00E676' }}>
                <Loader2 size={14} className="animate-spin" />
                ⚡ Ollama (Gemma 2) กำลังคิดและพิมพ์ตอบ...
              </div>
            ) : msg.role === 'ai' ? (
              <div className="chat-bubble-ai">
                {msg.source && (
                  <div style={{ fontSize: '10px', color: '#00E676', fontFamily: 'monospace', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="pulse-dot" style={{ width: '6px', height: '6px' }} /> {msg.source}
                  </div>
                )}
                {msg.isTyping ? (
                  <TypewriterMessage 
                    content={msg.content} 
                    containerRef={historyRef}
                    onComplete={() => {
                      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isTyping: false } : m));
                    }}
                  />
                ) : (
                  <div className="markdown-body" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
                )}
              </div>
            ) : (
              <div className="chat-bubble-user">{msg.content}</div>
            )}

            {msg.role === 'user' && (
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#00E676', fontWeight: 700, fontSize: '11px',
              }}>
                คุณ
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <form id="form-ollama-chat" onSubmit={e => { e.preventDefault(); sendMessage(input); }} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="พิมพ์ข้อความคุยกับ Ollama AI..."
          disabled={isSending}
          style={{
            flex: 1, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#fff', outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = '#00E676')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
        <button type="submit" id="btn-send-chat" disabled={isSending || !input.trim()} className="btn-ais" style={{ padding: '12px 20px' }}>
          <span>ส่งคำถาม</span> ➔
        </button>
      </form>
    </section>
  );
}
