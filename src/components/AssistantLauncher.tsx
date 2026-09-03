import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles } from 'lucide-react';
import { pathForTab } from '../routes';

export const AssistantLauncher: React.FC = () => (
  <Link
    to={pathForTab('ai-assistant')}
    aria-label="Open the Ai Draft Wizard"
    title="Ai Draft Wizard - prepare a legal document"
    className="lawpex-focus-ring group fixed bottom-5 right-4 z-30 flex items-center gap-3 rounded-2xl border border-amber-300/80 bg-[#181411] p-2 text-white shadow-[0_24px_60px_-32px_rgba(24,20,17,0.82)] hover:-translate-y-0.5 hover:border-amber-200 sm:right-6"
  >
    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e6ad22] text-[#181411]">
      <Bot className="h-5 w-5" />
      <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#181411] bg-emerald-400" />
    </span>
    <span className="hidden pr-2 text-left xl:block">
      <span className="flex items-center gap-1.5 text-sm font-black">
        Ai Draft Wizard
        <Sparkles className="h-3.5 w-3.5 text-amber-300" />
      </span>
      <span className="block text-[11px] font-medium text-white/62">Brief, generate, download</span>
    </span>
  </Link>
);
