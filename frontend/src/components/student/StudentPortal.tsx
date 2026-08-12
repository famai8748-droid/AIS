// ============================================================
// StudentPortal — Wrapper for student-facing components (original design)
// ============================================================

import { SelfDiscoveryGame } from './SelfDiscoveryGame';
import { FreeHubGrid } from './FreeHubGrid';

export function StudentPortal() {
  return (
    <section id="view-student-portal" className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <SelfDiscoveryGame />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* My Classroom Panel */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📚 คลาสเรียนส่วนตัว (My Classroom)
          </h4>
          <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>
            ชีทสรุปเฉพาะบุคคลที่ AI สร้างให้คุณครูแจกจ่ายตามจุดผิด
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              padding: '12px', background: 'rgba(15,23,42,0.9)',
              borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 600, color: '#F1F5F9' }}>ชีทซ่อมแซม: การถอดรากที่สอง</h5>
                <span style={{ fontSize: '11px', color: '#00E676' }}>จากครูสมชาย • มอบหมายเมื่อวาน</span>
              </div>
              <button className="btn-outline-ais" style={{ fontSize: '12px', padding: '4px 10px' }} onClick={() => alert('เปิดอ่านชีทสรุปส่วนตัว')}>
                ดาวน์โหลด
              </button>
            </div>
          </div>
        </div>

        <FreeHubGrid />
      </div>
    </section>
  );
}
