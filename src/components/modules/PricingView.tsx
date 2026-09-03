import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { SubscriptionTier } from '../../types';

interface PricingViewProps {
  currentTier: SubscriptionTier;
  onUpgrade: (tier: SubscriptionTier) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ currentTier, onUpgrade }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'free' as SubscriptionTier,
      name: 'Free Trial',
      priceMonthly: '₦0',
      priceAnnual: '₦0',
      description: 'Ideal for law students and initial exploration of Nigerian statutes.',
      features: [
        '3 Ai Draft Wizard documents per day',
        'Access to basic 1999 Constitution & LFN',
        'Standard Case Law Search summaries',
        'Read-only draft template previews'
      ],
      cta: 'Current Tier',
      highlighted: false
    },
    {
      id: 'professional' as SubscriptionTier,
      name: 'Professional Counsel',
      priceMonthly: '₦25,000',
      priceAnnual: '₦240,000',
      description: 'Built for active legal practitioners, litigators, and SANs in solo practice.',
      features: [
        'UNLIMITED LAWPEX AI Litigation Research',
        'Full Judgment Texts & SC / CA Citations',
        'Unlimited Word / PDF Court Process Customization',
        'All 1,200+ Draft Processes & Affidavits',
        'S.84 Evidence Act & CAMA 2020 Ratio Extractor',
        'Courtroom Practicals Video Masterclasses'
      ],
      cta: 'Upgrade to Professional',
      highlighted: true
    },
    {
      id: 'chambers' as SubscriptionTier,
      name: 'Law Firm & Chambers',
      priceMonthly: '₦120,000',
      priceAnnual: '₦1,150,000',
      description: 'Designed for Law Firms, Chambers, and Corporate Legal Departments.',
      features: [
        'Includes 10 Practitioner Seats for Associates',
        'Shared Chambers Custom Draft Repository',
        'Centralized Firm Billing & Usage Analytics',
        'Priority AI Token Allocation',
        'Dedicated Legal Account Manager'
      ],
      cta: 'Upgrade Chambers Account',
      highlighted: false
    },
    {
      id: 'judiciary' as SubscriptionTier,
      name: 'Judiciary & Institutions',
      priceMonthly: 'Contact Enterprise',
      priceAnnual: 'Custom Quote',
      description: 'Custom bench research tools for Supreme Court, CA, and High Court Judges.',
      features: [
        'Judicial Bench Research Suite & Benchbooks',
        'Offline Local Encrypted Sync for Courtrooms',
        'Judicial Assistant AI for Judgment Summaries',
        'On-Premise or Private Cloud Deployment',
        '24/7 Priority Support'
      ],
      cta: 'Request Judicial Demo',
      highlighted: false
    }
  ];

  const comparisonRows = [
    ['Search allowance', 'Limited', 'Unlimited', 'Unlimited', 'Priority'],
    ['Ai Draft Wizard', 'Limited daily use', 'Full access', 'Priority pool', 'Bench suite'],
    ['Draft exports', 'Preview only', 'Word + PDF', 'Firm repository', 'Institutional exports'],
    ['Shared folders', 'No', 'Personal only', 'Included', 'Institutional'],
    ['Internal notes', 'No', 'Personal notes', 'Firm notes', 'Bench notes'],
    ['Verification', 'Student/evaluator', 'NBA optional', 'Firm admin', 'Judicial review'],
    ['Support', 'Community', 'Standard', 'Priority', 'Dedicated SLA'],
  ];

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="bg-yellow-400 text-neutral-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            LAWPEX SUBSCRIPTION PLANS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-neutral-900">
            Simple, Transparent Subscriptions for Nigerian Legal Practice
          </h1>
          <p className="text-sm text-neutral-600">
            Empower your law practice with Nigeria's #1 AI Legal Research & Litigation Engine.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-neutral-900' : 'text-neutral-500'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 bg-yellow-400 rounded-full p-1 transition-colors relative"
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold ${billingCycle === 'annual' ? 'text-neutral-900' : 'text-neutral-500'}`}>
              Annual Billing <span className="text-yellow-700 font-bold text-[10px]">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const isCurrent = currentTier === p.id;
            return (
              <div
                key={p.id}
                className={`relative rounded-2xl p-6 flex flex-col justify-between transition ${
                  p.highlighted
                    ? 'bg-yellow-100 border-2 border-yellow-400 shadow-2xl shadow-yellow-500/20'
                    : 'bg-yellow-100/60 border border-neutral-200'
                }`}
              >
                {p.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-neutral-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-black font-serif text-neutral-900">{p.name}</h3>
                  <p className="text-xs text-neutral-600 mt-1 min-h-[36px]">{p.description}</p>

                  <div className="mt-4 mb-6">
                    <span className="text-3xl font-black text-neutral-900 font-serif">
                      {billingCycle === 'monthly' ? p.priceMonthly : p.priceAnnual}
                    </span>
                    {p.priceMonthly !== '₦0' && p.priceMonthly !== 'Contact Enterprise' && (
                      <span className="text-xs text-neutral-500 ml-1">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                    )}
                  </div>

                  <ul className="space-y-3 border-t border-neutral-200 pt-4 text-xs text-neutral-700">
                    {p.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-200">
                  <button
                    onClick={() => {
                      onUpgrade(p.id);
                      alert(`Upgraded subscription to ${p.name}!`);
                    }}
                    disabled={isCurrent}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition ${
                      isCurrent
                        ? 'bg-yellow-100 text-neutral-600 cursor-default'
                        : p.highlighted
                        ? 'bg-yellow-400 hover:bg-yellow-300 text-neutral-950 shadow-lg shadow-yellow-500/25'
                        : 'bg-white hover:bg-yellow-100 text-neutral-900 border border-neutral-200'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : p.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <section className="mt-12 lawpex-card rounded-3xl p-6">
          <div className="mb-5 border-b border-amber-100 pb-4">
            <p className="lawpex-kicker">Plan comparison matrix</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-950">
              Access by role and workspace need
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-600">
              The PRD separates students, individual practitioners, chambers and judiciary users;
              this matrix makes the operational difference between plans visible.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-xs">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.14em] text-neutral-500">
                  <th className="border-b border-amber-100 p-3">Capability</th>
                  <th className="border-b border-amber-100 p-3">Free</th>
                  <th className="border-b border-amber-100 p-3">Professional</th>
                  <th className="border-b border-amber-100 p-3">Chambers</th>
                  <th className="border-b border-amber-100 p-3">Judiciary</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([capability, free, professional, chambers, judiciary]) => (
                  <tr key={capability}>
                    <td className="border-b border-amber-50 p-3 font-black text-neutral-950">{capability}</td>
                    {[free, professional, chambers, judiciary].map((value, index) => (
                      <td key={`${capability}-${index}`} className="border-b border-amber-50 p-3 text-neutral-600">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
