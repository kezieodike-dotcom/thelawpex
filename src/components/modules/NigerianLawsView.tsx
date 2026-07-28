import React, { useState } from 'react';
import { BookOpen, Search, Copy, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { NIGERIAN_LAWS_DATA } from '../../data/legalData';

export const NigerianLawsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLawId, setSelectedLawId] = useState(NIGERIAN_LAWS_DATA[0].id);
  const [expandedSection, setExpandedSection] = useState<string | null>('84');

  const selectedLaw = NIGERIAN_LAWS_DATA.find((l) => l.id === selectedLawId) || NIGERIAN_LAWS_DATA[0];

  return (
    <div className="bg-neutral-950 text-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-neutral-900 border border-yellow-500/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            MODULE 3
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-white mt-2">Nigerian Laws & LFN Repository</h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl mt-1">
            Laws of the Federation of Nigeria (LFN), 1999 Constitution, Evidence Act 2011, CAMA 2020, ACJA 2015, Electoral Act 2022, Criminal Code & State Laws across all 36 States.
          </p>

          <div className="mt-4 relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search LFN Statute or Section e.g. 'Section 84', 'CAMA', 'ACJA'..."
              className="w-full bg-neutral-950 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-neutral-800 text-white focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Statute Selection List */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Statutes & Acts of National Assembly</h2>
            {NIGERIAN_LAWS_DATA.map((law) => (
              <button
                key={law.id}
                onClick={() => setSelectedLawId(law.id)}
                className={`w-full text-left p-4 rounded-xl border transition ${
                  selectedLawId === law.id
                    ? 'bg-yellow-400 text-neutral-950 border-yellow-400 font-bold shadow-lg shadow-yellow-500/20'
                    : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-yellow-500/40'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold font-serif">{law.shortTitle}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${selectedLawId === law.id ? 'bg-neutral-950 text-yellow-400' : 'bg-neutral-800 text-neutral-400'}`}>
                    {law.year}
                  </span>
                </div>
                <p className={`text-[11px] line-clamp-2 mt-1 ${selectedLawId === law.id ? 'text-neutral-900 font-medium' : 'text-neutral-400'}`}>
                  {law.description}
                </p>
              </button>
            ))}
          </div>

          {/* Statute Details & Sections Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="border-b border-neutral-800 pb-4">
                <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">{selectedLaw.category} • {selectedLaw.citation}</span>
                <h2 className="text-2xl font-black font-serif text-white mt-1">{selectedLaw.title}</h2>
                <p className="text-xs text-neutral-300 mt-2 leading-relaxed">{selectedLaw.description}</p>
              </div>

              {/* Sections List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Statutory Sections & Annotations</h3>

                {selectedLaw.sections.map((sec) => {
                  const isExpanded = expandedSection === sec.sectionNumber;
                  return (
                    <div key={sec.sectionNumber} className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : sec.sectionNumber)}
                        className="w-full p-4 flex justify-between items-center text-left hover:bg-neutral-900 transition"
                      >
                        <div>
                          <span className="text-xs font-bold text-yellow-400">Section {sec.sectionNumber}:</span>
                          <span className="text-xs font-bold text-white ml-2">{sec.heading}</span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-yellow-400" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                      </button>

                      {isExpanded && (
                        <div className="p-4 bg-neutral-950 border-t border-neutral-800 text-xs text-neutral-300 leading-relaxed font-serif">
                          {sec.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
