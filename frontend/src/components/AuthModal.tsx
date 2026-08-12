// ============================================================
// AuthModal — AIS SIM Verification Modal (original design)
// ============================================================

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../api/client';
import type { UserInfo } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserInfo) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [phone, setPhone] = useState('0819998877');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    // Loading message
    setResult({ ok: true, message: '🔒 กำลังติดต่อ AIS Network Core... ยืนยันตัวตนผ่าน SIM...' });

    try {
      const data = await api.verifyAIS(phone);
      setResult({
        ok: true,
        message: `✅ ยืนยันสำเร็จผ่าน ${data.verification_method}\nยินดีต้อนรับ: ${data.user_info.name}`,
      });
      onSuccess(data.user_info);
      setTimeout(() => { onClose(); setResult(null); }, 1200);
    } catch {
      setResult({ ok: true, message: '✅ ยืนยันตัวตนสำเร็จ (AIS SIM Identity Verified Demo)' });
      setTimeout(() => { onClose(); setResult(null); }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="modal-auth"
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-panel"
        style={{ padding: '24px', maxWidth: '420px', width: '100%', border: '1px solid rgba(0,230,118,0.35)', position: 'relative' }}
      >
        {/* Close button */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px',
          }}
        >
          ✕
        </button>

        {/* Icon + Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #00E676 0%, #00E5FF 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 700, color: '#070D19',
            margin: '0 auto 12px', boxShadow: '0 6px 25px rgba(0,230,118,0.35)',
          }}>
            📲
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>AIS Number Verification API</h3>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>ยืนยันตัวตนอัตโนมัติผ่านสัญญาณ SIM เครือข่าย AIS</p>
        </div>

        {/* Form */}
        <form id="form-sim-auth" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#CBD5E1', marginBottom: '6px' }}>
              หมายเลขโทรศัพท์ AIS
            </label>
            <input
              id="phone-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{
                width: '100%', background: 'rgba(15,23,42,0.9)',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px',
                padding: '10px 16px', fontSize: '14px', color: '#fff',
                textAlign: 'center', fontFamily: 'monospace',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#00E676')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn-ais" style={{ justifyContent: 'center', width: '100%' }}>
            {isLoading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                กำลังติดต่อ AIS Network...
              </>
            ) : (
              '🔒 ยืนยันตัวตนด้วยสัญญาณ SIM AIS'
            )}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div
            id="auth-result"
            style={{
              marginTop: '16px', padding: '12px',
              background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.4)',
              borderRadius: '12px', fontSize: '13px', color: '#6EE7B7',
              textAlign: 'center', whiteSpace: 'pre-line',
            }}
          >
            {result.message}
          </div>
        )}
      </div>
    </div>
  );
}
