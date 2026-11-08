import { useEffect, useState } from 'react';
import type { SourceLegalDocument } from '../components/LegalPageText';
import sourceLayoutNames from '../data/legalSourceLayouts.json';

const available = new Set(sourceLayoutNames);
const cache = new Map<string, Promise<SourceLegalDocument | null>>();
export function useSourceLegalLayout(documentPath?: string) {
  const name = documentPath?.split('/').at(-1)?.replace(/\.pdf$/i, '') ?? '';
  const [result, setResult] = useState<{ name: string; layout: SourceLegalDocument | null }>({ name: '', layout: null });
  useEffect(() => {
    if (!available.has(name)) return;
    let active = true;
    let pending = cache.get(name);
    if (!pending) {
      pending = fetch(`/documents/layouts/${name}.json`, { cache: 'no-cache' })
        .then(async response => {
          if (!response.ok) return null;
          const data = await response.json();
          return data.version === 1 && data.pages ? data as SourceLegalDocument : null;
        }).catch(() => null);
      cache.set(name, pending);
    }
    pending.then(layout => { if (active) setResult({ name, layout }); });
    return () => { active = false; };
  }, [name]);
  return result.name === name ? result.layout : null;
}
