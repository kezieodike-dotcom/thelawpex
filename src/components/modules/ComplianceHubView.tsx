import React, { useState } from 'react';
import { Building2, ShieldAlert, CheckCircle2, AlertTriangle, FileCheck, ArrowRight } from 'lucide-react';
import { COMPLIANCE_GUIDES } from '../../data/legalData';

export const ComplianceHubView: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState(COMPLIANCE_GUIDES[0]);

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            MODULE 11
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">Regulatory & Corporate Compliance Hub</h1>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1">
            Tailored compliance checklists and risk frameworks for Banks, Insurance, Oil & Gas (NUPRC), Corporate Governance (CAMA 2020), Anti-Money Laundering (SCUML/NFIU), and Data Protection (NDPA 2023).
          </p>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">Sectors & Regulators</h2>
            {COMPLIANCE_GUIDES.map((cg) => (
              <button
                key={cg.id}
                onClick={() => setSelectedGuide(cg)}
                className={`w-full text-left p-4 rounded-2xl border transition ${
                  selectedGuide.id === cg.id
                    ? 'bg-yellow-400 text-neutral-950 border-yellow-400 font-bold shadow-xl shadow-yellow-500/25'
                    : 'bg-yellow-100 text-neutral-700 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${selectedGuide.id === cg.id ? 'bg-white text-yellow-700' : 'bg-yellow-100 text-neutral-600'}`}>
                  {cg.sector}
                </span>
                <h3 className="text-sm font-bold font-serif mt-2">{cg.title}</h3>
                <p className={`text-[11px] line-clamp-2 mt-1 ${selectedGuide.id === cg.id ? 'text-neutral-900 font-medium' : 'text-neutral-600'}`}>
                  Regulator: {cg.regulatoryBody}
                </p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-yellow-100 border border-neutral-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl">
              <div>
                <span className="text-[10px] text-yellow-700 font-bold uppercase tracking-wider">{selectedGuide.sector} • {selectedGuide.regulatoryBody}</span>
                <h2 className="text-2xl font-black font-serif text-neutral-900 mt-1">{selectedGuide.title}</h2>
                <p className="text-xs text-neutral-700 mt-2 leading-relaxed">{selectedGuide.overview}</p>
              </div>

              {/* Requirements & Penalties */}
              <div>
                <h3 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-3">Statutory Mandatory Filings & Penalties</h3>
                <div className="space-y-3">
                  {selectedGuide.keyComplianceItems.map((item, i) => (
                    <div key={i} className="bg-white border border-neutral-200 p-4 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold text-neutral-900">
                        <span>{item.requirement}</span>
                        <span className="text-yellow-700 font-mono">{item.deadline}</span>
                      </div>
                      <p className="text-red-600 text-[11px] flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        Penalty for Non-Compliance: {item.penalty}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklist */}
              <div>
                <h3 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-3">Step-by-Step Corporate Audit Checklist</h3>
                <div className="space-y-2">
                  {selectedGuide.checklist.map((chk, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center gap-2.5 text-xs text-neutral-800">
                      <CheckCircle2 className="w-4 h-4 text-yellow-700 shrink-0" />
                      <span>{chk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
