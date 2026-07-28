import React from 'react';
import { Scale, Mail, Phone, MapPin, Shield, BookOpen, Award, CheckCircle } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-yellow-500/20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-yellow-400 flex items-center justify-center text-neutral-950 font-black shadow-md shadow-yellow-500/20">
                <Scale className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-black text-white font-serif tracking-tight">LAWPEX</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Nigeria's Premier AI-Powered Litigation & Legal Research Platform. Built specifically for Senior Advocates, Legal Practitioners, Judges, Magistrates, Law Firms, and Scholars across all 36 States and the FCT.
            </p>

            <div className="flex items-center gap-2 text-xs text-yellow-400 font-medium">
              <Shield className="w-4 h-4 text-yellow-400" />
              <span>Verified Data: LFN 2004, CAMA 2020, Evidence Act 2011, Supreme Court Judgments</span>
            </div>

            <div className="pt-2 flex flex-col gap-1 text-xs text-neutral-500">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                LAWPEX Towers, Central Business District, Abuja FCT / Victoria Island, Lagos
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-yellow-400" />
                support@lawpex.ng | research@lawpex.ng
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-yellow-400" />
                +234 (0) 700-LAWPEX-NG (+234 700 5297 3964)
              </p>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-yellow-500/30 pb-1">
              Litigation Modules
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('ai-assistant')} className="hover:text-yellow-400 transition">
                  AI Legal Assistant
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('case-law')} className="hover:text-yellow-400 transition">
                  Case Law Library (Supreme Court & CA)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('court-rules')} className="hover:text-yellow-400 transition">
                  Court Rules (FHC, NICN, 36 States)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('laws')} className="hover:text-yellow-400 transition">
                  Laws of the Federation (LFN)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('drafts')} className="hover:text-yellow-400 transition">
                  Legal Draft Templates & Writs
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('appeals')} className="hover:text-yellow-400 transition">
                  Appeals Centre & Notices
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('affidavits')} className="hover:text-yellow-400 transition">
                  Affidavits Library
                </button>
              </li>
            </ul>
          </div>

          {/* Education & Resources */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-yellow-500/30 pb-1">
              Education & Compliance
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('practicals')} className="hover:text-yellow-400 transition">
                  Courtroom Practicals Videos
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('articles')} className="hover:text-yellow-400 transition">
                  Peer-Reviewed Legal Articles
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('compliance')} className="hover:text-yellow-400 transition">
                  Corporate Compliance Hub (SCUML/NDPR)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('learning')} className="hover:text-yellow-400 transition">
                  Learning Centre & Certifications
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('pricing')} className="hover:text-yellow-400 transition">
                  Chambers & Judiciary Subscription
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-yellow-400 transition">
                  Admin Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Weekly Legal Digest */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-yellow-500/30 pb-1">
              Weekly Legal Digest
            </h3>
            <p className="text-xs text-neutral-400 mb-3">
              Receive new Supreme Court judgments, statutory amendments, and court rule updates in your inbox every Monday.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email address..."
                className="w-full bg-neutral-900 border border-neutral-700 text-xs px-3 py-2 rounded text-white focus:outline-none focus:border-yellow-400"
              />
              <button
                onClick={() => alert('Thank you for subscribing to the LAWPEX Weekly Legal Digest!')}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-neutral-950 text-xs font-bold py-2 rounded transition"
              >
                Subscribe Free
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-neutral-500 gap-4">
          <p>© 2026 LAWPEX Legal AI Technologies. Developed by MVPXLAB. All Rights Reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-neutral-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-400 cursor-pointer">Bar Verification Portal</span>
            <span className="hover:text-neutral-400 cursor-pointer">Judiciary SLA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
