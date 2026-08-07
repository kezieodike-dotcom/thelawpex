import React, { useState } from 'react';
import { FileText, Search, Sparkles, Download, Copy, Check, ChevronRight } from 'lucide-react';
import { LEGAL_DRAFTS_DATA } from '../../data/legalData';
import { LegalDraft } from '../../types';

interface DraftLibraryViewProps {
  onCustomizeDraft: (draft: LegalDraft) => void;
}

export const DraftLibraryView: React.FC<DraftLibraryViewProps> = ({ onCustomizeDraft }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', 'Civil', 'Criminal', 'Commercial', 'Corporate', 'Appellate', 'Affidavits'];

  const filteredDrafts = LEGAL_DRAFTS_DATA.filter((d) => {
    const matchesCat = categoryFilter === 'all' || d.category === categoryFilter;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.areaOfLaw.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            MODULE 6
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">Legal Draft & Process Library</h1>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1">
            Over 1,200 editable court process templates: Writs, Motions on Notice, Affidavits, Written Addresses, Notices of Appeal, Agreements, and Legal Opinions formatted for Nigerian High Courts & Appellate Courts.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-700" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Draft Template e.g. 'Motion for Injunction', 'Affidavit of Urgency', 'Notice of Appeal'..."
                className="w-full bg-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-neutral-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  categoryFilter === cat
                    ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-500/25'
                    : 'bg-white text-neutral-700 hover:bg-yellow-100'
                }`}
              >
                {cat === 'all' ? 'All Templates' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Draft Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrafts.map((draft) => (
            <div
              key={draft.id}
              className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/80 p-6 rounded-2xl transition shadow-xl space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="bg-yellow-400/20 text-yellow-700 border border-yellow-400/60 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                    {draft.category}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">{draft.downloadCount} downloads</span>
                </div>

                <h3 className="text-base font-bold font-serif text-neutral-900 group-hover:text-yellow-700 transition">
                  {draft.title}
                </h3>

                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">{draft.description}</p>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-2">
                <button
                  onClick={() => onCustomizeDraft(draft)}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-yellow-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Customize with AI</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
