import React, { useState } from 'react';
import { Shield, Users, Scale, FileText, Database, Activity, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'content'>('overview');

  const verificationQueue = [
    {
      id: 'usr-101',
      name: 'Barr. Temitope Alabi',
      barNumber: 'SCN/092104',
      yearEnrolled: '2016',
      firm: 'Alabi & Partners, Abuja',
      status: 'Pending SCN Verification'
    },
    {
      id: 'usr-102',
      name: 'Dr. Chika Ike, SAN',
      barNumber: 'SCN/041029',
      yearEnrolled: '2004',
      firm: 'Ike & Associates, Port Harcourt',
      status: 'Pending SCN Verification'
    }
  ];

  return (
    <div className="bg-neutral-950 text-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-neutral-900 border border-yellow-500/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-400" />
              <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
                LAWPEX PLATFORM ADMIN
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif text-white mt-1">Super Admin Control Center</h1>
            <p className="text-xs text-neutral-400">System metrics, Supreme Court roll verification, and content indexing.</p>
          </div>

          <div className="flex gap-2">
            {['overview', 'verifications', 'content'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                  activeTab === tab ? 'bg-yellow-400 text-neutral-950' : 'bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                <span className="text-xs text-neutral-400">Active Lawyers / SANs</span>
                <div className="text-3xl font-black text-white font-serif mt-1">14,250</div>
                <p className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12% this month
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                <span className="text-xs text-neutral-400">Monthly Revenue (MRR)</span>
                <div className="text-3xl font-black text-yellow-400 font-serif mt-1">₦48.5M</div>
                <p className="text-[10px] text-neutral-500 mt-1">Subscriptions active</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                <span className="text-xs text-neutral-400">Judgments Indexed</span>
                <div className="text-3xl font-black text-white font-serif mt-1">15,480</div>
                <p className="text-[10px] text-neutral-500 mt-1">Supreme Court & CA</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                <span className="text-xs text-neutral-400">AI Tokens Processed</span>
                <div className="text-3xl font-black text-white font-serif mt-1">2.4M</div>
                <p className="text-[10px] text-neutral-500 mt-1">Gemini API requests</p>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <h2 className="text-sm font-bold font-serif text-white mb-4">Pending SCN Bar Verifications</h2>
              <div className="space-y-3">
                {verificationQueue.map((item) => (
                  <div key={item.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <h3 className="font-bold text-white">{item.name}</h3>
                      <p className="text-yellow-400 font-mono mt-0.5">{item.barNumber} • Enrolled {item.yearEnrolled}</p>
                      <p className="text-neutral-400 text-[11px]">{item.firm}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => alert(`Verified ${item.name}`)} className="bg-yellow-400 text-neutral-950 font-bold px-3 py-1.5 rounded-lg">
                        Approve SCN
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
