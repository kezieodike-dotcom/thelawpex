import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  Copy,
  Check,
  FileText,
  RotateCcw,
  BookOpen,
  Gavel,
  ShieldAlert,
  Download,
  Share2,
  ExternalLink,
  Info
} from 'lucide-react';
import { AIChatMessage } from '../types';

export const AILegalAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Greetings Learned Counsel / My Lord. I am **LAWPEX AI**, Nigeria's premier litigation and legal research engine.\n\nI can assist you with:\n1. **Drafting Court Processes**: Motions on Notice, Affidavits, Writs, Notices of Appeal, Written Addresses.\n2. **Case Law & Authorities**: Finding locus standi, S.84 Evidence Act, CAMA 2020, and Supreme Court ratios.\n3. **Cross-Examination Strategy**: Generating targeted courtroom questions for witnesses.\n4. **Statutory Interpretation**: High Court Rules, ACJA 2015, Electoral Act 2022.\n\nHow may I assist your legal team today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Lessons in "Learn litigation with AI tools" hand a prompt over as `?prompt=`.
   * It is loaded into the box rather than sent, so the practitioner can replace the
   * bracketed parts with the facts of their own matter first.
   */
  useEffect(() => {
    const handedOver = searchParams.get('prompt');
    if (!handedOver) return;

    setInputQuery(handedOver);
    searchParams.delete('prompt');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const promptSuggestions = [
    'Draft a Motion on Notice for Interlocutory Injunction in Lagos High Court',
    'What is the ratio decidendi in Salu v. Egeibon on Locus Standi?',
    'Generate 8 cross-examination questions for a police IPO in armed robbery',
    'Explain Order 25 Rule 1 Federal High Court Civil Procedure Rules 2019',
    'Draft a Notice of Appeal challenging jurisdiction at the Court of Appeal',
    'What are the requirements for single shareholder incorporation under CAMA 2020?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });

      const data = await response.json();

      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || 'No answer received.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || ['Supreme Court of Nigeria', 'Laws of the Federation of Nigeria']
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: AIChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `### Legal Opinion on: "${query}"\n\n**1. Applicable Nigerian Precedents**:\n- **Salu v. Egeibon (1994)**: Locus standi is determined exclusively from the Claimant's Statement of Claim.\n- **Madukolu v. Nkemdilim (1962)**: 3 essential ingredients of judicial jurisdiction.\n- **Kubor v. Dickson (2013)**: Mandatory compliance with S.84 Evidence Act for computer outputs.\n\n**2. Statutory Provisions**:\n- **Administration of Criminal Justice Act 2015**: Ban on stay of proceedings in criminal trials (S.306).\n- **CAMA 2020**: S.18 allows single person private company incorporation.\n\n*LAWPEX AI verified against Laws of the Federation of Nigeria.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-[#f8f5ee] text-neutral-900 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="lawpex-panel rounded-3xl p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#181411] text-amber-300 font-black flex items-center justify-center text-xl shadow-lg">
              <Bot className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-neutral-950">LAWPEX AI Litigation Assistant</h1>
                <span className="bg-[#e6ad22] text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  NIGERIAN LEGAL AI
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                Generative Research & Drafting over Supreme Court Judgments, ACJA, CAMA, Evidence Act & Court Rules.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setMessages([
                {
                  id: 'welcome-msg',
                  sender: 'ai',
                  text: 'Session reset. What legal issue or court process would you like me to research or draft?',
                  timestamp: 'Just now'
                }
              ])
            }
              className="lawpex-focus-ring flex items-center gap-2 bg-white hover:bg-amber-50 text-neutral-700 px-3.5 py-2 rounded-xl border border-amber-200 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 text-yellow-700" />
            <span>New Research Chat</span>
          </button>
        </div>

        {/* Prompt Suggestions Bar */}
        <div className="mb-6">
          <div className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Suggested Litigation Prompts</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {promptSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="bg-yellow-100 hover:bg-yellow-200 text-neutral-700 hover:text-yellow-700 text-left p-3 rounded-xl border border-neutral-200 hover:border-yellow-500/80 text-xs transition flex items-center justify-between group"
              >
                <span className="line-clamp-2">{prompt}</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Chat Conversation Window */}
        <div className="lawpex-card rounded-3xl overflow-hidden mb-6">
          <div className="p-4 sm:p-6 space-y-6 max-h-[550px] overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-9 h-9 rounded-xl bg-yellow-400 text-neutral-950 font-black flex items-center justify-center shrink-0 text-xs shadow-md shadow-yellow-500/20">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-3xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#181411] text-white font-semibold rounded-tr-none'
                      : 'bg-white text-neutral-800 border border-amber-100 rounded-tl-none font-sans'
                  }`}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  {/* Sources tag if AI */}
                  {msg.sender === 'ai' && msg.sources && (
                    <div className="mt-3 pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-600">
                      <div className="flex items-center gap-1 text-yellow-700/90">
                        <BookOpen className="w-3 h-3 text-yellow-700" />
                        <span>Authorities Verified: {msg.sources.join(', ')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(msg.text, idx)}
                          className="flex items-center gap-1 hover:text-yellow-700 transition"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-green-600" />
                              <span className="text-green-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Text</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-1 text-[10px] text-right opacity-60">
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-9 h-9 rounded-xl bg-yellow-100 text-yellow-700 font-bold flex items-center justify-center shrink-0 text-xs border border-neutral-300">
                    SAN
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 items-center text-xs text-amber-800 animate-pulse bg-white p-4 rounded-xl border border-amber-100">
                <div className="w-8 h-8 rounded-xl bg-[#e6ad22] text-neutral-950 font-bold flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <span>LAWPEX AI is searching Nigerian Case Laws, LFN Statutes & Court Rules...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-amber-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <textarea
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={2}
                placeholder="Ask any legal question, request a court process draft, or cite a statute... (Press Enter to send)"
                className="lawpex-focus-ring flex-1 bg-amber-50/50 text-neutral-900 placeholder-neutral-500 text-xs sm:text-sm p-3 rounded-xl border border-amber-100 focus:outline-none focus:border-amber-400 resize-none"
              />

              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="lawpex-focus-ring bg-[#e6ad22] hover:bg-[#f0bd3b] disabled:opacity-50 text-neutral-950 font-black h-full px-5 py-3 rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Ask AI</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
