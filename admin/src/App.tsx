import React, { useEffect, useState } from 'react';
import { AdminPanelView } from './AdminPanelView';
import { AdminApiError, adminRequest, jsonBody, publicSiteUrl } from './api';
import { loadSharedRecords, useSaveState, getCaseIngestionRecords } from './storage';
import { LegacyImport } from './LegacyImport';

export function AdminApp() {
  const [session, setSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const save = useSaveState();
  useEffect(() => {
    let active = true;
    document.title = 'LAWPEX Administration';
    adminRequest<{ email: string }>('/session').then(async data => { if (!active) return; await loadSharedRecords(); if (active) setSession(data.email); }).catch(error => { if (active && (!(error instanceof AdminApiError) || error.status !== 401)) setError(error.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const login = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const data = await adminRequest<{ email: string }>('/session', { method: 'POST', ...jsonBody({ email, password }) });
      await loadSharedRecords(); setSession(data.email); setPassword('');
    } catch (error) { setError(error instanceof Error ? error.message : 'Sign-in failed.'); }
    finally { setLoading(false); }
  };
  const logout = async () => {
    if (save.pending) { setError('Wait for the current save before signing out.'); return; }
    if (save.error) downloadEdits();
    try {
      await adminRequest('/session', { method: 'DELETE' });
      try { localStorage.removeItem('lawpex.admin.shared-backup.v1'); } catch { /* Revocation does not depend on browser storage. */ }
      setSession(null); setError('');
    } catch (error) { setError((error as Error).message); }
  };
  const downloadEdits = () => {
    const blob = new Blob([JSON.stringify(getCaseIngestionRecords(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'lawpex-unsaved-editorial-records.json'; link.click(); URL.revokeObjectURL(url);
  };
  if (!session) return <main className="flex min-h-screen items-center justify-center bg-amber-50 px-6 py-12"><form onSubmit={login} className="w-full max-w-md rounded-2xl border border-amber-200 bg-white p-8 shadow-sm"><img src="/lawpex-official-logo.jpg" alt="LAWPEX" className="mb-6 h-16 w-16 object-cover" /><h1 className="text-3xl font-black">Administration</h1><p className="mt-3 text-sm text-neutral-600">Sign in to review and publish LAWPEX case reports.</p><label className="mt-7 block text-sm font-bold">Email<input required type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 block w-full rounded-lg border border-neutral-300 p-3" /></label><label className="mt-4 block text-sm font-bold">Password<input required type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} className="mt-2 block w-full rounded-lg border border-neutral-300 p-3" /></label>{error && <p role="alert" className="mt-4 text-sm text-red-800">{error}</p>}<button disabled={loading} className="mt-6 w-full rounded-lg bg-neutral-950 px-4 py-3 font-bold text-yellow-300 disabled:opacity-50">{loading ? 'Connecting...' : 'Sign in'}</button><a href={publicSiteUrl()} className="mt-5 block text-center text-sm underline">Back to LAWPEX</a></form></main>;
  return <><div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm"><span>{session} · {save.pending ? 'Saving changes...' : save.error ? 'Changes need attention' : 'All changes saved'}</span><div className="flex flex-wrap gap-4"><LegacyImport /><button onClick={downloadEdits} className="underline">Export editorial backup</button><button onClick={() => void logout()} className="font-bold underline" disabled={save.pending > 0}>Sign out</button></div></div>{(save.error || error) && <div role="alert" className="border-b border-red-200 bg-red-50 p-4 text-sm text-red-900">{save.error || error} {save.error && <><button onClick={downloadEdits} className="font-bold underline">Export your edits</button>, then <button onClick={() => window.location.reload()} className="font-bold underline">reload the workspace</button>.</>}</div>}<AdminPanelView /></>;
}
