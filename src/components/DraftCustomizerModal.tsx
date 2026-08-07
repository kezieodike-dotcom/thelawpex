import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, Download, FileText, Bot, RefreshCw } from 'lucide-react';
import { LegalDraft } from '../types';

interface DraftCustomizerModalProps {
  draft: LegalDraft | null;
  onClose: () => void;
}

export const DraftCustomizerModal: React.FC<DraftCustomizerModalProps> = ({ draft, onClose }) => {
  if (!draft) return null;

  const [courtName, setCourtName] = useState('High Court of Lagos State');
  const [state, setState] = useState('Lagos Judicial Division');
  const [suitNo, setSuitNo] = useState('SUIT NO: LD/10425/2026');
  const [claimant, setClaimant] = useState('CHIEF OSITA NWOSU');
  const [defendant, setDefendant] = useState('PRIME LANDS REALTY LTD');
  const [facts, setFacts] = useState('Breach of contract, trespass, and unlawful excavation on res.');
  const [prayers, setPrayers] = useState('An order of interlocutory injunction restraining the Defendant from further trespass.');
  const [customText, setCustomText] = useState(draft.sampleText);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateCustomDraft = async () => {
    setIsCustomizing(true);
    try {
      const res = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftType: draft.title,
          courtName,
          state,
          parties: { claimant, defendant },
          facts,
          prayers
        })
      });
      const data = await res.json();
      if (data.draftText) {
        setCustomText(data.draftText);
      }
    } catch {
      // Manual variable replace fallback
      let text = draft.sampleText
        .replace(/CHIEF OSITA NWOSU/g, claimant)
        .replace(/PRIME LANDS REALTY LTD/g, defendant)
        .replace(/LD\/10425\/2026/g, suitNo);
      setCustomText(text);
    } finally {
      setIsCustomizing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-yellow-100 border border-yellow-400/70 rounded-2xl shadow-2xl overflow-hidden text-neutral-900 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 sm:p-6 border-b border-neutral-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-neutral-950 font-black flex items-center justify-center text-lg shadow-md shadow-yellow-500/25">
              <FileText className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black font-serif text-neutral-900">{draft.title} Customizer</h2>
              <p className="text-xs text-yellow-700 font-medium">Interactive AI Process Generator & Court Heading Editor</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-yellow-500/25"
            >
              {copied ? <Check className="w-4 h-4 text-neutral-950" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Process!' : 'Copy to Word'}</span>
            </button>

            <button onClick={onClose} className="p-2 bg-yellow-100 text-neutral-600 hover:text-neutral-900 rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Split: Left Variables Form, Right Document Editor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 flex-1 overflow-hidden">
          {/* Form Column */}
          <div className="p-6 bg-white border-r border-neutral-200 overflow-y-auto space-y-4 text-xs">
            <h3 className="font-bold text-yellow-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-yellow-700" />
              Process Variables & Facts
            </h3>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">Court Name</label>
              <input
                type="text"
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                className="w-full bg-yellow-100 border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">Judicial Division / State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-yellow-100 border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">Claimant / Applicant Name</label>
              <input
                type="text"
                value={claimant}
                onChange={(e) => setClaimant(e.target.value)}
                className="w-full bg-yellow-100 border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">Defendant / Respondent Name</label>
              <input
                type="text"
                value={defendant}
                onChange={(e) => setDefendant(e.target.value)}
                className="w-full bg-yellow-100 border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">Key Facts Summary</label>
              <textarea
                value={facts}
                onChange={(e) => setFacts(e.target.value)}
                rows={3}
                className="w-full bg-yellow-100 border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none focus:border-yellow-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-neutral-600 font-medium mb-1">Prayers Requested</label>
              <textarea
                value={prayers}
                onChange={(e) => setPrayers(e.target.value)}
                rows={3}
                className="w-full bg-yellow-100 border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none focus:border-yellow-400 resize-none"
              />
            </div>

            <button
              onClick={handleGenerateCustomDraft}
              disabled={isCustomizing}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black py-3 rounded-xl text-xs transition shadow-lg shadow-yellow-500/25 flex items-center justify-center gap-2"
            >
              {isCustomizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Customizing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Re-Generate Process with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Process Text Editor Column */}
          <div className="md:col-span-2 p-6 bg-yellow-100 overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold text-yellow-700 uppercase tracking-wider">Formal Court Process Draft</span>
              <span className="text-[10px] text-neutral-500">Fully Editable Text Area</span>
            </div>

            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full flex-1 bg-white text-neutral-800 font-serif text-xs leading-relaxed p-6 rounded-2xl border border-neutral-200 focus:outline-none focus:border-yellow-400 min-h-[450px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
