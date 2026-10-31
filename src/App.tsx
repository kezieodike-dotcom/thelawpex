import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
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
import { HOME_ROUTE, pathForTab, routeForPath, tabForPath } from './routes';
import { UserRole, SubscriptionTier, LegalDraft } from './types';
import type { AuthMode } from './components/AuthModal';

// Keep route-specific data and UI out of the initial shell. In particular,
// this prevents the case-law corpus and large law/rule text assets from being
// parsed before the user opens the corresponding module.
const HomeView = lazy(() => import('./components/HomeView').then((module) => ({ default: module.HomeView })));
const NotFoundView = lazy(() => import('./components/NotFoundView').then((module) => ({ default: module.NotFoundView })));
const AuthPage = lazy(() => import('./components/AuthModal').then((module) => ({ default: module.AuthPage })));
const DashboardView = lazy(() => import('./components/DashboardView').then((module) => ({ default: module.DashboardView })));
const AILegalAssistantView = lazy(() => import('./components/AILegalAssistantView').then((module) => ({ default: module.AILegalAssistantView })));
const AreasOfLawView = lazy(() => import('./components/modules/AreasOfLawView').then((module) => ({ default: module.AreasOfLawView })));
const AppealsCentreView = lazy(() => import('./components/modules/AppealsCentreView').then((module) => ({ default: module.AppealsCentreView })));
const DraftLibraryView = lazy(() => import('./components/modules/DraftLibraryView').then((module) => ({ default: module.DraftLibraryView })));
const AffidavitsView = lazy(() => import('./components/modules/AffidavitsView').then((module) => ({ default: module.AffidavitsView })));
const CourtroomPracticalsView = lazy(() => import('./components/modules/CourtroomPracticalsView').then((module) => ({ default: module.CourtroomPracticalsView })));
const LitigationAIView = lazy(() => import('./components/modules/LitigationAIView').then((module) => ({ default: module.LitigationAIView })));
const LegalArticlesView = lazy(() => import('./components/modules/LegalArticlesView').then((module) => ({ default: module.LegalArticlesView })));
const ComplianceHubView = lazy(() => import('./components/modules/ComplianceHubView').then((module) => ({ default: module.ComplianceHubView })));
const LearningCentreView = lazy(() => import('./components/modules/LearningCentreView').then((module) => ({ default: module.LearningCentreView })));
const PricingView = lazy(() => import('./components/modules/PricingView').then((module) => ({ default: module.PricingView })));
const AdminPanelView = lazy(() => import('./components/modules/AdminPanelView').then((module) => ({ default: module.AdminPanelView })));

const LegalDocumentRoute = lazy(() => import('./components/LegalDocumentRoute'));
const CaseLawView = lazy(() => import('./components/modules/CaseLawView').then((module) => ({ default: module.CaseLawView })));
const CaseLawSearchView = lazy(() => import('./components/modules/CaseLawSearchView').then((module) => ({ default: module.CaseLawSearchView })));
const CourtRulesView = lazy(() => import('./components/modules/CourtRulesView').then((module) => ({ default: module.CourtRulesView })));
const NigerianLawsView = lazy(() => import('./components/modules/NigerianLawsView').then((module) => ({ default: module.NigerianLawsView })));
const UniversalSearchModal = lazy(() => import('./components/UniversalSearchModal').then((module) => ({ default: module.UniversalSearchModal })));
const UniversalViewerModal = lazy(() => import('./components/UniversalViewerModal').then((module) => ({ default: module.UniversalViewerModal })));
const DraftCustomizerModal = lazy(() => import('./components/DraftCustomizerModal').then((module) => ({ default: module.DraftCustomizerModal })));

const LegalDocumentFallback = () => (
  <div className="min-h-[55vh]" role="status" aria-busy="true" aria-label="Loading page" />
);

/** Keeps the document title and meta description in sync with the current page. */
const usePageMeta = (pathname: string) => {
  useEffect(() => {
    const route = routeForPath(pathname);
    const isConstitution = pathname === '/constitution' || pathname.startsWith('/constitution/');
    const isDocument = pathname.startsWith('/documents/');
    document.title = isConstitution || isDocument
      ? 'Legal Document Reader — LAWPEX'
      : route ? route.title : 'Page Not Found — LAWPEX';

    const description = isConstitution
      ? 'Read the Constitution of the Federal Republic of Nigeria 1999 as amended from the uploaded official source document.'
      : isDocument
      ? 'Read an uploaded Nigerian legal source document in a searchable, accessible digital reader.'
      : route
      ? route.description
      : 'The requested LAWPEX page could not be found.';
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = description;

    const absoluteUrl = (path: string) => new URL(path, window.location.origin).toString();
    const setMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
      let meta = document.querySelector<HTMLMetaElement>(selector);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const pageTitle = isConstitution || isDocument
      ? 'Legal Document Reader — LAWPEX'
      : route?.title ?? 'LAWPEX — Nigeria’s AI-Powered Litigation & Legal Research Platform';
    const pageUrl = absoluteUrl(pathname);
    const heroImage = absoluteUrl('/hero-justice.jpg');
    setMeta('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', pageUrl);
    setMeta('meta[property="og:image"]', 'property', 'og:image', heroImage);
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', 'LAWPEX Nigerian litigation workspace hero');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', heroImage);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
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

    // Motion is reserved for module entry pages. Detail and reading views
    // should open directly into their content without reveals.
    const animatedLandingPaths = new Set([
      '/',
      '/areas-of-law',
      '/case-law',
      '/court-rules',
      '/nigerian-laws',
      '/appeals',
      '/drafts',
      '/affidavits',
      '/courtroom-practicals',
      '/learn-litigation-ai',
      '/articles',
      '/compliance',
      '/learning',
    ]);
    if (!animatedLandingPaths.has(pathname)) {
      clearRevealState();
      return;
    }

    const pageCardSelectors = [
      '[data-lawpex-reveal]',
      '.lawpex-card',
      '.lawpex-panel',
      'main a[class*="rounded"][class*="border"]',
      'main button[class*="rounded"][class*="border"]',
      'main article[class*="rounded"][class*="border"]',
      'main div[class*="rounded"][class*="border"]',
      'main [class*="grid"] > div[class*="rounded"][class*="border"]',
      'footer > div > div',
      'footer a',
      'footer input',
      'footer button',
      'footer [class*="rounded"][class*="border"]',
    ];
    const selectorList = pageCardSelectors.join(',');

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
  const isAdminWorkspace = pathname === '/admin';

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
      if (/^case-\d+$/i.test(item?.id ?? '') && item?.court && item?.citation) {
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
    navigate(role === 'admin' ? '/admin' : pathForTab('dashboard'));
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
      {!isAdminWorkspace && <Navbar
        activeTab={activeTab}
        openAuthModal={openAuthModal}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />}

      {/* One URL per page */}
      <main className="flex-1">
        <Suspense fallback={<LegalDocumentFallback />}>
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
          <Route path="/case-law" element={<CaseLawSearchView />} />
          <Route path="/case-law/case/:caseId" element={<CaseLawPage />} />
          <Route path="/case-law/:courtSlug" element={<CaseLawPage />} />

          {/* Court rules: category → court → the rule book and its search banner */}
          <Route path="/court-rules" element={<CourtRulesPage />} />
          <Route path="/court-rules/:categoryId" element={<CourtRulesPage />} />
          <Route path="/court-rules/:categoryId/:bookId" element={<CourtRulesPage />} />

          {/* Nigerian laws: the Federation, and the 36 states and the FCT */}
          <Route path="/nigerian-laws" element={<NigerianLawsPage />} />
          <Route path="/nigerian-laws/:libraryId" element={<NigerianLawsPage />} />
          <Route path="/nigerian-laws/federation/:federalLawId" element={<NigerianLawsPage />} />
          <Route path="/nigerian-laws/states/:stateSlugParam" element={<NigerianLawsPage />} />
          <Route path="/constitution" element={<ConstitutionPage />} />
          <Route path="/constitution/:sectionId" element={<ConstitutionPage />} />
          <Route path="/documents/:documentId" element={<LegalDocumentPage />} />
          <Route path="/documents/:documentId/:sectionId" element={<LegalDocumentPage />} />
          <Route path="/appeals" element={<AppealsCentreView setActiveTab={setActiveTab} />} />

          <Route
            path="/drafts"
            element={<DraftLibraryView onCustomizeDraft={(draft) => setCustomizingDraft(draft)} />}
          />

          {/* Agreements and standalone affidavits */}
          <Route
            path="/affidavits"
            element={<AffidavitsPage onCustomizeDraft={(draft) => setCustomizingDraft(draft)} />}
          />
          <Route
            path="/affidavits/deposition/:affidavitId"
            element={<AffidavitsPage onCustomizeDraft={(draft) => setCustomizingDraft(draft)} />}
          />
          <Route
            path="/affidavits/agreement/:agreementId"
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
        </Suspense>
      </main>

      {/* Footer */}
      {!isAdminWorkspace && <Footer />}

      {/* Ai Draft Wizard launcher is redundant inside the wizard itself. */}
      {!isAdminWorkspace && activeTab !== 'ai-assistant' && <AssistantLauncher />}

      {/* Modals & Overlays */}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <UniversalSearchModal
            isOpen
            initialQuery={searchInitialQuery}
            onClose={() => setIsSearchOpen(false)}
            onSelectItem={openViewer}
          />
        </Suspense>
      )}

      {viewingItem && (
        <Suspense fallback={null}>
          <UniversalViewerModal item={viewingItem} onClose={() => setViewingItem(null)} />
        </Suspense>
      )}

      {customizingDraft && (
        <Suspense fallback={null}>
          <DraftCustomizerModal draft={customizingDraft} onClose={() => setCustomizingDraft(null)} />
        </Suspense>
      )}
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

/** Affidavit directory → the selected sworn text itself. */
function AffidavitsPage({ onCustomizeDraft }: { onCustomizeDraft: (draft: LegalDraft) => void }) {
  const { affidavitId, agreementId } = useParams<{ affidavitId: string; agreementId: string }>();
  return (
    <AffidavitsView
      affidavitId={affidavitId}
      agreementId={agreementId}
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
  const { libraryId, stateSlugParam, federalLawId } = useParams<{
    libraryId: string;
    stateSlugParam: string;
    federalLawId: string;
  }>();
  const resolvedLibraryId = libraryId ?? (federalLawId ? 'federation' : stateSlugParam ? 'states' : undefined);
  return <NigerianLawsView libraryId={resolvedLibraryId} stateSlugParam={stateSlugParam} federalLawId={federalLawId} />;
}

/** Full-text Constitution reader sourced from the uploaded official document. */
function ConstitutionPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  return (
    <Suspense fallback={<LegalDocumentFallback />}>
      <LegalDocumentRoute kind="constitution" sectionId={sectionId} />
    </Suspense>
  );
}

/** Dedicated URL for every uploaded Act or court-rules source document. */
function LegalDocumentPage() {
  const { documentId, sectionId } = useParams<{ documentId: string; sectionId: string }>();
  return (
    <Suspense fallback={<LegalDocumentFallback />}>
      <LegalDocumentRoute kind="document" documentId={documentId} sectionId={sectionId} />
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
