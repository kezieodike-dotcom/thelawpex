import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BookMarked,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Download,
  FileCheck2,
  GraduationCap,
  KeyRound,
  Landmark,
  Lock,
  Mail,
  MessageSquareText,
  Phone,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  User,
  X,
} from 'lucide-react';
import { LogoMark } from './LogoMark';
import { SubscriptionTier, UserRole } from '../types';
import { AUTH_CAPABILITIES, SUBSCRIPTION_USAGE, USER_ROLE_OPTIONS } from '../data/platform';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (barNumber: string, role: UserRole) => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

const WORKSPACE_ENTITLEMENTS = [
  { label: 'Profile', detail: 'Role, jurisdiction and verification status', icon: BadgeCheck },
  { label: 'Bookmarks', detail: 'Saved cases, statutes, rules and drafts', icon: BookMarked },
  { label: 'Downloads', detail: 'Full export history and working documents', icon: Download },
  { label: 'Subscription', detail: 'Plan, seats, invoices and renewals', icon: ReceiptText },
  { label: 'Certificates', detail: 'Learning Centre credentials earned', icon: GraduationCap },
  { label: 'Saved AI chats', detail: 'Persistent litigation assistant threads', icon: MessageSquareText },
];

const PLAN_LABELS: Record<SubscriptionTier, string> = {
  free: 'Free preview',
  professional: 'Professional',
  chambers: 'Chambers',
  judiciary: 'Judiciary',
};

const ROLE_ICON: Partial<Record<UserRole, React.ElementType>> = {
  lawyer: BriefcaseBusiness,
  judge: Landmark,
  magistrate: Landmark,
  law_firm: Building2,
  student: GraduationCap,
  compliance_officer: ShieldCheck,
};

const MODE_COPY: Record<AuthMode, { kicker: string; title: string; body: string; action: string }> = {
  login: {
    kicker: 'Secure sign in',
    title: 'Continue to your LAWPEX workspace',
    body: 'Authenticate your legal workspace with role context, device tracking and two-factor confirmation.',
    action: 'Authenticate workspace',
  },
  register: {
    kicker: 'Verified onboarding',
    title: 'Create a LAWPEX account',
    body: 'Set up your identity, professional category, verification route and subscription readiness.',
    action: 'Verify and create account',
  },
  forgot: {
    kicker: 'Account recovery',
    title: 'Recover secure access',
    body: 'Generate a reset link for the email and phone number attached to your LAWPEX profile.',
    action: 'Send reset link',
  },
};

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccessLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('lawyer');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>('professional');
  const [barNumber, setBarNumber] = useState('SCN/084251');
  const [email, setEmail] = useState('counsel@lawpex.ng');
  const [phone, setPhone] = useState('+234 803 458 0912');
  const [password, setPassword] = useState('lawpex-demo-pass');
  const [fullName, setFullName] = useState('Barr. O. J. Ademola, SAN');
  const [firmName, setFirmName] = useState('Ademola & Co. Legal Practitioners');
  const [jurisdiction, setJurisdiction] = useState('Lagos State');
  const [practiceArea, setPracticeArea] = useState('Civil Litigation');
  const [otp, setOtp] = useState('428901');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const modeCopy = MODE_COPY[mode];
  const selectedRoleMeta = USER_ROLE_OPTIONS.find((role) => role.id === selectedRole);
  const selectedUsage = SUBSCRIPTION_USAGE[selectedPlan];
  const selectedRoleIcon = ROLE_ICON[selectedRole] || User;

  const verificationRoute = useMemo(() => {
    if (mode === 'forgot') return 'Reset link and device confirmation';
    if (selectedRole === 'lawyer') return 'SCN enrolment number and email verification';
    if (selectedRole === 'judge' || selectedRole === 'magistrate') {
      return 'Judicial credential review before full activation';
    }
    if (selectedRole === 'law_firm') return 'Chambers profile, seat owner and billing verification';
    if (selectedRole === 'student') return 'Email verification and learning profile setup';
    return 'Corporate identity and compliance role verification';
  }, [mode, selectedRole]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (mode === 'forgot') {
        setSuccess('Reset instructions generated for the verified email and phone channels.');
        return;
      }

      setSuccess(
        mode === 'register'
          ? 'Identity captured. Verification route, plan and workspace profile are queued.'
          : 'Session authenticated. Workspace profile and saved work are being restored.',
      );

      setTimeout(() => {
        onSuccessLogin(barNumber, selectedRole);
        onClose();
      }, 850);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#181411]/62 p-3 backdrop-blur-sm sm:p-4">
      <div className="grid max-h-[94vh] w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[2rem] border border-amber-200 bg-white text-[#181411] shadow-[0_34px_100px_-62px_rgba(24,20,17,0.78)] lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative hidden overflow-hidden bg-[#fff9d7] p-7 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(250,204,21,0.54),transparent_20rem),radial-gradient(circle_at_90%_20%,rgba(125,211,252,0.22),transparent_18rem)]" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <LogoMark className="h-11 w-11 rounded-xl border border-amber-300/80 bg-white shadow-sm" />
              <div>
                <div className="text-xl font-black tracking-tight">LAWPEX</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800">
                  Verified legal access
                </div>
              </div>
            </div>

            <h2 className="mt-8 max-w-sm text-3xl font-black leading-tight tracking-tight">
              Enter the member workspace with your role, plan and verification intact.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-neutral-700">
              The PRD places every signed-in user inside a personalised legal workspace: profile,
              bookmarks, downloads, subscription status, certificates and saved AI chats.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-2">
              {WORKSPACE_ENTITLEMENTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-amber-200 bg-white/76 p-3 shadow-sm">
                    <Icon className="h-4 w-4 text-amber-700" />
                    <div className="mt-2 text-xs font-black">{item.label}</div>
                    <div className="mt-1 text-[11px] leading-5 text-neutral-500">{item.detail}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50/86 p-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-sky-800">
                <FileCheck2 className="h-4 w-4" />
                Current verification path
              </div>
              <p className="mt-2 text-sm font-black text-[#181411]">{verificationRoute}</p>
              <p className="mt-2 text-xs leading-5 text-neutral-600">
                Admin review remains available for judiciary and institutional accounts.
              </p>
            </div>
          </div>
        </aside>

        <section className="flex min-h-0 flex-col bg-[#fffdf6]">
          <div className="flex items-start justify-between gap-4 border-b border-amber-100 bg-white/86 p-5">
            <div className="flex items-center gap-3">
              <LogoMark className="h-10 w-10 rounded-xl border border-amber-200 bg-white lg:hidden" />
              <div>
                <p className="lawpex-kicker">{modeCopy.kicker}</p>
                <h2 className="mt-1 text-xl font-black tracking-tight text-[#181411]">
                  {modeCopy.title}
                </h2>
                <p className="mt-1 max-w-xl text-xs leading-5 text-neutral-500">{modeCopy.body}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lawpex-focus-ring rounded-xl bg-amber-50 p-2 text-neutral-600 hover:bg-yellow-100 hover:text-neutral-950"
              aria-label="Close authentication modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 overflow-y-auto p-5">
            <div className="mb-5 grid grid-cols-3 gap-2 rounded-2xl border border-amber-200 bg-white p-1">
              {([
                ['login', 'Sign in'],
                ['register', 'Register'],
                ['forgot', 'Recover'],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => {
                    setMode(id);
                    setSuccess('');
                  }}
                  className={`lawpex-focus-ring rounded-xl px-3 py-2 text-xs font-black ${
                    mode === id ? 'bg-[#facc15] text-[#181411]' : 'text-neutral-600 hover:bg-amber-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode !== 'forgot' && (
                <section>
                  <StepHeader number="01" title="Choose access category" />
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {USER_ROLE_OPTIONS.map((role) => {
                      const RoleIcon = ROLE_ICON[role.id] || User;
                      return (
                        <button
                          type="button"
                          key={role.id}
                          onClick={() => {
                            setSelectedRole(role.id);
                            if (role.id === 'judge' || role.id === 'magistrate') setSelectedPlan('judiciary');
                            if (role.id === 'law_firm') setSelectedPlan('chambers');
                          }}
                          className={`lawpex-focus-ring rounded-2xl border p-3 text-left ${
                            selectedRole === role.id
                              ? 'border-amber-400 bg-yellow-100 text-neutral-950'
                              : 'border-amber-100 bg-white text-neutral-700 hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 ring-1 ring-amber-200">
                              <RoleIcon className="h-4 w-4" />
                            </span>
                            <span>
                              <span className="block text-xs font-black">{role.label}</span>
                              <span className="mt-1 block text-[11px] leading-5 text-neutral-500">
                                {role.description}
                              </span>
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              <section>
                <StepHeader number={mode === 'forgot' ? '01' : '02'} title="Identity details" />
                {mode === 'register' && (
                  <Field icon={User} label="Full legal name">
                    <input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="auth-input"
                      required
                    />
                  </Field>
                )}

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field icon={Mail} label="Email address">
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="auth-input"
                      required
                    />
                  </Field>
                  <Field icon={Phone} label="Phone number">
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="auth-input"
                      required
                    />
                  </Field>
                </div>

                {mode !== 'forgot' && (
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field icon={Lock} label="Password">
                      <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="auth-input"
                        required
                      />
                    </Field>
                    <Field icon={Landmark} label="Primary jurisdiction">
                      <input
                        value={jurisdiction}
                        onChange={(event) => setJurisdiction(event.target.value)}
                        className="auth-input"
                        required
                      />
                    </Field>
                  </div>
                )}
              </section>

              {mode !== 'forgot' && (
                <section>
                  <StepHeader number="03" title="Verification and workspace setup" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {selectedRole === 'lawyer' && (
                      <Field icon={ShieldCheck} label="Supreme Court enrolment number">
                        <input
                          value={barNumber}
                          onChange={(event) => setBarNumber(event.target.value)}
                          className="auth-input font-mono font-black text-amber-800"
                          required
                        />
                      </Field>
                    )}

                    {(selectedRole === 'judge' || selectedRole === 'magistrate') && (
                      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                        <div className="flex items-start gap-3">
                          <FileCheck2 className="mt-0.5 h-5 w-5 text-sky-700" />
                          <div>
                            <h3 className="text-sm font-black text-neutral-950">
                              Judicial credential review
                            </h3>
                            <p className="mt-1 text-xs leading-5 text-neutral-600">
                              Registry, court and appointment details are reviewed before judiciary access.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedRole === 'law_firm' && (
                      <Field icon={Building2} label="Law firm / chambers name">
                        <input
                          value={firmName}
                          onChange={(event) => setFirmName(event.target.value)}
                          className="auth-input"
                          required
                        />
                      </Field>
                    )}

                    <Field icon={BriefcaseBusiness} label="Practice focus">
                      <input
                        value={practiceArea}
                        onChange={(event) => setPracticeArea(event.target.value)}
                        className="auth-input"
                        required
                      />
                    </Field>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field icon={Smartphone} label="Two-factor code">
                      <input
                        value={otp}
                        onChange={(event) => setOtp(event.target.value)}
                        className="auth-input font-mono font-black"
                        required
                      />
                    </Field>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex items-center gap-2 text-xs font-black text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        Email verification ready
                      </div>
                      <p className="mt-2 text-[11px] leading-5 text-neutral-500">
                        Full workspace activation follows identity, role and billing checks.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {mode !== 'forgot' && (
                <section>
                  <StepHeader number="04" title="Subscription readiness" />
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {(Object.keys(SUBSCRIPTION_USAGE) as SubscriptionTier[]).map((plan) => (
                      <button
                        type="button"
                        key={plan}
                        onClick={() => setSelectedPlan(plan)}
                        className={`lawpex-focus-ring rounded-2xl border p-3 text-left ${
                          selectedPlan === plan
                            ? 'border-amber-400 bg-yellow-100'
                            : 'border-amber-100 bg-white hover:border-amber-300'
                        }`}
                      >
                        <span className="block text-xs font-black">{PLAN_LABELS[plan]}</span>
                        <span className="mt-1 block text-[11px] leading-5 text-neutral-500">
                          {SUBSCRIPTION_USAGE[plan].searches} searches, {SUBSCRIPTION_USAGE[plan].downloads} downloads
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 rounded-2xl border border-amber-200 bg-white p-4">
                    <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                      <Usage label="Searches" value={selectedUsage.searches} />
                      <Usage label="AI" value={selectedUsage.ai} />
                      <Usage label="Downloads" value={selectedUsage.downloads} />
                      <Usage label="Seats" value={selectedUsage.seats} />
                    </div>
                  </div>
                </section>
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
                className="lawpex-focus-ring flex w-full items-center justify-center gap-2 rounded-2xl bg-[#facc15] px-4 py-3 text-sm font-black text-[#181411] shadow-[inset_0_1px_0_rgba(255,255,255,0.42)] hover:bg-[#fde047] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-[#181411]/30 border-t-[#181411]" />
                    Processing secure flow...
                  </>
                ) : mode === 'forgot' ? (
                  <>
                    <KeyRound className="h-4 w-4" />
                    {modeCopy.action}
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    {modeCopy.action}
                  </>
                )}
              </button>
            </form>

            {mode !== 'forgot' && selectedRoleMeta && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-white/72 p-3 text-xs leading-5 text-neutral-600">
                {React.createElement(selectedRoleIcon, {
                  className: 'mr-2 inline h-4 w-4 align-[-3px] text-amber-700',
                })}
                Selected path: <strong className="text-neutral-900">{selectedRoleMeta.description}</strong>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const StepHeader: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <div className="mb-2 flex items-center gap-2">
    <span className="rounded-full bg-[#181411] px-2 py-1 text-[10px] font-black text-yellow-200">
      {number}
    </span>
    <h3 className="text-xs font-black uppercase tracking-[0.14em] text-neutral-600">{title}</h3>
  </div>
);

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

const Usage: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-[10px] font-black uppercase tracking-[0.12em] text-neutral-500">{label}</div>
    <div className="mt-1 font-black text-[#181411]">{value}</div>
  </div>
);
