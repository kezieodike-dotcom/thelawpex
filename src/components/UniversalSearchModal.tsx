import React, { useState } from 'react';
import { Search, X, Scale, Gavel, BookOpen, FileText, ArrowRight } from 'lucide-react';
import { CaseLaw, CourtRule, NigerianLaw, LegalDraft } from '../types';
import { LANDMARK_CASES, COURT_RULES_DATA, NIGERIAN_LAWS_DATA, LEGAL_DRAFTS_DATA } from '../data/legalData';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: any) => void;
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectItem,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  if (!isOpen) return null;

  const filteredCases = LANDMARK_CASES.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.citation.toLowerCase().includes(query.toLowerCase()) ||
    c.subject.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRules = COURT_RULES_DATA.filter(r =>
    r.courtName.toLowerCase().includes(query.toLowerCase()) ||
    r.orderTitle.toLowerCase().includes(query.toLowerCase()) ||
    r.content.toLowerCase().includes(query.toLowerCase())
  );

  const filteredLaws = NIGERIAN_LAWS_DATA.filter(l =>
    l.title.toLowerCase().includes(query.toLowerCase()) ||
    l.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDrafts = LEGAL_DRAFTS_DATA.filter(d =>
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    d.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-yellow-500/30 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header Search Input */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex items-center gap-3">
          <Search className="w-5 h-5 text-yellow-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Universal Search e.g. 'Amaechi', 'Section 84', 'Interlocutory Injunction'..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 flex flex-wrap gap-2 text-xs">
          {['all', 'cases', 'laws', 'rules', 'drafts'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1 rounded-lg font-semibold uppercase tracking-wider transition ${
                filterType === f ? 'bg-yellow-400 text-neutral-950' : 'bg-neutral-950 text-neutral-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-4 max-h-[450px] overflow-y-auto space-y-4">
          {(filterType === 'all' || filterType === 'cases') && filteredCases.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" />
                Case Laws ({filteredCases.length})
              </div>
              <div className="space-y-2">
                {filteredCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectItem(c);
                      onClose();
                    }}
                    className="p-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-yellow-500/40 rounded-xl cursor-pointer transition flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.title}</h4>
                      <p className="text-[11px] text-yellow-400 font-mono mt-0.5">{c.citation}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {(filterType === 'all' || filterType === 'laws') && filteredLaws.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                Nigerian Laws & LFN ({filteredLaws.length})
              </div>
              <div className="space-y-2">
                {filteredLaws.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      onSelectItem(l);
                      onClose();
                    }}
                    className="p-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-yellow-500/40 rounded-xl cursor-pointer transition flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{l.title}</h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{l.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {(filterType === 'all' || filterType === 'drafts') && filteredDrafts.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                Draft Templates ({filteredDrafts.length})
              </div>
              <div className="space-y-2">
                {filteredDrafts.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      onSelectItem(d);
                      onClose();
                    }}
                    className="p-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-yellow-500/40 rounded-xl cursor-pointer transition flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{d.title}</h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{d.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
