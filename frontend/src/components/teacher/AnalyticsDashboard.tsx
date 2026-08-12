// ============================================================
// AnalyticsDashboard — Teacher classroom analytics (original design)
// ============================================================

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../../api/client';
import type { TeacherAnalytics, WeaknessAlert } from '../../types';

interface AnalyticsDashboardProps {
  onTriggerRemedial: (topic: string, weakness: string) => void;
}

const statCard = (label: string, value: string | number | undefined, unit: string, color: string, isLoading: boolean) => (
  <div style={{ padding: '16px', background: 'rgba(15,23,42,0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: color }}>
      {isLoading ? '—' : value}
      {!isLoading && <span style={{ fontSize: '12px', fontWeight: 400, color: '#64748B', marginLeft: '4px' }}>{unit}</span>}
    </div>
  </div>
);

export function AnalyticsDashboard({ onTriggerRemedial }: AnalyticsDashboardProps) {
  const [data, setData] = useState<TeacherAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.teacherAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const severityCss = (s: WeaknessAlert['severity']) => `severity-${s}`;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
      {/* Main Analytics Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#00E676', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Teacher Portal Dashboard
            </span>
            <h3 id="class-title" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
              {data?.classroom_name ?? 'กำลังโหลด...'}
            </h3>
          </div>
          <span style={{
            padding: '4px 12px', background: 'rgba(0,230,118,0.15)', color: '#00E676',
            fontSize: '12px', fontWeight: 600, borderRadius: '9999px', border: '1px solid rgba(0,230,118,0.3)',
          }}>
            ห้องเรียนแอคทีฟ
          </span>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {statCard('นักเรียนทั้งหมด', data?.total_students, 'คน', '#fff', isLoading)}
          {statCard('คะแนนเฉลี่ยรวม', data?.average_score ? `${data.average_score}%` : undefined, '', '#00E676', isLoading)}
          {statCard('จุดอ่อนเร่งด่วน', data?.weakness_alerts.filter(a => a.severity === 'high').length, 'เรื่อง', '#FB7185', isLoading)}
        </div>

        {/* Weakness Alert Header */}
        <h4 style={{ fontWeight: 600, color: '#E2E8F0', marginBottom: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🚨 AI สรุปรายงานจุดอ่อนของห้องเรียน (Class Analytics Report)
        </h4>

        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', color: '#64748B', gap: '8px' }}>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '14px' }}>กำลังโหลดข้อมูลห้องเรียน...</span>
          </div>
        ) : (
          <div id="weakness-alert-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data?.weakness_alerts.map((item) => (
              <div
                key={item.id}
                className="fade-in"
                style={{
                  padding: '16px', background: 'rgba(30,41,59,0.8)',
                  border: '1px solid rgba(252,211,77,0.2)', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span
                      className={severityCss(item.severity)}
                      style={{ padding: '2px 8px', fontSize: '11px', fontWeight: 600, border: '1px solid', borderRadius: '6px' }}
                    >
                      พบจุดอ่อน {item.affected_students_pct}%
                    </span>
                    <h4 style={{ fontWeight: 600, color: '#F1F5F9', fontSize: '14px' }}>{item.topic}</h4>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748B' }}>
                    เด็กติดขัด {item.affected_students_count} คน | ข้อแนะนำ: {item.recommended_remedial}
                  </p>
                </div>
                <button
                  className="btn-ais"
                  style={{ fontSize: '12px', padding: '8px 12px', whiteSpace: 'nowrap' }}
                  onClick={() => onTriggerRemedial(item.topic, item.recommended_remedial)}
                >
                  ⚡ สั่ง AI เจนชีทซ่อมแซม
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Auto-Grading Panel */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>📝</span>
            <h3 style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>AI ตรวจข้อสอบอัตโนมัติ</h3>
          </div>
          <p style={{ fontSize: '12px', color: '#CBD5E1', marginBottom: '16px' }}>
            ระบบ AI OCR ตรวจกระดาษคำตอบลายมือและแบบทดสอบ คืนเวลาให้ครูกว่า 70%
          </p>

          <div style={{ padding: '16px', background: 'rgba(15,23,42,0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
              <span>ตัวอย่างกระดาษคำตอบ: ด.ช. ภานุเดช</span>
              <span style={{ color: '#00E676', fontWeight: 600 }}>ตรวจแล้ว (8/10)</span>
            </div>
            <div style={{ padding: '12px', background: 'rgba(2,6,23,0.9)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', fontSize: '12px' }}>
              <p style={{ color: '#CBD5E1', marginBottom: '4px' }}>ข้อ 1) √48 + √12 = 6√3 <span style={{ color: '#00E676' }}>✓ (+2)</span></p>
              <p style={{ color: '#CBD5E1', marginBottom: '4px' }}>
                ข้อ 2) √(9+16) = √9 + √16 = 7 <span style={{ color: '#FB7185', fontWeight: 700 }}>✗ (0)</span>{' '}
                <span style={{ color: '#FCD34D', fontSize: '10px' }}>← กระจายรากผิด!</span>
              </p>
              <p style={{ color: '#CBD5E1' }}>ข้อ 3) √75 / √3 = 5 <span style={{ color: '#00E676' }}>✓ (+2)</span></p>
            </div>
          </div>
        </div>

        <button
          className="btn-outline-ais"
          style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}
          onClick={() => alert('ระบบตรวจแบบทดสอบด้วย AI OCR พร้อมสแกนกระดาษคำตอบ')}
        >
          📷 อัปโหลดสแกนแบบทดสอบใหม่
        </button>
      </div>
    </div>
  );
}
