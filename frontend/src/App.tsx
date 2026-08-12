// ============================================================
// App.tsx — Root component (original layout design)
// ============================================================

import { useState } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { AuthModal } from './components/AuthModal';
import { TeacherPortal } from './components/teacher/TeacherPortal';
import { StudentPortal } from './components/student/StudentPortal';
import { TyphoonChat } from './components/TyphoonChat';
import { AISPitchSection } from './components/AISPitchSection';
import type { RoleType, UserInfo } from './types';

function App() {
  const [role, setRole] = useState<RoleType>('teacher');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

  const handleAuthSuccess = (user: UserInfo) => {
    setCurrentUser(user);
    setRole(user.role);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <Header
        role={role}
        onRoleChange={setRole}
        onLoginClick={() => setIsAuthOpen(true)}
        currentUserName={currentUser?.name}
      />

      {/* Main */}
      <main style={{ flex: 1, maxWidth: '80rem', width: '100%', margin: '0 auto', padding: '24px 32px' }}>
        <HeroBanner />
        {role === 'teacher' ? <TeacherPortal /> : <StudentPortal />}
        <TyphoonChat />
        <AISPitchSection />
      </main>

      {/* Footer */}
      <footer style={{
        background: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '24px 16px', textAlign: 'center', fontSize: '12px', color: '#475569',
      }}>
        <p>FindSelf Class (by AIS) • JUMP THAILAND Hackathon 2026 • AI for the Future of Thai Education</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </div>
  );
}

export default App;
