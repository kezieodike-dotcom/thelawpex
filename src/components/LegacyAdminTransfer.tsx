import React, { useState } from 'react';
import { adminSiteUrl } from '../lib/adminLocation';
import { getCaseIngestionRecords } from '../data/caseIngestion';
import { exportLegacyAdminBackup } from '../lib/legacyAdminBackup';

export function LegacyAdminTransfer() {
  const [notice, setNotice] = useState('');
  const count = getCaseIngestionRecords().length;
  const backup = async () => {
    try {
      setNotice('Preparing your records and original documents...');
      const url = URL.createObjectURL(await exportLegacyAdminBackup());
      const link = document.createElement('a'); link.href = url; link.download = 'lawpex-editorial-transfer.json'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setNotice('Backup downloaded. Sign in to the new admin site and choose Import old workspace.');
    } catch (error) { setNotice((error as Error).message); }
  };
  return <section className="mx-auto max-w-3xl px-6 py-20"><h1 className="text-3xl font-black">LAWPEX Administration has moved</h1><p className="mt-5">The admin workspace now has its own site, with shared publishing to the public case library.</p>{count > 0 && <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-5"><p>This browser has {count} records from the old workspace. Download a backup here, then import it on the new admin site. Published records must be reviewed again before shared publication.</p><button onClick={() => void backup()} className="mt-4 rounded-lg bg-neutral-950 px-5 py-3 font-bold text-yellow-300">Download old workspace</button></div>}<a href={`${adminSiteUrl()}${window.location.search}`} className="mt-7 inline-block rounded-lg bg-yellow-400 px-6 py-3 font-bold">Open admin site</a>{notice && <p role="status" className="mt-5">{notice}</p>}</section>;
}
