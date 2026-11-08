import { getCaseIngestionRecords, getSourceDocument, type AdminCaseRecord } from '../data/caseIngestion';

export interface LegacyBackup {
  format: 'lawpex-editorial-backup-v1'; records: AdminCaseRecord[];
  sources: { key: string; type: string; base64: string }[];
}
export async function exportLegacyAdminBackup() {
  const records = getCaseIngestionRecords();
  const keys = new Set(records.flatMap(record => [record.sourceDocument.storageKey, ...record.auditLog.flatMap(event => event.snapshotKey ? [event.snapshotKey] : [])]));
  const sources: LegacyBackup['sources'] = [];
  for (const key of keys) {
    const source = await getSourceDocument(key);
    if (!source) continue;
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = () => reject(reader.error); reader.readAsDataURL(source);
    });
    sources.push({ key, type: source.type, base64 });
  }
  const backup: LegacyBackup = { format: 'lawpex-editorial-backup-v1', records, sources };
  return new Blob([JSON.stringify(backup)], { type: 'application/json' });
}
