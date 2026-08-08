import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Menu, Search, User, X } from 'lucide-react';
import { LogoMark } from './LogoMark';
import { pathForTab } from '../routes';

interface NavbarProps {
  activeTab: string;
  openSearch: () => void;
  openAuthModal: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const PRIMARY_NAV = [
  { id: 'areas-of-law', label: 'Areas' },
  { id: 'case-law', label: 'Cases' },
  { id: 'court-rules', label: 'Rules' },
  { id: 'drafts', label: 'Drafts' },
  { id: 'appeals', label: 'Appeals' },
];

const MOBILE_NAV = [
  { id: 'home', label: 'Home' },
  { id: 'ai-assistant', label: 'AI Assistant', badge: 'New' },
  { id: 'areas-of-law', label: 'Areas of Law' },
  { id: 'case-law', label: 'Case Law' },
  { id: 'court-rules', label: 'Court Rules' },
  { id: 'laws', label: 'Nigerian Laws' },
  { id: 'drafts', label: 'Draft Library' },
  { id: 'affidavits', label: 'Affidavits' },
  { id: 'practicals', label: 'Courtroom Procedures' },
  { id: 'learn-litigation-ai', label: 'Learn Litigation with AI', badge: 'New' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'learning', label: 'Learning' },
  { id: 'pricing', label: 'Pricing' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  openSearch,
  openAuthModal,
  isLoggedIn,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-amber-200/80 bg-[#fbf8f1]/86 text-neutral-950 shadow-[0_1px_0_rgba(255,255,255,0.82)_inset,0_18px_48px_-40px_rgba(24,20,17,0.55)] backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="LAWPEX home" className="lawpex-focus-ring flex items-center gap-3 rounded-xl">
          <LogoMark className="h-10 w-10 rounded-xl border border-amber-300/80 shadow-sm" />
          <span className="leading-none">
            <span className="block text-xl font-black tracking-tight">LAWPEX</span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800 sm:block">
              Litigation workspace
            </span>
          </span>
        </Link>

        <button
          onClick={openSearch}
          className="lawpex-focus-ring hidden min-w-0 flex-1 items-center gap-3 rounded-2xl border border-amber-200 bg-white/82 px-4 py-2.5 text-left text-sm text-neutral-600 shadow-sm hover:-translate-y-0.5 hover:border-amber-400 hover:bg-white md:flex lg:max-w-md"
        >
          <Search className="h-4 w-4 shrink-0 text-amber-700" />
          <span className="truncate">Search cases, statutes, rules and drafts</span>
          <kbd className="ml-auto rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-neutral-500">
            Ctrl K
          </kbd>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.id}
              to={pathForTab(item.id)}
              className={`lawpex-focus-ring rounded-xl px-3 py-2 text-xs font-extrabold ${
                activeTab === item.id
                  ? 'bg-[#181411] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                  : 'text-neutral-700 hover:-translate-y-0.5 hover:bg-white/82 hover:text-neutral-950'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="lawpex-focus-ring inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white/82 px-3 py-2 text-xs font-black text-neutral-800 hover:-translate-y-0.5 hover:border-amber-400 hover:bg-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              className="lawpex-focus-ring inline-flex items-center gap-2 rounded-xl bg-[#d9a21d] px-3 py-2 text-xs font-black text-[#181411] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] hover:-translate-y-0.5 hover:bg-[#f0c85a]"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            className="lawpex-focus-ring rounded-xl border border-amber-200 bg-white/82 p-2 text-neutral-800 hover:border-amber-400 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-amber-200/80 bg-[#fbf8f1]/96 px-4 py-4 shadow-2xl backdrop-blur-2xl lg:hidden">
          <button
            onClick={() => {
              openSearch();
              setMobileMenuOpen(false);
            }}
            className="lawpex-focus-ring flex w-full items-center gap-2 rounded-2xl border border-amber-200 bg-white p-3 text-left text-xs font-bold text-neutral-600"
          >
            <Search className="h-4 w-4 text-amber-700" />
            Search LAWPEX Library
          </button>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {MOBILE_NAV.map((item) => (
              <Link
                key={item.id}
                to={pathForTab(item.id)}
                onClick={() => setMobileMenuOpen(false)}
                className={`lawpex-focus-ring flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold ${
                  activeTab === item.id
                    ? 'bg-[#181411] text-white'
                    : 'border border-amber-200 bg-white/76 text-neutral-700'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-[#e6ad22] px-2 py-0.5 text-[9px] font-black uppercase text-[#181411]">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
