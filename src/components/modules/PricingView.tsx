import React, { useState } from 'react';
import { Check, Zap, ShieldCheck, Scale, Building, Users, Award, Sparkles } from 'lucide-react';
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
        '3 AI Legal Assistant Queries per day',
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

  return (
    <div className="bg-neutral-950 text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="bg-yellow-400 text-neutral-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            LAWPEX SUBSCRIPTION PLANS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-white">
            Simple, Transparent Subscriptions for Nigerian Legal Practice
          </h1>
          <p className="text-sm text-neutral-400">
            Empower your law practice with Nigeria's #1 AI Legal Research & Litigation Engine.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-neutral-500'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 bg-yellow-400 rounded-full p-1 transition-colors relative"
            >
              <div
                className={`w-4 h-4 bg-neutral-950 rounded-full transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold ${billingCycle === 'annual' ? 'text-white' : 'text-neutral-500'}`}>
              Annual Billing <span className="text-yellow-400 font-bold text-[10px]">(Save 20%)</span>
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
                    ? 'bg-neutral-900 border-2 border-yellow-400 shadow-2xl shadow-yellow-500/10'
                    : 'bg-neutral-900/60 border border-neutral-800'
                }`}
              >
                {p.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-neutral-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-black font-serif text-white">{p.name}</h3>
                  <p className="text-xs text-neutral-400 mt-1 min-h-[36px]">{p.description}</p>

                  <div className="mt-4 mb-6">
                    <span className="text-3xl font-black text-white font-serif">
                      {billingCycle === 'monthly' ? p.priceMonthly : p.priceAnnual}
                    </span>
                    {p.priceMonthly !== '₦0' && p.priceMonthly !== 'Contact Enterprise' && (
                      <span className="text-xs text-neutral-500 ml-1">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                    )}
                  </div>

                  <ul className="space-y-3 border-t border-neutral-800 pt-4 text-xs text-neutral-300">
                    {p.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-800">
                  <button
                    onClick={() => {
                      onUpgrade(p.id);
                      alert(`Upgraded subscription to ${p.name}!`);
                    }}
                    disabled={isCurrent}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition ${
                      isCurrent
                        ? 'bg-neutral-800 text-neutral-400 cursor-default'
                        : p.highlighted
                        ? 'bg-yellow-400 hover:bg-yellow-300 text-neutral-950 shadow-lg shadow-yellow-500/20'
                        : 'bg-neutral-950 hover:bg-neutral-800 text-white border border-neutral-800'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : p.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
