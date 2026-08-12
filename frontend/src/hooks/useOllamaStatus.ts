// ============================================================
// useOllamaStatus — Custom hook to check backend health
// ============================================================

import { useState, useEffect } from 'react';
import { api } from '../api/client';

export function useOllamaStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const data = await api.healthCheck();
        if (!cancelled) {
          setIsOnline(data.ollama_online);
        }
      } catch {
        if (!cancelled) setIsOnline(false);
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    };
    check();
    return () => { cancelled = true; };
  }, []);

  return { isOnline, isChecking };
}
