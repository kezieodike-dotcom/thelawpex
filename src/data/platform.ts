import { SubscriptionTier, UserRole } from '../types';

export const PLATFORM_STATS = [
  { label: 'Case laws', value: '15,480', detail: 'Structured judgments' },
  { label: 'Court rules', value: '1,248', detail: 'Orders and rules' },
  { label: 'Statutes', value: '4,620', detail: 'Federal and state laws' },
  { label: 'Draft templates', value: '1,200+', detail: 'Editable processes' },
  { label: 'Active lawyers', value: '14,250', detail: 'Verified users' },
  { label: 'Subscribers', value: '3,080', detail: 'Paid seats' },
];

export const NOTIFICATIONS = [
  {
    type: 'New judgment',
    cadence: 'As published',
    channel: 'In-app + digest',
    title: 'Supreme Court clarifies electronic evidence certification',
    detail: 'Flagged for Evidence Act searches and litigation AI prompts.',
  },
  {
    type: 'Court rule update',
    cadence: 'As amended',
    channel: 'Email + in-app',
    title: 'Lagos High Court practice direction update queued for review',
    detail: 'Admin review required before publication to rule library.',
  },
  {
    type: 'AI tip',
    cadence: 'Weekly',
    channel: 'In-app',
    title: 'Use the limitation checker before drafting originating processes',
    detail: 'Recommended for civil litigation, land, tax and fundamental rights matters.',
  },
  {
    type: 'Weekly digest',
    cadence: 'Weekly',
    channel: 'Email + in-app',
    title: 'Monday legal digest ready for subscribed counsel',
    detail: 'Includes new cases, laws, rules and drafting notes.',
  },
];

export const AUTH_CAPABILITIES = [
  { label: 'Email or phone registration', priority: 'P0' },
  { label: 'Session login with device tracking', priority: 'P0' },
  { label: 'Secure forgot-password reset', priority: 'P0' },
  { label: 'Mandatory email verification', priority: 'P0' },
  { label: 'Two-factor authentication', priority: 'P1' },
  { label: 'NBA number verification', priority: 'P1' },
  { label: 'Judge credential review', priority: 'P1' },
  { label: 'Firm seats and admin roles', priority: 'P1' },
];

export const USER_ROLE_OPTIONS: { id: UserRole; label: string; description: string }[] = [
  { id: 'lawyer', label: 'Lawyer / SAN', description: 'SCN verification and counsel workspace' },
  { id: 'judge', label: 'Judicial officer', description: 'Bench-focused research and manual credential review' },
  { id: 'magistrate', label: 'Magistrate', description: 'Lower-court procedure, statutes and checklists' },
  { id: 'law_firm', label: 'Chambers / firm', description: 'Firm seats, shared folders and internal notes' },
  { id: 'student', label: 'Law student', description: 'Learning centre, selected articles and free tier' },
  { id: 'compliance_officer', label: 'Compliance officer', description: 'Regulatory alerts and sector guides' },
];

export const SUBSCRIPTION_USAGE: Record<
  SubscriptionTier,
  { searches: string; ai: string; downloads: string; seats: string }
> = {
  free: { searches: '25 / month', ai: '3 / day', downloads: 'Preview only', seats: '1' },
  professional: { searches: 'Unlimited', ai: 'Unlimited', downloads: 'Unlimited', seats: '1' },
  chambers: { searches: 'Unlimited', ai: 'Priority pool', downloads: 'Unlimited', seats: '10 included' },
  judiciary: { searches: 'Priority', ai: 'Bench suite', downloads: 'Institutional', seats: 'Institutional' },
};

export const ADMIN_DOMAINS = [
  {
    domain: 'Users',
    functions: ['Create and suspend accounts', 'Verify counsel and judges', 'Assign roles'],
    health: '12 pending reviews',
  },
  {
    domain: 'Subscriptions',
    functions: ['Plan management', 'Seat allocation', 'Upgrades and cancellations'],
    health: '3 failed renewals',
  },
  {
    domain: 'Content',
    functions: ['Draft, review and publish workflow', 'Editorial quality checks', 'Versioning'],
    health: '41 drafts awaiting review',
  },
  {
    domain: 'Judgments',
    functions: ['Ingestion', 'Structuring', 'Tagging and citation linking'],
    health: '228 queued judgments',
  },
  {
    domain: 'Statutes',
    functions: ['Upload', 'Amend', 'Repeal and consolidation status'],
    health: '9 amendment checks',
  },
  {
    domain: 'Court Rules',
    functions: ['Order/rule management', 'State edition tracking', 'Keyword indexing'],
    health: '6 gazette checks',
  },
  {
    domain: 'AI Knowledge Base',
    functions: ['Corpus curation', 'Embedding refresh', 'Retrieval quality review'],
    health: '94.2% citation coverage',
  },
  {
    domain: 'Emails',
    functions: ['Templates', 'Campaign scheduling', 'Deliverability monitoring'],
    health: 'Digest scheduled',
  },
  {
    domain: 'Analytics',
    functions: ['Usage', 'Search quality', 'Conversion and revenue reporting'],
    health: 'Live',
  },
];

export const KPI_TARGETS = [
  { metric: 'Registered users', target: '10,000', category: 'Growth' },
  { metric: 'Paid subscribers', target: '3,000', category: 'Revenue' },
  { metric: 'Searchable legal documents', target: '100,000', category: 'Content depth' },
  { metric: 'AI legal queries per month', target: '50,000', category: 'Engagement' },
  { metric: 'User satisfaction', target: '95%', category: 'Quality' },
  { metric: 'Search response time', target: 'Under 2 seconds', category: 'Performance' },
];
