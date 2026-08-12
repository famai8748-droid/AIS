// ============================================================
// RemedialGenerator — One-Click Remedial Sheet Generator (original design)
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../../api/client';
import { formatMarkdown } from '../../utils/markdown';

interface RemedialGeneratorProps {
  initialTopic?: string;
  initialWeakness?: string;
}

export function RemedialGenerator({ initialTopic, initialWeakness }: RemedialGeneratorProps) {
  const [topic, setTopic] = useState('คณิตศาสตร์ ม.3 - การถอดรากที่สอง (Square Root)');
  const [weakness, setWeakness] = useState('เด็ก 20% ยังติดขัดเรื่องสับสนการกระจายรากที่สองในผลบวก');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ content: string; source: string } | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
    if (initialWeakness) setWeakness(initialWeakness);
  }, [initialTopic, initialWeakness]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const data = await api.generateRemedial(topic, weakness);
      setResult({ content: data.content, source: data.source });
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch {
      setResult({ content: 'เกิดข้อผิดพลาดในการติดต่อระบบ AI', source: '' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(15,23,42,0.9)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
    padding: '10px 16px', fontSize: '14px', color: '#fff', outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
          }}>
            ⚡
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>One-Click Remedial Generator</h3>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              ครูกดปุ่มเดียว AI จะสร้าง "ชีทสรุปซ่อมแซม 1 หน้า + โจทย์ 3 ข้อ" แจกเด็กกลุ่มที่มีปัญหาทันที
            </p>
          </div>
        </div>
        <span style={{
          padding: '4px 12px', background: 'rgba(0,229,255,0.1)', color: '#00E5FF',
          fontSize: '12px', fontWeight: 600, borderRadius: '9999px', border: '1px solid rgba(0,229,255,0.3)',
        }}>
          Powered by Ollama / Edge AI
        </span>
      </div>

      {/* Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#CBD5E1', marginBottom: '6px' }}>วิชา / หัวข้อบทเรียน</label>
          <input
            id="remedial-topic"
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#00E676')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#CBD5E1', marginBottom: '6px' }}>สรุปจุดอ่อนของนักเรียนที่พบ</label>
          <input
            id="remedial-weakness"
            type="text"
            value={weakness}
            onChange={e => setWeakness(e.target.value)}
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = '#00E676')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>
      </div>

      {/* Generate Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button id="btn-generate-remedial" className="btn-ais" onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              AI กำลังสร้างชีทซ่อมแซม...
            </>
          ) : (
            <><span>⚡</span> สั่ง AI เจนชีทซ่อมแซมจุดอ่อน (One-Click Generate)</>
          )}
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div style={{ marginTop: '24px', padding: '24px', background: 'rgba(2,6,23,0.7)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: '16px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginBottom: '10px', width: `${100 - i * 10}%`, animation: 'pulse 2s infinite' }} />
          ))}
        </div>
      )}

      {/* Output */}
      {result && !isLoading && (
        <div
          ref={outputRef}
          id="remedial-output-container"
          className="slide-in"
          style={{ marginTop: '24px', padding: '24px', background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: '16px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <h4 style={{ fontWeight: 700, color: '#00E676', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📄 ใบงานซ่อมเสริมเฉพาะบุคคล (AI Generated Remedial Sheet)
            </h4>
            <button className="btn-outline-ais" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => window.print()}>
              🖨️ พิมพ์ชีท / แจกนักเรียน
            </button>
          </div>

          {result.source && (
            <div style={{ marginBottom: '12px', fontSize: '12px', color: '#00E676', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
              ประมวลผลจาก: {result.source}
            </div>
          )}

          <div
            id="remedial-output-text"
            className="markdown-body whitespace-pre-line"
            style={{ color: '#E2E8F0', fontSize: '14px', lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: formatMarkdown(result.content) }}
          />
        </div>
      )}
    </div>
  );
}
