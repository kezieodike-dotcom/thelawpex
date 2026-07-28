import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Scale, User, Lock, Mail, Building, Award } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (barNumber: string, role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccessLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('lawyer');
  const [barNumber, setBarNumber] = useState('SCN/084251');
  const [email, setEmail] = useState('counsel@lawpex.ng');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Barr. O. J. Ademola, SAN');
  const [firmName, setFirmName] = useState('Ademola & Co. Legal Practitioners');
  const [isVerifyingBar, setIsVerifyingBar] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingBar(true);

    setTimeout(() => {
      setIsVerifyingBar(false);
      setVerifiedSuccess(true);
      setTimeout(() => {
        onSuccessLogin(barNumber, selectedRole);
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-neutral-900 border border-yellow-500/30 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="bg-neutral-950 p-6 border-b border-neutral-800 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center text-neutral-950 font-black shadow-md shadow-yellow-500/20">
              <Scale className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black font-serif text-white">
                {isRegister ? 'Create LAWPEX Account' : 'Sign In & Verify Bar'}
              </h2>
              <p className="text-xs text-yellow-400 font-medium">Supreme Court of Nigeria Roll Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Role selector tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Select Practitioner Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('lawyer')}
                className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition ${
                  selectedRole === 'lawyer'
                    ? 'bg-yellow-400 text-neutral-950 border-yellow-400'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                Lawyer / SAN
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('judge')}
                className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition ${
                  selectedRole === 'judge'
                    ? 'bg-yellow-400 text-neutral-950 border-yellow-400'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                Judicial Officer
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('law_firm')}
                className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition ${
                  selectedRole === 'law_firm'
                    ? 'bg-yellow-400 text-neutral-950 border-yellow-400'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                Chambers / Firm
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-3 text-xs text-white focus:outline-none focus:border-yellow-400"
                    placeholder="e.g. Barr. O. J. Ademola, SAN"
                  />
                </div>
              </div>
            )}

            {selectedRole === 'lawyer' && (
              <div>
                <label className="block text-xs font-medium text-yellow-400 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
                  Supreme Court Enrollment Bar Number (SCN)
                </label>
                <input
                  type="text"
                  required
                  value={barNumber}
                  onChange={(e) => setBarNumber(e.target.value)}
                  className="w-full bg-neutral-950 border border-yellow-500/40 rounded-lg py-2.5 px-3 text-xs text-yellow-300 font-mono font-bold focus:outline-none focus:border-yellow-400"
                  placeholder="e.g. SCN/084251"
                />
                <p className="text-[10px] text-neutral-400 mt-1">Authenticates status with Supreme Court of Nigeria database.</p>
              </div>
            )}

            {selectedRole === 'law_firm' && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Law Firm / Chambers Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-3 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-3 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-3 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            {verifiedSuccess ? (
              <div className="p-3 bg-green-500/10 border border-green-500/40 text-green-400 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Bar Verification Successful! Redirecting to Workspace...</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isVerifyingBar}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black py-3 rounded-xl text-xs transition shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
              >
                {isVerifyingBar ? (
                  <>
                    <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Nigerian Bar Registry...</span>
                  </>
                ) : (
                  <span>{isRegister ? 'Complete Verification & Register' : 'Authenticate & Sign In'}</span>
                )}
              </button>
            )}
          </form>

          <div className="mt-4 pt-4 border-t border-neutral-800 text-center text-xs text-neutral-400">
            {isRegister ? (
              <p>
                Already verified?{' '}
                <button onClick={() => setIsRegister(false)} className="text-yellow-400 font-bold hover:underline">
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                New Practitioner?{' '}
                <button onClick={() => setIsRegister(true)} className="text-yellow-400 font-bold hover:underline">
                  Register Account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
