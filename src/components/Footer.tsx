import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { LogoMark } from './LogoMark';
import { pathForTab } from '../routes';

const LITIGATION_LINKS = [
  { id: 'ai-assistant', label: 'AI Legal Assistant' },
  { id: 'case-law', label: 'Case Law Library' },
  { id: 'court-rules', label: 'Court Rules' },
  { id: 'laws', label: 'Nigerian Laws' },
  { id: 'drafts', label: 'Legal Drafts' },
  { id: 'appeals', label: 'Appeals Centre' },
  { id: 'affidavits', label: 'Affidavits' },
];

const RESOURCE_LINKS = [
  { id: 'areas-of-law', label: 'Areas of Law' },
  { id: 'practicals', label: 'Courtroom Procedures' },
  { id: 'learn-litigation-ai', label: 'Learn Litigation with AI' },
  { id: 'articles', label: 'Legal Articles' },
  { id: 'compliance', label: 'Compliance Hub' },
  { id: 'learning', label: 'Learning Centre' },
  { id: 'pricing', label: 'Pricing' },
];

export const Footer: React.FC = () => (
  <footer className="border-t border-amber-200/80 bg-[#181411] text-white">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.8fr_0.8fr_1fr]">
        <div>
          <Link to="/" className="lawpex-focus-ring inline-flex items-center gap-3 rounded-xl">
            <LogoMark className="h-11 w-11 rounded-xl border border-amber-300/60" />
            <span>
              <span className="block text-2xl font-black tracking-tight">LAWPEX</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">
                Nigerian legal intelligence
              </span>
            </span>
          </Link>

          <p className="mt-5 max-w-sm text-sm leading-7 text-white/68">
            Litigation research, court processes, authorities, statutes, rules and AI drafting
            support for Nigerian legal work.
          </p>

          <div className="mt-5 space-y-2 text-xs text-white/62">
            <p className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              Abuja FCT and Lagos, Nigeria
            </p>
            <p className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              support@lawpex.ng
            </p>
          </div>
        </div>

        <FooterLinkGroup title="Litigation" links={LITIGATION_LINKS} />
        <FooterLinkGroup title="Resources" links={RESOURCE_LINKS} />

        <div className="lawpex-panel rounded-2xl p-5 text-[#181411]">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
            <div>
              <h3 className="text-sm font-black">Weekly Legal Digest</h3>
              <p className="mt-1 text-xs leading-6 text-neutral-700">
                New judgments, court-rule updates and drafting notes, sent every Monday.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="block">
              <span className="sr-only">Email address</span>
              <input
                type="email"
                placeholder="Email address"
                className="lawpex-focus-ring w-full rounded-xl border border-amber-200 bg-white px-3 py-3 text-xs font-medium text-neutral-900 placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
              />
            </label>
            <button
              onClick={() => alert('Thank you for subscribing to the LAWPEX Weekly Legal Digest.')}
              className="lawpex-focus-ring inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e6ad22] px-4 py-3 text-xs font-black text-[#181411] hover:bg-[#f0bd3b]"
            >
              Subscribe
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11px] text-white/48 md:flex-row md:items-center md:justify-between">
        <p>Copyright 2026 LAWPEX Legal AI Technologies. Developed by MVPXLAB.</p>
        <div className="flex flex-wrap gap-4">
          <span>Terms</span>
          <span>Privacy</span>
          <span>Bar Verification</span>
          <span>Judiciary SLA</span>
        </div>
      </div>
    </div>
  </footer>
);

const FooterLinkGroup: React.FC<{
  title: string;
  links: { id: string; label: string }[];
}> = ({ title, links }) => (
  <div>
    <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-amber-300">{title}</h3>
    <ul className="mt-4 space-y-2.5 text-sm text-white/68">
      {links.map((link) => (
        <li key={link.id}>
          <Link to={pathForTab(link.id)} className="lawpex-focus-ring rounded-md hover:text-white">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
