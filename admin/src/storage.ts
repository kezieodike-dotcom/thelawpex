import { useSyncExternalStore } from 'react';
import type { AdminCaseRecord } from '../../src/data/caseIngestion';
import { adminRequest, jsonBody } from './api';

let records: AdminCaseRecord[] = [];
const versions = new Map<string, number>();
const saved = new Map<string, string>();
let queue = Promise.resolve();
let state = { pending: 0, error: '' };
const listeners = new Set<() => void>();
const announce = () => { listeners.forEach(listener => listener()); window.dispatchEvent(new Event('lawpex-case-ingestion-updated')); };
const setState = (patch: Partial<typeof state>) => { state = { ...state, ...patch }; listeners.forEach(listener => listener()); };
export const useSaveState = () => useSyncExternalStore(callback => { listeners.add(callback); return () => { listeners.delete(callback); }; }, () => state);

export async function loadSharedRecords() {
  const data = await adminRequest<{ records: { record: AdminCaseRecord; version: number }[] }>('/cases');
  records = data.records.map(item => item.record);
  versions.clear(); saved.clear();
  for (const item of data.records) { versions.set(item.record.id, item.version); saved.set(item.record.id, JSON.stringify(item.record)); }
  setState({ pending: 0, error: '' });
  queue = Promise.resolve();
  announce();
}
export const getCaseIngestionRecords = () => records;
export function saveCaseIngestionRecords(next: AdminCaseRecord[]) {
  records = next;
  // Retain an emergency backup of unsaved editorial work; public pages never read it.
  try { localStorage.setItem('lawpex.admin.shared-backup.v1', JSON.stringify(next)); } catch { /* The server remains the primary store. */ }
  announce();
  setState({ pending: state.pending + 1 });
  const snapshot = structuredClone(next);
  const task = queue.then(async () => {
    if (state.error) throw new Error(state.error);
    for (const record of snapshot) {
      const serialized = JSON.stringify(record);
      if (saved.get(record.id) === serialized) continue;
      const result = await adminRequest<{ version: number }>(`/cases/${encodeURIComponent(record.id)}`, { method: 'PUT', ...jsonBody({ record, version: versions.get(record.id) ?? 0 }) });
      versions.set(record.id, result.version); saved.set(record.id, serialized);
    }
    for (const id of [...saved.keys()]) {
      if (snapshot.some(record => record.id === id)) continue;
      await adminRequest(`/cases/${encodeURIComponent(id)}`, { method: 'DELETE', ...jsonBody({ version: versions.get(id) }) });
      saved.delete(id); versions.delete(id);
    }
  });
  queue = task.catch(error => { setState({ error: error instanceof Error ? error.message : 'Shared storage could not save your edits.' }); }).finally(() => setState({ pending: Math.max(0, state.pending - 1) }));
  return task;
}
export function upsertCaseIngestionRecord(record: AdminCaseRecord) {
  return saveCaseIngestionRecords(records.some(item => item.id === record.id) ? records.map(item => item.id === record.id ? record : item) : [record, ...records]);
}
export async function saveSourceDocument(key: string, file: File) {
  await adminRequest(`/sources/${encodeURIComponent(key)}`, { method: 'PUT', headers: { 'Content-Type': 'application/octet-stream' }, body: file });
}
export async function getSourceDocument(key: string): Promise<Blob | null> {
  const response = await fetch(`/api/admin/sources/${encodeURIComponent(key)}`, { credentials: 'same-origin', cache: 'no-store' });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('The preserved source document could not be loaded. Check your connection and sign in again if needed.');
  return response.blob();
}
