import React, { useState } from 'react';
import { Gavel, Search, Copy, Check, Bookmark, FileText, Download } from 'lucide-react';
import { COURT_RULES_DATA } from '../../data/legalData';

export const CourtRulesView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourtFilter, setSelectedCourtFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const courtsList = [
    'all',
    'Supreme Court',
    'Court of Appeal',
    'Federal High Court',
    'National Industrial Court',
    'High Courts (States & FCT)'
  ];

  const filteredRules = COURT_RULES_DATA.filter((r) => {
    const matchesCourt = selectedCourtFilter === 'all' || r.jurisdictionCategory === selectedCourtFilter;
    const matchesQuery =
      r.courtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.orderTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `order ${r.orderNumber}`.includes(searchQuery.toLowerCase()) ||
      `rule ${r.ruleNumber}`.includes(searchQuery.toLowerCase());
    return matchesCourt && matchesQuery;
  });

  const handleCopyRule = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-neutral-950 text-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-neutral-900 border border-yellow-500/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            MODULE 2
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-white mt-2">Court Rules Library</h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl mt-1">
            Searchable Rules of Court covering Supreme Court, Court of Appeal, Federal High Court, NICN, High Courts across all 36 States & FCT, Magistrate, Customary and Sharia Courts.
          </p>

          {/* Search Controls */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order, Rule, or Keyword e.g. 'Order 25', 'Summary Judgment', 'Pleadings'..."
                className="w-full bg-neutral-950 text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border border-neutral-800 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Court Filter Tabs */}
          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-neutral-800">
            {courtsList.map((court) => (
              <button
                key={court}
                onClick={() => setSelectedCourtFilter(court)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCourtFilter === court
                    ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-500/20'
                    : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {court === 'all' ? 'All Courts' : court}
              </button>
            ))}
          </div>
        </div>

        {/* Rules Cards List */}
        <div className="space-y-4">
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-neutral-900 border border-neutral-800 hover:border-yellow-500/40 p-6 rounded-2xl transition shadow-lg space-y-3"
            >
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-400/10 text-yellow-400 font-bold text-[10px] px-2 py-0.5 rounded border border-yellow-500/20">
                      {rule.courtName} ({rule.year})
                    </span>
                    {rule.state && (
                      <span className="bg-neutral-800 text-neutral-300 text-[10px] px-2 py-0.5 rounded">
                        {rule.state} State
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold font-serif text-white mt-1">
                    Order {rule.orderNumber} Rule {rule.ruleNumber}: {rule.orderTitle}
                  </h3>
                  <p className="text-xs text-yellow-400 font-medium">{rule.ruleTitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyRule(rule.content, rule.id)}
                    className="flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 px-3 py-1.5 rounded-lg text-xs border border-neutral-800 transition"
                  >
                    {copiedId === rule.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-yellow-400" />}
                    <span>{copiedId === rule.id ? 'Copied' : 'Copy Rule'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/80 text-xs text-neutral-300 leading-relaxed font-mono">
                {rule.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
