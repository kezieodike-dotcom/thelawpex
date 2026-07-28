import React, { useState } from 'react';
import { FileText, Search, Sparkles, Copy, Check, ShieldCheck } from 'lucide-react';
import { LEGAL_DRAFTS_DATA } from '../../data/legalData';
import { LegalDraft } from '../../types';

interface AffidavitsViewProps {
  onCustomizeDraft: (draft: LegalDraft) => void;
}

export const AffidavitsView: React.FC<AffidavitsViewProps> = ({ onCustomizeDraft }) => {
  const [selectedSubCat, setSelectedSubCat] = useState('Civil');

  const categories = ['Civil', 'Criminal', 'Election', 'Probate', 'Corporate', 'Land', 'Employment', 'Family'];

  const affidavitTemplates = [
    {
      id: 'aff-01',
      title: 'Affidavit of Urgency (Ex-Parte Applications)',
      category: 'Civil',
      description: 'Sworn affidavit setting out grounds of extreme urgency and immediate threat to res requiring ex-parte order.',
      deponent: 'Claimant / Applicant Counsel'
    },
    {
      id: 'aff-02',
      title: 'Affidavit in Support of Motion for Injunction',
      category: 'Civil',
      description: 'Detailed affidavit of facts, ownership, balance of convenience, and undertaking as to damages.',
      deponent: 'Deponent / Property Owner'
    },
    {
      id: 'aff-03',
      title: 'Affidavit of Non-Involvement in Criminal Proceedings',
      category: 'Criminal',
      description: 'Sworn statement for bail application certifying no prior criminal convictions or pending indictments.',
      deponent: 'Applicant Sureties'
    },
    {
      id: 'aff-04',
      title: 'Affidavit of Loss of Original Title Document / C of O',
      category: 'Land',
      description: 'Sworn affidavit for publication in national gazette and police extract regarding lost Land Title.',
      deponent: 'Property Owner'
    }
  ];

  return (
    <div className="bg-neutral-950 text-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-neutral-900 border border-yellow-500/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            MODULE 7
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-white mt-2">Affidavit Library</h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl mt-1">
            Organized sworn affidavit templates complying strictly with the Oaths Act LFN 2004 and High Court Rules across Civil, Criminal, Probate, Election, Land, Corporate, and Family matters.
          </p>

          {/* Categories */}
          <div className="mt-6 flex flex-wrap gap-2 pt-2 border-t border-neutral-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedSubCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedSubCat === cat
                    ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-500/20'
                    : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {cat} Affidavits
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {affidavitTemplates.map((aff) => (
            <div
              key={aff.id}
              className="bg-neutral-900 border border-neutral-800 hover:border-yellow-500/40 p-6 rounded-2xl transition shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-yellow-400" />
                  <span className="text-[10px] font-bold text-yellow-400 uppercase">Sworn under Oaths Act</span>
                </div>
                <h3 className="text-base font-bold font-serif text-white">{aff.title}</h3>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{aff.description}</p>
                <span className="text-[11px] text-neutral-500 mt-2 block">Deponent Designation: {aff.deponent}</span>
              </div>

              <button
                onClick={() =>
                  onCustomizeDraft({
                    id: aff.id,
                    title: aff.title,
                    category: 'Affidavits',
                    areaOfLaw: 'Civil Litigation',
                    description: aff.description,
                    courtHeadingRequired: true,
                    sampleText: `IN THE HIGH COURT OF LAGOS STATE\nIN THE LAGOS JUDICIAL DIVISION\nHOLDEN AT LAGOS\n\nSUIT NO: LD/______/2026\n\nBETWEEN:\nCLAIMANT NAME ................................................................ CLAIMANT/APPLICANT\nAND\nDEFENDANT NAME ................................................................ DEFENDANT/RESPONDENT\n\n${aff.title.toUpperCase()}\n\nI, [DEPONENT NAME], Male, Christian, Nigerian Citizen of [ADDRESS], do hereby make oath and state as follows:\n1. That I am the Deponent herein and conversant with the facts...\n2. That I make this solemn declaration conscientiously believing same to be true and in accordance with the Oaths Act.`,
                    variables: [],
                    downloadCount: 1500,
                    isCustomizableWithAI: true
                  })
                }
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Customize Affidavit Process</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
