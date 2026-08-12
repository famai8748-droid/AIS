// ============================================================
// HeroBanner — Hero section (original design)
// ============================================================

export function HeroBanner() {
  const stats = [
    { value: '100%', label: 'Web-based ทุกอุปกรณ์', color: '#00E676' },
    { value: '1-Click', label: 'AI สรุปชีทซ่อมแซมจุดอ่อน', color: '#00E5FF' },
    { value: 'SIM Auth', label: 'AIS Number Verification', color: '#00E676' },
    { value: '5G Edge', label: 'Local Privacy-Preserving AI', color: '#00E5FF' },
  ];

  return (
    <section className="glass-panel" style={{ padding: '32px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow orbs */}
      <div style={{
        position: 'absolute', top: '-48px', right: '-48px',
        width: '256px', height: '256px',
        background: 'rgba(0,230,118,0.08)', borderRadius: '50%', filter: 'blur(48px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-48px', left: '-48px',
        width: '192px', height: '192px',
        background: 'rgba(0,229,255,0.06)', borderRadius: '50%', filter: 'blur(48px)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '768px' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 12px', background: 'rgba(0,230,118,0.1)',
          border: '1px solid rgba(0,230,118,0.3)', borderRadius: '9999px',
          fontSize: '12px', fontWeight: 600, color: '#00E676', marginBottom: '12px',
        }}>
          ✨ AI for the Future of Thai Education
        </div>

        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: '12px' }}>
          คลาสรูมอัจฉริยะ <span className="text-gradient">ค้นหาตัวตน</span> และปิดจุดอ่อนด้วย AI Specific
        </h2>

        <p style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.7 }}>
          คืนเวลาให้ครูด้วยระบบวิเคราะห์ห้องเรียน สรุปจุดอ่อนอัตโนมัติ และสร้าง{' '}
          <strong style={{ color: '#00E676' }}>Remedial Sheet</strong> ด้วยปุ่มเดียว พร้อมศูนย์แนะแนวหาตัวตนเด็กไทยประมวลผลผ่าน{' '}
          <strong style={{ color: '#00E5FF' }}>AIS 5G Edge AI Engine</strong> ปลอดภัยและรวดเร็ว
        </p>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '24px' }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{
              padding: '12px', background: 'rgba(15,23,42,0.6)',
              borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
