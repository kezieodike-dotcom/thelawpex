import React, { useState } from 'react';
import {
  Award,
  Building2,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Smartphone,
  Upload,
  User,
  X,
} from 'lucide-react';
import { LogoMark } from './LogoMark';
import { UserRole } from '../types';
import { AUTH_CAPABILITIES, USER_ROLE_OPTIONS } from '../data/platform';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (barNumber: string, role: UserRole) => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccessLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('lawyer');
  const [barNumber, setBarNumber] = useState('SCN/084251');
  const [email, setEmail] = useState('counsel@lawpex.ng');
  const [phone, setPhone] = useState('+234 803 458 0912');
  const [password, setPassword] = useState('lawpex-demo-pass');
  const [fullName, setFullName] = useState('Barr. O. J. Ademola, SAN');
  const [firmName, setFirmName] = useState('Ademola & Co. Legal Practitioners');
  const [otp, setOtp] = useState('428901');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const selectedRoleMeta = USER_ROLE_OPTIONS.find((role) => role.id === selectedRole);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (mode === 'forgot') {
        setSuccess('Password reset link generated. Check email and SMS channels.');
        return;
      }

      setSuccess(
        mode === 'register'
          ? 'Email verified, 2FA confirmed and role verification queued.'
          : 'Session authenticated with device tracking and 2FA.',
      );
      setTimeout(() => {
        onSuccessLogin(barNumber, selectedRole);
        onClose();
      }, 850);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/78 p-4 backdrop-blur-sm">
      <div className="lawpex-card grid max-h-[92vh] w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl text-neutral-900 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="hidden bg-[#181411] p-7 text-white lg:block">
          <div className="flex items-center gap-3">
            <LogoMark className="h-11 w-11 rounded-xl border border-amber-300/60" />
            <div>
              <div className="text-xl font-black tracking-tight">LAWPEX</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">
                Identity and access
              </div>
            </div>
          </div>

          <h2 className="mt-8 text-3xl font-black leading-tight tracking-tight">
            Secure access for counsel, chambers and the Bench.
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/64">
            The PRD requires role-aware registration, verification, 2FA and firm seat readiness.
            This flow models those states for the product.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-2">
            {AUTH_CAPABILITIES.map((capability) => (
              <div key={capability.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs">
                <span>{capability.label}</span>
                <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-black text-[#181411]">
                  {capability.priority}
                </span>
              </div>
            ))}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col bg-[#f8f5ee]">
          <div className="flex items-start justify-between gap-4 border-b border-amber-100 bg-white p-5">
            <div className="flex items-center gap-3">
              <LogoMark className="h-10 w-10 rounded-xl border border-amber-200 lg:hidden" />
              <div>
                <p className="lawpex-kicker">
                  {mode === 'login' ? 'Sign in' : mode === 'register' ? 'Register' : 'Password reset'}
                </p>
                <h2 className="mt-1 text-xl font-black tracking-tight text-neutral-950">
                  {mode === 'login'
                    ? 'Access your LAWPEX workspace'
                    : mode === 'register'
                    ? 'Create a verified account'
                    : 'Recover account access'}
                </h2>
              </div>
            </div>
            <button onClick={onClose} className="lawpex-focus-ring rounded-xl bg-amber-50 p-2 text-neutral-600 hover:text-neutral-950">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 overflow-y-auto p-5">
            <div className="mb-5 grid grid-cols-3 gap-2 rounded-2xl border border-amber-200 bg-white p-1">
              {[
                ['login', 'Login'],
                ['register', 'Register'],
                ['forgot', 'Forgot'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => {
                    setMode(id as AuthMode);
                    setSuccess('');
                  }}
                  className={`lawpex-focus-ring rounded-xl px-3 py-2 text-xs font-black ${
                    mode === id ? 'bg-[#181411] text-white' : 'text-neutral-600 hover:bg-amber-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode !== 'forgot' && (
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-neutral-600">
                    Practitioner category
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {USER_ROLE_OPTIONS.map((role) => (
                      <button
                        type="button"
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`lawpex-focus-ring rounded-2xl border p-3 text-left ${
                          selectedRole === role.id
                            ? 'border-amber-400 bg-amber-100 text-neutral-950'
                            : 'border-amber-100 bg-white text-neutral-700 hover:border-amber-300'
                        }`}
                      >
                        <span className="block text-xs font-black">{role.label}</span>
                        <span className="mt-1 block text-[11px] leading-5 text-neutral-500">{role.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <Field icon={User} label="Full legal name">
                  <input value={fullName} onChange={(event) => setFullName(event.target.value)} className="auth-input" required />
                </Field>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field icon={Mail} label="Email address">
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="auth-input" required />
                </Field>
                <Field icon={Phone} label="Phone number">
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} className="auth-input" required />
                </Field>
              </div>

              {mode !== 'forgot' && (
                <Field icon={Lock} label="Password">
                  <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="auth-input" required />
                </Field>
              )}

              {mode !== 'forgot' && selectedRole === 'lawyer' && (
                <Field icon={ShieldCheck} label="Supreme Court enrolment number">
                  <input value={barNumber} onChange={(event) => setBarNumber(event.target.value)} className="auth-input font-mono font-black text-amber-800" required />
                </Field>
              )}

              {mode !== 'forgot' && selectedRole === 'judge' && (
                <div className="rounded-2xl border border-amber-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <Upload className="mt-0.5 h-5 w-5 text-amber-700" />
                    <div>
                      <h3 className="text-sm font-black text-neutral-950">Judicial credential upload</h3>
                      <p className="mt-1 text-xs leading-5 text-neutral-600">
                        Manual admin review is required before judiciary-tier activation.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {mode !== 'forgot' && selectedRole === 'law_firm' && (
                <Field icon={Building2} label="Law firm / chambers name">
                  <input value={firmName} onChange={(event) => setFirmName(event.target.value)} className="auth-input" required />
                </Field>
              )}

              {mode !== 'forgot' && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field icon={Smartphone} label="2FA code">
                    <input value={otp} onChange={(event) => setOtp(event.target.value)} className="auth-input font-mono font-black" required />
                  </Field>
                  <div className="rounded-2xl border border-amber-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-xs font-black text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Email verification ready
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-neutral-500">
                      Subscription activation is held until verification completes.
                    </p>
                  </div>
                </div>
              )}

              {success && (
                <div className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="lawpex-focus-ring flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e6ad22] px-4 py-3 text-sm font-black text-[#181411] hover:bg-[#f0bd3b] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-[#181411]/30 border-t-[#181411]" />
                    Processing secure flow...
                  </>
                ) : mode === 'forgot' ? (
                  <>
                    <KeyRound className="h-4 w-4" />
                    Send reset link
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4" />
                    {mode === 'register' ? 'Verify and register' : 'Authenticate session'}
                  </>
                )}
              </button>
            </form>

            {selectedRoleMeta && mode !== 'forgot' && (
              <p className="mt-4 text-center text-xs leading-5 text-neutral-500">
                Selected access path: <strong className="text-neutral-800">{selectedRoleMeta.description}</strong>
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const Field: React.FC<{
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}> = ({ icon: Icon, label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-bold text-neutral-700">{label}</span>
    <span className="relative block">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700" />
      {children}
    </span>
  </label>
);
