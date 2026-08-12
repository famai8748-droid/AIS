// ============================================================
// FreeHubGrid — Free learning hub grid (original design)
// ============================================================

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../../api/client';
import type { CourseItem } from '../../types';

export function FreeHubGrid() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.freeHub().then(setCourses).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 2' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🌐 คลังชีทสรุป &amp; คอร์สฟรี (Free Learning Hub)
          </h4>
          <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>ไมโครคอร์สและชีทสรุปเนื้อหาให้ดาวน์โหลดฟรีเพื่อพัฒนาทักษะอนาคต</p>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', color: '#64748B', gap: '8px' }}>
          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '14px' }}>กำลังโหลดคอร์ส...</span>
        </div>
      ) : (
        <div id="free-hub-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {courses.map(course => (
            <div
              key={course.id}
              className="glass-panel"
              style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{course.icon}</div>
                <span style={{
                  padding: '4px 10px', fontSize: '11px', fontWeight: 600,
                  background: 'rgba(0,230,118,0.1)', color: '#00E676',
                  border: '1px solid rgba(0,230,118,0.3)', borderRadius: '8px',
                }}>
                  {course.category}
                </span>
                <h4 style={{ fontWeight: 700, color: '#F1F5F9', marginTop: '8px', fontSize: '0.95rem' }}>{course.title}</h4>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>⏱️ ใช้เวลาศึกษา: {course.duration}</p>
              </div>
              <button
                className="btn-outline-ais"
                style={{ marginTop: '16px', width: '100%', justifyContent: 'center', fontSize: '12px' }}
                onClick={() => alert('ดาวน์โหลดเอกสารเนื้อหาฟรีเรียบร้อย')}
              >
                📥 ดาวน์โหลดชีท / เรียนฟรี
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
