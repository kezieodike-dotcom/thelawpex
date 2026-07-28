import React, { useState } from 'react';
import { Scale, Search, Bookmark, ChevronRight, Sparkles, Filter, Award } from 'lucide-react';
import { LANDMARK_CASES } from '../../data/legalData';

interface CaseLawViewProps {
  onOpenViewer: (item: any) => void;
}

export const CaseLawView: React.FC<CaseLawViewProps> = ({ onOpenViewer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courtFilter, setCourtFilter] = useState('all');

  const filteredCases = LANDMARK_CASES.filter((c) => {
    const matchesCourt = courtFilter === 'all' || c.court === courtFilter;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.factsSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourt && matchesSearch;
  });

  return (
    <div className="bg-neutral-950 text-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-neutral-900 border border-yellow-500/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            MODULE 4
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-white mt-2">Case Law Library & Precedents</h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl mt-1">
            Over 15,000 Supreme Court of Nigeria and Court of Appeal judgments indexed by Citation, Suit Number, Presiding Justices, Ratio Decidendi, and Obiter Dicta.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Citation or Subject e.g. 'Amaechi v INEC', '(2008) 5 NWLR', 'Locus Standi'..."
                className="w-full bg-neutral-950 text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border border-neutral-800 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Court Filter Tabs */}
          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-neutral-800">
            {['all', 'Supreme Court of Nigeria', 'Court of Appeal', 'Federal High Court'].map((court) => (
              <button
                key={court}
                onClick={() => setCourtFilter(court)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  courtFilter === court
                    ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-500/20'
                    : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {court === 'all' ? 'All Apex Courts' : court}
              </button>
            ))}
          </div>
        </div>

        {/* Case Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              className="bg-neutral-900 border border-neutral-800 hover:border-yellow-500/50 p-6 rounded-2xl transition shadow-xl space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded">
                    {c.court} ({c.year})
                  </span>
                  {c.isLandmark && (
                    <span className="bg-amber-500 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                      <Award className="w-3 h-3" /> LANDMARK PRECEDENT
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black font-serif text-white group-hover:text-yellow-400 transition leading-snug">
                  {c.title}
                </h3>

                <p className="text-xs text-yellow-400 font-mono font-bold">{c.citation} • {c.suitNumber}</p>

                <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed">
                  <strong className="text-white">Facts:</strong> {c.factsSummary}
                </p>

                {/* Ratio Preview */}
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs text-neutral-400">
                  <span className="text-yellow-400 font-bold text-[10px] uppercase block mb-1">Ratio Decidendi Highlight:</span>
                  <p className="italic text-neutral-300 line-clamp-2">"{c.ratioDecidendi[0]}"</p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">{c.presidingJudges[0]}</span>
                <button
                  onClick={() => onOpenViewer(c)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1"
                >
                  <span>Read Full Judgment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
