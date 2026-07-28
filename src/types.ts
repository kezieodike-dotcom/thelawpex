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

export interface CaseLaw {
  id: string;
  title: string;
  citation: string;
  suitNumber: string;
  court: 'Supreme Court of Nigeria' | 'Court of Appeal' | 'Federal High Court' | 'National Industrial Court' | 'State High Court';
  year: number;
  presidingJudges: string[];
  areaOfLaw: string;
  subject: string;
  factsSummary: string;
  issuesForDetermination: string[];
  decisionSummary: string;
  ratioDecidendi: string[];
  obiterDicta?: string[];
  fullJudgmentText: string;
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
