import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Menu, User, X } from 'lucide-react';
import { LogoMark } from './LogoMark';
import { pathForTab } from '../routes';
import { AuthMode } from './AuthModal';

interface NavbarProps {
  activeTab: string;
  openAuthModal: (mode?: AuthMode) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const PRIMARY_NAV = [
  { id: 'case-law', label: 'Cases' },
  { id: 'areas-of-law', label: 'Areas' },
  { id: 'court-rules', label: 'Rules' },
  { id: 'laws', label: 'Laws' },
  { id: 'appeals', label: 'Appeals' },
  { id: 'affidavits', label: 'Affidavits' },
  { id: 'practicals', label: 'Procedures' },
  { id: 'learn-litigation-ai', label: 'Learn AI' },
];

const MOBILE_NAV = [
  { id: 'case-law', label: 'Case Laws' },
  { id: 'areas-of-law', label: 'Areas of Law' },
  { id: 'court-rules', label: 'Rules' },
  { id: 'laws', label: 'Nigerian Laws' },
  { id: 'appeals', label: 'Appeals' },
  { id: 'affidavits', label: 'All Affidavits' },
  { id: 'practicals', label: 'Courtroom Procedures' },
  { id: 'learn-litigation-ai', label: 'Learn Litigation with AI' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  openAuthModal,
  isLoggedIn,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-amber-200 bg-white/88 text-neutral-950 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_18px_48px_-42px_rgba(180,126,18,0.38)] backdrop-blur-2xl">
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

        <nav className="hidden items-center gap-0.5 lg:flex">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.id}
              to={pathForTab(item.id)}
              className={`lawpex-focus-ring rounded-xl px-2.5 py-2 text-[11px] font-extrabold xl:px-3 xl:text-xs ${
                activeTab === item.id
                  ? 'bg-[#facc15] text-[#181411] shadow-[inset_0_1px_0_rgba(255,255,255,0.38)]'
                  : 'text-neutral-700 hover:-translate-y-0.5 hover:bg-yellow-50 hover:text-neutral-950'
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
            <Link
              to="/sign-in"
              className="lawpex-focus-ring inline-flex items-center gap-2 rounded-full bg-[#facc15] px-3 py-2 text-xs font-black text-[#181411] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] hover:-translate-y-0.5 hover:bg-[#fde047]"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {!isLoggedIn && (
            <Link
              to="/register"
              className="lawpex-focus-ring hidden rounded-full border border-amber-300 bg-white/86 px-3 py-2 text-xs font-black text-neutral-800 hover:-translate-y-0.5 hover:border-amber-500 hover:bg-yellow-50 sm:inline-flex"
            >
              Register
            </Link>
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
        <div className="border-t border-amber-200 bg-white/96 px-4 py-4 shadow-2xl backdrop-blur-2xl lg:hidden">
          {!isLoggedIn && (
            <div className="mb-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="lawpex-focus-ring rounded-xl bg-[#facc15] px-3 py-3 text-xs font-black text-[#181411]"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('register');
                }}
                className="lawpex-focus-ring rounded-xl border border-amber-300 bg-white px-3 py-3 text-xs font-black text-neutral-800"
              >
                Register
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {MOBILE_NAV.map((item) => (
              <Link
                key={item.id}
                to={pathForTab(item.id)}
                onClick={() => setMobileMenuOpen(false)}
                className={`lawpex-focus-ring flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold ${
                  activeTab === item.id
                    ? 'bg-[#facc15] text-[#181411]'
                    : 'border border-amber-200 bg-white/76 text-neutral-700'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
