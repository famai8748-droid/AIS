// ============================================================
// TeacherPortal — Wrapper for all teacher-facing components
// ============================================================

import { useState } from 'react';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { RemedialGenerator } from './RemedialGenerator';

export function TeacherPortal() {
  const [remedialTopic, setRemedialTopic] = useState('');
  const [remedialWeakness, setRemedialWeakness] = useState('');

  const handleTriggerRemedial = (topic: string, weakness: string) => {
    setRemedialTopic(topic);
    setRemedialWeakness(weakness);
    // Scroll to remedial section
    setTimeout(() => {
      document.getElementById('remedial-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section id="view-teacher-portal" className="space-y-8 animate-fade-in">
      <AnalyticsDashboard onTriggerRemedial={handleTriggerRemedial} />
      <div id="remedial-section">
        <RemedialGenerator
          initialTopic={remedialTopic || undefined}
          initialWeakness={remedialWeakness || undefined}
        />
      </div>
    </section>
  );
}
