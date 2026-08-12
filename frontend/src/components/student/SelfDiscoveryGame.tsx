// ============================================================
// SelfDiscoveryGame — 4-question quiz → AI career analysis (original design)
// ============================================================

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../../api/client';
import { formatMarkdown } from '../../utils/markdown';
import type { QuizQuestion } from '../../types';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'กิจกรรมยามว่างที่คุณชอบทำคืออะไร?',
    options: [
      { id: 'A', icon: '💻', text: 'เล่นเกม ท่องเว็บ เขียนโค้ด' },
      { id: 'B', icon: '🎨', text: 'วาดรูป ฟังเพลง ดูหนัง' },
      { id: 'C', icon: '🏃', text: 'เล่นกีฬา ออกกำลังกาย' },
      { id: 'D', icon: '📚', text: 'อ่านหนังสือ ค้นคว้าเรื่องใหม่ๆ' },
    ],
  },
  {
    question: 'ถ้ามีงานกลุ่ม คุณมักจะรับบทบาทไหน?',
    options: [
      { id: 'A', icon: '👑', text: 'หัวหน้ากลุ่ม คอยแบ่งงาน' },
      { id: 'B', icon: '💡', text: 'คนคิดไอเดีย สร้างสรรค์งาน' },
      { id: 'C', icon: '🛠️', text: 'คนลงมือทำ พิมพ์งาน/หาข้อมูล' },
      { id: 'D', icon: '🎤', text: 'คนพรีเซนต์ นำเสนงานหน้าห้อง' },
    ],
  },
  {
    question: 'วิชาที่คุณรู้สึกสนุกเวลาเรียนที่สุดคือ?',
    options: [
      { id: 'A', icon: '📐', text: 'คณิตศาสตร์ / วิทยาศาสตร์' },
      { id: 'B', icon: '🌍', text: 'สังคม / ภาษา / ประวัติศาสตร์' },
      { id: 'C', icon: '🎨', text: 'ศิลปะ / ดนตรี / กีฬา' },
      { id: 'D', icon: '💻', text: 'คอมพิวเตอร์ / เทคโนโลยี' },
    ],
  },
  {
    question: 'รูปแบบการทำงานในอนาคตที่อยากได้?',
    options: [
      { id: 'A', icon: '🏢', text: 'ทำงานออฟฟิศ มั่นคง มีระบบ' },
      { id: 'B', icon: '🏠', text: 'ทำงานอิสระ (Freelance) เวลายืดหยุ่น' },
      { id: 'C', icon: '🤝', text: 'ช่วยเหลือสังคม พบปะผู้คน' },
      { id: 'D', icon: '🚀', text: 'ธุรกิจส่วนตัว เป็นเจ้านายตัวเอง' },
    ],
  },
];

type GameState = 'start' | 'playing' | 'loading' | 'result';

export function SelfDiscoveryGame() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [studentName, setStudentName] = useState('ด.ช. กิตติศักดิ์ พัฒนากุล');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<{ studentName: string; content: string; source: string } | null>(null);
  const [error, setError] = useState('');

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const progress = (currentIdx / QUIZ_QUESTIONS.length) * 100;
  const isLast = currentIdx === QUIZ_QUESTIONS.length - 1;

  const handleStart = () => {
    setCurrentIdx(0); setAnswers([]); setSelectedOption(null); setGameState('playing');
  };

  const handleNext = async () => {
    if (!selectedOption) return;
    const newAnswers = [...answers, selectedOption];
    if (!isLast) {
      setAnswers(newAnswers);
      setCurrentIdx(i => i + 1);
      setSelectedOption(null);
    } else {
      setGameState('loading');
      try {
        const combined = newAnswers.join(', ');
        const data = await api.selfDiscovery(combined, studentName);
        setResult({ studentName: data.student_name, content: data.ai_result.content, source: data.ai_result.source });
        setGameState('result');
      } catch {
        setError('เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง');
        setGameState('result');
      }
    }
  };

  const handleReset = () => {
    setGameState('start'); setCurrentIdx(0); setAnswers([]); setSelectedOption(null); setResult(null); setError('');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(2,6,23,0.9)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
    padding: '10px 16px', fontSize: '14px', color: '#fff', outline: 'none',
  };

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      {/* Section Header */}
      <div style={{ maxWidth: '768px', marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 12px', background: 'rgba(0,229,255,0.1)',
          border: '1px solid rgba(0,229,255,0.3)', borderRadius: '9999px',
          fontSize: '12px', fontWeight: 600, color: '#00E5FF', marginBottom: '8px',
        }}>
          🔍 Self-Discovery Hub
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>ค้นหาตัวตน &amp; วางแผนอาชีพอนาคตด้วย AI Specific</h3>
        <p style={{ color: '#CBD5E1', fontSize: '14px', marginTop: '4px' }}>
          บอกสิ่งที่คุณชอบ ความถนัด หรือรูปแบบงานที่อยากทำ AI จะประมวลผลแมปเข้ากับสายเรียนและอาชีพอนาคต พร้อมสรุปรายงาน 1-Page Summary ส่งต่อให้ครูแนะแนวได้ทันที!
        </p>
      </div>

      {/* Game Container */}
      <div id="minigame-container" style={{
        background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', padding: '24px', minHeight: '300px', display: 'flex', flexDirection: 'column',
      }}>
        {/* ── Start Screen ── */}
        {gameState === 'start' && (
          <div id="minigame-start" className="slide-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flex: 1, padding: '32px 0' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #00E676 0%, #00E5FF 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', marginBottom: '16px', boxShadow: '0 6px 25px rgba(0,230,118,0.3)',
            }}>
              🎮
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>มินิเกมค้นหาตัวตน (Self-Discovery Quest)</h4>
            <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '24px', maxWidth: '400px' }}>
              ตอบคำถามง่ายๆ 4 ข้อ เพื่อค้นหาว่าบุคลิกและความชอบของคุณเหมาะกับสายอาชีพแบบไหนในอนาคต!
            </p>
            <div style={{ width: '280px', marginBottom: '24px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#CBD5E1', marginBottom: '6px' }}>ชื่อ-นามสกุล ของคุณ</label>
              <input
                id="student-name-input"
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <button id="btn-start-game" className="btn-ais" onClick={handleStart}>
              <span>▶️</span> เริ่มเล่นมินิเกม
            </button>
          </div>
        )}

        {/* ── Question Screen ── */}
        {gameState === 'playing' && (
          <div id="minigame-question" className="slide-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
              <span id="question-counter">ข้อ {currentIdx + 1} / {QUIZ_QUESTIONS.length}</span>
            </div>
            <div className="progress-track">
              <div id="quiz-progress" className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <h4 id="question-text" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>
              {currentQ.question}
            </h4>
            <div id="options-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              {currentQ.options.map(opt => (
                <div
                  key={opt.id}
                  className={`quiz-option ${selectedOption === opt.text ? 'selected' : ''}`}
                  onClick={() => setSelectedOption(opt.text)}
                >
                  <div className="option-icon">{opt.icon}</div>
                  <div style={{ fontWeight: 500, color: '#E2E8F0', fontSize: '14px' }}>{opt.text}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
              <button
                id="btn-next-question"
                className="btn-ais"
                disabled={!selectedOption}
                onClick={handleNext}
                style={!selectedOption ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
              >
                {isLast ? <><span>🚀</span> ประมวลผลผลลัพธ์ AI</> : <>ถัดไป <span>➔</span></>}
              </button>
            </div>
          </div>
        )}

        {/* ── Loading Screen ── */}
        {gameState === 'loading' && (
          <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '48px 0' }}>
            <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#00E676', marginBottom: '16px' }} />
            <div style={{ color: '#00E676', fontWeight: 500 }}>AI กำลังวิเคราะห์ตัวตนของคุณจากคำตอบที่เลือก...</div>
          </div>
        )}
      </div>

      {/* ── Result ── */}
      {gameState === 'result' && (
        <div id="discovery-result-container" className="slide-in" style={{ marginTop: '24px' }}>
          {error ? (
            <div style={{ color: '#FB7185', padding: '16px', textAlign: 'center' }}>{error}</div>
          ) : result && (
            <>
              <div style={{
                padding: '16px', background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.3)',
                borderRadius: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <h3 style={{ fontWeight: 700, color: '#00E676', fontSize: '1.1rem' }}>🎓 รายงานค้นหาตัวตน 1-Page Summary</h3>
                  <p style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '4px' }}>
                    นักเรียน: <strong>{result.studentName}</strong> | แหล่งข้อมูล: <span style={{ color: '#6EE7B7', fontFamily: 'monospace' }}>{result.source}</span>
                  </p>
                </div>
                <button className="btn-outline-ais" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => window.print()}>
                  🖨️ พิมพ์/เซฟ PDF
                </button>
              </div>
              <div
                id="discovery-result-text"
                className="markdown-body whitespace-pre-line"
                style={{
                  color: '#E2E8F0', fontSize: '14px', lineHeight: 1.7,
                  padding: '16px', background: 'rgba(15,23,42,0.6)',
                  borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)',
                }}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(result.content) }}
              />
            </>
          )}
          <button className="btn-outline-ais" style={{ marginTop: '24px', display: 'flex', margin: '24px auto 0' }} onClick={handleReset}>
            🔄 เริ่มเล่นใหม่อีกครั้ง
          </button>
        </div>
      )}
    </div>
  );
}
