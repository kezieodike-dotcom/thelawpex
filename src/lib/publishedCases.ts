import { useSyncExternalStore } from 'react';
import type { CaseLaw } from '../types';

interface LibrarySnapshot { cases: CaseLaw[]; loaded: boolean; loading: boolean; error: string | null }
export function createPublishedCaseStore(url = '/api/cases') {
  let snapshot: LibrarySnapshot = { cases: [], loaded: false, loading: false, error: null };
  let pending: Promise<void> | null = null;
  const listeners = new Set<() => void>();
  const update = (patch: Partial<LibrarySnapshot>) => { snapshot = { ...snapshot, ...patch }; listeners.forEach(listener => listener()); };
  const refresh = () => {
    if (pending) return pending;
    update({ loading: true });
    pending = (async () => {
      try {
        const response = await fetch(url, { cache: 'no-store', credentials: 'omit' });
        if (!response.ok) throw new Error('The shared case library could not be loaded. Please try again.');
        const data = await response.json();
        if (!Array.isArray(data.cases)) throw new Error('The shared library returned an invalid response.');
        update({ cases: data.cases, error: null, loaded: true });
      } catch (error) {
        update({ cases: [], error: error instanceof Error ? error.message : 'The shared library is unavailable.', loaded: true });
      } finally { update({ loading: false }); pending = null; }
    })();
    return pending;
  };
  let stop: (() => void) | undefined;
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    if (listeners.size === 1 && typeof window !== 'undefined') {
      const onFocus = () => { if (!document.hidden) void refresh(); };
      window.addEventListener('focus', onFocus);
      document.addEventListener('visibilitychange', onFocus);
      const timer = window.setInterval(onFocus, 30_000);
      stop = () => { window.clearInterval(timer); window.removeEventListener('focus', onFocus); document.removeEventListener('visibilitychange', onFocus); };
      void refresh();
    }
    return () => { listeners.delete(listener); if (!listeners.size) { stop?.(); stop = undefined; } };
  };
  return { getSnapshot: () => snapshot, subscribe, refresh };
}

const sharedLibrary = createPublishedCaseStore();
export function usePublishedCases() {
  return { ...useSyncExternalStore(sharedLibrary.subscribe, sharedLibrary.getSnapshot), refresh: sharedLibrary.refresh };
}
