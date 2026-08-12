export type UserRole = 'lawyer' | 'judge' | 'magistrate' | 'law_firm' | 'student' | 'compliance_officer' | 'admin';

export type SubscriptionTier = 'free' | 'professional' | 'chambers' | 'judiciary';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  barNumber?: string;
  courtJurisdiction?: string;
  firmName?: string;
  subscription: SubscriptionTier;
  subscriptionExpiry?: string;
  isVerified: boolean;
  savedCasesCount: number;
  savedDraftsCount: number;
}

export interface AreaOfLaw {
  id: string;
  title: string;
  description: string;
  icon: string;
  popularTopics: string[];
  applicableStatutes: string[];
  keyRules: string[];
  principlesOfLaw: string[];
  checklists: string[];
  draftCount: number;
  caseCount: number;
}

/** A single sample process/draft offered inside an area of law. */
export interface AreaDraftResource {
  id: string;
  title: string;
  description: string;
  /** Court-ready sample text with placeholders for parties, suit numbers and dates. */
  sampleText: string;
}

/** A statute, rule or regulation governing an area of law. */
export interface AreaGoverningLaw {
  title: string;
  citation: string;
  kind: 'Act' | 'Rules' | 'Regulations' | 'Constitution';
  note: string;
}

/** An explanatory article attached to an area of law. */
export interface AreaArticle {
  id: string;
  title: string;
  author: string;
  readTimeMinutes: number;
  excerpt: string;
  /** Markdown-lite body: paragraphs separated by blank lines, `## ` for headings. */
  body: string;
}

/** A courtroom practical walkthrough attached to an area of law. */
export interface AreaPractical {
  id: string;
  title: string;
  duration: string;
  instructor: string;
  summary: string;
  /** Ordered walkthrough of what happens in the courtroom. */
  steps: string[];
}

/**
 * Everything offered when a user opens one area of law. Every area exposes the same
 * eight features so the experience is identical across practice areas.
 */
export interface AreaResourceBundle {
  /** What the initiating and responding parties are called in this area. */
  partyLabels: { initiating: string; responding: string };
  demandLetters: AreaDraftResource[];
  /** Sample processes for the initiating party — capped at two. */
  initiatingProcesses: AreaDraftResource[];
  /** Sample processes for the responding party. */
  respondingProcesses: AreaDraftResource[];
  /** Likely preliminary objections and counter affidavits. */
  preliminaryObjections: AreaDraftResource[];
  governingLaws: AreaGoverningLaw[];
  articles: AreaArticle[];
  /** Ids into LANDMARK_CASES, plus free-standing summaries where no full case exists. */
  caseIds: string[];
  practicals: AreaPractical[];
}

export interface CaseLaw {
  id: string;
  title: string;
  citation: string;
  sourceUrl?: string;
  suitNumber: string;
  court: 'Supreme Court of Nigeria' | 'Court of Appeal' | 'Federal High Court' | 'National Industrial Court' | 'State High Court';
  year: number;
  judicialDivision?: string;
  dateDelivered?: string;
  presidingJudges: string[];
  appearances?: {
    appellant?: string;
    respondent?: string;
  };
  areaOfLaw: string;
  subject: string;
  catchwords?: string[];
  proceduralHistory?: string;
  factsSummary: string;
  reliefsClaimed?: string[];
  ordersMade?: string[];
  issuesForDetermination: string[];
  decisionSummary: string;
  /** Exact judicial words containing the ratio; do not summarise. */
  ratioDecidendi: string[];
  obiterDicta?: string[];
  authoritiesCited?: string[];
  statutesConsidered?: string[];
  practiceNotes?: string[];
  hasFullJudgment?: boolean;
  fullJudgmentText?: string;
  judgmentPages?: {
    page: string;
    paragraphs: string[];
  }[];
  keyPrinciples: string[];
  relatedCaseIds?: string[];
  isLandmark?: boolean;
}

export interface CourtRule {
  id: string;
  courtName: string;
  jurisdictionCategory: 'Supreme Court' | 'Court of Appeal' | 'Federal High Court' | 'National Industrial Court' | 'High Courts (States & FCT)' | 'Magistrate' | 'Customary' | 'Sharia';
  state?: string;
  orderNumber: number;
  orderTitle: string;
  ruleNumber: number;
  ruleTitle: string;
  content: string;
  year: number;
}

export interface NigerianLaw {
  id: string;
  title: string;
  shortTitle: string;
  category: 'LFN (Federation)' | 'State Law' | 'Regulations & Decrees';
  state?: string;
  year: number;
  citation: string;
  description: string;
  sectionsCount: number;
  sections: {
    sectionNumber: string;
    heading: string;
    content: string;
  }[];
}

export interface LegalDraft {
  id: string;
  title: string;
  category: 'Civil' | 'Criminal' | 'Commercial' | 'Corporate' | 'Property' | 'Family' | 'Appellate' | 'Affidavits';
  areaOfLaw: string;
  description: string;
  courtHeadingRequired: boolean;
  sampleText: string;
  variables: string[];
  downloadCount: number;
  isCustomizableWithAI: boolean;
}

/** The families every affidavit in the library falls into. */
export type AffidavitCategoryId =
  | 'general'
  | 'civil'
  | 'interlocutory'
  | 'criminal'
  | 'land'
  | 'matrimonial'
  | 'probate'
  | 'corporate'
  | 'election'
  | 'enforcement'
  | 'appellate'
  | 'administrative';

/** One sworn process in the affidavit library. */
export interface AffidavitTemplate {
  id: string;
  title: string;
  category: AffidavitCategoryId;
  /** One line on what the affidavit is for. */
  description: string;
  /** When a practitioner reaches for this affidavit. */
  whenToUse: string;
  /** Who ordinarily deposes to it. */
  deponent: string;
  /** The law under which it is sworn and any rule that requires it. */
  statutoryBasis: string[];
  /** Whether the deposition is filed under a court heading or sworn standalone. */
  courtHeadingRequired: boolean;
  /** Practice warnings — the defects that get affidavits struck out. */
  practiceNotes: string[];
  /** The full sworn text, with bracketed placeholders. */
  sampleText: string;
  /** Free-text search aids. */
  keywords: string[];
}

/** One courtroom procedure: what happens, in the order it happens. */
export interface CourtroomProcedure {
  id: string;
  title: string;
  /** The proceeding this belongs to, e.g. "Civil trial", "Criminal trial". */
  track: string;
  court: string;
  /** One line on what the procedure achieves. */
  summary: string;
  /** Roughly how long the step takes in real time. */
  typicalDuration: string;
  governingRules: string[];
  /** The stages of the procedure, each with the steps inside it. */
  stages: {
    heading: string;
    steps: string[];
  }[];
  /** What counsel actually says, in the register the court expects. */
  saidInCourt: string[];
  /** Where matters go wrong, and how to avoid it. */
  pitfalls: string[];
  keywords: string[];
}

/** One lesson in the "learn litigation with AI tools" curriculum. */
export interface AiLitigationLesson {
  id: string;
  title: string;
  /** The stage of litigation the lesson belongs to. */
  stage:
    | 'Case assessment'
    | 'Pleadings & drafting'
    | 'Research & authority'
    | 'Evidence'
    | 'Advocacy'
    | 'Appeals'
    | 'Practice management';
  level: 'Foundation' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  /** What the practitioner will be able to do after the lesson. */
  objective: string;
  /** What the AI does well here, in plain terms. */
  whatTheAiDoes: string;
  /** The litigation skill the AI is assisting — the lesson body. */
  body: string;
  /** Ready-made prompts the learner can send to the LAWPEX assistant. */
  prompts: { label: string; prompt: string }[];
  /** What must be checked by hand before the output goes near a court. */
  verificationSteps: string[];
  /** A task the learner does themselves to fix the skill. */
  exercise: string;
}

export interface AppealResource {
  id: string;
  title: string;
  appealCategory: 'Appeal as of Right' | 'Leave to Appeal' | 'Grounds of Appeal' | 'Notice of Appeal' | 'Timelines & Procedure';
  courtLevel: 'Supreme Court' | 'Court of Appeal';
  statutoryTimeframe: string;
  description: string;
  checklists: string[];
  templateDraftId?: string;
  relevantRules: string;
}

export interface CourtroomVideo {
  id: string;
  title: string;
  topic: 'Filing a Case' | 'Service of Processes' | 'Calling Witnesses' | 'Tendering Exhibits' | 'Examination-in-Chief' | 'Cross Examination' | 'Final Address' | 'Appeals Practice';
  duration: string;
  instructorName: string;
  instructorTitle: string;
  videoUrl: string;
  thumbnailUrl: string;
  summaryNotes: string;
  downloadableMaterials: string[];
}

export interface LegalArticle {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  category: string;
  publishedDate: string;
  readTimeMinutes: number;
  excerpt: string;
  fullContent: string;
  tags: string[];
}

export interface ComplianceGuide {
  id: string;
  sector: 'Banking & Financial' | 'Oil & Gas (NUPRC)' | 'Corporate Governance (CAMA)' | 'Data Protection (NDPR)' | 'Anti-Money Laundering (AML/KYC)' | 'Insurance (NAICOM)';
  title: string;
  overview: string;
  regulatoryBody: string;
  keyComplianceItems: {
    requirement: string;
    penalty: string;
    deadline: string;
  }[];
  checklist: string[];
}

export interface LearningCourse {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Senior Advocate Masterclass';
  modulesCount: number;
  durationHours: number;
  instructor: string;
  description: string;
  topics: string[];
  enrolledCount: number;
  certificateProvided: boolean;
}

export interface SavedItem {
  id: string;
  type: 'case' | 'statute' | 'rule' | 'draft' | 'article';
  title: string;
  citationOrRef: string;
  savedAt: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: string[];
  suggestedDraft?: string;
}
