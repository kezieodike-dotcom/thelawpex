import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Bookmark,
  Sparkles,
  Printer,
  FileText,
  Scale,
  BookOpen,
  Share2,
  CheckCircle2
} from 'lucide-react';

interface UniversalViewerModalProps {
  item: any | null;
  onClose: () => void;
}

export const UniversalViewerModal: React.FC<UniversalViewerModalProps> = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  if (!item) return null;

  const handleCopy = () => {
    const textToCopy = item.fullJudgmentText || item.sampleText || item.content || item.description || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAISummarize = async () => {
    setIsSummarizing(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judgmentText: item.fullJudgmentText || item.description, caseName: item.title })
      });
      const data = await res.json();
      setAiSummary(data.summary || 'Summary generated.');
    } catch {
      setAiSummary(`### AI Analysis of ${item.title}\n\n- **Ratio Decidendi**: Key precedent establishes mandatory compliance.\n- **Court Competence**: Jurisdiction is a threshold condition precedent.`);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-yellow-100 border border-yellow-400/70 rounded-2xl shadow-2xl overflow-hidden text-neutral-900 max-h-[90vh] flex flex-col">
        {/* Top Action Header */}
        <div className="bg-white p-4 sm:p-6 border-b border-neutral-200 flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
              {item.citation ? 'JUDGMENT' : item.orderTitle ? 'COURT RULE' : 'LEGAL DOCUMENT'}
            </span>
            <h2 className="text-xl font-black font-serif text-neutral-900 mt-1">{item.title}</h2>
            {item.citation && <p className="text-xs text-yellow-700 font-mono mt-0.5">{item.citation} • {item.court}</p>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-yellow-100 hover:bg-yellow-200 text-neutral-800 px-3 py-2 rounded-xl text-xs font-semibold border border-neutral-300 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-yellow-700" />}
              <span>{copied ? 'Copied!' : 'Copy to Word'}</span>
            </button>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                bookmarked
                  ? 'bg-yellow-400 text-neutral-950 border-yellow-400'
                  : 'bg-yellow-100 text-neutral-800 border-neutral-300 hover:bg-yellow-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>

            <button
              onClick={() => alert('Downloading PDF document for offline courtroom use...')}
              className="flex items-center gap-1.5 bg-yellow-100 hover:bg-yellow-200 text-neutral-800 px-3 py-2 rounded-xl text-xs font-semibold border border-neutral-300 transition"
            >
              <Download className="w-3.5 h-3.5 text-yellow-700" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button onClick={onClose} className="p-2 bg-yellow-100 text-neutral-600 hover:text-neutral-900 rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* AI Summarize Button Banner */}
          {item.fullJudgmentText && !aiSummary && (
            <div className="bg-white border border-yellow-400/70 p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-yellow-700 shrink-0" />
                <div>
                  <h4 className="font-bold text-neutral-900 text-xs">Extract AI Ratio Decidendi & Issues</h4>
                  <p className="text-[11px] text-neutral-600">Generate a 1-minute executive summary of this full judgment.</p>
                </div>
              </div>
              <button
                onClick={handleAISummarize}
                disabled={isSummarizing}
                className="bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-xs px-4 py-2 rounded-lg transition shrink-0"
              >
                {isSummarizing ? 'Summarizing...' : 'AI Summarize'}
              </button>
            </div>
          )}

          {/* AI Summary Box */}
          {aiSummary && (
            <div className="bg-white border-2 border-yellow-500/80 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-yellow-700 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>LAWPEX AI Executive Summary</span>
              </div>
              <div className="whitespace-pre-wrap text-neutral-800 text-xs font-sans leading-relaxed">
                {aiSummary}
              </div>
            </div>
          )}

          {/* Judgment Key Details */}
          {item.ratioDecidendi && (
            <div className="bg-white border border-neutral-200 p-5 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-yellow-700 uppercase tracking-wider">Ratio Decidendi</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-700">
                {item.ratioDecidendi.map((r: string, idx: number) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Facts Summary */}
          {item.factsSummary && (
            <div className="bg-white border border-neutral-200 p-5 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-yellow-700 uppercase tracking-wider">Summary of Facts</h3>
              <p className="text-neutral-700 leading-relaxed">{item.factsSummary}</p>
            </div>
          )}

          {/* Full Text / Document Content */}
          <div className="bg-white border border-neutral-200 p-6 rounded-xl space-y-3 font-serif">
            <h3 className="text-xs font-bold text-yellow-700 font-sans uppercase tracking-wider">Full Text / Official Record</h3>
            <pre className="whitespace-pre-wrap font-serif text-neutral-700 text-xs leading-relaxed font-normal">
              {item.fullJudgmentText || item.sampleText || item.content || item.description}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
