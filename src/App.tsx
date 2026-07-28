import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { AuthModal } from './components/AuthModal';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { UniversalViewerModal } from './components/UniversalViewerModal';
import { DraftCustomizerModal } from './components/DraftCustomizerModal';

import { DashboardView } from './components/DashboardView';
import { AILegalAssistantView } from './components/AILegalAssistantView';
import { AreasOfLawView } from './components/modules/AreasOfLawView';
import { CourtRulesView } from './components/modules/CourtRulesView';
import { NigerianLawsView } from './components/modules/NigerianLawsView';
import { CaseLawView } from './components/modules/CaseLawView';
import { AppealsCentreView } from './components/modules/AppealsCentreView';
import { DraftLibraryView } from './components/modules/DraftLibraryView';
import { AffidavitsView } from './components/modules/AffidavitsView';
import { CourtroomPracticalsView } from './components/modules/CourtroomPracticalsView';
import { LegalArticlesView } from './components/modules/LegalArticlesView';
import { ComplianceHubView } from './components/modules/ComplianceHubView';
import { LearningCentreView } from './components/modules/LearningCentreView';
import { PricingView } from './components/modules/PricingView';
import { AdminPanelView } from './components/modules/AdminPanelView';

import { UserRole, SubscriptionTier, LegalDraft } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>('lawyer');
  const [subscription, setSubscription] = useState<SubscriptionTier>('professional');
  const [barNumber, setBarNumber] = useState<string>('SCN/084251');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [viewingItem, setViewingItem] = useState<any | null>(null);
  const [customizingDraft, setCustomizingDraft] = useState<LegalDraft | null>(null);

  const handleLoginSuccess = (scBarNum: string, role: UserRole) => {
    setBarNumber(scBarNum);
    setUserRole(role);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col selection:bg-yellow-400 selection:text-neutral-950">
      {/* Universal Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        subscription={subscription}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            setActiveTab={setActiveTab}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenViewer={(item) => setViewingItem(item)}
          />
        )}

        {activeTab === 'ai-assistant' && <AILegalAssistantView />}
        {activeTab === 'dashboard' && (
          <DashboardView
            userRole={userRole}
            subscription={subscription}
            barNumber={barNumber}
            setActiveTab={setActiveTab}
            onOpenViewer={(item) => setViewingItem(item)}
          />
        )}
        {activeTab === 'areas-of-law' && (
          <AreasOfLawView onSelectArea={(id) => {}} setActiveTab={setActiveTab} />
        )}
        {activeTab === 'court-rules' && <CourtRulesView />}
        {activeTab === 'laws' && <NigerianLawsView />}
        {activeTab === 'case-law' && (
          <CaseLawView onOpenViewer={(item) => setViewingItem(item)} />
        )}
        {activeTab === 'appeals' && <AppealsCentreView setActiveTab={setActiveTab} />}
        {activeTab === 'drafts' && (
          <DraftLibraryView onCustomizeDraft={(draft) => setCustomizingDraft(draft)} />
        )}
        {activeTab === 'affidavits' && (
          <AffidavitsView onCustomizeDraft={(draft) => setCustomizingDraft(draft)} />
        )}
        {activeTab === 'practicals' && <CourtroomPracticalsView />}
        {activeTab === 'articles' && <LegalArticlesView />}
        {activeTab === 'compliance' && <ComplianceHubView />}
        {activeTab === 'learning' && <LearningCentreView />}
        {activeTab === 'pricing' && (
          <PricingView
            currentTier={subscription}
            onUpgrade={(tier) => setSubscription(tier)}
          />
        )}
        {activeTab === 'admin' && <AdminPanelView />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Modals & Overlays */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccessLogin={handleLoginSuccess}
      />

      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={(item) => setViewingItem(item)}
      />

      <UniversalViewerModal
        item={viewingItem}
        onClose={() => setViewingItem(null)}
      />

      <DraftCustomizerModal
        draft={customizingDraft}
        onClose={() => setCustomizingDraft(null)}
      />
    </div>
  );
}
