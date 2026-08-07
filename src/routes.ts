/**
 * Single source of truth for every page on the site.
 *
 * Views throughout the app still navigate by tab id (`setActiveTab('case-law')`).
 * The shell translates those ids into real URLs using this table, so every module
 * is a proper, linkable, bookmarkable page.
 */
export interface AppRoute {
  /** Legacy tab id used by views to request navigation. */
  id: string;
  /** Public URL of the page. */
  path: string;
  /** Short label for navigation menus. */
  label: string;
  /** Document title used for the browser tab. */
  title: string;
  /** Meta description for the page. */
  description: string;
}

const SITE_NAME = 'LAWPEX';

export const APP_ROUTES: AppRoute[] = [
  {
    id: 'home',
    path: '/',
    label: 'Home',
    title: `${SITE_NAME} — Nigeria's AI-Powered Litigation & Legal Research Platform`,
    description:
      "LAWPEX is Nigeria's premier AI-powered litigation, legal research, court rules, case law, statutes and legal drafting platform for lawyers, judges, law firms and legal researchers.",
  },
  {
    id: 'ai-assistant',
    path: '/ai-assistant',
    label: 'AI Legal Assistant',
    title: `AI Legal Assistant — ${SITE_NAME}`,
    description:
      'Ask Nigerian law questions, generate court processes and summarise judgments with an AI assistant grounded in LFN statutes, court rules and Supreme Court authority.',
  },
  {
    id: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    title: `My Workspace — ${SITE_NAME}`,
    description:
      'Your LAWPEX workspace: matters, saved authorities, drafts in progress, subscription status and practice analytics.',
  },
  {
    id: 'areas-of-law',
    path: '/areas-of-law',
    label: 'Areas of Law',
    title: `Areas of Law — ${SITE_NAME}`,
    description:
      'Explore 20+ Nigerian practice areas, each with drafts, applicable LFN statutes, court rules, legal principles, case law and practical checklists.',
  },
  {
    id: 'case-law',
    path: '/case-law',
    label: 'Case Law',
    title: `Case Law Library — ${SITE_NAME}`,
    description:
      'Structured Supreme Court and Court of Appeal judgments with facts, issues, decisions and ratio decidendi.',
  },
  {
    id: 'court-rules',
    path: '/court-rules',
    label: 'Court Rules',
    title: `Court Rules — ${SITE_NAME}`,
    description:
      'Rules of court for the Supreme Court, Court of Appeal, Federal High Court, NICN and the High Courts of all 36 states and the FCT, searchable by Order and Rule.',
  },
  {
    id: 'laws',
    path: '/nigerian-laws',
    label: 'Nigerian Laws',
    title: `Nigerian Laws & Statutes — ${SITE_NAME}`,
    description:
      'Laws of the Federation of Nigeria, including CAMA 2020, the Evidence Act 2011, ACJA 2015 and the 1999 Constitution as amended.',
  },
  {
    id: 'appeals',
    path: '/appeals',
    label: 'Appeals Centre',
    title: `Appeals Centre — ${SITE_NAME}`,
    description:
      'End-to-end Nigerian appellate guidance: notices of appeal, records, briefs, timelines and procedural flowcharts.',
  },
  {
    id: 'drafts',
    path: '/drafts',
    label: 'Draft Library',
    title: `Legal Draft Library — ${SITE_NAME}`,
    description:
      'Thousands of editable, AI-customisable Nigerian court processes, writs, motions, briefs and agreements.',
  },
  {
    id: 'affidavits',
    path: '/affidavits',
    label: 'Affidavits',
    title: `All Manner of Affidavits — ${SITE_NAME}`,
    description:
      'Every Nigerian affidavit — civil, criminal, land, matrimonial, probate, corporate, election, garnishee and fundamental rights — with the full sworn text, the Oaths Act basis and copy-to-Word.',
  },
  {
    id: 'practicals',
    path: '/courtroom-practicals',
    label: 'Court Room Procedures',
    title: `Different Court Room Procedures — ${SITE_NAME}`,
    description:
      'Nigerian courtroom procedures stage by stage — civil and criminal trials, motions, witnesses and exhibits, matrimonial causes, fundamental rights, garnishee, election petitions and appeals — with video demonstrations.',
  },
  {
    id: 'learn-litigation-ai',
    path: '/learn-litigation-ai',
    label: 'Learn Litigation with AI',
    title: `Learn Litigation with AI Tools — ${SITE_NAME}`,
    description:
      'A working curriculum for running Nigerian litigation with AI: case theory, drafting, authority research, evidence, cross-examination, appeals and deadlines — with the prompts to send and the checks to run before filing.',
  },
  {
    id: 'articles',
    path: '/articles',
    label: 'Legal Articles',
    title: `Legal Articles — ${SITE_NAME}`,
    description:
      'Peer-reviewed commentary and practice notes on Nigerian law, categorised and fully searchable.',
  },
  {
    id: 'compliance',
    path: '/compliance',
    label: 'Compliance Hub',
    title: `Corporate Compliance Hub — ${SITE_NAME}`,
    description:
      'Corporate compliance for Nigerian entities: CAC filings, SCUML, NDPR/NDPA, tax and regulatory calendars.',
  },
  {
    id: 'learning',
    path: '/learning',
    label: 'Learning Centre',
    title: `Learning Centre — ${SITE_NAME}`,
    description:
      'Structured courses, continuing legal education and certifications for Nigerian legal practitioners and law students.',
  },
  {
    id: 'pricing',
    path: '/pricing',
    label: 'Pricing',
    title: `Pricing & Plans — ${SITE_NAME}`,
    description:
      'LAWPEX subscription plans for individual practitioners, chambers, law firms, the judiciary and law students.',
  },
  {
    id: 'admin',
    path: '/admin',
    label: 'Admin Panel',
    title: `Admin Panel — ${SITE_NAME}`,
    description: 'LAWPEX platform administration, content moderation and user management.',
  },
];

const ROUTE_BY_ID = new Map(APP_ROUTES.map((route) => [route.id, route]));
const ROUTE_BY_PATH = new Map(APP_ROUTES.map((route) => [route.path, route]));

export const HOME_ROUTE = ROUTE_BY_ID.get('home')!;

/** Normalises a pathname so `/pricing`, `/pricing/` and `/Pricing` all resolve alike. */
const normalisePath = (pathname: string): string => {
  const trimmed = pathname.toLowerCase().replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
};

/** URL for a tab id. Falls back to the home page for unknown ids. */
export const pathForTab = (tabId: string): string => ROUTE_BY_ID.get(tabId)?.path ?? HOME_ROUTE.path;

/** The route matching a pathname, including nested paths such as `/areas-of-law/land-law`. */
export const routeForPath = (pathname: string): AppRoute | undefined => {
  const path = normalisePath(pathname);
  const exact = ROUTE_BY_PATH.get(path);
  if (exact) return exact;

  // Longest prefix wins, so `/areas-of-law/land-law` resolves to the Areas of Law page.
  return APP_ROUTES.filter((route) => route.path !== '/' && path.startsWith(`${route.path}/`)).sort(
    (a, b) => b.path.length - a.path.length,
  )[0];
};

/** Tab id matching a pathname, for highlighting the active navigation item. */
export const tabForPath = (pathname: string): string => routeForPath(pathname)?.id ?? '';
