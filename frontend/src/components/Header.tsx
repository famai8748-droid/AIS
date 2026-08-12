// ============================================================
// Header — Sticky navigation bar (original design)
// ============================================================

import type { RoleType } from '../types';
import { useOllamaStatus } from '../hooks/useOllamaStatus';

interface HeaderProps {
  role: RoleType;
  onRoleChange: (role: RoleType) => void;
  onLoginClick: () => void;
  currentUserName?: string;
}

export function Header({ role, onRoleChange, onLoginClick, currentUserName }: HeaderProps) {
  const { isOnline, isChecking } = useOllamaStatus();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'rgba(2,6,23,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '12px 32px',
    }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #00E676 0%, #00E5FF 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, color: '#070D19', fontSize: '1.1rem',
            boxShadow: '0 4px 20px rgba(0,230,118,0.3)',
          }}>
            FS
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.01em' }}>
                FindSelf Class
              </h1>
              <span style={{
                padding: '2px 8px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
                background: 'rgba(0,230,118,0.15)', color: '#00E676',
                border: '1px solid rgba(0,230,118,0.4)', borderRadius: '6px',
              }}>
                by AIS
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
              JUMP THAILAND Hackathon 2026 Track: Future of Education
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* AI Status Badge */}
          {!isChecking && (
            <div className="glass-pill" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              {isOnline ? (
                <>
                  <span className="pulse-dot" />
                  <span style={{ color: '#00E676', fontWeight: 500 }}>AIS 5G Edge AI (Ollama Llama 3.2 Active)</span>
                </>
              ) : (
                <>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FCD34D', display: 'inline-block' }} />
                  <span style={{ color: '#FCD34D', fontWeight: 500 }}>FindSelf AIS Engine (Dataset RAG Mode)</span>
                </>
              )}
            </div>
          )}

          {/* Role Switcher */}
          <div style={{
            background: 'rgba(15,23,42,0.9)', padding: '4px',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
            display: 'flex', alignItems: 'center',
          }}>
            <button
              id="tab-role-teacher"
              className={`role-tab ${role === 'teacher' ? 'active' : ''}`}
              onClick={() => onRoleChange('teacher')}
            >
              👩‍🏫 มุมคุณครู (Teacher)
            </button>
            <button
              id="tab-role-student"
              className={`role-tab ${role === 'student' ? 'active' : ''}`}
              onClick={() => onRoleChange('student')}
            >
              🎓 มุมนักเรียน (Student)
            </button>
          </div>

          {/* Login Button */}
          <button
            id="btn-login-ais"
            className="btn-ais"
            style={{ fontSize: '0.8rem', padding: '8px 16px' }}
            onClick={onLoginClick}
          >
            <span>📱</span>
            <span>{currentUserName ? `👤 ${currentUserName}` : 'เข้าสู่ระบบด้วยเบอร์ AIS'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
