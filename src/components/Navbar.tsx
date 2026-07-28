import React, { useState } from 'react';
import {
  Scale,
  Search,
  Bot,
  BookOpen,
  FileText,
  Gavel,
  ShieldCheck,
  UserCheck,
  Building,
  User,
  Sparkles,
  CheckCircle2,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Zap,
  GraduationCap
} from 'lucide-react';
import { UserRole, SubscriptionTier } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSearch: () => void;
  openAuthModal: () => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  subscription: SubscriptionTier;
  barNumber: string;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openSearch,
  openAuthModal,
  userRole,
  setUserRole,
  subscription,
  barNumber,
  isLoggedIn,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleLabels: Record<UserRole, { title: string; badge: string; color: string }> = {
    lawyer: { title: 'Legal Practitioner', badge: `Bar No: ${barNumber || 'SCN/10425'}`, color: 'bg-yellow-400 text-neutral-950' },
    judge: { title: 'Judiciary / Judge', badge: 'Verified Judicial Officer', color: 'bg-amber-500 text-neutral-950' },
    magistrate: { title: 'Magistrate Officer', badge: 'Verified Magistrate', color: 'bg-amber-400 text-neutral-950' },
    law_firm: { title: 'Law Firm Chambers', badge: 'Multi-User Firm Account', color: 'bg-yellow-500 text-neutral-950' },
    student: { title: 'Law Student / Scholar', badge: 'Academic Tier', color: 'bg-neutral-800 text-yellow-400 border border-yellow-400/40' },
    compliance_officer: { title: 'Compliance Officer', badge: 'Corporate Legal', color: 'bg-neutral-800 text-yellow-400 border border-yellow-400/40' },
    admin: { title: 'Super Admin', badge: 'System Admin', color: 'bg-red-500 text-white' }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'ai-assistant', label: 'AI Assistant', badge: 'NEW' },
    { id: 'areas-of-law', label: 'Areas of Law' },
    { id: 'case-law', label: 'Case Law' },
    { id: 'court-rules', label: 'Court Rules' },
    { id: 'drafts', label: 'Draft Library' },
    { id: 'appeals', label: 'Appeals' },
    { id: 'laws', label: 'Nigerian Laws' },
    { id: 'practicals', label: 'Court Practicals' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'learning', label: 'Learning' },
    { id: 'pricing', label: 'Pricing' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/95 backdrop-blur-md border-b border-yellow-500/20 text-white">
      {/* Top Bar for Verification & Bar Status */}
      <div className="bg-neutral-900 border-b border-neutral-800 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center text-neutral-300">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-yellow-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Nigeria's Premier Legal AI Ecosystem
          </span>
          <span className="hidden md:inline text-neutral-600">|</span>
          <span className="hidden md:inline text-neutral-400">
            Includes Supreme Court, Court of Appeal, FHC, NICN & 36 States High Court Rules
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2.5 py-1 rounded text-xs transition border border-neutral-700"
            >
              <UserCheck className="w-3 h-3 text-yellow-400" />
              <span>Role: <strong className="text-yellow-400">{roleLabels[userRole].title}</strong></span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-60 bg-neutral-900 border border-yellow-500/30 rounded-lg shadow-xl z-50 py-2">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                  Switch Role / View Context
                </div>
                {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setUserRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-800 transition ${userRole === r ? 'text-yellow-400 font-bold bg-neutral-800/60' : 'text-neutral-300'}`}
                  >
                    <span>{roleLabels[r].title}</span>
                    {userRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subscription Status Tag */}
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 font-medium text-[11px]">
            <Zap className="w-3 h-3" />
            {subscription.toUpperCase()} PLAN
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 group focus:outline-none text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center text-neutral-950 font-black shadow-lg shadow-yellow-500/20 group-hover:bg-yellow-300 transition-all">
            <Scale className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white font-serif">LAWPEX</span>
              <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-1.5 py-0.2 rounded uppercase">AI</span>
            </div>
            <p className="text-[10px] text-yellow-400 font-medium tracking-wide uppercase">Litigation & Legal Research</p>
          </div>
        </button>

        {/* Global Search Bar Button */}
        <button
          onClick={openSearch}
          className="hidden md:flex items-center gap-3 bg-neutral-900 hover:bg-neutral-800/90 text-neutral-400 border border-neutral-700/80 px-4 py-2 rounded-xl text-sm w-72 lg:w-96 transition text-left group hover:border-yellow-500/40"
        >
          <Search className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
          <span className="flex-1 truncate">Search case law, statutes, court rules, drafts...</span>
          <kbd className="hidden lg:inline bg-neutral-800 text-neutral-400 px-1.5 py-0.5 text-[10px] rounded border border-neutral-700">⌘K</kbd>
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'ai-assistant'
                ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-500/20'
                : 'text-yellow-400 hover:bg-yellow-400/10'
            }`}
          >
            <Bot className="w-4 h-4" />
            AI Legal Assistant
          </button>

          <button
            onClick={() => setActiveTab('areas-of-law')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'areas-of-law' ? 'bg-neutral-800 text-yellow-400 font-semibold' : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Areas of Law
          </button>

          <button
            onClick={() => setActiveTab('case-law')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'case-law' ? 'bg-neutral-800 text-yellow-400 font-semibold' : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Case Law
          </button>

          <button
            onClick={() => setActiveTab('court-rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'court-rules' ? 'bg-neutral-800 text-yellow-400 font-semibold' : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Court Rules
          </button>

          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'drafts' ? 'bg-neutral-800 text-yellow-400 font-semibold' : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Drafts
          </button>

          <button
            onClick={() => setActiveTab('appeals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'appeals' ? 'bg-neutral-800 text-yellow-400 font-semibold' : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Appeals
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
              activeTab === 'dashboard'
                ? 'bg-neutral-800 border-yellow-400 text-yellow-400'
                : 'border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-yellow-400" />
            Dashboard
          </button>
        </nav>

        {/* Auth / Account Actions */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-lg border border-yellow-500/30 text-xs transition"
              >
                <div className="w-6 h-6 rounded-full bg-yellow-400 text-neutral-950 font-bold flex items-center justify-center text-xs">
                  {barNumber ? 'SCN' : 'ADV'}
                </div>
                <span className="hidden sm:inline font-medium">My Workspace</span>
              </button>

              <button
                onClick={onLogout}
                className="text-neutral-400 hover:text-white text-xs px-2 py-1"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs px-4 py-2 rounded-lg shadow-md shadow-yellow-500/20 transition flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              Sign In / Verify Bar
            </button>
          )}

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-300 hover:text-yellow-400 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-yellow-500/20 px-4 py-4 space-y-2">
          <button
            onClick={openSearch}
            className="w-full flex items-center gap-2 bg-neutral-900 text-neutral-400 p-2.5 rounded-lg text-xs border border-neutral-800"
          >
            <Search className="w-4 h-4 text-yellow-400" />
            <span>Search LAWPEX Library...</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                  activeTab === item.id ? 'bg-yellow-400 text-neutral-950 font-bold' : 'text-neutral-300 bg-neutral-900'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-yellow-500 text-neutral-950 text-[9px] px-1.5 py-0.5 rounded font-black">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
