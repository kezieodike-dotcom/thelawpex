import React, { useCallback, useEffect, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AssistantLauncher } from './components/AssistantLauncher';
import { HomeView } from './components/HomeView';
import { NotFoundView } from './components/NotFoundView';
import { AuthMode, AuthPage } from './components/AuthModal';
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
import { LitigationAIView } from './components/modules/LitigationAIView';
import { LegalArticlesView } from './components/modules/LegalArticlesView';
import { ComplianceHubView } from './components/modules/ComplianceHubView';
import { LearningCentreView } from './components/modules/LearningCentreView';
import { PricingView } from './components/modules/PricingView';
import { AdminPanelView } from './components/modules/AdminPanelView';

import { HOME_ROUTE, pathForTab, routeForPath, tabForPath } from './routes';
import { UserRole, SubscriptionTier, LegalDraft } from './types';
import { LANDMARK_CASES } from './data/legalData';

/** Keeps the document title and meta description in sync with the current page. */
const usePageMeta = (pathname: string) => {
  useEffect(() => {
    const route = routeForPath(pathname);
    document.title = route ? route.title : 'Page Not Found — LAWPEX';

    const description = route
      ? route.description
      : 'The requested LAWPEX page could not be found.';
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = description;
  }, [pathname]);
};

/** Every navigation lands at the top of the new page, the way a normal site behaves. */
const useScrollToTop = (pathname: string) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
};

/** Reveals feature sections and cards as they enter the viewport. */
const useScrollReveal = (pathname: string) => {
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let mutationFrame: number | null = null;
    let revealIndex = 0;

    const clearRevealState = () => {
      document.querySelectorAll<HTMLElement>('.lawpex-reveal, .lawpex-reveal-in').forEach((element) => {
        element.classList.remove('lawpex-reveal', 'lawpex-reveal-in');
        element.style.removeProperty('--reveal-delay');
      });
    };

    const homeCardSelectors = [
      '[data-lawpex-reveal]',
      '.lawpex-card',
      '.lawpex-panel',
      'main a[class*="rounded"][class*="border"]',
      'main div[class*="rounded"][class*="border"]',
      'footer > div > div',
      'footer a',
      'footer input',
      'footer button',
      'footer [class*="rounded"][class*="border"]',
    ];
    const pageCardSelectors = [
      '[data-lawpex-reveal]',
      '.lawpex-card',
      '.lawpex-panel',
      'main a[class*="rounded"][class*="border"]',
      'main button[class*="rounded"][class*="border"]',
      'main article[class*="rounded"][class*="border"]',
      'main [class*="grid"] > div[class*="rounded"][class*="border"]',
    ];
    const selectors = pathname === HOME_ROUTE.path ? homeCardSelectors : pageCardSelectors;
    const selectorList = selectors.join(',');

    const revealElement = (element: Element) => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => element.classList.add('lawpex-reveal-in'));
      });
    };

    const registerElements = () => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(selectorList))
        .filter((element, index, list) => list.indexOf(element) === index)
        .filter((element) => !element.classList.contains('lawpex-reveal'))
        .filter((element) => !element.classList.contains('lawpex-case-motion'))
        .filter((element) => !element.closest(
          '.lawpex-hero-motion, .lawpex-no-reveal, .lawpex-report-page, [role="dialog"], aside, nav',
        ))
        .filter((element) => element.hasAttribute('data-lawpex-reveal') || !element.querySelector(selectorList));

      elements.forEach((element) => {
        element.classList.add('lawpex-reveal');
        element.style.setProperty('--reveal-delay', `${Math.min(revealIndex % 6, 5) * 80}ms`);
        revealIndex += 1;

        const box = element.getBoundingClientRect();
        if (box.top < window.innerHeight * 0.94 && box.bottom > 0) {
          revealElement(element);
          return;
        }

        observer?.observe(element);
      });
    };

    const timer = window.setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealElement(entry.target);
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      );
      registerElements();

      mutationObserver = new MutationObserver(() => {
        if (mutationFrame !== null) return;
        mutationFrame = window.requestAnimationFrame(() => {
          mutationFrame = null;
          registerElements();
        });
      });
      const pageRoot = document.querySelector('main');
      if (pageRoot) mutationObserver.observe(pageRoot, { childList: true, subtree: true });
    }, 40);

    return () => {
      window.clearTimeout(timer);
      if (mutationFrame !== null) window.cancelAnimationFrame(mutationFrame);
      mutationObserver?.disconnect();
      observer?.disconnect();
      clearRevealState();
    };
  }, [pathname]);
};

export function AppShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [userRole, setUserRole] = useState<UserRole>('lawyer');
  const [subscription, setSubscription] = useState<SubscriptionTier>('professional');
  const [barNumber, setBarNumber] = useState<string>('SCN/084251');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  const [viewingItem, setViewingItem] = useState<any | null>(null);
  const [customizingDraft, setCustomizingDraft] = useState<LegalDraft | null>(null);

  const activeTab = tabForPath(pathname);

  usePageMeta(pathname);
  useScrollToTop(pathname);
  useScrollReveal(pathname);

  /**
   * Views still ask for navigation by tab id; the shell turns that into a URL change so
   * the address bar, browser history and shareable links all stay correct.
   */
  const setActiveTab = useCallback(
    (tab: string) => {
      navigate(pathForTab(tab));
    },
    [navigate],
  );

  const openSearch = useCallback((query = '') => {
    setSearchInitialQuery(query.trim());
    setIsSearchOpen(true);
  }, []);
  const openCase = useCallback(
    (caseId: string) => navigate(`/case-law/case/${caseId}`),
    [navigate],
  );
  const openViewer = useCallback(
    (item: any) => {
      if (item?.id && LANDMARK_CASES.some((caseItem) => caseItem.id === item.id)) {
        openCase(item.id);
        return;
      }
      setViewingItem(item);
    },
    [openCase],
  );
  const openAuthModal = useCallback((mode: AuthMode = 'login') => {
    navigate(mode === 'register' ? '/register' : mode === 'forgot' ? '/recover-access' : '/sign-in');
  }, [navigate]);

  const handleLoginSuccess = (scBarNum: string, role: UserRole) => {
    setBarNumber(scBarNum);
    setUserRole(role);
    setIsLoggedIn(true);
    navigate(pathForTab('dashboard'));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('lawyer');
    navigate(HOME_ROUTE.path);
  };

  // ⌘K / Ctrl+K opens the universal search from anywhere on the site.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="lawpex-shell min-h-screen text-neutral-900 font-sans flex flex-col selection:bg-yellow-400 selection:text-neutral-950">
      {/* Universal Top Navigation */}
      <Navbar
        activeTab={activeTab}
        openAuthModal={openAuthModal}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* One URL per page */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomeView
                setActiveTab={setActiveTab}
                onOpenSearch={openSearch}
                onOpenCase={openCase}
                onOpenViewer={openViewer}
              />
            }
          />

          <Route
            path="/sign-in"
            element={
              <AuthPage
                initialMode="login"
                onClose={() => navigate(HOME_ROUTE.path)}
                onSuccessLogin={handleLoginSuccess}
              />
            }
          />
          <Route
            path="/register"
            element={
              <AuthPage
                initialMode="register"
                onClose={() => navigate(HOME_ROUTE.path)}
                onSuccessLogin={handleLoginSuccess}
              />
            }
          />
          <Route
            path="/recover-access"
            element={
              <AuthPage
                initialMode="forgot"
                onClose={() => navigate(HOME_ROUTE.path)}
                onSuccessLogin={handleLoginSuccess}
              />
            }
          />

          <Route path="/ai-assistant" element={<AILegalAssistantView />} />

          <Route
            path="/dashboard"
            element={
              <DashboardView
                userRole={userRole}
                subscription={subscription}
                barNumber={barNumber}
                setActiveTab={setActiveTab}
                onOpenViewer={openViewer}
              />
            }
          />

          <Route path="/areas-of-law" element={<AreasOfLawPage setActiveTab={setActiveTab} />} />
          <Route
            path="/areas-of-law/:areaId"
            element={<AreasOfLawPage setActiveTab={setActiveTab} />}
          />

          {/* Case law: court → list of cases → the case itself */}
          <Route path="/case-law" element={<CaseLawPage />} />
          <Route path="/case-law/case/:caseId" element={<CaseLawPage />} />
          <Route path="/case-law/:courtSlug" element={<CaseLawPage />} />

          {/* Court rules: category → court → the rule book and its search banner */}
          <Route path="/court-rules" element={<CourtRulesPage />} />
          <Route path="/court-rules/:categoryId" element={<CourtRulesPage />} />
          <Route path="/court-rules/:categoryId/:bookId" element={<CourtRulesPage />} />

          {/* Nigerian laws: the Federation, and the 36 states and the FCT */}
          <Route path="/nigerian-laws" element={<NigerianLawsPage />} />
          <Route path="/nigerian-laws/:libraryId" element={<NigerianLawsPage />} />
          <Route path="/nigerian-laws/:libraryId/:stateSlugParam" element={<NigerianLawsPage />} />
          <Route path="/appeals" element={<AppealsCentreView setActiveTab={setActiveTab} />} />

          <Route
            path="/drafts"
            element={<DraftLibraryView onCustomizeDraft={(draft) => setCustomizingDraft(draft)} />}
          />

          {/* Affidavits: category → the deposition itself */}
          <Route
            path="/affidavits"
            element={<AffidavitsPage onCustomizeDraft={(draft) => setCustomizingDraft(draft)} />}
          />
          <Route
            path="/affidavits/deposition/:affidavitId"
            element={<AffidavitsPage onCustomizeDraft={(draft) => setCustomizingDraft(draft)} />}
          />
          <Route
            path="/affidavits/:categoryId"
            element={<AffidavitsPage onCustomizeDraft={(draft) => setCustomizingDraft(draft)} />}
          />

          {/* Court room procedures, each deep-linkable */}
          <Route path="/courtroom-practicals" element={<CourtroomPracticalsPage />} />
          <Route path="/courtroom-practicals/:procedureId" element={<CourtroomPracticalsPage />} />

          {/* Learn litigation with AI tools */}
          <Route path="/learn-litigation-ai" element={<LitigationAIPage />} />
          <Route path="/learn-litigation-ai/:lessonId" element={<LitigationAIPage />} />
          <Route path="/articles" element={<LegalArticlesView />} />
          <Route path="/compliance" element={<ComplianceHubView />} />
          <Route path="/learning" element={<LearningCentreView />} />
          <Route
            path="/pricing"
            element={
              <PricingView currentTier={subscription} onUpgrade={(tier) => setSubscription(tier)} />
            }
          />
          <Route path="/admin" element={<AdminPanelView />} />

          {/* Legacy / convenience aliases so old links keep working */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/laws" element={<Navigate to="/nigerian-laws" replace />} />
          <Route path="/practicals" element={<Navigate to="/courtroom-practicals" replace />} />

          <Route path="*" element={<NotFoundView onOpenSearch={openSearch} />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* AI assistant, pinned to the right edge of every page */}
      <AssistantLauncher />

      {/* Modals & Overlays */}
      <UniversalSearchModal
        isOpen={isSearchOpen}
        initialQuery={searchInitialQuery}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={openViewer}
      />

      <UniversalViewerModal item={viewingItem} onClose={() => setViewingItem(null)} />

      <DraftCustomizerModal draft={customizingDraft} onClose={() => setCustomizingDraft(null)} />
    </div>
  );
}

/** Areas of Law is deep-linkable: `/areas-of-law/:areaId` opens straight to a practice area. */
function AreasOfLawPage({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { areaId } = useParams<{ areaId: string }>();
  const navigate = useNavigate();

  return (
    <AreasOfLawView
      selectedAreaId={areaId}
      onSelectArea={(id) => navigate(`/areas-of-law/${id}`)}
      setActiveTab={setActiveTab}
    />
  );
}

/** Case law drills down court → cases → judgment, each level with its own URL. */
function CaseLawPage() {
  const { courtSlug, caseId } = useParams<{ courtSlug: string; caseId: string }>();
  return <CaseLawView courtSlug={courtSlug} caseId={caseId} />;
}

/** Court rules drill down category → court → rule book. */
function CourtRulesPage() {
  const { categoryId, bookId } = useParams<{ categoryId: string; bookId: string }>();
  return <CourtRulesView categoryId={categoryId} bookId={bookId} />;
}

/** Affidavits drill down category → the sworn text itself. */
function AffidavitsPage({ onCustomizeDraft }: { onCustomizeDraft: (draft: LegalDraft) => void }) {
  const { categoryId, affidavitId } = useParams<{ categoryId: string; affidavitId: string }>();
  return (
    <AffidavitsView
      categoryId={categoryId}
      affidavitId={affidavitId}
      onCustomizeDraft={onCustomizeDraft}
    />
  );
}

/** Each court room procedure has its own URL. */
function CourtroomPracticalsPage() {
  const { procedureId } = useParams<{ procedureId: string }>();
  return <CourtroomPracticalsView procedureId={procedureId} />;
}

/** Each lesson in the AI litigation curriculum has its own URL. */
function LitigationAIPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  return <LitigationAIView lessonId={lessonId} />;
}

/** Nigerian laws split into the Federation and the states. */
function NigerianLawsPage() {
  const { libraryId, stateSlugParam } = useParams<{ libraryId: string; stateSlugParam: string }>();
  return <NigerianLawsView libraryId={libraryId} stateSlugParam={stateSlugParam} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
