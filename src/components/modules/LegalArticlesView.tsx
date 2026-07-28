import React, { useState } from 'react';
import { BookOpen, Search, Bookmark, Clock, User, Share2 } from 'lucide-react';
import { LEGAL_ARTICLES } from '../../data/legalData';

export const LegalArticlesView: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState(LEGAL_ARTICLES[0]);

  return (
    <div className="bg-neutral-950 text-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-neutral-900 border border-yellow-500/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            MODULE 10
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-white mt-2">Peer-Reviewed Legal Articles & Journals</h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl mt-1">
            Thousands of expert legal commentaries authored by Senior Advocates of Nigeria, law professors, and judges on emerging legal trends, evidence law, CAMA 2020, and arbitration.
          </p>
        </div>

        {/* Article Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Sidebar */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Featured Research Papers</h2>
            {LEGAL_ARTICLES.map((art) => (
              <button
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className={`w-full text-left p-4 rounded-2xl border transition ${
                  selectedArticle.id === art.id
                    ? 'bg-neutral-900 border-yellow-400 shadow-xl'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <span className="text-[10px] text-yellow-400 font-bold uppercase">{art.category}</span>
                <h3 className="text-xs font-bold font-serif text-white line-clamp-2 mt-1">{art.title}</h3>
                <p className="text-[11px] text-neutral-400 mt-1">{art.author}</p>
                <div className="flex justify-between items-center mt-2 text-[10px] text-neutral-500">
                  <span>{art.publishedDate}</span>
                  <span>{art.readTimeMinutes} min read</span>
                </div>
              </button>
            ))}
          </div>

          {/* Article Main Reader */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl">
              <div className="border-b border-neutral-800 pb-4">
                <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                  {selectedArticle.category}
                </span>
                <h1 className="text-2xl font-black font-serif text-white mt-2 leading-tight">{selectedArticle.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mt-3">
                  <span className="flex items-center gap-1 font-semibold text-yellow-400">
                    <User className="w-3.5 h-3.5" /> {selectedArticle.author} ({selectedArticle.authorRole})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {selectedArticle.publishedDate} • {selectedArticle.readTimeMinutes} min read
                  </span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-neutral-300 font-serif leading-relaxed whitespace-pre-wrap">
                {selectedArticle.fullContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
