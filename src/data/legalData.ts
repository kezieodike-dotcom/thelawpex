import {
  AreaOfLaw,
  CaseLaw,
  CourtRule,
  NigerianLaw,
  LegalDraft,
  AppealResource,
  CourtroomVideo,
  LegalArticle,
  ComplianceGuide,
  LearningCourse,
} from '../types';

export const AREAS_OF_LAW: AreaOfLaw[] = [
  {
    id: 'criminal-law',
    title: 'Criminal Law & Procedure',
    description: 'Administration of Criminal Justice Act (ACJA 2015), Penal Code, Criminal Code, Bail Applications, Charge Sheets & Criminal Appeals.',
    icon: 'ShieldAlert',
    popularTopics: ['Bail Pending Trial', 'Confessional Statements & Voir Dire', 'Section 84 Evidence Act (Electronic Evidence)', 'No-Case Submission', 'Plea Bargaining'],
    applicableStatutes: ['Administration of Criminal Justice Act 2015', 'Criminal Code Act Cap C38 LFN 2004', 'Penal Code Law', 'Evidence Act 2011 (as amended)'],
    keyRules: ['ACJA 2015 Practice Directions', 'High Court Criminal Procedure Rules'],
    principlesOfLaw: [
      'The prosecution bears the burden of proving the guilt of the accused beyond reasonable doubt (S.135 Evidence Act; Woolmington v. DPP).',
      'An accused is presumed innocent until proven guilty (S.36(5) 1999 Constitution).',
      'A confessional statement, if direct, positive and voluntary, can ground a conviction even without corroboration.'
    ],
    checklists: [
      'Confirm jurisdiction of court over the offence and the territory where it was committed',
      'Verify proper drafting of the charge/information and compliance with ACJA',
      'Assess admissibility of confessional statements and need for a trial-within-trial',
      'Evaluate whether a no-case submission is available at close of prosecution',
      'Compute custody time limits and bail entitlements'
    ],
    draftCount: 142,
    caseCount: 2850,
  },
  {
    id: 'civil-litigation',
    title: 'Civil Litigation & Advocacy',
    description: 'Writs of Summons, Originating Summons, Interlocutory Injunctions, Summary Judgment, Evidence, Enforcement of Judgments & Garnishee.',
    icon: 'Scale',
    popularTopics: ['Locus Standi', 'Summary Judgment Procedure', 'Garnishee Proceedings (S.84 SCBA)', 'Interlocutory & Mareva Injunctions', 'Service of Processes & Substituted Service'],
    applicableStatutes: ['Sheriffs and Civil Process Act', 'Evidence Act 2011', 'High Court Laws of States & FCT'],
    keyRules: ['Federal High Court Rules 2019', 'Lagos State High Court Rules 2019', 'FCT High Court Rules'],
    principlesOfLaw: [
      'Jurisdiction is a threshold issue; a defect in competence renders the entire proceedings a nullity (Madukolu v. Nkemdilim).',
      'Locus standi is determined from the four corners of the Statement of Claim (Salu v. Egeibon).',
      'He who asserts must prove; the burden of proof in civil cases is on the balance of probabilities.'
    ],
    checklists: [
      'Select the correct originating process (writ vs originating summons)',
      'Confirm the court has territorial and subject-matter jurisdiction',
      'Ensure proper service of originating process or obtain leave for substituted service',
      'File front-loaded documents: statement of claim, witness statements on oath, list of documents',
      'Diarise timelines for pleadings, pre-trial conference and hearing'
    ],
    draftCount: 310,
    caseCount: 4120,
  },
  {
    id: 'constitutional-law',
    title: 'Constitutional Law',
    description: 'Interpretation of the 1999 Constitution, Jurisdiction, Separation of Powers, Federalism, and Enforcement of Constitutional Guarantees.',
    icon: 'BookOpen',
    popularTopics: ['Locus Standi in Constitutional Matters', 'Fair Hearing (Section 36 1999 Constitution)', 'Executive & Legislative Powers', 'Doctrine of Covering the Field', 'Ouster Clauses'],
    applicableStatutes: ['1999 Constitution of FRN (as amended)', 'Interpretation Act'],
    keyRules: ['Supreme Court Rules', 'Court of Appeal Rules 2021'],
    principlesOfLaw: [
      'The Constitution is supreme and any law inconsistent with it is void to the extent of the inconsistency (S.1(3)).',
      'The Constitution must be given a broad, liberal and purposive interpretation (Nafiu Rabiu v. The State).',
      'Courts will not allow an ouster clause to cloak constitutional illegality (Inakoju v. Adeleke).'
    ],
    checklists: [
      'Identify the specific constitutional provision engaged',
      'Confirm which court has original/appellate jurisdiction over the question',
      'Establish standing to raise the constitutional issue',
      'Frame issues to invoke the interpretive jurisdiction of the court',
      'Consider joinder of the Attorney-General where public rights are affected'
    ],
    draftCount: 95,
    caseCount: 1980,
  },
  {
    id: 'human-rights',
    title: 'Human Rights & Fundamental Rights',
    description: 'Fundamental Rights Enforcement Procedure (FREP) Rules 2009, Chapter IV of the Constitution, and the African Charter on Human and Peoples’ Rights.',
    icon: 'HandHeart',
    popularTopics: ['FREP Rules 2009 Procedure', 'Unlawful Arrest & Detention', 'Right to Dignity & Freedom from Torture', 'Enforcement Against the State', 'Public Interest Litigation'],
    applicableStatutes: ['1999 Constitution Chapter IV', 'African Charter on Human and Peoples Rights (Ratification & Enforcement) Act', 'Anti-Torture Act 2017'],
    keyRules: ['Fundamental Rights (Enforcement Procedure) Rules 2009'],
    principlesOfLaw: [
      'Fundamental rights are antecedent to the political society and stand above ordinary law (Ransome-Kuti v. AGF).',
      'The FREP Rules 2009 relaxed the requirement of locus standi to widen access to justice for human rights.',
      'The State and its agents are liable for the infraction of fundamental rights (Abacha v. Fawehinmi).'
    ],
    checklists: [
      'Confirm the right allegedly breached falls under Chapter IV or the African Charter',
      'Commence by originating motion or application under the FREP Rules 2009',
      'Attach a statement, verifying affidavit and written address',
      'Join the appropriate respondents including State agencies',
      'Claim declaratory reliefs, injunctions, and compensation'
    ],
    draftCount: 88,
    caseCount: 1460,
  },
  {
    id: 'corporate-law',
    title: 'Corporate & Commercial Law (CAMA 2020)',
    description: 'Companies and Allied Matters Act 2020, CAC filings, Shareholders Disputes, Winding Up, Derivative Actions & Insolvency.',
    icon: 'Building2',
    popularTopics: ['Minority Protection (Foss v. Harbottle exceptions)', 'Winding-Up Petitions', 'Directorship Removal & Duties', 'Insolvency & Business Recovery'],
    applicableStatutes: ['Companies and Allied Matters Act 2020', 'Investment and Securities Act 2007', 'CAC Regulations 2021'],
    keyRules: ['Companies Winding Up Rules', 'Federal High Court Insolvency Rules'],
    principlesOfLaw: [
      'A company is a legal person distinct from its members (Salomon v. Salomon; S.42 CAMA 2020).',
      'The rule in Foss v. Harbottle: the proper claimant for a wrong done to a company is the company itself, subject to statutory exceptions.',
      'Directors owe fiduciary duties to act bona fide in the best interest of the company (S.305 CAMA 2020).'
    ],
    checklists: [
      'Confirm the Federal High Court’s exclusive jurisdiction over CAMA matters',
      'Verify capacity to sue (member, director, creditor, or the company)',
      'Assess whether a derivative action requires leave of court',
      'Check statutory pre-conditions for winding-up petitions',
      'Confirm proper CAC filings and corporate resolutions'
    ],
    draftCount: 210,
    caseCount: 1650,
  },
  {
    id: 'banking-finance',
    title: 'Banking & Finance Law',
    description: 'BOFIA 2020, CBN Guidelines, the Banker-Customer relationship, dishonoured instruments, mortgages, receivership and debt recovery.',
    icon: 'Coins',
    popularTopics: ['Duty of Care owed by Bank to Customer', 'Garnishee Order Nisi vs Absolute', 'Mortgages & Receiver Management', 'Dishonoured Cheques', 'Debt Recovery & Undefended List'],
    applicableStatutes: ['Banks and Other Financial Institutions Act (BOFIA) 2020', 'Central Bank of Nigeria Act 2007', 'Bills of Exchange Act'],
    keyRules: ['Federal High Court Rules 2019', 'State High Court (Undefended List) Rules'],
    principlesOfLaw: [
      'The banker-customer relationship is fundamentally that of debtor and creditor.',
      'A garnishee order nisi must be made absolute before funds attach; consent of the AG is required for public funds (S.84 Sheriffs and Civil Process Act).',
      'A bank owes its customer a duty of care in the operation of the account.'
    ],
    checklists: [
      'Confirm the appropriate forum (Federal High Court vs State High Court)',
      'Verify the loan/security documentation and default position',
      'Consider undefended list or summary judgment procedure for liquidated sums',
      'For enforcement, decide between garnishee, fieri facias, or receivership',
      'Check limitation periods for the recovery action'
    ],
    draftCount: 115,
    caseCount: 890,
  },
  {
    id: 'tax-law',
    title: 'Tax & Revenue Law',
    description: 'Companies Income Tax, VAT, Personal Income Tax, the Finance Acts, Tax Appeal Tribunal procedure and FIRS assessments and objections.',
    icon: 'Receipt',
    popularTopics: ['FIRS Assessments & Objections', 'Tax Appeal Tribunal Procedure', 'Value Added Tax Disputes', 'Company Income Tax Reliefs', 'Stamp Duties'],
    applicableStatutes: ['Companies Income Tax Act', 'Value Added Tax Act', 'Personal Income Tax Act', 'Federal Inland Revenue Service (Establishment) Act', 'Finance Acts 2019-2023'],
    keyRules: ['Tax Appeal Tribunal (Procedure) Rules 2021'],
    principlesOfLaw: [
      'A tax statute must be construed strictly; there is no equity in a taxing statute.',
      'A taxpayer aggrieved by an assessment must first exhaust the objection and appeal procedure before the Tax Appeal Tribunal.',
      'The burden is on the taxpayer to displace an assessment properly raised by the revenue authority.'
    ],
    checklists: [
      'Confirm the tax type and the assessing authority (FIRS or State IRS)',
      'Diarise the 30-day window to object to an assessment',
      'File a notice of appeal at the Tax Appeal Tribunal within the statutory period',
      'Compile the audited accounts and supporting documentation',
      'Assess availability of reliefs, exemptions and pioneer status'
    ],
    draftCount: 84,
    caseCount: 610,
  },
  {
    id: 'election-petitions',
    title: 'Election Petitions',
    description: 'Electoral Act 2022, BVAS accreditation evidence, Pre-election & Post-election matters, 180-day tribunal deadlines & Qualifications.',
    icon: 'Vote',
    popularTopics: ['Section 134 Electoral Act 2022 Grounds', 'BVAS Backend Credentials & S.84 Evidence', 'Pre-Election Disqualification (S.285 Constitution)', 'Non-Compliance Standard'],
    applicableStatutes: ['Electoral Act 2022', 'Constitution 1999 S.285'],
    keyRules: ['Election Tribunal Practice Directions 2022', 'Court of Appeal Election Rules'],
    principlesOfLaw: [
      'Election petitions are sui generis and governed strictly by time; the tribunal must deliver judgment within 180 days (S.285 Constitution).',
      'A petitioner alleging non-compliance must prove that it was substantial and affected the result (S.135 Electoral Act 2022).',
      'Votes in Nigerian elections belong to political parties, not individual candidates (Amaechi v. INEC).'
    ],
    checklists: [
      'Confirm the ground(s) under S.134 Electoral Act 2022',
      'File the petition within 21 days of declaration of result',
      'Plead scores and comply with mandatory contents of a petition',
      'Secure BVAS and INEC backend records via subpoena/certification',
      'Track the 180-day and 60-day appeal timelines'
    ],
    draftCount: 78,
    caseCount: 1240,
  },
  {
    id: 'land-property',
    title: 'Land & Property Law',
    description: 'Land Use Act 1978, Certificate of Occupancy (C of O), Action for Declaration of Title, Trespass & Recovery of Premises.',
    icon: 'Landmark',
    popularTopics: ['5 Ways of Proving Title (Idundun v. Okumagba)', 'Overriding Public Interest Revocation', 'Governor\'s Consent requirement (S.22 LUA)', 'Tenancy Notices & Recovery of Possession'],
    applicableStatutes: ['Land Use Act 1978 Cap L5 LFN', 'Recovery of Premises Laws of States', 'Registration of Titles Laws'],
    keyRules: ['High Court Land Registry Rules'],
    principlesOfLaw: [
      'Title to land may be proved in any of five ways (Idundun v. Okumagba).',
      'All land in a State is vested in the Governor in trust; alienation of a statutory right of occupancy requires the Governor’s consent (S.1 & S.22 Land Use Act).',
      'A claimant for declaration of title must succeed on the strength of his own case, not the weakness of the defence.'
    ],
    checklists: [
      'Identify the mode(s) of proving title to be relied upon',
      'Obtain a composite survey plan showing the land in dispute',
      'Verify the root of title and chain of devolution',
      'Confirm Governor’s consent and registration of instruments',
      'For recovery of premises, serve the correct statutory notices'
    ],
    draftCount: 185,
    caseCount: 2910,
  },
  {
    id: 'probate-estates',
    title: 'Probate & Administration of Estates',
    description: 'Wills, grants of probate, letters of administration, caveats, contentious probate and the distribution of testate and intestate estates.',
    icon: 'ScrollText',
    popularTopics: ['Grant of Probate', 'Letters of Administration', 'Caveat & Contentious Probate', 'Validity & Revocation of Wills', 'Intestate Succession'],
    applicableStatutes: ['Wills Act / Wills Laws of States', 'Administration of Estates Laws', 'Succession Law Edicts'],
    keyRules: ['High Court (Probate) Rules of States'],
    principlesOfLaw: [
      'A valid will must comply with the statutory formalities of writing, signature and attestation by two witnesses.',
      'A beneficiary who witnesses a will forfeits any gift under it.',
      'Where a person dies intestate, the estate devolves according to the applicable law or custom, subject to constitutional guarantees against discrimination (Ukeje v. Ukeje).'
    ],
    checklists: [
      'Determine whether the deceased died testate or intestate',
      'Identify entitled applicants for the grant',
      'File the application with the death certificate, will (if any) and inventory',
      'Search for and respond to any caveat entered against the grant',
      'Account for estate assets, debts and estate duty'
    ],
    draftCount: 96,
    caseCount: 540,
  },
  {
    id: 'matrimonial-causes',
    title: 'Matrimonial Causes',
    description: 'Matrimonial Causes Act, dissolution and nullity of statutory marriage, ancillary financial relief and settlement of property.',
    icon: 'Rings',
    popularTopics: ['Grounds for Divorce (Irretrievable Breakdown)', 'Nullity of Marriage', 'Ancillary Relief & Settlement', 'Decree Nisi & Decree Absolute', 'Judicial Separation'],
    applicableStatutes: ['Matrimonial Causes Act Cap M7 LFN', 'Marriage Act'],
    keyRules: ['Matrimonial Causes Rules 1983'],
    principlesOfLaw: [
      'There is one ground for dissolution of a statutory marriage — that the marriage has broken down irretrievably (S.15 Matrimonial Causes Act).',
      'A decree nisi does not dissolve the marriage until it is made absolute.',
      'The court may not make a decree absolute where arrangements for the children are unsatisfactory.'
    ],
    checklists: [
      'Confirm the marriage is statutory (Act) and the court has jurisdiction',
      'Establish one or more of the facts evidencing irretrievable breakdown',
      'Comply with the two-year rule for petitions early in the marriage',
      'Frame claims for ancillary financial relief and settlement of property',
      'Diarise the interval between decree nisi and decree absolute'
    ],
    draftCount: 96,
    caseCount: 520,
  },
  {
    id: 'family-law',
    title: 'Family Law & Child Rights',
    description: 'Custody, guardianship and maintenance of children, the Child Rights Act 2003, adoption, and protection from domestic violence.',
    icon: 'Heart',
    popularTopics: ['Best Interest of the Child in Custody', 'Child Rights Act Protections', 'Adoption Procedure', 'Maintenance & Access', 'Domestic Violence Protection Orders'],
    applicableStatutes: ['Child Rights Act 2003', 'Violence Against Persons (Prohibition) Act 2015', 'Marriage Act'],
    keyRules: ['Family Court Rules of States', 'Child Rights Act procedural rules'],
    principlesOfLaw: [
      'In every matter concerning a child, the best interest of the child is the paramount consideration (Child Rights Act 2003).',
      'A child has the right to be heard in proceedings affecting the child, according to age and maturity.',
      'Custody is not a reward or punishment for the parents but a determination of the child’s welfare.'
    ],
    checklists: [
      'Confirm the Family Court’s jurisdiction over the child matter',
      'Assess the child’s welfare, wishes and living arrangements',
      'Determine custody, access and maintenance reliefs sought',
      'For adoption, verify statutory eligibility and consents',
      'Consider protection orders where domestic violence is alleged'
    ],
    draftCount: 88,
    caseCount: 460,
  },
  {
    id: 'labour-employment',
    title: 'Labour & Employment Law (NICN)',
    description: 'National Industrial Court of Nigeria Act 2006, S.254C Jurisdiction, Wrongful Termination, Workplace Harassment & Redundancy.',
    icon: 'Briefcase',
    popularTopics: ['Unfair Labour Practice S.254C', 'Constructive Dismissal', 'Reinstatement vs Damages', 'Trade Union Disputes & Strike Orders'],
    applicableStatutes: ['Labour Act Cap L1 LFN 2004', 'National Industrial Court Act 2006', 'Factories Act'],
    keyRules: ['National Industrial Court Civil Procedure Rules 2017'],
    principlesOfLaw: [
      'The NICN has exclusive jurisdiction over labour, employment and industrial relations matters (S.254C Constitution).',
      'In master-servant employment, an unlawful termination sounds in damages, not reinstatement, unless the employment has statutory flavour.',
      'The NICN may apply international best practices and ratified conventions in unfair labour practice claims.'
    ],
    checklists: [
      'Characterise the employment (master-servant vs statutory flavour)',
      'Confirm the NICN’s exclusive jurisdiction over the dispute',
      'Assess whether termination followed the contract and fair procedure',
      'Quantify entitlements: salary in lieu, benefits, and damages',
      'Consider trade dispute and collective bargaining dimensions'
    ],
    draftCount: 130,
    caseCount: 1150,
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property & Technology',
    description: 'Trademarks Act, Copyright Act 2022, Patents and Designs, Software Copyright, Passing Off & Data Protection (NDPA 2023).',
    icon: 'Cpu',
    popularTopics: ['Action for Passing Off', 'Copyright Infringement in Digital Media', 'Trademark Infringement & Rectification', 'Nigeria Data Protection Act 2023 Remedies'],
    applicableStatutes: ['Copyright Act 2022', 'Trademarks Act Cap T13 LFN', 'Patents and Designs Act', 'Nigeria Data Protection Act 2023'],
    keyRules: ['Federal High Court Intellectual Property Practice Directions'],
    principlesOfLaw: [
      'The Federal High Court has exclusive jurisdiction over copyright, patents, trademarks and designs.',
      'To succeed in passing off, a claimant must prove goodwill, misrepresentation and damage (the classic trinity).',
      'Copyright subsists automatically in an original work fixed in a definite medium of expression.'
    ],
    checklists: [
      'Confirm subsistence and ownership of the IP right',
      'Verify registration status (trademarks, patents, designs)',
      'Establish the acts constituting infringement or passing off',
      'Consider Anton Piller and interlocutory injunctive relief',
      'Assess remedies: injunction, damages/account of profits, delivery up'
    ],
    draftCount: 65,
    caseCount: 390,
  },
  {
    id: 'maritime-admiralty',
    title: 'Maritime & Admiralty Law',
    description: 'Admiralty Jurisdiction Act, arrest of ships in rem, bills of lading, carriage of goods by sea, maritime liens and limitation of liability.',
    icon: 'Ship',
    popularTopics: ['Admiralty Arrest in Rem', 'Maritime Lien vs Statutory Right in Rem', 'Bills of Lading & Carriage of Goods', 'Limitation of Liability', 'Ship Mortgages'],
    applicableStatutes: ['Admiralty Jurisdiction Act Cap A5 LFN', 'Merchant Shipping Act 2007', 'Nigerian Maritime Administration and Safety Agency (NIMASA) Act'],
    keyRules: ['Federal High Court (Admiralty Jurisdiction Procedure) Rules 2011'],
    principlesOfLaw: [
      'Admiralty jurisdiction is vested exclusively in the Federal High Court.',
      'An action in rem is brought against the ship (res) itself and founds jurisdiction upon its arrest.',
      'A maritime lien travels with the ship notwithstanding a change of ownership.'
    ],
    checklists: [
      'Determine whether the claim is a maritime claim under the Admiralty Jurisdiction Act',
      'Decide between an action in rem (against the ship) and in personam',
      'Prepare the warrant of arrest and supporting affidavit',
      'Provide for security and undertaking as to damages',
      'Confirm applicable international conventions and bills of lading terms'
    ],
    draftCount: 60,
    caseCount: 420,
  },
  {
    id: 'aviation-law',
    title: 'Aviation Law',
    description: 'Civil Aviation Act, passenger rights, carrier liability under the Montreal Convention, and Nigerian Civil Aviation Authority regulation.',
    icon: 'Plane',
    popularTopics: ['Carrier Liability (Montreal Convention)', 'Passenger Compensation & Delayed Flights', 'Baggage & Cargo Claims', 'NCAA Consumer Protection Regulations', 'Aircraft Leasing (Cape Town Convention)'],
    applicableStatutes: ['Civil Aviation Act 2022', 'Montreal Convention 1999 (domesticated)', 'Nigeria Civil Aviation Regulations (Nig.CARs)'],
    keyRules: ['Federal High Court Rules 2019'],
    principlesOfLaw: [
      'Carrier liability for international carriage by air is governed by the Montreal Convention as domesticated by the Civil Aviation Act.',
      'The Convention provides the exclusive cause of action and remedy for covered claims, ousting inconsistent common law claims.',
      'Liability limits apply unless the damage resulted from an act done with intent to cause damage or recklessly.'
    ],
    checklists: [
      'Classify the carriage as domestic or international',
      'Confirm applicability of the Montreal Convention and its limitation periods',
      'Establish the head of claim (death/injury, delay, baggage, cargo)',
      'Observe the two-year time bar for actions under the Convention',
      'Assess the applicable liability caps and special declarations of value'
    ],
    draftCount: 42,
    caseCount: 280,
  },
  {
    id: 'insurance-law',
    title: 'Insurance Law',
    description: 'Insurance Act, NAICOM regulation, principles of utmost good faith and indemnity, subrogation, and claims and coverage disputes.',
    icon: 'ShieldCheck',
    popularTopics: ['Utmost Good Faith (Uberrimae Fidei)', 'Insurable Interest', 'Subrogation & Contribution', 'Repudiation of Claims', 'Compulsory Insurances'],
    applicableStatutes: ['Insurance Act 2003', 'National Insurance Commission (NAICOM) Act', 'Marine Insurance Act'],
    keyRules: ['High Court Civil Procedure Rules of States'],
    principlesOfLaw: [
      'A contract of insurance is one of utmost good faith requiring full disclosure of all material facts.',
      'The insured must have an insurable interest in the subject matter of the insurance.',
      'Indemnity insurance places the insured in the same position as before the loss — no more, no less.'
    ],
    checklists: [
      'Verify the policy wording, coverage and exclusions',
      'Confirm insurable interest and disclosure at inception',
      'Assess whether a warranty or condition has been breached',
      'Establish proof of loss and quantum',
      'Consider subrogation and contribution among insurers'
    ],
    draftCount: 54,
    caseCount: 360,
  },
  {
    id: 'energy-law',
    title: 'Energy & Natural Resources Law',
    description: 'Petroleum Industry Act 2021, oil and gas licensing, host community relations, electricity regulation and environmental obligations.',
    icon: 'Zap',
    popularTopics: ['Petroleum Industry Act 2021 Framework', 'Host Community Development Trusts', 'Oil Prospecting & Mining Leases', 'Electricity Act 2023', 'Gas Flaring & Environmental Liability'],
    applicableStatutes: ['Petroleum Industry Act 2021', 'Electricity Act 2023', 'Nigerian Oil and Gas Industry Content Development Act 2010'],
    keyRules: ['Federal High Court Rules 2019'],
    principlesOfLaw: [
      'Ownership and control of petroleum resources is vested in the Federal Government (S.1 PIA 2021).',
      'Licensees owe statutory obligations to host communities through Host Community Development Trusts under the PIA.',
      'The polluter-pays principle informs liability for environmental damage in the sector.'
    ],
    checklists: [
      'Identify the licence/lease and the regulator (NUPRC/NMDPRA/NERC)',
      'Confirm local content and host community obligations',
      'Assess environmental and decommissioning liabilities',
      'Review the fiscal and royalty regime under the PIA',
      'Map dispute resolution clauses (arbitration vs court)'
    ],
    draftCount: 58,
    caseCount: 340,
  },
  {
    id: 'environmental-law',
    title: 'Environmental Law',
    description: 'NESREA Act, Environmental Impact Assessment, oil pollution liability, environmental rights and enforcement against polluters.',
    icon: 'Leaf',
    popularTopics: ['Environmental Impact Assessment', 'Oil Spill & Pollution Liability', 'NESREA Enforcement', 'Environmental Human Rights (Gbemre v. Shell)', 'Waste & Emissions Regulation'],
    applicableStatutes: ['National Environmental Standards and Regulations Enforcement Agency (NESREA) Act 2007', 'Environmental Impact Assessment Act', 'Oil Pipelines Act'],
    keyRules: ['Federal High Court Rules 2019', 'Fundamental Rights (Enforcement Procedure) Rules 2009'],
    principlesOfLaw: [
      'Development projects with significant environmental impact require a prior Environmental Impact Assessment.',
      'The polluter-pays principle imposes liability for the cost of remediation on the party responsible for pollution.',
      'A clean and healthy environment has been linked to the right to life and dignity (Gbemre v. Shell).'
    ],
    checklists: [
      'Determine the regulatory regime and competent agency',
      'Confirm whether an EIA was required and conducted',
      'Establish causation between the activity and the environmental harm',
      'Quantify remediation, restoration and compensation claims',
      'Consider public interest and representative action dimensions'
    ],
    draftCount: 40,
    caseCount: 260,
  },
  {
    id: 'arbitration-adr',
    title: 'Arbitration & ADR',
    description: 'Arbitration and Mediation Act 2023, Enforcement of Arbitral Awards, Setting Aside Awards & Multi-Door Court House Practice.',
    icon: 'Handshake',
    popularTopics: ['Enforcement under New AMA 2023', 'Arbitration Clause as Independent Contract', 'Setting Aside Award on Misconduct', 'Emergency Arbitrators', 'Mediation & Multi-Door Court House'],
    applicableStatutes: ['Arbitration and Mediation Act 2023 (AMA)', 'New York Convention (Third Schedule, AMA)'],
    keyRules: ['Arbitration Proceedings Rules 2023', 'Lagos Multi-Door Court House Rules'],
    principlesOfLaw: [
      'An arbitration clause is separable and survives the invalidity of the main contract (S.5 AMA 2023).',
      'The competence-competence principle allows the tribunal to rule on its own jurisdiction.',
      'Courts will only set aside an award on the narrow grounds specified in S.55 AMA 2023.'
    ],
    checklists: [
      'Confirm the existence and scope of a valid arbitration agreement',
      'Constitute the tribunal per the agreed rules or the AMA default',
      'Observe party autonomy on seat, language and procedure',
      'For enforcement, invoke the AMA and the New York Convention',
      'Preserve grounds and timelines for setting-aside applications'
    ],
    draftCount: 72,
    caseCount: 640,
  }
];

export const LANDMARK_CASES: CaseLaw[] = [
  {
    id: 'case-001',
    title: 'Amaechi v. Independent National Electoral Commission (INEC) & Ors',
    citation: '(2008) LDLR (SC) pt 1001',
    sourceUrl: 'https://lawcarenigeria.com/rt-hon-rotimi-chubuike-amaechi-v-inec-2-ors/',
    hasFullJudgment: true,
    suitNumber: 'SC.252/2007',
    court: 'Supreme Court of Nigeria',
    year: 2008,
    presidingJudges: ['Katsina-Alu, JSC (Presiding)', 'Musdapher, JSC', 'Onnoghen, JSC', 'Aderemi, JSC', 'Oguntade, JSC'],
    areaOfLaw: 'Election Petitions & Constitutional Law',
    subject: 'Internal Party Primaries, Substitution of Candidates and Declaratory Orders',
    factsSummary: 'Rotimi Amaechi won the PDP governorship primaries in Rivers State. Without cogent or verifiable reasons as required by S.34 Electoral Act 2006, PDP substituted his name with Celestine Omehia. Omehia went on to win the election. Amaechi challenged the illegal substitution.',
    issuesForDetermination: [
      'Whether the substitution of Rotimi Amaechi without compliance with S.34 Electoral Act 2006 was lawful.',
      'Whether the Court could declare Amaechi the duly elected Governor when his name was not on the ballot paper on election day.'
    ],
    decisionSummary: 'Supreme Court held unanimously that the substitution was illegal, null and void. In law, parties vote for political parties and not individual candidates. Therefore, Amaechi who was the validly nominated candidate was declared the duly elected Governor of Rivers State.',
    ratioDecidendi: [
      `Where a candidate for an election is wrongfully substituted by another, on obtaining judgment; he steps into the shoes of his invalidly nominated opponent whether as loser or winner`,
      `The word ‘shall’ in section 34(2) of the Electoral Act 2006 is mandatory and not directory – a party must give cogent and verifiable reasons for changing its candidate`,
      `It is a political party that is obliged to give cogent and verifiable reasons in it’s application to substitute a candidate for an election under the Electoral Act 2006`,
      `The doctrine of lis pendens prevents any transfer of any right or the taking of any step capable of foisting a state of helplessness on the parties or the court during the pendency in court of an action and after the action`,
      `(b) In any event, I do not accept the argument that a mere accusation or charge or indictment is sufficient for the purpose of section 34 of the Electoral Act, 2006 having regard to the requirement that the reason of indictment must be cogent and verifiable particularly as the word “verify” connotes to prove to be true, to confirm, to establish the truth of: to examine or test the correctness or authenticity of something. If the word is used, as in the instant case in a statute, it is presumed to have been used in its legal sense meaning to confirm or substantiate by oath or affidavit – see Action Congress v. INEC. The above being the position it follows therefore that even if an indictment was proved to exist, there is the additional requirement that it be proved to be true, which still does not exist in this case. – Per Onnoghen, JSC (Pg. 144)`,
    ],
    obiterDicta: [
      'Political parties must respect their own constitutions and guidelines for primary elections to prevent judicial intervention in internal party management.'
    ],
    keyPrinciples: [
      'S.34 Electoral Act requires "cogent and verifiable reasons" for substitution of candidate.',
      'Consequential order of Supreme Court declaring winner without fresh election.',
      'Votes in Nigerian general elections belong to political parties.'
    ],
    isLandmark: true,
  },
  {
    id: 'case-002',
    title: 'Salu v. Egeibon',
    citation: '(1994) LDLR (SC) pt 1002',
    sourceUrl: 'https://lawcarenigeria.com/salu-v-egeibon/',
    hasFullJudgment: true,
    suitNumber: 'SC.114/1989',
    court: 'Supreme Court of Nigeria',
    year: 1994,
    presidingJudges: ['Uwais, JSC (Presiding)', 'Belgore, JSC', 'Wali, JSC', 'Kutigi, JSC'],
    areaOfLaw: 'Civil Litigation & Advocacy',
    subject: 'Locus Standi, Cause of Action and Threshold Competence of Court',
    factsSummary: 'The Appellant sued challenging the alienation of family property. The Respondent raised a preliminary objection that Appellant lacked locus standi to institute the action as he failed to show special interest or injury above the general public.',
    issuesForDetermination: [
      'What constitutes locus standi in civil actions?',
      'Whether the statement of claim disclosed a reasonable cause of action and sufficient standing.'
    ],
    decisionSummary: 'Supreme Court affirmed the dismissal of the suit. Locus standi is a threshold issue touching on jurisdiction. A plaintiff must show a sufficient legal interest that has been directly infringed.',
    ratioDecidendi: [
      `A court is not bound to grant an adjournment as the question whether to grant an adjournment is a matter of discretion and it depends on the facts and circumstances of each particular case. See Odusote v. Odusote (1971) 1 NMLR 228; (1971) 1 All NLR 219 and Nigeria Ports Authority v. Construzioni G. F Cogefar SPA., (1974) 12 SC 81 at pp. 91. Where an application for an adjournment is made to a court, the court should bear in mind the requirement that justice should be done to both parties and that it is also in the interest of justice that the hearing of a case should not be unduly delayed. It should grant it if a refusal of the application is most likely to defeat the rights of the parties altogether or be an injustice to one or the other of them, unless there is a good or sufficient cause for such refusal, otherwise an appellate court will not only have power but will be under a duty to review the ruling refusing the application- PER ADIO JSC.`,
      `A trial court, ought to weigh the reasons given for the application for adjournment and the surrounding circumstances. A Judge must balance the requirements of fair hearing with the requirements for hearing to be within a reasonable time. By using the word reasonable in section 33(1) the framers of the constitution have given enough wide discretion to enable a court to conduct this balancing act. Where the requirements of fair hearing outweigh the necessity for a speedy trial a Judge or court should not hesitate to grant an application for an adjournment. Where however a party indulges in dilatory tactics, it could not be said that party is aiming at a fair hearing rather, that party is using the due process to defeat justice being done to the opposing party. In such a case a Judge or court should have enough courage not to lend weight to such act of filibustering and should be firm in refusing unnecessary application for adjournment- PER OGUNDARE JSC.`,
      `To acknowledge the resounding authorities of Kodinlinye v. Odu (1935) 2 WACA 336 and its precursor authority on the same issue in Ekpo v. Ita 11 NLR 68 that it is for the plaintiff who seeks declaration of title to offer prolific evidence in proof of such a disputed fact coupled with positive acts of user so numerous over a length of time to indicate ownership is not so much to belabour those authorities in this instance but to openly acknowledge them- PER OGUNDARE JSC.`,
      `Ordinarily if a plaintiff claiming that he is entitled to statutory right of occupancy in relation to parcel of land fails to establish by evidence the boundaries of the land, the proper order to make is one dismissing his claim. See Imah v. Okogbe, (1993) 9 NWLR (Pt.316) 159- PER ADIO JSC.`,
      `If a principle of natural justice is violated, it does not matter whether if the proper thing had been done the decision would have been the same; the proceedings will still be null and void. In other words, if the principles of natural justice are violated in respects of any decision, it is immaterial whether the same decision would have been arrived at in the absence of the departure from the essential principles of justice. The decision must be declared to be no decision. See Adigun v. A.-T., of Oyo State (1987) 1 NWLR. (Pt.53) 678- PER ADIO JSC.`,
      `An appellate court is entitled to interfere with the exercise of discretion of a trial court if the appellate court is satisfied that it is in the interest of justice to do so. See Ceekay Traders Ltd., v. General Motors Ltd., (1992) 2 NWLR (Pt. 222) 132- PER ADIO JSC.`,
    ],
    keyPrinciples: [
      'Locus standi is determined strictly from the 4 corners of the Statement of Claim.',
      'Jurisdiction is a threshold matter that can be raised at any stage of proceedings.'
    ],
    isLandmark: true,
  },
  {
    id: 'case-003',
    title: 'Madukolu & Ors v. Nkemdilim',
    citation: '(1962) LDLR (SC) pt 1003',
    sourceUrl: 'https://lawcarenigeria.com/gabriel-madukolu-ors-v-johnson-nkemdilim-2/',
    hasFullJudgment: true,
    suitNumber: 'F.S.C. 344/1961',
    court: 'Supreme Court of Nigeria',
    year: 1962,
    presidingJudges: ['Bairamian, FJ (Delivered Leading Judgment)'],
    areaOfLaw: 'Civil Litigation & Advocacy',
    subject: 'Conditions Precedent to Exercise of Judicial Jurisdiction',
    factsSummary: 'Land dispute where proceedings were initiated without satisfying statutory notice conditions under native court rules. The fundamental question was whether the court had jurisdiction to hear the matter.',
    issuesForDetermination: ['What are the essential ingredients that confer competence and jurisdiction on a court of law?'],
    decisionSummary: 'The Federal Supreme Court established the bedrock 3-pronged test for judicial jurisdiction in Nigeria.',
    ratioDecidendi: [
      `To revert to the portions of record quoted above, the Native Court, that instead of having a full re-hearing, had the evidence of the former witnesses read out, and heard only witnesses from the other sub-families. That was a defect in procedure; neither party complained of it in the subsequent appeals. The re-hearing was not a nullity on that account.`,
      `If it was a nullity, it would be, under condition (3) of the above statement on competence, on the ground that the District Officer’s order, which initiated the re-hearing, was bad in law. The order was in these terms`,
      `I set aside the judgment of the Court below and order that the case be re-opened to enable witnesses to be called from the other two sub-families of Umuonala.`,
      `If that means that the re-hearing is to be confined to witnesses from those sub-families, the order is bad; if it means that there is to be a re-hearing for the sake of enabling such witnesses to be heard but does not confine it to them, it is not bad.`,
      `It may be suggested that the order is ambiguous and should be interpreted in the light of the paragraph which precedes it; but that is itself ambiguous and in my view cannot have any real weight. For my part I think that the order should be interpreted in the light of the maxim ut res magis valeat, and the second meaning which saves the order, should be adopted. Moreover, it was so understood by the Native Court to which it was addressed: at the outset that court had the former evidence read out, presumably as a method of incorporating it and of saving itself from hearing it again.`,
      `I therefore think that the re-hearing was not a nullity. At the same time I should add that as the point arose incidentally ex improvise, it was not argued at all fully and no cases were cited.`,
    ],
    keyPrinciples: [
      '3 cardinal requirements for court competence.',
      'Any defect in competence renders proceedings a nullity no matter how well conducted.'
    ],
    isLandmark: true,
  },
  {
    id: 'case-004',
    title: 'Inakoju v. Adeleke & Ors',
    citation: '(2007) LDLR (SC) pt 1004',
    sourceUrl: 'https://sheriahub.com/cases/ng/caselaw/hon-muyiwa-inakoju-ibadan-south-east-and-others-v-hon-adeleke-speaker-and-others-sc-2722006-2007-ngsc-30-12-january-2007-sc-2722006-1960-ngsc-1-11-january-2007',
    hasFullJudgment: true,
    suitNumber: 'SC.272/2006',
    court: 'Supreme Court of Nigeria',
    year: 2007,
    presidingJudges: ['Musdapher, JSC', 'Katsina-Alu, JSC', 'Niki Tobi, JSC'],
    areaOfLaw: 'Constitutional Law',
    subject: 'Impeachment of Governor under Section 188 of 1999 Constitution',
    factsSummary: 'Impeachment proceedings against Governor Rasheed Ladoja of Oyo State held in a hotel room by 18 members of the House of Assembly without compliance with constitutional 2/3rd quorum and panel procedures.',
    issuesForDetermination: ['Whether courts can inquire into impeachment proceedings despite the ousted clause in S.188(10) of the Constitution.'],
    decisionSummary: 'Supreme Court held that section 188(10) ouster clause only applies if the House of Assembly strictly complied with all constitutional preconditions in S.188(1)-(9). Where procedure is breached, courts have jurisdiction to strike down the impeachment.',
    ratioDecidendi: [
      `They also contended that the claims did not disclose a reasonable cause of action.`,
      `By the combined effect of the above provisions therefore, and having regard to the nature of the reliefs claimed by the plaintiffs, it is clear beyond argument that the jurisdiction of this court is clearly ousted.`,
      `Fortunately, society and its people are not totally helpless as the Judiciary, in the performance of its judicial functions under section 6 of the Constitution, is alive to check acts of violation, breach and indiscretions on the part of the Legislature.`,
    ],
    keyPrinciples: [
      'Non-compliance with constitutional steps voids S.188 impeachment.',
      'Judicial review of legislative impeachment proceedings.'
    ],
    isLandmark: true,
  },
  {
    id: 'case-005',
    title: 'Kubor v. Dickson',
    citation: '(2013) LDLR (SC) pt 1005',
    sourceUrl: 'https://lawcarenigeria.com/dr-imoro-kubor-anor-v-hon-seriake-henry-dickson-ors/',
    hasFullJudgment: true,
    suitNumber: 'SC.369/2012',
    court: 'Supreme Court of Nigeria',
    year: 2013,
    presidingJudges: ['Onnoghen, JSC', 'Rhodes-Vivour, JSC'],
    areaOfLaw: 'Civil Litigation & Advocacy',
    subject: 'Admissibility of Computer Generated Evidence under Section 84 Evidence Act 2011',
    factsSummary: 'Tendering of internet printouts from website without attaching S.84 certificate of compliance certifying the operational condition of the computer printer.',
    issuesForDetermination: ['Is a certificate mandatory under Section 84(2) & (4) for electronic and computer printout evidence?'],
    decisionSummary: 'Supreme Court held that compliance with S.84 Evidence Act 2011 is mandatory. Computer printouts tendered without a S.84 Certificate of Compliance are inadmissible in law.',
    ratioDecidendi: [
      `I have to state from the onset that it is settled law that issues for trial are joined in the pleadings and that parties and indeed the court are bound by the pleadings of the parties. PER WALTER SAMUEL NKANU ONNOGHEN, J.S.C.`,
      `it is necessary for us to know what the law/constitution provides as the requirement that a candidate for that office must possess. In that respect, we have to take a look at Section 177 of the Constitution of the Federal Republic of Nigeria, 1999, as amended, (hereinafter referred to as the 1999 Constitution, as amended) which provides as follows:-`,
      `“A person shall be qualified for election to the Office of Governorship of a state if:`,
      `(iii) He is a member of a political party and is sponsored by that political party, and;`,
      `(iv) He has been educated up to at least School Certificate Level or its equivalent”.`,
      `From the argument of learned senior counsel for appellants, it is clear that they are contending that the 1st respondent, though a member of a political party was not sponsored by that political party as its candidate for the election in issue, in breach of Section 177(iii) supra.`,
      `The other Section of the 1999 Constitution as amended relevant to the issue of qualification or non qualification of a candidate for the office of Governor of a state is Section 182 of that constitution which enacts as follows:-`,
      `“182(1) No person shall be qualified for election to the office of Governor of a State if;-`,
    ],
    keyPrinciples: [
      'Mandatory nature of S.84 Evidence Act Certificate.',
      'Electronic evidence admissibility in Nigerian courts.'
    ],
    relatedCaseIds: ['case-002'],
    isLandmark: true,
  },
  {
    id: 'case-006',
    title: 'Military Governor of Lagos State v. Ojukwu',
    citation: '(1986) LDLR (SC) pt 1006',
    sourceUrl: 'https://lawcarenigeria.com/the-military-governor-of-lagos-state-ors-v-chief-emeka-odumegwu-ojukwu-anor-1986/',
    hasFullJudgment: true,
    suitNumber: 'SC.241/1985',
    court: 'Supreme Court of Nigeria',
    year: 1986,
    presidingJudges: ['Obaseki, JSC', 'Eso, JSC', 'Kayode Eso, JSC', 'Aniagolu, JSC', 'Nnamani, JSC'],
    areaOfLaw: 'Constitutional Law',
    subject: 'Rule of Law, Executive Lawlessness and Obedience to Court Orders',
    factsSummary: 'While a suit over ownership of a residential property at 29 Queen\'s Drive, Ikoyi was pending, and in the face of an order for maintenance of the status quo, the Lagos State Government forcibly ejected Chief Emeka Odumegwu-Ojukwu from the premises using armed men.',
    issuesForDetermination: [
      'Whether the executive can resort to self-help and disobey a subsisting order of court.',
      'Whether the courts will lend their aid to preserve the rule of law against executive lawlessness.'
    ],
    decisionSummary: 'The Supreme Court roundly condemned the executive lawlessness and restored possession to Ojukwu, holding that in a society governed by the rule of law the executive must obey court orders and cannot resort to self-help.',
    ratioDecidendi: [
      `In the same Court, Ademola J.C.A. in a concurring ruling, said-`,
      `Mr. Adelosoye the learned Solicitor General for the Lagos State pleaded for a restoration of the status quo ante the judgment of the High Court. He said Ojukwu had been in occupation for 10 months before the Lagos State Government got to know of his occupation.`,
    ],
    obiterDicta: [
      'Per Eso, JSC: "The essence of the rule of law is that it should never operate under the rule of force or fear."'
    ],
    keyPrinciples: [
      'Executive must obey subsisting court orders.',
      'Courts will not condone self-help or executive lawlessness.'
    ],
    isLandmark: true,
  },
  {
    id: 'case-007',
    title: 'Garba & Ors v. University of Maiduguri',
    citation: '(1986) LDLR (SC) pt 1007',
    sourceUrl: 'https://lawcarenigeria.com/mr-yesufu-amuda-garba-ors-v-the-university-of-maiduguri1986/',
    hasFullJudgment: true,
    suitNumber: 'SC.55/1985',
    court: 'Supreme Court of Nigeria',
    year: 1986,
    presidingJudges: ['Bello, JSC', 'Obaseki, JSC', 'Eso, JSC', 'Nnamani, JSC', 'Oputa, JSC'],
    areaOfLaw: 'Constitutional & Human Rights',
    subject: 'Fair Hearing and Nemo Judex in Causa Sua in Administrative Discipline',
    factsSummary: 'Students of the University of Maiduguri were expelled by a disciplinary panel over allegations of misconduct/rioting without being afforded an opportunity to be heard, and where the accusers effectively sat in judgment over them.',
    issuesForDetermination: [
      'Whether the expulsion breached the students’ right to fair hearing under the Constitution.',
      'Whether a body determining allegations that amount to a crime can do so without observing the twin pillars of natural justice.'
    ],
    decisionSummary: 'The Supreme Court set aside the expulsions, holding that the students were denied fair hearing. Where an allegation discloses a crime, it must be established before a court of law, and no person may be a judge in his own cause.',
    ratioDecidendi: [
      `(a) fair hearing`,
      `(b) within a reasonable time`,
      `(c) by a court or other tribunal established by law; and`,
    ],
    keyPrinciples: [
      'Right to fair hearing (S.36 Constitution) applies to administrative panels.',
      'Criminal allegations must be tried by a court, not a domestic tribunal.'
    ],
    relatedCaseIds: ['case-004'],
    isLandmark: true,
  },
  {
    id: 'case-008',
    title: 'Ariori & Ors v. Elemo & Ors',
    citation: '(1983) LDLR (SC) pt 1008',
    sourceUrl: 'https://lawcarenigeria.com/a-ariori-ors-v-muraino-b-o-elemo-ors-1983/',
    hasFullJudgment: true,
    suitNumber: 'SC.80/1981',
    court: 'Supreme Court of Nigeria',
    year: 1983,
    presidingJudges: ['Fatai-Williams, CJN', 'Bello, JSC', 'Idigbe, JSC', 'Obaseki, JSC', 'Eso, JSC'],
    areaOfLaw: 'Civil Litigation & Advocacy',
    subject: 'Fair Hearing Within a Reasonable Time and Waiver of Rights',
    factsSummary: 'A land matter that had been in litigation for well over a decade raised the question of whether the constitutional guarantee of a hearing within a reasonable time had been breached, and whether such a right could be waived by the parties.',
    issuesForDetermination: [
      'What amounts to a fair hearing within a reasonable time under the Constitution.',
      'Whether the right to fair hearing within a reasonable time can be waived.'
    ],
    decisionSummary: 'The Supreme Court examined the content of the fair hearing guarantee and held that while a person of full age and capacity may waive a right conferred for his sole benefit, the right to fair hearing is so fundamental that waiver must be approached with great caution.',
    ratioDecidendi: [
      `In the con of this appeal therefore, the first question that one asks is “what is waiver” Rather than define the word, it is probably appropriate just to describe its concept. For as Pollock said, Waiver is a simple and wholly untechnical concept perhaps the most powerful and flexible instrument to be found in any system of court jurisprudence. The concept of waiver must be one that presupposes that the person who is to enjoy a benefit or who has the choice of two benefits is fully aware of his right to the benefit or benefits, but he either neglects to exercise his right to the benefit, or where he has a choice of two, he decides to take one but not both – see Vyvyan v. Vyvyan 30 Beav 65 as per Sir John Romilly M.R. at p.74 (reported also in 54 E.R. 817). PER ESO, J.S.C.`,
      `The next enquiry is the extent to which a person could waive rights conferred upon him by law. When a right is conferred solely for the benefit of an individual there should be no problem as to the extent to which he could waive such right.`,
      `The right is for his benefit. He is sui juris. He is under no legal disability. He should be able to forgo the right or in other words waive it either completely or partially, depending on his free choice. The extent to which he has forgone his right would be a matter of fact and each case will depend on its peculiar facts. A simple example could be seen in a right which has been conferred by contract. A person who is a beneficiary to a contract, whereby the benefit is principally for him, has full competence to waive that right. What obtains in the case of a contract should go for benefits conferred by statute. A beneficiary under statute should have full competence to waive those rights once the rights are solely for his benefit.`,
      `The only exception I can think of is where the statute itself forbids waiver of its statutory provisions. PER ESO, J.S.C.`,
      `I do no think the question permits of a simple and summary answer and it would be of use to examine the attitude of the courts in other jurisdictions which operate Constitutions similar to ours especially the United States of America and India, if only by way of comparison, though not necessarily taking these judgments as serving as precedents to be followed in this country without a thorough examination of the implications of those judgments.`,
      `I had cause in the case of Attorney-General of Bendel State v. Attorney-General of the Federation and 22 Ors. (1981) 10 S.C.1 to warn as to the reliance to be placed by this Court, especially in constitutional matters, upon the decisions of the courts of other countries, which even operated the same type of Constitution as ours. I said in that judgment, and I am still of the same view that-`,
      `“Gone should be the days, if ever they were, when, the decisions of other countries in any common law country are to be accepted in this country as precedents in the like of the Delphic oracle. The decisions of any court, other than those of this Court, are only to be treated as the respected opinion of those courts, which were given in their wisdom, under given circumstances and given environmental and cultural background, and no more. They are, at best, to give a guidance of what those courts did in those circumstances, and the wisdom to be drawn from them by this Court would be reflected in its dealing with the peculiar problems of this country, to which the Constitution which this country operates, is peculiar.” PER ESO, J.S.C.`,
      `It seems to me therefore that to answer the question whether or not one could waive one’s fundamental right to a speedy or fair trial, it would be necessary to make an enquiry first as to whether the right to be waived is exclusively within one’s control for it is common sense that one could not compromise what is not within one’s control.`,
    ],
    keyPrinciples: [
      'Fair hearing within a reasonable time is fact-dependent.',
      'Personal statutory/constitutional rights may be waived subject to public policy.'
    ],
    isLandmark: true,
  },
  {
    id: 'case-009',
    title: 'Adegoke Motors Ltd v. Adesanya & Anor',
    citation: '(1989) LDLR (SC) pt 1009',
    sourceUrl: 'https://lawcarenigeria.com/adegoke-motors-ltd-vs-dr-babatunde-adesanya/',
    hasFullJudgment: true,
    suitNumber: 'SC.169/1987',
    court: 'Supreme Court of Nigeria',
    year: 1989,
    presidingJudges: ['Oputa, JSC (Delivered Leading Judgment)', 'Nnamani, JSC', 'Karibi-Whyte, JSC'],
    areaOfLaw: 'Civil Litigation & Advocacy',
    subject: 'Finality of the Supreme Court and Stare Decisis',
    factsSummary: 'The appeal raised the effect of the finality of the Supreme Court’s decisions and the circumstances in which the apex court may depart from its own earlier decisions.',
    issuesForDetermination: [
      'Whether the Supreme Court is bound in perpetuity by its own previous decisions.',
      'The proper approach to the finality and infallibility of the apex court.'
    ],
    decisionSummary: 'The Supreme Court reaffirmed that it is the final court of the land and, while it may in appropriate cases depart from its previous decisions to avoid perpetuating error, litigation must have an end.',
    ratioDecidendi: [
      `Generally, an appeal is regarded as a continuation of the original suit rather than the inception of a new action. Because of this, in an appeal, parties are normally confined to their case as pleaded in the Court of first instance. They are not allowed to make a new and different case on appeal. They are not allowed to raise in such appeal new Issues without the express leave of Court or to proffer new evidence without such leave. An appeal, being a judicial examination by a higher Court of the decision of an inferior Court, it follows that such examination should normally and more appropriately be confined to the facts and issues that came before the inferior Court for decision. PER OPUTA, J.S.C.`,
      `There must be a distinction between the issuance of a Writ and the Service of that writ. After all the long title to the Sheriffs and Civil Process Act. Cap 189 of 1958 is:`,
      `“An Ordinance to make provision for the appointment and duties of Sheriffs, the enforcement of judgments and orders and the Service and execution of civil process of the Courts of Regions throughout Nigeria.”`,
      `Strictly speaking, the Issuing of civil Process and the Service of such process should be two distinct though inter related steps in civil litigation. A writ may be valid while its service may suffer from some defect. It may also happen, as was the case in Nwabueze v. Okoye supra, that both Writ and its Service are invalid. Again and strictly speaking, the issuing of civil process (here Writ of Summons) should be the concern of the High Court Law and the High Court Rules while the Service of such process will be referable to “the Law made for the Service of civil process of the Courts” – the Sheriffs and Civil Process Act Cap 189 of 1958. The reality of the present position is that the High Court of Lagos (Civil Procedure) Rules not only made provision for Service but also incorporated by direct reference, the Sheriffs and Civil Process Act. Order 2 Rule 4 of the Lagos Rules provides:-`,
      `“Or. 2 Rule 4 – Subject to the provisions of Part VII of the Sheriffs & Civil Process Act no writ of summons for service out of jurisdiction……… shall be issued without the leave of the Court or Judge in Chambers.” PER OPUTA, J.S.C.`,
      `It is not the business of the court to embark on a consideration of a conflict between one decision of the Supreme Court and another decision of the Supreme Court when issues warranting the consideration of the conflict are not raised in the grounds of appeal and when the facts of the two cases alleged to be in conflict are totally different from one another. Caution is a virtue that should not be dispensed with at any stage of the proceedings before any court. Dicta should not be taken and read out of con. PER OBASEKI, J.S.C.`,
      `The principles on the question of raising new points not previously raised in the trial court or Court of Appeal, i.e. courts below, are well settled. They include the requirement of leave of court to raise them and the satisfaction of the court that no further or additional evidence is required on the issues to be considered. There is of course a total bar against new points designed to establish a case different from the one considered in the courts below.`,
      `I refer to the following cases in which these guiding principles have been settled`,
    ],
    obiterDicta: [
      'Per Oputa, JSC: "We are final not because we are infallible; rather we are infallible only because we are final."'
    ],
    keyPrinciples: [
      'Supreme Court is final but may depart from prior decisions to correct error.',
      'Doctrine of stare decisis in the Nigerian hierarchy of courts.'
    ],
    isLandmark: true,
  },
  {
    id: 'case-010',
    title: 'Fawehinmi v. Akilu & Anor',
    citation: '(1987) LDLR (SC) pt 1010',
    sourceUrl: 'https://lawcarenigeria.com/chief-gani-fawehinmi-vs-col-halilu-akilu-anor/',
    hasFullJudgment: true,
    suitNumber: 'SC.43/1987',
    court: 'Supreme Court of Nigeria',
    year: 1987,
    presidingJudges: ['Obaseki, JSC', 'Eso, JSC', 'Nnamani, JSC', 'Oputa, JSC', 'Karibi-Whyte, JSC'],
    areaOfLaw: 'Criminal Law & Procedure',
    subject: 'Locus Standi in Private Prosecution',
    factsSummary: 'Following the murder of the journalist Dele Giwa by a letter bomb, Chief Gani Fawehinmi, as counsel, sought to compel a private prosecution. His standing to apply was challenged on the ground that he was not related to the deceased.',
    issuesForDetermination: [
      'Whether a person who is not a relation of a deceased has locus standi to seek to prosecute those alleged to be responsible for the death.'
    ],
    decisionSummary: 'The Supreme Court held that every citizen is his "brother’s keeper" and has sufficient interest to set the criminal law in motion; locus standi to prosecute is not limited to relations of the victim.',
    ratioDecidendi: [
      `This is evident from a close examination of the provisions of section 342(a) of the Criminal Procedure Law. That paragraph reads: ‘The registrar shall receive an information from a private person If it has endorsed thereon a certificate by a law officer to the effect that he has seen such information and declines to prosecute at the public instance the offence therein set forth.” The duty that the appellant complains of the respondent has not carried out is that “having seen the information and having failed to decide to prosecute at the public instance the offence therein set forth, the Director of Public Prosecutions refused to endorse thereon “that he has seen the information and declines to prosecute at the public instance the offence therein set forth.” Where a law officer expresses that he is unable to come to a decision to prosecute, it cannot be interpreted that he has come to a decision to prosecute. It is more consonant with reason to hold that at that point of time, he has declined to prosecute. The reason for taking such a stand is not relevant at this stage and need not be enquired into for the purpose of the application for leave. What is relevant is the failure or refusal (1) to take a decision to prosecute or not to prosecute and (2) to endorse on the information that he declines to prosecute at public instance. PER OBASEKI, J.S.C.`,
      `For the general rule is that before the applicant is entitled to the order, he must have addressed a direct distinct specific demand or request to the respondent to do a duty imposed upon him by law and the respondent must have unequivocally, either expressly or by necessary implication manifested his refusal to comply ……. PER OBASEKI, J.S.C.`,
      `There is provision for other public officer or person to sign information. It is subsection(2) of section 341 of the Criminal Procedure Law which reads: “Where the State Commissioner shall for reasons of public convenience think fit, an information may be signed by any other public officer or person whom the State Commissioner may delegate.” PER OBASEKI, J.S.C.`,
      `The conditions under which a private person can sign an information are set out in section 342 of the Criminal Procedure Law which reads: ‘The Registrar shall receive an information from a private person if – (a) it has endorsed thereon a certificate by a law officer that he has seen such information and declines to prosecute at the public instance the offence therein set forth, and (b) such private person has entered into a recognizance in the sum of one hundred Naira, together with one surety to be approved by the Registrar in the like sum to prosecute the said information to conclusion at the times as which the accused shall be required to appear and to pay such costs as may be ordered by the court or in lieu of entering into such recognizance shall have deposited one hundred Naira in court to abide the same conditions.” PER OBASEKI, J.S.C.`,
      `It is fundamental that an applicant for leave to apply for an order of mandamus must have locus standi to make the application before leave can be granted by the court. Indeed, the party making any claim and bringing any application before the court must have locus standi. See Senator Adesanya v. President of Nigeria (supra) Irene Thomas v. Olufosoye (supra) Amusa Momoh & Anor. v. Jimoh Olotu (1970) 1 All NLR. 117. If the plaintiff has no locus standi, the court has no jurisdiction to entertain the matter and it must be struck out. See Oloriode & Ors. v. Oyebi & Ors. (1984) 5 SC. 1 at 28. When a party’s standing to sue (i.e. locus standi) is in issue, the question is whether the person whose standing is in issue is the proper party to request an adjudication of a particular issue and not whether the issue itself is justiciable. Oloriode & Ors. v. Oyebi & Ors. (1984) 5 SC. 1 at 28. PER OBASEKI, J.S.C.`,
    ],
    keyPrinciples: [
      'Liberal locus standi in criminal/private prosecution.',
      'Any citizen may set the criminal law in motion.'
    ],
    relatedCaseIds: ['case-002'],
    isLandmark: true,
  },
  {
    id: 'case-011',
    title: 'General Sani Abacha & Ors v. Chief Gani Fawehinmi',
    citation: '(2000) LDLR (SC) pt 1011',
    sourceUrl: 'https://lawcarenigeria.com/general-sani-abacha-ors-v-chief-gani-fawehinmi2000/',
    hasFullJudgment: true,
    suitNumber: 'SC.45/1997',
    court: 'Supreme Court of Nigeria',
    year: 2000,
    presidingJudges: ['Uwais, CJN', 'Ogundare, JSC', 'Ogwuegbu, JSC', 'Achike, JSC', 'Uwaifo, JSC'],
    areaOfLaw: 'Constitutional & Human Rights',
    subject: 'Status of the African Charter on Human and Peoples’ Rights in Nigerian Law',
    factsSummary: 'Chief Gani Fawehinmi was arrested and detained without charge by State Security operatives. He challenged the detention and relied, in part, on the African Charter on Human and Peoples’ Rights (Ratification and Enforcement) Act.',
    issuesForDetermination: [
      'The status of the African Charter (Ratification and Enforcement) Act within the hierarchy of Nigerian laws.',
      'Whether ouster decrees of the military era could oust the court’s jurisdiction to enforce fundamental rights.'
    ],
    decisionSummary: 'The Supreme Court held that the African Charter Act is a statute with international flavour that ranks above ordinary domestic legislation, though subordinate to the Constitution, and its provisions are enforceable in Nigerian courts.',
    ratioDecidendi: [
      `the government of Nigeria does not become binding until enacted into law by the National Assembly. See Section 12(1) of the 1979 Constitution which provides:`,
      `“12(1) No treaty between the Federation and any other country shall have the force of law except to the extent to which any such treaty has been enacted into law by the National Assembly (AFRC).”`,
    ],
    keyPrinciples: [
      'Domesticated treaties rank above ordinary statutes, below the Constitution.',
      'Fundamental rights remain enforceable notwithstanding ouster provisions.'
    ],
    isLandmark: true,
  },
  {
    id: 'case-012',
    title: 'Idundun & Ors v. Okumagba & Ors',
    citation: '(1976) LDLR (SC) pt 1012',
    sourceUrl: 'https://nigerialii.org/akn/ng/judgment/ngsc/1976/2/eng%401976-10-07',
    hasFullJudgment: true,
    suitNumber: 'SC.309/1974',
    court: 'Supreme Court of Nigeria',
    year: 1976,
    presidingJudges: ['Fatayi-Williams, JSC', 'Idigbe, JSC', 'Obaseki, Ag. JSC'],
    areaOfLaw: 'Land & Property Law',
    subject: 'The Five Ways of Proving Title to Land',
    factsSummary: 'A dispute over declaration of title to land in which the Supreme Court authoritatively set out the methods by which ownership of land may be established.',
    issuesForDetermination: [
      'What are the recognised ways of proving title to or ownership of land in Nigeria?'
    ],
    decisionSummary: 'The Supreme Court laid down the five distinct ways of proving title to land, any one of which, if established, is sufficient.',
    ratioDecidendi: [
      `Firstly, ownership of land may be proved by traditional evidence as has been done in the case in hand. In our view, not only was the evidence of the witnesses called by the appellants rightly rejected by the learned trial judge for good and sufficient reasons, we also think that he was right in not attach­ing any weigh to the views expressed in the books cited in support of such traditiona1 evidence. As Lionel Brett, J.S.C. (as he then was), rightly in our view, once pointed out in a learned address given by him at the Univer­sity of Lagos to the Nigerian Association of Law Teachers:`,
      `"The courts are not to be hypnotised by the authority of print. The crucial fact is that a book cannot be cross-examined, either as to the opinion expressed, or as to the claims of the author to have special knowledge. If the author is living, there is no reason why he should not be tendered as an expert witness, when this diffi­culty would vanish."`,
      `No evidence was adduced to show that any of these books is generally acknowledged either in Nigeria or elsewhere as a standard work or as appropriate authority on the relevant traditional history so as to enable the court to resort, with justifica­tion, to its aid. (See section 58 and 73(2) of the Evidence Act, Cap. 62 and Adedibu v. Adewoyin 13 WACA 191 at page 192). Moreover, none of the authors of these books testified in support of the views stated therein and no explanation was given for this omission. For all these reasons, we share the apprehensions`,
    ],
    keyPrinciples: [
      'The five methods of proving title to land.',
      'Any single method, if proved, suffices.'
    ],
    isLandmark: true,
  },
  {
    id: 'case-013',
    title: 'Chief Obafemi Awolowo v. Alhaji Shehu Shagari & Ors',
    citation: '(1979) LDLR (SC) pt 1013',
    sourceUrl: 'https://nigerialii.org/akn/ng/judgment/ngsc/1979/11/eng%401979-09-26',
    hasFullJudgment: true,
    suitNumber: 'SC.62/1979',
    court: 'Supreme Court of Nigeria',
    year: 1979,
    presidingJudges: ['Fatai-Williams, CJN', 'Sowemimo, JSC', 'Idigbe, JSC', 'Obaseki, JSC', 'Eso, JSC'],
    areaOfLaw: 'Election Petitions',
    subject: 'Interpretation of the "Two-Thirds of Nineteen States" Presidential Requirement',
    factsSummary: 'Challenge to the 1979 presidential election result on the question whether the winner had satisfied the constitutional requirement of not less than one-quarter of the votes in at least two-thirds of the then nineteen States of the Federation.',
    issuesForDetermination: [
      'What constitutes two-thirds of nineteen States for the purpose of the presidential election requirement.'
    ],
    decisionSummary: 'By a majority, the Supreme Court upheld the declaration of the result, adopting the arithmetical interpretation applied by the electoral body in the circumstances of the case.',
    ratioDecidendi: [
      `(6) Furthermore, it is, we think, fallacious to talk of fractionalisation of the physical land area of a State when the operative words of Section 34(1)( c )(ii) relate undoubtedly to the votes cast by the voters in the State at the election.`,
      `(7) It is also fallacious to talk of scaling down the votes cast for the 1st respondent in Kano State by one-third. That argument, if we may say so, overlooks the clear and unambiguous words of Section 34(1)( c )(ii) which provide FIRST for ascertaining the total number of votes cast for the 1st respondent by the voters of Kano State before comparing this figure obtained thereby with two-thirds of all the votes cast in Kano State in order to determine whether the votes received by him are not less than one-quarter of two-thirds of all the votes in Kano State.`,
      `(8) We are prepared to say that the respondent was in error of his interpretation of what constitutes two-thirds of nineteen States. Moreover, until election returns can be computerized in this country, the "mathematical canon of interpretation" put forward by Professor Awojobi (1st petitioner's witness) in his testimony before the Tribunal will remain impractical and legally unacceptable.`,
      `(9) Quite apart from the compliance with the provisions of Section 34A(1)( c )(ii) of the Decree as found by us, even if we had found that there had been non-compliance with the said provision we would have evoked the provisions of Section III Sub-section (1) of the Decree which provides that non-compliance with Part II of the Decree did not affect the result of the election, and held that the election to the office of the President was conducted substantially in accordance with the provisions of Section 34A(1)( c )(ii) which is within Part II of the Decree.`,
    ],
    obiterDicta: [
      'The majority expressly stated that the decision should not be treated as a binding precedent for future elections given its peculiar facts.'
    ],
    keyPrinciples: [
      'Geographical spread requirement in presidential elections.',
      'Decisions on peculiar facts may be confined to those facts.'
    ],
    relatedCaseIds: ['case-001'],
    isLandmark: true,
  },
  {
    id: 'case-014',
    title: 'Peter Obi v. Independent National Electoral Commission (INEC) & Ors',
    citation: '(2007) LDLR (SC) pt 1014',
    hasFullJudgment: true,
    suitNumber: 'SC.123/2007',
    court: 'Supreme Court of Nigeria',
    year: 2007,
    presidingJudges: ['Niki Tobi, JSC', 'Katsina-Alu, JSC', 'Aderemi, JSC'],
    areaOfLaw: 'Election Petitions',
    subject: 'Commencement and Computation of a Governor’s Four-Year Tenure',
    factsSummary: 'Peter Obi, having been declared winner of the Anambra governorship election after protracted litigation, was sworn in in 2006. INEC sought to conduct a fresh election in 2007 on the basis of the general election cycle. Obi contended his four-year tenure should run from the date he actually took the oath of office.',
    issuesForDetermination: [
      'When does the four-year tenure of a Governor begin to run under the Constitution?'
    ],
    decisionSummary: 'The Supreme Court held that a Governor’s four-year term begins to run from the date he takes the oath of allegiance and oath of office, not from any earlier date, so Obi’s tenure had not expired.',
    ratioDecidendi: [
      'The tenure of office of a Governor under the Constitution is computed from the date the person elected takes and subscribes to the oath of allegiance and the oath of office.'
    ],
    keyPrinciples: [
      'Executive tenure runs from date of oath of office.',
      'Protection of validly elected officials’ constitutional term.'
    ],
    relatedCaseIds: ['case-001'],
    isLandmark: true,
  },
  {
    id: 'case-015',
    title: 'Ukeje & Anor v. Ukeje',
    citation: '(2014) LDLR (SC) pt 1015',
    sourceUrl: 'https://lawcarenigeria.com/mrs-lois-chituru-ukeje-anor-v-mrs-gladys-ada-ukeje2014/',
    hasFullJudgment: true,
    suitNumber: 'SC.224/2004',
    court: 'Supreme Court of Nigeria',
    year: 2014,
    presidingJudges: ['Ogunbiyi, JSC (Delivered Leading Judgment)', 'Fabiyi, JSC', 'Rhodes-Vivour, JSC'],
    areaOfLaw: 'Family, Matrimonial & Probate',
    subject: 'Female Inheritance Rights and Repugnancy of Discriminatory Custom',
    factsSummary: 'A daughter was excluded from sharing in her late father’s estate on the basis of an Igbo customary law that denied female children the right to inherit from their father’s estate.',
    issuesForDetermination: [
      'Whether a customary law that disentitles a female child from inheriting her deceased father’s estate is valid.'
    ],
    decisionSummary: 'The Supreme Court held that the Igbo customary law which excludes a female child from inheriting her father’s estate is discriminatory, repugnant to natural justice, equity and good conscience, and unconstitutional as it conflicts with Section 42 of the Constitution.',
    ratioDecidendi: [
      `The position of the law is that once documentary evidence supports oral evidence, such oral evidence becomes more credible. The reasoning is premised on the fact and the law that documentary evidence serves as a hanger from which to assess oral testimony. See Kimdey & Ors v. Military Governor of Gongola State & Ors 1988 Vol.19 (Pt.1) NSCC P.827 Omoregbe v. Lawani 1980 5-4 SC P.117. PER OLABODE RHODES-VIVOUR, J.S.C.`,
      `The long settled position of the law is that when fraud is being alleged in a suit it must be pleaded, particulars given and established in evidence by proof beyond reasonable doubt. PER OLABODE RHODES-VIVOUR, J.S.C.`,
      `It is well settled that it is the duty of the trial court which saw and heard witnesses to evaluate the evidence and pronounce on their credibility and ascribe probative value. See Kim v. State (1992) 4 NWLR Pt 233 p.17 Sanusi v. Ameyogun (1992) 4 NWLR Pt.237 P.527. PER OLABODE RHODES-VIVOUR, J.S.C.`,
      `Whether the respondent is a daughter of L.O. Ukeje (deceased). L.O. Ukeje deceased is subject to the Igbo Customary Law. Agreeing with the High Court the Court of Appeal correctly found that the Igbo native law and custom which disentitles a female from inheriting, in her late father’s estate is void as it conflicts with sections 39(1)(a) and (2) of the 1979 Constitution (as amended). This finding was affirmed by the Court of Appeal. There is no appeal on it. The finding remains inviolate. Section 39(1),(a) (2) of the 1979 Constitution is now contained in the 1999 Constitution as section 42(1), (a), (2) and it states that: “42(1) A citizen of Nigeria of a particular community, ethnic group, place of origin, sex, religion or political opinion shall not, by reason only that he is such a person:- (a) be subjected either expressly by, or in the practical application of, any law in force in Nigeria or any executive or administrative action of the government, to disabilities or restrictions to which citizens of Nigeria of other communities, ethnic groups places of origin, sex, religions or political opinions are made subject: or …………………. (2) No citizen of Nigeria shall be subjected to any disability or deprivation merely by reason of the circumstances of his birth.” No matter the circumstances of the birth of a female child, such a child is entitled to an inheritance from her late father’s estate. Consequently the Igbo customary law which disentitles a female child from partaking, in the sharing of her deceased lather’s estate is in breach of section 42 (1) and (2) of the Constitution, a fundamental rights provision guaranteed to every Nigerian. The said discriminatory customary law is void as it conflicts with section 42(1) and (2) of the Constitution. PER OLABODE RHODES-VIVOUR, J.S.C.`,
      `It is settled law that unless there are special circumstances shown, this court will not disturb the concurrent findings of fact made by the lower courts – see Chinwedu vs Mbamali (1980) 3 – 4 S.C 31 at 75; Ogbu vs Wokoma (2005) 14 NWLR (pt. 944) 118 at 123. The circumstance or exceptions to the above general principle include the following:- (a) If such findings of fact are made on inadmissible evidence; or (b) If such findings of fact cannot be related to any evidence before the court; or (c) Where such findings of fact are on matters not pleaded; or (d) Where, on the whole facts before the trial court and the Court of Appeal, the findings are manifestly perverse – see Ogbu vs Wokoma supra. PER WALTER SAMUEL NKANU ONNOGHEN, J.S.C.`,
    ],
    keyPrinciples: [
      'Female children have equal inheritance rights.',
      'Discriminatory customs void under S.42 Constitution.'
    ],
    relatedCaseIds: ['case-016'],
    isLandmark: true,
  },
  {
    id: 'case-016',
    title: 'Mojekwu v. Mojekwu',
    citation: '(1997) LDLR (CA) pt 1016',
    hasFullJudgment: true,
    suitNumber: 'CA/E/85/94',
    court: 'Court of Appeal',
    year: 1997,
    presidingJudges: ['Niki Tobi, JCA (Delivered Leading Judgment)', 'Achike, JCA', 'Pats-Acholonu, JCA'],
    areaOfLaw: 'Family, Matrimonial & Probate',
    subject: 'Repugnancy Doctrine and the "Oli-Ekpe" Discriminatory Custom',
    factsSummary: 'A dispute over the devolution of property in which the "Oli-Ekpe" custom of Nnewi was invoked to allow a male relation to inherit the property of a deceased to the exclusion of female descendants.',
    issuesForDetermination: [
      'Whether the Oli-Ekpe custom, which permits inheritance by a male relation to the exclusion of females, is valid.'
    ],
    decisionSummary: 'The Court of Appeal (per Tobi, JCA) struck down the Oli-Ekpe custom as discriminatory against women and repugnant to natural justice, equity and good conscience.',
    ratioDecidendi: [
      'A custom that discriminates against a woman on the ground of sex offends the repugnancy doctrine and modern notions of equality and cannot be enforced.'
    ],
    obiterDicta: [
      'Per Tobi, JCA: courts should not give their blessing to customs that subject women to indignities merely on account of their sex.'
    ],
    keyPrinciples: [
      'Repugnancy doctrine invalidates discriminatory customs.',
      'Judicial protection of women’s customary property rights.'
    ],
    relatedCaseIds: ['case-015'],
    isLandmark: true,
  },
  {
    id: 'case-017',
    title: 'Nafiu Rabiu v. The State',
    citation: '(1981) LDLR (SC) pt 1017',
    sourceUrl: 'https://lawcarenigeria.com/nafiu-rabiu-v-kano-state/',
    hasFullJudgment: true,
    suitNumber: 'SC.13/1980',
    court: 'Supreme Court of Nigeria',
    year: 1981,
    presidingJudges: ['Fatai-Williams, CJN', 'Bello, JSC', 'Idigbe, JSC', 'Obaseki, JSC', 'Eso, JSC'],
    areaOfLaw: 'Constitutional & Human Rights',
    subject: 'Principles of Constitutional Interpretation',
    factsSummary: 'The case raised a question of jurisdiction and the proper approach a court should take when construing the provisions of the Constitution.',
    issuesForDetermination: [
      'What principles should guide the courts in the interpretation of the Constitution?'
    ],
    decisionSummary: 'The Supreme Court held that the provisions of the Constitution should be given a broad, liberal and purposive interpretation so as to advance, rather than defeat, its objects.',
    ratioDecidendi: [
      `“It is, however, my view that the validity of Section 284 (2) of the C. P. C. is preserved under the new Constitution by virtue of sub-section (1) (g) (v) of Section 220 thereof. [Yekini Onigbeden v. Ishola Balogun (1975) 1 all NLR 233 at 241; National Employers Mutual General Insurance Association v. Uchav (1973) 1 NMLR 170 at 172-3; Kiren v. Paschal and Ludwig Incorporate (1978) 11 and 12 S. C. 77] My Lords, the conclusion which I have reached, therefore, is that the prosecutor in the Northern States has a right of appeal from an order of acquittal, made by a High Court sitting at first instance, in criminal proceedings but only on points of law.” PER IDIGBE, J.S.C`,
      `“…the case of Karuwa Takida (Supra) re-stated the general principle of law that no court is bound to speculate on what possible defences can be open to an accused person before it, but where in a trial for homicide, the evidence suggests a line of defence it is the duty of the trial court to consider and deal with that defence “whether or not the accused or his counsel expressly raised the defence by the legal terminology ascribed to it by lawyers.” PER IDIGBE, J.S.C.`,
    ],
    keyPrinciples: [
      'Constitution to be construed broadly and purposively.',
      'Interpretation should advance, not defeat, constitutional objects.'
    ],
    relatedCaseIds: ['case-003'],
    isLandmark: true,
  },
  {
    id: 'case-018',
    title: 'Ransome-Kuti & Ors v. Attorney-General of the Federation & Ors',
    citation: '(1985) LDLR (SC) pt 1018',
    sourceUrl: 'https://lawcarenigeria.com/chief-dr-mrs-olufunmilayo-ransome-kuti-ors-v-the-attorney-general-of-the-federation-ors1985/',
    hasFullJudgment: true,
    suitNumber: 'SC.123/1984',
    court: 'Supreme Court of Nigeria',
    year: 1985,
    presidingJudges: ['Bello, JSC', 'Obaseki, JSC', 'Eso, JSC', 'Nnamani, JSC', 'Uwais, JSC'],
    areaOfLaw: 'Constitutional & Human Rights',
    subject: 'Nature of Fundamental Rights and State Liability',
    factsSummary: 'Arising from the invasion of the Kalakuta Republic and the death of Mrs. Funmilayo Ransome-Kuti, the action sought to hold the State liable for the violation of fundamental rights during the raid by soldiers.',
    issuesForDetermination: [
      'The nature and origin of fundamental rights under the Constitution.',
      'Whether the State can be held liable for breaches of fundamental rights by its agents.'
    ],
    decisionSummary: 'The Supreme Court explained the character of fundamental rights and affirmed that the State is amenable to claims for the enforcement of fundamental rights breached by its agents.',
    ratioDecidendi: [
      `“No person shall be subjected to torture or to inhuman or degrading punishment or other treatment.”`,
      `This is no doubt a right guaranteed to everyone including the appellants by the Constitution. But what is the nature of a fundamental right It is a right which stands above the ordinary laws of the land and which in fact is antecedent to the political society itself. It is a primary condition to a civilised existence and what has been done by our constitution, since independence, starting with the Independence Constitution, that is, the Nigeria (Constitution) Order in Council 1960 up to the present Constitution, that is, the Constitution of the Federal Republic of Nigeria, 1979 (the latter does not in fact apply to this case: it is the 1963 Constitution that applies) is to have these rights enshrined in the Constitution so that the rights could be “immutable” to the extent of the “non-immutability” of the Constitution itself.`,
      `It is not in all countries that the Fundamental Rights guaranteed to the citizen are written into the Constitution. For instance, in England, where there is no written constitution, it stands to reason that a written code of fundamental rights could not be expected. But notwithstanding, there are fundamental rights. The guarantee against inhuman treatment, as specified in section 19 of the 1963 Constitution, would, for instance, appear to be the same as some of the fundamental rights guaranteed in England, contained in the Magna Carter 1215 – Articles 19 and 40 which provide –`,
      `“no freeman may be taken or imprisoned, or disused of his freehold or liabilities in free customs or be outlawed or exiled or in any way molested nor judged or condemned except by lawful judgment or in accordance with the law of the land And the crown or its ministers may not imprison or coerce the subject in an arbitrary manner” (Underlining mine)`,
      `In the United States, the Eighth Amendment to the United States Constitution provides –`,
      `“Excessive bail shall not be required, nor excessive fines imposed, nor cruel and unusual punishment inflicted.” PER ESO, J.S.C.`,
      `This is answered by s.32(2) and (3) which provide procedure for the enforcement or securing the enforcement of the right. It provides –`,
      `“32(2)Subject to the provisions of section 115 of this Constitution, the High Court of a territory shall have original jurisdiction to hear and determine any application made to it in pursuance of this section and may make such orders, issue such writs and give such directions as it may consider appropriate for the purpose of enforcing, or securing the enforcement, within that territory of any rights to which the person who makes the application may be entitled under this chapter”. PER ESO, J.S.C.`,
    ],
    keyPrinciples: [
      'Fundamental rights are antecedent to the State and stand above ordinary law.',
      'State liable for rights violations by its agents.'
    ],
    relatedCaseIds: ['case-011'],
    isLandmark: true,
  },
  {
    id: 'case-019',
    title: 'Mrs Theresa Udo v. Dr Peter Idundun & Anor',
    citation: '(2022) LDLR (CA) pt 1043',
    hasFullJudgment: true,
    suitNumber: 'CA/AS/434/2017',
    court: 'Court of Appeal',
    judicialDivision: 'Asaba Judicial Division',
    dateDelivered: 'Friday, 20 May 2022',
    year: 2022,
    presidingJudges: [
      'Joseph Olubunmi Kayode Oyewole, JCA',
      'Boloukuromo Moses Ugo, JCA',
      'Sybil Onyeji Nwaka Gbagi, JCA'
    ],
    appearances: {
      appellant: 'P. A. Oboreh Esq.',
      respondent: 'Sir Victor E. Akpoguma'
    },
    areaOfLaw: 'Evidence, Land & Property Law',
    subject: 'Wrongful Admission of Evidence, Proof of Title to Land and Appellate Interference with Findings of Fact',
    catchwords: [
      'Evidence',
      'Wrongful admission or rejection of evidence',
      'Proof of title to land',
      'Family property',
      'Findings of fact on appeal'
    ],
    proceduralHistory:
      'Appeal from the judgment of the High Court of Delta State delivered on 20 June 2017 in Suit No. W/407/2014, where the trial court resolved the ownership dispute over Plot Nos. 23, 25 and 27 Ekpen Street, Okere, Warri in favour of the respondents.',
    factsSummary:
      'The appellant claimed that she was a member of the Idundun family through the Etsemaye gate and a joint owner of Plot Nos. 23, 25 and 27 Ekpen Street, Okere, Warri. The respondents accepted the family connection but maintained that Pa Idundun gifted the properties exclusively to the Edomi and Peter Ulionerajolo lineages, excluding Mene lineage through whom the appellant claimed. The trial court accepted the respondents\' traditional history and documentary evidence, dismissed the appellant\'s ownership claim, and made consequential orders on reimbursement and account of rents.',
    reliefsClaimed: [
      'Declaration that the appellant is a bona fide member of the Idundun family through the Etsemaye gate and a joint owner of the properties at Nos. 23, 25 and 27 Ekpen Street, Okere, Warri.',
      'An order permitting the appellant to recover outstanding sums allegedly expended on the buildings on the disputed properties.',
      'Perpetual injunction restraining harassment or intimidation of the appellant in relation to the properties.',
      'Damages for alleged harassment and embarrassment arising from community and EFCC complaints.'
    ],
    issuesForDetermination: [
      'Whether the lower court was right in holding from the evidence before it that the land comprising Plot Nos. 23, 25 and 27 Ekpen Street, Okere, Warri is the property of the Edomi/Peter Ulionerajolo lineages of the Idundun family, excluding the Mene lineage as claimed by the respondents.',
      'Whether the lower court was right from the evidence before it in making the orders it made on the appellant\'s claim and the respondents\' counterclaim.'
    ],
    decisionSummary:
      'The Court of Appeal dismissed the appeal. It affirmed the trial court\'s findings on ownership, upheld the orders made on the claim and counterclaim, and held that the appellant had not shown a basis for appellate interference with the findings of fact.',
    ordersMade: [
      'The appeal was dismissed in its entirety.',
      'The findings and orders of the High Court of Delta State on both the claim and counterclaim were upheld.',
      'Parties were ordered to bear their respective costs.'
    ],
    ratioDecidendi: [
      `D		"I must necessarily recognize that this appeal is basically against findings of fact of the lower Court. That is an issue on which the appellate Court usually respects the decision of the trial judge who saw and listened to witnesses testify to the facts in issues on which he reached his conclusions. Katsina-Alu J.S.C. (later C.J.N.) stated proper attitude of an appellate Court to findings of fact of a trial Court when he said in Nwadiogbu v. Nnadozie (2001) F.W.L.R. (PT 61) 1625 @ 1636 that: "The position of the law is this: that an appellate Court should not interfere with the findings of the trial Court unless the findings are not supported by the pleadings and/or evidence or are perverse." See also Agbonifo v. Aiwereoba & Anor (1988) 1 NSCC 237 @ 245, Odofin v. Ayoola (1984) NSCC 711 @ 733, Olanrewaju v. Governor of Oyo State & Ors (1992) LPELR-2570 (SC) P.19 para E-F."

Per BOLOUKUROMO MOSES UGO JCA (Pp. 11-12, paras. I-J)`
    ],
    authoritiesCited: [
      'Ugbe & 4 Ors. v. Edigbe & Ors.',
      'Nwadiogbu v. Nnadozie',
      'Agbonifo v. Aiwereoba & Anor',
      'Odofin v. Ayoola',
      'Olanrewaju v. Governor of Oyo State & Ors',
      'Idundun & Ors v. Okumagba & Ors'
    ],
    statutesConsidered: [
      'Evidence Act, section 226(1)',
      'Evidence Act, sections 58 and 73(2)',
      'Evidence Act, section 45'
    ],
    practiceNotes: [
      'When attacking admitted or rejected evidence on appeal, show materiality and demonstrate that the result would probably have changed.',
      'On appeal against findings of fact, isolate perversity, absence of evidence, wrong evaluation, or miscarriage of justice; mere disagreement with the trial judge is insufficient.',
      'For family land disputes, align pleadings, traditional history, acts of ownership, documents, rent collection, compensation records, and possession evidence.'
    ],
    keyPrinciples: [
      'Wrongful admission or rejection of evidence is not automatically fatal; the appellant must show that the decision would have been different.',
      'Proof of title to land may be established through traditional evidence, documents of title, acts of ownership, long possession, or connected/adjacent possession.',
      'Findings of fact by a trial court are rarely disturbed on appeal unless they are perverse, unsupported, or occasion a miscarriage of justice.'
    ],
    relatedCaseIds: ['case-012'],
    isLandmark: true,
  }
];

export const COURT_RULES_DATA: CourtRule[] = [
  {
    id: 'fhc-ord-25',
    courtName: 'Federal High Court',
    jurisdictionCategory: 'Federal High Court',
    orderNumber: 25,
    orderTitle: 'Pleadings and Statement of Claim',
    ruleNumber: 1,
    ruleTitle: 'Filing and Service of Statement of Claim',
    content: 'Order 25 Rule 1: (1) Unless the Court gives leave to the contrary, the Claimant shall within 30 days of service of the Writ of Summons on the Defendant or notice of appearance, deliver his Statement of Claim together with written statements on oath of witnesses and copies of documents to be relied upon.',
    year: 2019,
  },
  {
    id: 'sc-ord-8',
    courtName: 'Supreme Court of Nigeria',
    jurisdictionCategory: 'Supreme Court',
    orderNumber: 8,
    orderTitle: 'Appeals in Civil Matters',
    ruleNumber: 2,
    ruleTitle: 'Notice and Grounds of Appeal',
    content: 'Order 8 Rule 2: (1) All appeals shall be by way of rehearing and shall be brought by Notice of Appeal. (2) The Notice of Appeal shall set forth concisely the grounds upon which the Appellant relies, stating the particulars of error in law or misdirection.',
    year: 2014,
  },
  {
    id: 'ca-ord-6',
    courtName: 'Court of Appeal',
    jurisdictionCategory: 'Court of Appeal',
    orderNumber: 6,
    orderTitle: 'Briefs of Argument',
    ruleNumber: 1,
    ruleTitle: 'Appellant Brief Timeframe',
    content: 'Order 19 Rule 2: The Appellant shall within 45 days of receipt of the Record of Appeal file his Brief of Argument in the Registry of the Court.',
    year: 2021,
  },
  {
    id: 'nicn-ord-14',
    courtName: 'National Industrial Court of Nigeria',
    jurisdictionCategory: 'National Industrial Court',
    orderNumber: 14,
    orderTitle: 'Fast Track & Summary Judgment',
    ruleNumber: 1,
    ruleTitle: 'Summary Judgment Application',
    content: 'Where a Claimant believes that there is no defence to his claim, he may file an application for summary judgment accompanied by an affidavit on oath verifying the facts and exhibits.',
    year: 2017,
  },
  {
    id: 'lagos-ord-15',
    courtName: 'High Court of Lagos State',
    jurisdictionCategory: 'High Courts (States & FCT)',
    state: 'Lagos',
    orderNumber: 15,
    orderTitle: 'Pre-Trial Conference & Scheduling',
    ruleNumber: 1,
    ruleTitle: 'Issuance of Pre-Trial Information Sheet (Form 17)',
    content: 'Within 14 days after close of pleadings, the Claimant shall apply for the issuance of a Pre-Trial Conference Information Sheet in Form 17.',
    year: 2019,
  }
];

export const NIGERIAN_LAWS_DATA: NigerianLaw[] = [
  {
    id: 'const-1999',
    title: 'Constitution of the Federal Republic of Nigeria 1999 (as amended)',
    shortTitle: '1999 Constitution',
    category: 'LFN (Federation)',
    year: 1999,
    citation: 'Cap C23 LFN 2004',
    description: 'The Supreme Law of the Federal Republic of Nigeria. Any law inconsistent with its provisions is void to the extent of its inconsistency (S.1(3)).',
    sectionsCount: 320,
    sections: [
      {
        sectionNumber: '1',
        heading: 'Supremacy of Constitution',
        content: '(1) This Constitution is supreme and its provisions shall have binding force on all authorities and persons throughout the Federal Republic of Nigeria. (3) If any other law is inconsistent with the provisions of this Constitution, this Constitution shall prevail, and that other law shall, to the extent of the inconsistency, be void.'
      },
      {
        sectionNumber: '36',
        heading: 'Right to Fair Hearing',
        content: '(1) In the determination of his civil rights and obligations, including any question or determination by or against any government or authority, a person shall be entitled to a fair hearing within a reasonable time by a court or other tribunal established by law.'
      },
      {
        sectionNumber: '251',
        heading: 'Jurisdiction of Federal High Court',
        content: '(1) Notwithstanding anything to the contrary contained in this Constitution and in addition to such other jurisdiction as may be conferred upon it by an Act of the National Assembly, the Federal High Court shall have and exercise jurisdiction to the exclusion of any other court in civil causes and matters relating to revenue, taxation, CAMA, customs, maritime, aviation, and federal government executive actions.'
      }
    ]
  },
  {
    id: 'evidence-act-2011',
    title: 'Evidence Act 2011 (as amended 2023)',
    shortTitle: 'Evidence Act 2011',
    category: 'LFN (Federation)',
    year: 2011,
    citation: 'Act No. 18 of 2011',
    description: 'Governs admissibility of facts, oral evidence, documentary evidence, electronic records (S.84), judicial notice, and burden of proof in Nigerian civil and criminal proceedings.',
    sectionsCount: 259,
    sections: [
      {
        sectionNumber: '84',
        heading: 'Admissibility of Statements in Documents Produced by Computers',
        content: '(1) In any proceeding a statement contained in a document produced by a computer shall be admissible as evidence of any fact stated in it... provided the conditions in subsection (2) are met and accompanied by a certificate under subsection (4).'
      },
      {
        sectionNumber: '135',
        heading: 'Standard of Proof in Criminal Cases',
        content: '(1) If the commission of a crime by a party to any proceeding is directly in issue, it must be proved beyond reasonable doubt.'
      }
    ]
  },
  {
    id: 'cama-2020',
    title: 'Companies and Allied Matters Act 2020',
    shortTitle: 'CAMA 2020',
    category: 'LFN (Federation)',
    year: 2020,
    citation: 'Act No. 3 of 2020',
    description: 'Framework for business incorporation, Single-member companies, Limited Liability Partnerships (LLP), CAC administration, and insolvency practitioner framework.',
    sectionsCount: 870,
    sections: [
      {
        sectionNumber: '18',
        heading: 'Formation of a Company by Single Person',
        content: 'Notwithstanding anything contained in this Act, one person may form and incorporate a private company by complying with the requirements of this Act.'
      }
    ]
  },
  {
    id: 'acja-2015',
    title: 'Administration of Criminal Justice Act 2015',
    shortTitle: 'ACJA 2015',
    category: 'LFN (Federation)',
    year: 2015,
    citation: 'Act No. 12 of 2015',
    description: 'Promotes efficient management of criminal justice institutions, speedy dispensation of justice, protection of suspect rights, and ban on stay of proceedings in criminal trials (S.306).',
    sectionsCount: 495,
    sections: [
      {
        sectionNumber: '306',
        heading: 'Abolition of Stay of Proceedings',
        content: 'An application for stay of proceedings in respect of a criminal matter before the court shall not be entertained.'
      },
      {
        sectionNumber: '396',
        heading: 'Day-to-Day Trial and Time for Interlocutory Objections',
        content: '(2) After the plea has been taken, the defendant may raise any objection to the validity of the charge. (3) Upon arraignment, the trial shall proceed from day-to-day until conclusion. (7) An objection to the competence of the charge or jurisdiction may be considered along with the substantive issues and a ruling given at the time of delivery of judgment.'
      }
    ]
  },
  {
    id: 'land-use-act-1978',
    title: 'Land Use Act 1978',
    shortTitle: 'Land Use Act',
    category: 'LFN (Federation)',
    year: 1978,
    citation: 'Cap L5 LFN 2004',
    description: 'Vests all land within each State in the Governor to be held in trust for the use and common benefit of all Nigerians, and regulates the grant, alienation and revocation of rights of occupancy. Entrenched in the Constitution by Section 315(5).',
    sectionsCount: 51,
    sections: [
      {
        sectionNumber: '1',
        heading: 'Vesting of Land in the Governor',
        content: 'Subject to the provisions of this Act, all land comprised in the territory of each State in the Federation is vested in the Governor of that State, and such land shall be held in trust and administered for the use and common benefit of all Nigerians in accordance with the provisions of this Act.'
      },
      {
        sectionNumber: '5',
        heading: 'Powers of the Governor to Grant Statutory Rights of Occupancy',
        content: '(1) It shall be lawful for the Governor in respect of land, whether or not in an urban area, to grant statutory rights of occupancy to any person for all purposes; to grant easements appurtenant to statutory rights of occupancy; and to demand rent for any such land granted.'
      },
      {
        sectionNumber: '22',
        heading: 'Consent Required for Alienation of Statutory Right of Occupancy',
        content: 'It shall not be lawful for the holder of a statutory right of occupancy granted by the Governor to alienate his right of occupancy or any part of it by assignment, mortgage, transfer of possession, sublease or otherwise howsoever without the consent of the Governor first had and obtained.'
      },
      {
        sectionNumber: '28',
        heading: 'Power of Governor to Revoke Rights of Occupancy',
        content: '(1) It shall be lawful for the Governor to revoke a right of occupancy for overriding public interest. (2) Overriding public interest in the case of a statutory right of occupancy means, among others, the requirement of the land by the Government of the State or Federal Government for public purposes, or the requirement of the land for mining purposes or oil pipelines.'
      }
    ]
  },
  {
    id: 'electoral-act-2022',
    title: 'Electoral Act 2022',
    shortTitle: 'Electoral Act 2022',
    category: 'LFN (Federation)',
    year: 2022,
    citation: 'Act No. 13 of 2022',
    description: 'Consolidated law regulating the conduct of federal, state and area council elections in Nigeria, introducing the Bimodal Voter Accreditation System (BVAS), electronic transmission of results, and revised timelines for party primaries and nomination of candidates.',
    sectionsCount: 153,
    sections: [
      {
        sectionNumber: '29',
        heading: 'Submission of List of Candidates and False Information',
        content: '(1) Every political party shall not later than 180 days before the date appointed for a general election submit to the Commission the list of the candidates the party proposes to sponsor at the elections, who emerged from valid primaries. (5) Any aspirant who participated in the primaries may challenge, on grounds of false information of a fundamental nature in the affidavit or documents submitted, by a candidate to the Commission.'
      },
      {
        sectionNumber: '84',
        heading: 'Nomination of Candidates by Parties (Primaries)',
        content: '(1) A political party seeking to nominate candidates for elections shall hold primaries for aspirants to all elective positions, which may be direct, indirect or by consensus. Only members of a political party who are duly registered may participate and vote at the primaries.'
      },
      {
        sectionNumber: '134',
        heading: 'Grounds for Questioning an Election',
        content: '(1) An election may be questioned on any of the following grounds — (a) that a person whose election is questioned was, at the time of the election, not qualified to contest the election; (b) that the election was invalid by reason of corrupt practices or non-compliance with the provisions of this Act; or (c) that the respondent was not duly elected by majority of lawful votes cast at the election.'
      },
      {
        sectionNumber: '135',
        heading: 'Effect of Non-Compliance',
        content: '(1) An election shall not be liable to be invalidated by reason of non-compliance with the provisions of this Act if it appears to the Election Tribunal or Court that the election was conducted substantially in accordance with the principles of this Act and that the non-compliance did not affect substantially the result of the election.'
      }
    ]
  },
  {
    id: 'criminal-code-act',
    title: 'Criminal Code Act',
    shortTitle: 'Criminal Code',
    category: 'LFN (Federation)',
    year: 1916,
    citation: 'Cap C38 LFN 2004',
    description: 'The principal codified criminal law applicable in the Southern States of Nigeria, defining offences against the person, property, public order and morality, together with defences and punishments.',
    sectionsCount: 521,
    sections: [
      {
        sectionNumber: '316',
        heading: 'Definition of Murder',
        content: 'Except as hereinafter set forth, a person who unlawfully kills another under any of the following circumstances, that is to say — (1) if the offender intends to cause the death of the person killed or that of some other person; (2) if the offender intends to do to the person killed or to some other person some grievous harm — is guilty of murder.'
      },
      {
        sectionNumber: '319',
        heading: 'Punishment for Murder',
        content: '(1) Subject to the provisions of this section, any person who commits the offence of murder shall be sentenced to death.'
      },
      {
        sectionNumber: '383',
        heading: 'Definition of Stealing',
        content: 'A person who fraudulently takes anything capable of being stolen, or fraudulently converts to his own use or to the use of any other person anything capable of being stolen, is said to steal that thing.'
      }
    ]
  },
  {
    id: 'penal-code',
    title: 'Penal Code (Northern States) Federal Provisions Act',
    shortTitle: 'Penal Code',
    category: 'LFN (Federation)',
    year: 1960,
    citation: 'Cap P3 LFN 2004',
    description: 'The codified criminal law applicable in the Northern States of Nigeria and the Federal Capital Territory, modelled on the Indian/Sudanese penal codes, defining offences, criminal responsibility and punishments.',
    sectionsCount: 410,
    sections: [
      {
        sectionNumber: '221',
        heading: 'Culpable Homicide Punishable with Death',
        content: 'Except in the circumstances mentioned in section 222, culpable homicide shall be punished with death — (a) if the act by which the death is caused is done with the intention of causing death; or (b) if the doer of the act knew or had reason to know that death would be the probable and not only a likely consequence of the act.'
      },
      {
        sectionNumber: '68',
        heading: 'Right of Private Defence',
        content: 'Nothing is an offence which is done in the lawful exercise of the right of private defence of person or property, subject to the restrictions contained in the Code.'
      }
    ]
  },
  {
    id: 'matrimonial-causes-act',
    title: 'Matrimonial Causes Act',
    shortTitle: 'Matrimonial Causes Act',
    category: 'LFN (Federation)',
    year: 1970,
    citation: 'Cap M7 LFN 2004',
    description: 'Governs the dissolution and nullity of statutory (Act) marriages in Nigeria, custody and maintenance of children, ancillary reliefs and the sole ground for divorce — that the marriage has broken down irretrievably.',
    sectionsCount: 114,
    sections: [
      {
        sectionNumber: '15',
        heading: 'Sole Ground and Facts for Dissolution of Marriage',
        content: '(1) A petition for a decree of dissolution of marriage may be presented to the court by either party to the marriage upon the ground that the marriage has broken down irretrievably. (2) The court shall hold the marriage to have broken down irretrievably only if the petitioner satisfies the court of one or more of the facts, including that the respondent has committed adultery and the petitioner finds it intolerable to live with the respondent, or that the parties have lived apart for a continuous period of at least two or three years, among others.'
      },
      {
        sectionNumber: '69',
        heading: 'Welfare of Children Paramount',
        content: 'In proceedings with respect to the custody, guardianship, welfare, advancement or education of children of a marriage, the court shall regard the interests of those children as the paramount consideration.'
      }
    ]
  },
  {
    id: 'arbitration-mediation-act-2023',
    title: 'Arbitration and Mediation Act 2023',
    shortTitle: 'AMA 2023',
    category: 'LFN (Federation)',
    year: 2023,
    citation: 'Act No. 8 of 2023',
    description: 'Repealed the Arbitration and Conciliation Act to provide a unified legal framework for domestic and international commercial arbitration and mediation, introducing third-party funding, emergency arbitrators, an Award Review Tribunal, and modern enforcement rules.',
    sectionsCount: 92,
    sections: [
      {
        sectionNumber: '5',
        heading: 'Arbitration Agreement and Doctrine of Separability',
        content: 'An arbitration clause which forms part of a contract shall be treated as an agreement independent of the other terms of the contract, and a decision by the arbitral tribunal that the contract is null and void shall not entail ipso jure the invalidity of the arbitration clause.'
      },
      {
        sectionNumber: '55',
        heading: 'Application for Setting Aside an Arbitral Award',
        content: 'An arbitral award may be set aside by the Court only where the party making the application furnishes proof that a party to the arbitration agreement was under some incapacity; the arbitration agreement is not valid; proper notice was not given; the award deals with matters beyond the scope of submission; or the composition of the tribunal or procedure was not in accordance with the agreement; or where the Court finds the subject-matter is not arbitrable or the award is against public policy.'
      },
      {
        sectionNumber: '57',
        heading: 'Recognition and Enforcement of Awards',
        content: 'An arbitral award shall, irrespective of the country in which it was made, be recognised as binding and, upon application in writing to the Court, shall be enforced subject to the provisions of this Act and the New York Convention set out in the Third Schedule.'
      }
    ]
  },
  {
    id: 'ndpa-2023',
    title: 'Nigeria Data Protection Act 2023',
    shortTitle: 'NDPA 2023',
    category: 'LFN (Federation)',
    year: 2023,
    citation: 'Act No. 37 of 2023',
    description: 'Establishes the Nigeria Data Protection Commission and provides the legal framework for the protection of personal data, the lawful processing of data by controllers and processors, and the enforceable rights of data subjects.',
    sectionsCount: 64,
    sections: [
      {
        sectionNumber: '24',
        heading: 'Principles of Data Processing',
        content: 'A data controller or data processor shall ensure that personal data is processed in a fair, lawful and transparent manner; collected for specified, explicit and legitimate purposes; adequate, relevant and limited to the minimum necessary; accurate and kept up to date; retained for no longer than necessary; and processed in a manner that ensures appropriate security of the personal data.'
      },
      {
        sectionNumber: '25',
        heading: 'Lawful Basis for Processing',
        content: 'The processing of personal data shall be lawful only where, and to the extent that, the data subject has given consent; or the processing is necessary for the performance of a contract, compliance with a legal obligation, protection of vital interests, a task carried out in the public interest, or the legitimate interests pursued by the data controller.'
      },
      {
        sectionNumber: '34',
        heading: 'Rights of a Data Subject',
        content: 'A data subject has the right to request information about, and access to, personal data being processed; to request rectification or erasure; to object to or restrict processing; to withdraw consent at any time; and to data portability, subject to the provisions of this Act.'
      }
    ]
  }
];

export const LEGAL_DRAFTS_DATA: LegalDraft[] = [
  {
    id: 'draft-001',
    title: 'Motion on Notice for Interlocutory Injunction',
    category: 'Civil',
    areaOfLaw: 'Civil Litigation & Advocacy',
    description: 'Formal court process filed to restrain a party from taking actions affecting the subject matter (res) pending the final determination of the suit.',
    courtHeadingRequired: true,
    downloadCount: 4120,
    isCustomizableWithAI: true,
    variables: ['courtName', 'state', 'suitNo', 'claimant', 'defendant', 'prayers', 'grounds'],
    sampleText: `IN THE HIGH COURT OF LAGOS STATE
IN THE LAGOS JUDICIAL DIVISION
HOLDEN AT LAGOS

SUIT NO: LD/10425/2026

BETWEEN:
CHIEF OSITA NWOSU ................................................................ CLAIMANT/APPLICANT
AND
PRIME LANDS REALTY LTD ....................................................... DEFENDANT/RESPONDENT

MOTION ON NOTICE
BROUGHT PURSUANT TO ORDER 39 RULE 1 & 2 OF THE HIGH COURT OF LAGOS STATE (CIVIL PROCEDURE) RULES 2019 AND UNDER THE INHERENT JURISDICTION OF THIS HONORABLE COURT

TAKE NOTICE that this Honorable Court will be moved on the _____ day of _____________ 2026 at the hour of 9 o'clock in the forenoon or so soon thereafter as Counsel may be heard on behalf of the Claimant/Applicant praying for the following orders:

1. AN ORDER OF INTERLOCUTORY INJUNCTION restraining the Defendant/Respondent whether by itself, directors, servants, agents, privies or whosoever called from entering upon, constructing, selling or in any manner interfering with the piece or parcel of land situated at Plot 14 Lekki Phase 1, Lagos State pending the hearing and final determination of this suit.

2. AND FOR SUCH FURTHER ORDER OR ORDERS as this Honorable Court may deem fit to make in the circumstances.

DATED THIS ______ DAY OF _________________ 2026.

_______________________________
O. J. ADEMOLA, ESQ.
Counsel to the Claimant/Applicant
Ademola & Co. Legal Practitioners
12 Marina, Lagos State.
For Service On:
The Defendant, Prime Lands Realty Ltd, Victoria Island, Lagos.`
  },
  {
    id: 'draft-002',
    title: 'Affidavit in Support of Motion for Injunction',
    category: 'Affidavits',
    areaOfLaw: 'Civil Litigation & Advocacy',
    description: 'Sworn affidavit setting out factual grounds, urgency, balance of convenience, and undertaking as to damages.',
    courtHeadingRequired: true,
    downloadCount: 3890,
    isCustomizableWithAI: true,
    variables: ['deponentName', 'occupation', 'facts', 'undertaking'],
    sampleText: `IN THE HIGH COURT OF LAGOS STATE
IN THE LAGOS JUDICIAL DIVISION
HOLDEN AT LAGOS

SUIT NO: LD/10425/2026

BETWEEN:
CHIEF OSITA NWOSU ................................................................ CLAIMANT/APPLICANT
AND
PRIME LANDS REALTY LTD ....................................................... DEFENDANT/RESPONDENT

AFFIDAVIT IN SUPPORT OF MOTION ON NOTICE

I, CHIEF OSITA NWOSU, Male, Christian, Nigerian Citizen, Business Executive of 5 Parkview Estate, Ikoyi, Lagos, do hereby make oath and state as follows:

1. That I am the Claimant/Applicant in this suit and by virtue of which I am conversant with the facts deposed herein.
2. That I am the lawful beneficial owner of Plot 14 Lekki Phase 1 under C of O No. 99/99/2012.
3. That on 10th January 2026, the Defendant illegally brought heavy earth-moving equipment to commence excavation on my land.
4. That unless restrained by this Court, the res will be completely destroyed before trial.
5. That I hereby give a solemn undertaking to pay damages should this application turn out to be frivolous.
6. That I make this solemn declaration conscientiously believing the contents to be true and in accordance with the Oaths Act.`
  },
  {
    id: 'draft-003',
    title: 'Notice of Appeal (Court of Appeal)',
    category: 'Appellate',
    areaOfLaw: 'Civil Litigation & Advocacy',
    description: 'Standard Notice of Appeal filed at the Registry of the trial court to initiate appellate review at the Court of Appeal.',
    courtHeadingRequired: true,
    downloadCount: 2950,
    isCustomizableWithAI: true,
    variables: ['trialCourt', 'appealNo', 'appellant', 'respondent', 'groundsOfAppeal'],
    sampleText: `IN THE COURT OF APPEAL
IN THE LAGOS JUDICIAL DIVISION
HOLDEN AT LAGOS

APPEAL NO: CA/L/______/2026
SUIT NO: LD/8821/2025

BETWEEN:
AFRI-TECH ENERGY LTD .......................................................... APPELLANT
AND
FIRST COMMERCE BANK PLC ................................................. RESPONDENT

NOTICE OF APPEAL

TAKE NOTICE that the Appellant being dissatisfied with the decision of the High Court of Lagos State contained in the Judgment of Hon. Justice A. B. Cole delivered on 15th December 2025 doth hereby appeal to the Court of Appeal upon the grounds set out in paragraph 3 below...`
  },
  {
    id: 'draft-004',
    title: 'Written Address on Preliminary Objection (Jurisdiction)',
    category: 'Civil',
    areaOfLaw: 'Civil Litigation & Advocacy',
    description: 'Comprehensive written address citing Madukolu v. Nkemdilim & Salu v. Egeibon challenging jurisdiction.',
    courtHeadingRequired: true,
    downloadCount: 3100,
    isCustomizableWithAI: true,
    variables: ['courtName', 'parties', 'legalArguments'],
    sampleText: `WRITTEN ADDRESS IN SUPPORT OF PRELIMINARY OBJECTION
ISSUE 1: Whether this Honorable Court has jurisdiction where condition precedent was breached...`
  }
];

export const APPEALS_RESOURCES: AppealResource[] = [
  {
    id: 'app-01',
    title: 'Appeals as of Right under Section 241(1) Constitution',
    appealCategory: 'Appeal as of Right',
    courtLevel: 'Court of Appeal',
    statutoryTimeframe: '90 Days for Final Judgments; 14 Days for Interlocutory Decisions',
    description: 'Appeals that require no leave of court. Includes decisions involving interpretation of the Constitution, Fundamental Human Rights, or final decisions of High Courts in civil/criminal proceedings.',
    checklists: [
      'Verify if Judgment is Final or Interlocutory (Ogolo v. Ogolo test)',
      'Confirm 90-day time limit from date of judgment delivery',
      'Pay prescribed filing fees and obtain certified true copy (CTC) of judgment',
      'Serve Notice of Appeal on all Respondents personally or by substituted service order'
    ],
    relevantRules: 'S.241(1) 1999 Constitution & Order 6 Court of Appeal Rules 2021',
  },
  {
    id: 'app-02',
    title: 'Application for Leave to Appeal (Out of Time / Interlocutory)',
    appealCategory: 'Leave to Appeal',
    courtLevel: 'Court of Appeal',
    statutoryTimeframe: 'Tripartite Prayer Application required if time has elapsed',
    description: 'Required where the appeal is on facts alone or mixed law and facts from interlocutory decisions, or where the 90/14-day statutory time limit has expired.',
    checklists: [
      'Draft Motion for Leave to Appeal / Extension of Time to apply for Leave / Extension of Time to Appeal',
      'Attach Affidavit explaining cogent reasons for the delay',
      'Attach Proposed Notice of Appeal showing arguable grounds of appeal'
    ],
    relevantRules: 'Order 7 Rule 10 Court of Appeal Rules 2021',
  }
];

export const COURTROOM_VIDEOS: CourtroomVideo[] = [
  {
    id: 'vid-01',
    title: 'Mastering Cross-Examination of Expert Witnesses in Nigerian Courts',
    topic: 'Cross Examination',
    duration: '42 mins',
    instructorName: 'Chief Rotimi Williams SAN Memorial Lecture Series',
    instructorTitle: 'Senior Advocate of Nigeria',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Embed placeholder
    thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    summaryNotes: `Key Techniques Taught:
1. Destabilizing the expert's qualifications under S.68 Evidence Act 2011.
2. Testing the factual premises and methodology relied upon by the expert witness.
3. Locking down the witness with closed leading questions (Yes/No answers).
4. Never asking "Why?" during cross-examination.`,
    downloadableMaterials: ['Expert_Cross_Exam_Checklist_LAWPEX.pdf', 'Sample_Questions_Forensic_Accounting.docx']
  },
  {
    id: 'vid-02',
    title: 'Tendering Computer-Generated Evidence under Section 84 Evidence Act',
    topic: 'Tendering Exhibits',
    duration: '35 mins',
    instructorName: 'Prof. Yemi Osinbajo SAN',
    instructorTitle: 'Professor of Evidence & Advocacy',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=800&q=80',
    summaryNotes: `Step-by-Step Courtroom Demonstration:
- How to lay proper foundation before witness produces printout.
- Tendering S.84 Certificate of Compliance.
- Overcoming objections on hearsay and original vs secondary electronic records (Kubor v. Dickson).`,
    downloadableMaterials: ['Section_84_Certificate_Draft_Template.docx', 'Evidence_Act_S84_CaseLaw_Digest.pdf']
  }
];

export const LEGAL_ARTICLES: LegalArticle[] = [
  {
    id: 'art-001',
    title: 'The Evolution of Electronic Evidence in Nigerian Litigation: 15 Years after Evidence Act 2011',
    author: 'Dr. Babatunde Ajibade, SAN',
    authorRole: 'Managing Partner, SPA Ajibade & Co.',
    category: 'Evidence & Procedure',
    publishedDate: '18 July 2026',
    readTimeMinutes: 8,
    excerpt: 'An in-depth critical analysis of judicial attitudes towards Section 84 certificate requirements, WhatsApp chats, email chains, and AI-generated records in High Courts.',
    fullContent: `ELECTRONIC EVIDENCE JURISPRUDENCE IN NIGERIAN COURTS
By Dr. Babatunde Ajibade, SAN

Introduction:
When the Evidence Act 2011 replaced the archaic 1945 Act, Section 84 was heralded as a revolutionary bridge to the modern digital era...`,
    tags: ['Section 84', 'Electronic Evidence', 'Supreme Court', 'Kubor v Dickson']
  },
  {
    id: 'art-002',
    title: 'Navigating Insolvency and Business Rescue under CAMA 2020: Practical Guide for Litigators',
    author: 'Chief Anthony Idigbe, SAN',
    authorRole: 'Senior Partner, Punuka Attorneys',
    category: 'Corporate & CAMA',
    publishedDate: '02 June 2026',
    readTimeMinutes: 12,
    excerpt: 'How Company Voluntary Arrangements (CVA) and Company Rescue Managers affect pending debt recovery lawsuits and bank enforcement suits.',
    fullContent: `CAMA 2020 INSOLVENCY PRACTICE GUIDE
The introduction of Administration and Company Voluntary Arrangements (CVAs) under Chapter 17 of CAMA 2020 changed debt litigation...`,
    tags: ['CAMA 2020', 'Insolvency', 'CVA', 'Federal High Court']
  }
];

export const COMPLIANCE_GUIDES: ComplianceGuide[] = [
  {
    id: 'comp-01',
    sector: 'Anti-Money Laundering (AML/KYC)',
    title: 'NFIU & SCUML Compliance Guide for Nigerian Law Firms & Financial Institutions',
    overview: 'Designation of Legal Practitioners as Designated Non-Financial Businesses and Professions (DNFBPs) under Money Laundering (Prevention and Prohibition) Act 2022.',
    regulatoryBody: 'Special Control Unit Against Money Laundering (SCUML) / NFIU',
    keyComplianceItems: [
      { requirement: 'SCUML Registration & Compliance Officer designation', penalty: 'Suspension of account & Fine up to ₦10,000,000', deadline: 'Immediate' },
      { requirement: 'Filing Suspicious Transaction Reports (STRs) & Currency Transaction Reports (CTRs) above ₦5M for individuals / ₦10M for corporate entities', penalty: 'Criminal prosecution of directors', deadline: 'Within 7 days of transaction' }
    ],
    checklist: [
      'Appoint AML Compliance Officer',
      'Conduct Customer Due Diligence (CDD) on all retainer clients',
      'Maintain transaction records for minimum 5 years',
      'File monthly returns on SCUML portal'
    ]
  },
  {
    id: 'comp-02',
    sector: 'Data Protection (NDPR)',
    title: 'Nigeria Data Protection Act 2023 (NDPA) Corporate Audit & Audit Filing',
    overview: 'Mandatory compliance framework for Data Controllers and Data Processors of major importance processing personal data of Nigerian citizens.',
    regulatoryBody: 'Nigeria Data Protection Commission (NDPC)',
    keyComplianceItems: [
      { requirement: 'Annual Data Protection Audit Report Filing', penalty: 'Fine up to 2% of annual gross revenue or ₦10,000,000', deadline: 'March 15 Annually' }
    ],
    checklist: [
      'Publish Privacy Policy on corporate website',
      'Appoint Data Protection Officer (DPO)',
      'Conduct Data Protection Impact Assessment (DPIA) before launching digital services'
    ]
  }
];

export const BAR_EXAM_COURSES = [
  {
    id: 'nls-civil',
    title: 'Civil Litigation & Rules of Court',
    pastQuestionYears: '2015 - 2025 Past Questions',
    description: 'Comprehensive Nigerian Law School Bar Final suite: High Court Rules, Originating Processes, Interlocutory Injunctions, Summary Judgments, and Enforcement.',
    syllabusModules: [
      'Overview of Civil Courts Jurisdiction in Nigeria',
      'Instigation of Civil Suits: Writ vs Originating Summons',
      'Pleadings & Pre-Trial Conference (Order 15 Lagos Rules)',
      'Interlocutory Applications & Injunctions',
      'Summary Judgment Procedures & Fast Track',
      'Garnishee Proceedings & Judgment Enforcement'
    ],
    sampleQuizzes: [
      {
        question: 'Which of the following originating processes is appropriate where the principal question at issue is, or is likely to be, one of the construction of a statute or written instrument?',
        options: [
          'Writ of Summons',
          'Originating Summons',
          'Petition',
          'Originating Motion'
        ],
        correctIndex: 1,
        explanation: 'Under Nigerian High Court Rules, Originating Summons is reserved for non-contentious suits involving statutory interpretation or construction of documents where facts are not in dispute (Key v. Key; Doherty v. Doherty).'
      },
      {
        question: 'Under Section 84 of the Sheriffs and Civil Process Act, whose consent is mandatory before garnishee proceedings can be commenced against funds in the custody of a public officer?',
        options: [
          'The Chief Judge of the State',
          'The Attorney-General of the Federation or State',
          'The Governor of the Central Bank of Nigeria',
          'The Inspector-General of Police'
        ],
        correctIndex: 1,
        explanation: 'Section 84(1) of the Sheriffs and Civil Process Act requires the prior consent of the Attorney-General before a garnishee order nisi can be served on a public officer holding government funds in custody.'
      }
    ]
  },
  {
    id: 'nls-criminal',
    title: 'Criminal Litigation & ACJA 2015',
    pastQuestionYears: '2015 - 2025 Past Questions',
    description: 'Administration of Criminal Justice Act (ACJA 2015), Charge Drafting, Bail Applications, Examination of Witnesses, and Criminal Appeals.',
    syllabusModules: [
      'Constitutional Rights of Suspects (S.35 & 36 1999 Constitution)',
      'Drafting Charges & Counts under ACJA 2015',
      'Bail Applications in High Court & Magistrate Court',
      'Trial Procedure & Trial within Trial (Voir Dire)',
      'No-Case Submission Requirements & Ratios',
      'Section 306 ACJA Ban on Stay of Proceedings'
    ],
    sampleQuizzes: [
      {
        question: 'What is the legal effect of Section 306 of the Administration of Criminal Justice Act (ACJA) 2015 on criminal proceedings in Nigeria?',
        options: [
          'It grants the Defendant automatic right to interlocutory bail',
          'It abolishes applications for stay of proceedings in criminal trials',
          'It mandates trial to conclude within 14 days',
          'It allows private prosecutors to institute capital offence trials'
        ],
        correctIndex: 1,
        explanation: 'Section 306 ACJA 2015 explicitly provides that an application for stay of proceedings in respect of a criminal trial shall not be entertained, ensuring speedy trial without interlocutory delays.'
      }
    ]
  },
  {
    id: 'nls-corporate',
    title: 'Corporate Law Practice (CAMA 2020)',
    pastQuestionYears: '2015 - 2025 Past Questions',
    description: 'CAMA 2020 incorporation, CAC CRP Portal, Share Capital, Board Resolutions, Winding Up, and Insolvency Practice.',
    syllabusModules: [
      'Incorporation of Private & Public Companies',
      'Single Shareholder Company under CAMA 2020 S.18',
      'Limited Liability Partnerships (LLP) & Business Names',
      'Board Meetings, AGM Notices & CAC Filings',
      'Company Insolvency, Administration & Receiver Management'
    ],
    sampleQuizzes: [
      {
        question: 'Under CAMA 2020, what is the minimum number of persons required to form and incorporate a private limited liability company in Nigeria?',
        options: [
          'One (1) Person',
          'Two (2) Persons',
          'Seven (7) Persons',
          'Fifty (50) Persons'
        ],
        correctIndex: 0,
        explanation: 'Section 18 of CAMA 2020 revolutionized Nigerian corporate law by allowing a single individual to incorporate and own a private company.'
      }
    ]
  },
  {
    id: 'nls-property',
    title: 'Property Law Practice & Conveyancing',
    pastQuestionYears: '2015 - 2025 Past Questions',
    description: 'Land Use Act 1978, Deed of Assignment, Governor\'s Consent, Mortgages, Leases, and Probate/Letters of Administration.',
    syllabusModules: [
      'Deducing & Investigating Title to Land in Nigeria',
      'Drafting Contract of Sale & Deed of Assignment',
      'Governor\'s Consent requirement under S.22 Land Use Act',
      'Mortgages, Registration of Charges & Stamping',
      'Wills Act Requirements, Grants of Probate & Administration'
    ],
    sampleQuizzes: [
      {
        question: 'Under Section 22 of the Land Use Act 1978, whose consent is required before a holder of a customary or statutory right of occupancy can alienate his interest by assignment or mortgage?',
        options: [
          'The President of Nigeria',
          'The Governor of the State where the land is situated',
          'The Surveyor-General of the Federation',
          'The Chairman of the Local Government'
        ],
        correctIndex: 1,
        explanation: 'Section 22 of the Land Use Act renders any alienation of statutory right of occupancy without the prior consent of the State Governor null and void (Savannah Bank v. Ajilo).'
      }
    ]
  },
  {
    id: 'nls-ethics',
    title: 'Professional Ethics & Conduct',
    pastQuestionYears: '2015 - 2025 Past Questions',
    description: 'Rules of Professional Conduct for Legal Practitioners (RPC 2023), Client Accounts, LPDC Discipline, Contempt, and Advertising.',
    syllabusModules: [
      'Duties of Counsel to Court, Client, and Bar',
      'Rules of Professional Conduct (RPC 2023)',
      'Legal Practitioners Disciplinary Committee (LPDC) Procedure',
      'Handling Client Funds & Client Accounts Rules',
      'Touting, Advertising & Contingency Fee Restrictions'
    ],
    sampleQuizzes: [
      {
        question: 'Where a lawyer receives money on behalf of a client, into which account must the funds be immediately deposited?',
        options: [
          'The Lawyer\'s Personal Savings Account',
          'A Dedicated Client Account opened in a commercial bank',
          'The Law Firm\'s Office Expenditure Account',
          'The Nigerian Bar Association Welfare Fund'
        ],
        correctIndex: 1,
        explanation: 'Under the Legal Practitioners Accounts Rules and RPC, a lawyer must keep client money completely separate in a dedicated Client Account.'
      }
    ]
  }
];

export const LEARNING_COURSES: LearningCourse[] = [
  {
    id: 'course-101',
    title: 'Appellate Advocacy & Brief Writing Masterclass',
    level: 'Senior Advocate Masterclass',
    modulesCount: 8,
    durationHours: 12,
    instructor: 'Hon. Justice Samson Uwaifo (Rtd), JSC',
    description: 'Learn how to distill complex trial records into persuasive, razor-sharp Appellant and Respondent Briefs of Argument for the Court of Appeal and Supreme Court.',
    topics: ['Formulating Issues for Determination from Grounds', 'Brief Writing Syntax', 'Oral Argument Before the Apex Bench', 'Handling Hot Benches'],
    enrolledCount: 1420,
    certificateProvided: true
  },
  {
    id: 'course-102',
    title: 'Corporate Secretarial & CAC Practice under CAMA 2020',
    level: 'Intermediate',
    modulesCount: 6,
    durationHours: 9,
    instructor: 'Folake Solanke Legal Academy',
    description: 'Step-by-step masterclass on navigating the CAC CRP portal, post-incorporation filings, board resolutions, and corporate restructuring.',
    topics: ['CAC CRP Portal Mastery', 'Filing Annual Returns', 'Allotment & Transfer of Shares', 'Filing Mortgages & Charges'],
    enrolledCount: 2890,
    certificateProvided: true
  }
];
