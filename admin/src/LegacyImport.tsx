import React, { useRef, useState } from 'react';
import type { LegacyBackup } from '../../src/lib/legacyAdminBackup';
import { getCaseIngestionRecords, saveCaseIngestionRecords, saveSourceDocument } from './storage';

export function LegacyImport() {
  const input = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const importBackup = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true); setNotice('Importing preserved sources and draft records...');
    try {
      const backup = JSON.parse(await file.text()) as LegacyBackup;
      if (backup.format !== 'lawpex-editorial-backup-v1' || !Array.isArray(backup.records) || !Array.isArray(backup.sources)) throw new Error('Choose a LAWPEX transfer backup downloaded from the old /admin page.');
      const existing = getCaseIngestionRecords();
      const imported = backup.records.filter(record => !existing.some(item => item.id === record.id));
      const neededKeys = new Set(imported.flatMap(record => [record.sourceDocument.storageKey, ...record.auditLog.flatMap(event => event.snapshotKey ? [event.snapshotKey] : [])]));
      for (const source of backup.sources.filter(source => neededKeys.has(source.key))) {
        const bytes = Uint8Array.from(atob(source.base64), character => character.charCodeAt(0));
        await saveSourceDocument(source.key, new File([bytes], source.key, { type: source.type || 'application/octet-stream' }));
      }
      const records = imported.map(record => ({ ...record, status: 'Draft' as const, validation: undefined, review: undefined, preparedReportText: undefined, updatedAt: new Date().toISOString() }));
      // Uploading source files can take time. Merge into the current collection,
      // preserving any edits or uploads made while this import was in progress.
      const current = getCaseIngestionRecords();
      const additions = records.filter(record => !current.some(item => item.id === record.id));
      await saveCaseIngestionRecords([...current, ...additions]);
      setNotice(`Imported ${additions.length} draft records. Existing cases were preserved. Verify and approve imported reports before publishing.`);
    } catch (error) { setNotice((error as Error).message); }
    finally { setBusy(false); if (input.current) input.current.value = ''; }
  };
  return <><input type="file" accept="application/json,.json" className="sr-only" ref={input} onChange={event => void importBackup(event.target.files?.[0])} aria-label="Import old workspace backup" /><button disabled={busy} onClick={() => input.current?.click()} className="underline">{busy ? 'Importing...' : 'Import old workspace'}</button>{notice && <span role="status" className="max-w-xl">{notice}</span>}</>;
}
