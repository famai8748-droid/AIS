// ============================================================
// AISPitchSection — AIS Technology pitching cards (original design)
// ============================================================

export function AISPitchSection() {
  const cards = [
    {
      icon: '📲',
      iconBg: 'rgba(0,230,118,0.15)',
      iconBorder: 'rgba(0,230,118,0.4)',
      titleColor: '#00E676',
      title: '1. AIS Number Verification API',
      desc: 'ยืนยันตัวตนเด็กและครูผ่านระบบ SIM เบอร์มือถือ AIS เครือข่ายปลอดภัย ป้องกันเด็กจำ Password ไม่ได้ ไม่ต้องกรอก OTP ให้ยุ่งยาก ใช้งานได้ทันที 100%',
    },
    {
      icon: '⚡',
      iconBg: 'rgba(0,229,255,0.15)',
      iconBorder: 'rgba(0,229,255,0.4)',
      titleColor: '#00E5FF',
      title: '2. AIS 5G & Local Edge Computing',
      desc: 'รันโมเดล AI (Typhoon AI) แบบ Cloud Server ในโรงเรียนผ่าน AIS 5G หน่วงต่ำ (Low Latency) ปลอดภัยตามกฎหมาย PDPA ข้อมูลนักเรียนไม่รั่วไหลออกภายนอก',
    },
  ];

  return (
    <section className="glass-panel" style={{ marginTop: '32px', padding: '32px', borderColor: 'rgba(0,230,118,0.15)' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🟢 เทคโนโลยีของ AIS ที่นำมาปลั๊กอิน (JUMP THAILAND Hackathon Pitching Points)
      </h3>
      <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '24px' }}>จุดขายสำคัญในการเสนอผลงานแก่คณะกรรมการ</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {cards.map((card, idx) => (
          <div key={idx} style={{
            padding: '20px', background: 'rgba(2,6,23,0.6)',
            borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'flex-start', gap: '16px',
            transition: 'border-color 0.2s',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: card.iconBg, border: `1px solid ${card.iconBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', flexShrink: 0,
            }}>
              {card.icon}
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '1rem', color: card.titleColor }}>{card.title}</h4>
              <p style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: 1.7, marginTop: '4px' }}>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
