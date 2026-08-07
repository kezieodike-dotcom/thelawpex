import { NIGERIAN_STATES, highCourtName, stateSlug } from './nigeria';
import { NIGERIAN_LAWS_DATA } from './legalData';

/**
 * Two law libraries:
 *
 *  1. The Laws of the Federation of Nigeria — an index of the federal Acts a
 *     practitioner reaches for, grouped by subject. Where a law has been fully
 *     sectioned in the statute database, `fullTextId` points at it.
 *  2. The laws of the 36 states and the Federal Capital Territory — the state
 *     enactments that govern practice in each jurisdiction.
 */

export interface FederalLawEntry {
  id: string;
  title: string;
  shortTitle: string;
  citation: string;
  year: number;
  category: FederalLawCategory;
  description: string;
  /** Id into NIGERIAN_LAWS_DATA where the full sectioned text is available. */
  fullTextId?: string;
}

export type FederalLawCategory =
  | 'Constitution & Courts'
  | 'Criminal Law & Justice'
  | 'Civil & Commercial'
  | 'Corporate & Financial'
  | 'Tax & Revenue'
  | 'Labour & Employment'
  | 'Land, Property & Succession'
  | 'Family & Persons'
  | 'Intellectual Property & Technology'
  | 'Energy, Environment & Transport'
  | 'Public Law & Administration';

export const FEDERAL_LAW_CATEGORIES: FederalLawCategory[] = [
  'Constitution & Courts',
  'Criminal Law & Justice',
  'Civil & Commercial',
  'Corporate & Financial',
  'Tax & Revenue',
  'Labour & Employment',
  'Land, Property & Succession',
  'Family & Persons',
  'Intellectual Property & Technology',
  'Energy, Environment & Transport',
  'Public Law & Administration',
];

export const FEDERAL_LAWS: FederalLawEntry[] = [
  // Constitution & Courts
  {
    id: 'const-1999',
    title: 'Constitution of the Federal Republic of Nigeria 1999 (as amended)',
    shortTitle: '1999 Constitution',
    citation: 'CFRN 1999 (as amended)',
    year: 1999,
    category: 'Constitution & Courts',
    description:
      'The supreme law of the Federation. Chapter IV guarantees fundamental rights; Sections 230–296 establish the courts and their jurisdiction; Section 6(6) vests judicial powers; Section 36 guarantees fair hearing.',
    fullTextId: 'const-1999',
  },
  {
    id: 'supreme-court-act',
    title: 'Supreme Court Act',
    shortTitle: 'Supreme Court Act',
    citation: 'Cap S15 LFN 2004',
    year: 2004,
    category: 'Constitution & Courts',
    description:
      'Constitution, jurisdiction and practice of the Supreme Court of Nigeria, including its powers on appeal and the composition of the panel for constitutional questions.',
  },
  {
    id: 'court-of-appeal-act',
    title: 'Court of Appeal Act',
    shortTitle: 'Court of Appeal Act',
    citation: 'Cap C36 LFN 2004',
    year: 2004,
    category: 'Constitution & Courts',
    description:
      'Jurisdiction and practice of the Court of Appeal, the time within which appeals are brought, and the Court’s powers to receive fresh evidence and to order a retrial.',
  },
  {
    id: 'federal-high-court-act',
    title: 'Federal High Court Act',
    shortTitle: 'Federal High Court Act',
    citation: 'Cap F12 LFN 2004',
    year: 2004,
    category: 'Constitution & Courts',
    description:
      'Establishment, constitution and jurisdiction of the Federal High Court, and the transfer of causes between it and the State High Courts.',
  },
  {
    id: 'national-industrial-court-act',
    title: 'National Industrial Court Act',
    shortTitle: 'NICN Act',
    citation: 'NICN Act 2006',
    year: 2006,
    category: 'Constitution & Courts',
    description:
      'Establishment and jurisdiction of the National Industrial Court over labour, employment, trade union and industrial relations matters, read with Section 254C of the Constitution.',
  },
  {
    id: 'sheriffs-civil-process-act',
    title: 'Sheriffs and Civil Process Act',
    shortTitle: 'Sheriffs and Civil Process Act',
    citation: 'Cap S6 LFN 2004',
    year: 2004,
    category: 'Constitution & Courts',
    description:
      'Service of process across state boundaries and the enforcement of judgments — writs of execution, garnishee proceedings and judgment summonses.',
  },
  {
    id: 'interpretation-act',
    title: 'Interpretation Act',
    shortTitle: 'Interpretation Act',
    citation: 'Cap I23 LFN 2004',
    year: 2004,
    category: 'Constitution & Courts',
    description:
      'How federal enactments are construed — commencement, repeal and re-enactment, service by post, computation of time and the meaning of common statutory expressions.',
  },
  {
    id: 'legal-practitioners-act',
    title: 'Legal Practitioners Act',
    shortTitle: 'Legal Practitioners Act',
    citation: 'Cap L11 LFN 2004',
    year: 2004,
    category: 'Constitution & Courts',
    description:
      'Enrolment and privileges of legal practitioners, the rank of Senior Advocate of Nigeria, professional discipline and the recovery of a practitioner’s charges.',
  },
  {
    id: 'oaths-act',
    title: 'Oaths Act',
    shortTitle: 'Oaths Act',
    citation: 'Cap O1 LFN 2004',
    year: 2004,
    category: 'Constitution & Courts',
    description:
      'The form and administration of oaths and affirmations, and the requirements every affidavit filed in a Nigerian court must satisfy.',
  },
  {
    id: 'frep-rules-2009',
    title: 'Fundamental Rights (Enforcement Procedure) Rules 2009',
    shortTitle: 'FREP Rules 2009',
    citation: 'FREP Rules 2009',
    year: 2009,
    category: 'Constitution & Courts',
    description:
      'Procedure for enforcing Chapter IV rights and the African Charter — application by any originating process, no limitation period, and a mandate to expand rather than restrict access to the courts.',
  },

  // Criminal Law & Justice
  {
    id: 'acja-2015',
    title: 'Administration of Criminal Justice Act 2015',
    shortTitle: 'ACJA 2015',
    citation: 'ACJA 2015',
    year: 2015,
    category: 'Criminal Law & Justice',
    description:
      'Criminal procedure in the federal courts — arrest, bail, day-to-day trial, the abolition of stay of proceedings in criminal trials, plea bargaining and sentencing.',
    fullTextId: 'acja-2015',
  },
  {
    id: 'criminal-code-act',
    title: 'Criminal Code Act',
    shortTitle: 'Criminal Code',
    citation: 'Cap C38 LFN 2004',
    year: 2004,
    category: 'Criminal Law & Justice',
    description:
      'The code of criminal offences applicable in the southern states — offences against the person and property, and the general principles of criminal responsibility.',
    fullTextId: 'criminal-code-act',
  },
  {
    id: 'penal-code',
    title: 'Penal Code (Northern States) Federal Provisions Act',
    shortTitle: 'Penal Code',
    citation: 'Cap P3 LFN 2004',
    year: 2004,
    category: 'Criminal Law & Justice',
    description:
      'The code of criminal offences applicable in the northern states, with its own scheme of general exceptions, offences and punishments.',
    fullTextId: 'penal-code',
  },
  {
    id: 'evidence-act-2011',
    title: 'Evidence Act 2011 (as amended)',
    shortTitle: 'Evidence Act 2011',
    citation: 'Evidence Act 2011',
    year: 2011,
    category: 'Criminal Law & Justice',
    description:
      'Admissibility, relevance, burden and standard of proof in every Nigerian court — including Section 84 on computer-generated evidence and Section 83 on documentary hearsay.',
    fullTextId: 'evidence-act-2011',
  },
  {
    id: 'vapp-2015',
    title: 'Violence Against Persons (Prohibition) Act 2015',
    shortTitle: 'VAPP Act 2015',
    citation: 'VAPP Act 2015',
    year: 2015,
    category: 'Criminal Law & Justice',
    description:
      'Prohibits rape, spousal battery, harmful traditional practices, economic abuse and stalking, and provides for protection orders and a register of convicted offenders.',
  },
  {
    id: 'money-laundering-2022',
    title: 'Money Laundering (Prevention and Prohibition) Act 2022',
    shortTitle: 'Money Laundering Act 2022',
    citation: 'MLPPA 2022',
    year: 2022,
    category: 'Criminal Law & Justice',
    description:
      'Cash transaction thresholds and reporting duties, customer due diligence, designated non-financial businesses and professions, and the offence of money laundering.',
  },
  {
    id: 'terrorism-2022',
    title: 'Terrorism (Prevention and Prohibition) Act 2022',
    shortTitle: 'Terrorism Act 2022',
    citation: 'TPPA 2022',
    year: 2022,
    category: 'Criminal Law & Justice',
    description:
      'Proscription of terrorist groups, terrorism financing offences, investigative powers and the procedure for the trial of terrorism offences.',
  },
  {
    id: 'efcc-act-2004',
    title: 'Economic and Financial Crimes Commission (Establishment) Act 2004',
    shortTitle: 'EFCC Act',
    citation: 'EFCC Act 2004',
    year: 2004,
    category: 'Criminal Law & Justice',
    description:
      'Establishment, powers and jurisdiction of the EFCC over economic and financial crimes, including investigation, asset forfeiture and prosecution.',
  },
  {
    id: 'icpc-act-2000',
    title: 'Corrupt Practices and Other Related Offences Act 2000',
    shortTitle: 'ICPC Act',
    citation: 'ICPC Act 2000',
    year: 2000,
    category: 'Criminal Law & Justice',
    description:
      'Offences of bribery, gratification, and abuse of office by public officers, and the powers of the Independent Corrupt Practices Commission.',
  },
  {
    id: 'police-act-2020',
    title: 'Police Act 2020',
    shortTitle: 'Police Act 2020',
    citation: 'Police Act 2020',
    year: 2020,
    category: 'Criminal Law & Justice',
    description:
      'Powers and duties of the Nigeria Police Force, the conditions of lawful arrest, the rights of an arrested person, and police bail free of charge.',
  },
  {
    id: 'cybercrimes-2015',
    title: 'Cybercrimes (Prohibition, Prevention, etc.) Act 2015 (as amended)',
    shortTitle: 'Cybercrimes Act',
    citation: 'Cybercrimes Act 2015',
    year: 2015,
    category: 'Criminal Law & Justice',
    description:
      'Offences relating to computer systems, electronic fraud, identity theft, cyberstalking and the interception of electronic communications, with the duties of service providers.',
  },

  // Civil & Commercial
  {
    id: 'arbitration-mediation-act-2023',
    title: 'Arbitration and Mediation Act 2023',
    shortTitle: 'AMA 2023',
    citation: 'AMA 2023',
    year: 2023,
    category: 'Civil & Commercial',
    description:
      'Arbitration agreements, the appointment and challenge of arbitrators, interim measures, the award, third-party funding, and the recognition and enforcement of awards.',
    fullTextId: 'arbitration-mediation-act-2023',
  },
  {
    id: 'public-officers-protection',
    title: 'Public Officers Protection Act',
    shortTitle: 'Public Officers Protection Act',
    citation: 'Cap P41 LFN 2004',
    year: 2004,
    category: 'Civil & Commercial',
    description:
      'The three-month limitation on actions against public officers for acts done in the execution of a public duty, and the exceptions the courts have carved out of it.',
  },
  {
    id: 'fccpa-2018',
    title: 'Federal Competition and Consumer Protection Act 2018',
    shortTitle: 'FCCPA 2018',
    citation: 'FCCPA 2018',
    year: 2018,
    category: 'Civil & Commercial',
    description:
      'Prohibits restrictive agreements and abuse of dominance, regulates mergers, and creates enforceable consumer rights with the FCCPC as regulator.',
  },
  {
    id: 'stamp-duties-act',
    title: 'Stamp Duties Act',
    shortTitle: 'Stamp Duties Act',
    citation: 'Cap S8 LFN 2004',
    year: 2004,
    category: 'Civil & Commercial',
    description:
      'Instruments chargeable with duty, the time for stamping, and the consequence of failure to stamp — an unstamped instrument is inadmissible in evidence for most purposes.',
  },

  // Corporate & Financial
  {
    id: 'cama-2020',
    title: 'Companies and Allied Matters Act 2020',
    shortTitle: 'CAMA 2020',
    citation: 'CAMA 2020',
    year: 2020,
    category: 'Corporate & Financial',
    description:
      'Incorporation and management of companies, limited liability partnerships, business names and incorporated trustees; directors’ duties, minority protection, insolvency and business rescue.',
    fullTextId: 'cama-2020',
  },
  {
    id: 'bofia-2020',
    title: 'Banks and Other Financial Institutions Act 2020',
    shortTitle: 'BOFIA 2020',
    citation: 'BOFIA 2020',
    year: 2020,
    category: 'Corporate & Financial',
    description:
      'Licensing and supervision of banks and other financial institutions, the CBN’s powers of intervention and resolution, and offences by bank officers.',
  },
  {
    id: 'cbn-act-2007',
    title: 'Central Bank of Nigeria Act 2007',
    shortTitle: 'CBN Act 2007',
    citation: 'CBN Act 2007',
    year: 2007,
    category: 'Corporate & Financial',
    description:
      'Constitution and functions of the Central Bank, monetary policy, currency, and the Bank’s role as banker and adviser to the Federal Government.',
  },
  {
    id: 'isa-2025',
    title: 'Investments and Securities Act 2025',
    shortTitle: 'ISA 2025',
    citation: 'ISA 2025',
    year: 2025,
    category: 'Corporate & Financial',
    description:
      'Regulation of the capital market by the Securities and Exchange Commission — registration of securities and market operators, public offers, takeovers, digital assets and market offences.',
  },
  {
    id: 'ndic-act-2023',
    title: 'Nigeria Deposit Insurance Corporation Act 2023',
    shortTitle: 'NDIC Act 2023',
    citation: 'NDIC Act 2023',
    year: 2023,
    category: 'Corporate & Financial',
    description:
      'Deposit insurance, the resolution and liquidation of failing banks, and the NDIC’s powers as liquidator of a failed insured institution.',
  },
  {
    id: 'pension-reform-2014',
    title: 'Pension Reform Act 2014',
    shortTitle: 'Pension Reform Act 2014',
    citation: 'PRA 2014',
    year: 2014,
    category: 'Corporate & Financial',
    description:
      'The contributory pension scheme, the duties of employers and pension fund administrators, and the recovery of unremitted contributions.',
  },
  {
    id: 'insurance-act-2003',
    title: 'Insurance Act 2003',
    shortTitle: 'Insurance Act 2003',
    citation: 'Insurance Act 2003',
    year: 2003,
    category: 'Corporate & Financial',
    description:
      'Registration and supervision of insurers by NAICOM, compulsory insurances, the settlement of claims and the consequences of non-disclosure.',
  },
  {
    id: 'public-procurement-2007',
    title: 'Public Procurement Act 2007',
    shortTitle: 'Public Procurement Act',
    citation: 'PPA 2007',
    year: 2007,
    category: 'Corporate & Financial',
    description:
      'Competitive tendering for public contracts, thresholds and approving authorities, the review of procurement decisions and offences under the Act.',
  },

  // Tax & Revenue
  {
    id: 'cita',
    title: 'Companies Income Tax Act',
    shortTitle: 'CITA',
    citation: 'Cap C21 LFN 2004',
    year: 2004,
    category: 'Tax & Revenue',
    description:
      'Taxation of the profits of companies, allowable and disallowable deductions, capital allowances, and the assessment and appeal procedure.',
  },
  {
    id: 'pita',
    title: 'Personal Income Tax Act',
    shortTitle: 'PITA',
    citation: 'Cap P8 LFN 2004',
    year: 2004,
    category: 'Tax & Revenue',
    description:
      'Taxation of individuals, PAYE, the residence rules determining the taxing state, and the powers of the state boards of internal revenue.',
  },
  {
    id: 'vat-act',
    title: 'Value Added Tax Act',
    shortTitle: 'VAT Act',
    citation: 'Cap V1 LFN 2004',
    year: 2004,
    category: 'Tax & Revenue',
    description:
      'Charge of VAT on the supply of taxable goods and services, exemptions and zero-rating, registration, remittance and input tax recovery.',
  },
  {
    id: 'firs-act-2007',
    title: 'Federal Inland Revenue Service (Establishment) Act 2007',
    shortTitle: 'FIRS Act 2007',
    citation: 'FIRS Act 2007',
    year: 2007,
    category: 'Tax & Revenue',
    description:
      'Powers of the FIRS to assess, collect and enforce federal taxes, the Tax Appeal Tribunal, and the procedure for objections and appeals.',
  },
  {
    id: 'finance-act-2023',
    title: 'Finance Act 2023',
    shortTitle: 'Finance Act 2023',
    citation: 'Finance Act 2023',
    year: 2023,
    category: 'Tax & Revenue',
    description:
      'Annual amendments to the tax statutes — rates, reliefs, digital and non-resident taxation, and administrative changes to assessment and collection.',
  },

  // Labour & Employment
  {
    id: 'labour-act',
    title: 'Labour Act',
    shortTitle: 'Labour Act',
    citation: 'Cap L1 LFN 2004',
    year: 2004,
    category: 'Labour & Employment',
    description:
      'Contracts of employment for workers, wages, hours, redundancy, notice and termination, and the protection of women and young persons at work.',
  },
  {
    id: 'trade-disputes-act',
    title: 'Trade Disputes Act',
    shortTitle: 'Trade Disputes Act',
    citation: 'Cap T8 LFN 2004',
    year: 2004,
    category: 'Labour & Employment',
    description:
      'The steps for settling a trade dispute — internal machinery, mediation, conciliation, the Industrial Arbitration Panel and reference to the National Industrial Court.',
  },
  {
    id: 'trade-unions-act',
    title: 'Trade Unions Act',
    shortTitle: 'Trade Unions Act',
    citation: 'Cap T14 LFN 2004',
    year: 2004,
    category: 'Labour & Employment',
    description:
      'Registration and governance of trade unions, membership and check-off dues, and the conditions for lawful industrial action.',
  },
  {
    id: 'employees-compensation-2010',
    title: 'Employees’ Compensation Act 2010',
    shortTitle: 'Employees’ Compensation Act',
    citation: 'ECA 2010',
    year: 2010,
    category: 'Labour & Employment',
    description:
      'Compensation for death, injury, disease or disability arising out of and in the course of employment, administered by the Nigeria Social Insurance Trust Fund.',
  },

  // Land, Property & Succession
  {
    id: 'land-use-act-1978',
    title: 'Land Use Act 1978',
    shortTitle: 'Land Use Act',
    citation: 'Cap L5 LFN 2004',
    year: 1978,
    category: 'Land, Property & Succession',
    description:
      'Vests all land in each state in the Governor in trust for the people; statutory and customary rights of occupancy, the Governor’s consent to alienation, and revocation for overriding public interest.',
    fullTextId: 'land-use-act-1978',
  },
  {
    id: 'illiterates-protection',
    title: 'Illiterates Protection Act',
    shortTitle: 'Illiterates Protection Act',
    citation: 'Cap I17 LFN 2004',
    year: 2004,
    category: 'Land, Property & Succession',
    description:
      'The illiterate jurat — a writer of a document for an illiterate must state their name and address and that the document was read over and explained.',
  },
  {
    id: 'wills-administration',
    title: 'Administration of Estates and Wills legislation',
    shortTitle: 'Estates & Wills',
    citation: 'State Wills Laws & Administration of Estates Laws',
    year: 2004,
    category: 'Land, Property & Succession',
    description:
      'Testamentary capacity, the formal validity of wills, grants of probate and letters of administration, and the devolution of estates on intestacy. Principally state legislation, applied with the Wills Act 1837 where adopted.',
  },

  // Family & Persons
  {
    id: 'matrimonial-causes-act',
    title: 'Matrimonial Causes Act',
    shortTitle: 'Matrimonial Causes Act',
    citation: 'Cap M7 LFN 2004',
    year: 2004,
    category: 'Family & Persons',
    description:
      'Dissolution and nullity of statutory marriage on the sole ground of irretrievable breakdown, the Section 15(2) facts, custody, maintenance and settlement of property.',
    fullTextId: 'matrimonial-causes-act',
  },
  {
    id: 'marriage-act',
    title: 'Marriage Act',
    shortTitle: 'Marriage Act',
    citation: 'Cap M6 LFN 2004',
    year: 2004,
    category: 'Family & Persons',
    description:
      'Celebration of statutory marriage — notice, registrar’s certificate, licence, place and form of celebration, and the offences that invalidate a marriage.',
  },
  {
    id: 'child-rights-act-2003',
    title: 'Child’s Rights Act 2003',
    shortTitle: 'Child’s Rights Act',
    citation: 'CRA 2003',
    year: 2003,
    category: 'Family & Persons',
    description:
      'The rights of the child, the best-interests principle, prohibition of child marriage and child labour, family courts and the child justice system. Adopted by most states as a State Child’s Rights Law.',
  },
  {
    id: 'trafficking-2015',
    title: 'Trafficking in Persons (Prohibition) Enforcement and Administration Act 2015',
    shortTitle: 'Trafficking in Persons Act',
    citation: 'TIPPEA 2015',
    year: 2015,
    category: 'Family & Persons',
    description:
      'Offences of trafficking, forced labour and exploitation, the powers of NAPTIP, and the protection, rehabilitation and compensation of victims.',
  },

  // Intellectual Property & Technology
  {
    id: 'copyright-act-2022',
    title: 'Copyright Act 2022',
    shortTitle: 'Copyright Act 2022',
    citation: 'Copyright Act 2022',
    year: 2022,
    category: 'Intellectual Property & Technology',
    description:
      'Works eligible for copyright, the rights of authors and performers, exceptions and limitations, notice-and-takedown for online infringement, and civil and criminal remedies.',
  },
  {
    id: 'trade-marks-act',
    title: 'Trade Marks Act',
    shortTitle: 'Trade Marks Act',
    citation: 'Cap T13 LFN 2004',
    year: 2004,
    category: 'Intellectual Property & Technology',
    description:
      'Registration of trade marks, the Register and its parts, opposition and rectification, infringement and the action for passing off.',
  },
  {
    id: 'patents-designs-act',
    title: 'Patents and Designs Act',
    shortTitle: 'Patents and Designs Act',
    citation: 'Cap P2 LFN 2004',
    year: 2004,
    category: 'Intellectual Property & Technology',
    description:
      'Patentability, the rights conferred by a patent, industrial designs, compulsory licences and the remedies for infringement.',
  },
  {
    id: 'ndpa-2023',
    title: 'Nigeria Data Protection Act 2023',
    shortTitle: 'NDPA 2023',
    citation: 'NDPA 2023',
    year: 2023,
    category: 'Intellectual Property & Technology',
    description:
      'Lawful bases for processing personal data, the rights of data subjects, cross-border transfers, the duties of controllers and processors, and enforcement by the Nigeria Data Protection Commission.',
    fullTextId: 'ndpa-2023',
  },
  {
    id: 'nigerian-communications-2003',
    title: 'Nigerian Communications Act 2003',
    shortTitle: 'NCA 2003',
    citation: 'NCA 2003',
    year: 2003,
    category: 'Intellectual Property & Technology',
    description:
      'Licensing and regulation of communications services by the NCC, interconnection, consumer protection and the resolution of disputes between operators.',
  },
  {
    id: 'startup-act-2022',
    title: 'Nigeria Startup Act 2022',
    shortTitle: 'Startup Act 2022',
    citation: 'Startup Act 2022',
    year: 2022,
    category: 'Intellectual Property & Technology',
    description:
      'Labelling of startups, the Startup Investment Seed Fund, tax and regulatory incentives, and the Council for Digital Innovation and Entrepreneurship.',
  },

  // Energy, Environment & Transport
  {
    id: 'petroleum-industry-act-2021',
    title: 'Petroleum Industry Act 2021',
    shortTitle: 'PIA 2021',
    citation: 'PIA 2021',
    year: 2021,
    category: 'Energy, Environment & Transport',
    description:
      'Governance of the petroleum industry — the NUPRC and NMDPRA, licensing of upstream and midstream operations, host community development trusts and the fiscal framework.',
  },
  {
    id: 'local-content-2010',
    title: 'Nigerian Oil and Gas Industry Content Development Act 2010',
    shortTitle: 'Local Content Act',
    citation: 'NOGICD Act 2010',
    year: 2010,
    category: 'Energy, Environment & Transport',
    description:
      'Nigerian content requirements in the award of contracts in the oil and gas industry, and the supervisory role of the Nigerian Content Development and Monitoring Board.',
  },
  {
    id: 'electricity-act-2023',
    title: 'Electricity Act 2023',
    shortTitle: 'Electricity Act 2023',
    citation: 'Electricity Act 2023',
    year: 2023,
    category: 'Energy, Environment & Transport',
    description:
      'Post-privatisation regulation of the power sector, state electricity markets, licensing of generation, transmission and distribution, and consumer protection.',
  },
  {
    id: 'nesrea-2007',
    title: 'National Environmental Standards and Regulations Enforcement Agency Act 2007',
    shortTitle: 'NESREA Act 2007',
    citation: 'NESREA Act 2007',
    year: 2007,
    category: 'Energy, Environment & Transport',
    description:
      'Enforcement of environmental standards, regulations and guidelines, and offences relating to pollution, waste and the discharge of hazardous substances.',
  },
  {
    id: 'eia-act',
    title: 'Environmental Impact Assessment Act',
    shortTitle: 'EIA Act',
    citation: 'Cap E12 LFN 2004',
    year: 2004,
    category: 'Energy, Environment & Transport',
    description:
      'Mandatory environmental impact assessment before a project likely to affect the environment is undertaken, and the procedure for review and certification.',
  },
  {
    id: 'admiralty-jurisdiction-act',
    title: 'Admiralty Jurisdiction Act',
    shortTitle: 'Admiralty Jurisdiction Act',
    citation: 'Cap A5 LFN 2004',
    year: 2004,
    category: 'Energy, Environment & Transport',
    description:
      'The admiralty jurisdiction of the Federal High Court, maritime claims, proceedings in rem and in personam, and the arrest of ships.',
  },
  {
    id: 'merchant-shipping-2007',
    title: 'Merchant Shipping Act 2007',
    shortTitle: 'Merchant Shipping Act',
    citation: 'MSA 2007',
    year: 2007,
    category: 'Energy, Environment & Transport',
    description:
      'Registration of ships, the rights and duties of shipowners and seafarers, carriage of goods by sea, salvage, wreck and limitation of liability.',
  },
  {
    id: 'civil-aviation-2022',
    title: 'Civil Aviation Act 2022',
    shortTitle: 'Civil Aviation Act 2022',
    citation: 'CAA 2022',
    year: 2022,
    category: 'Energy, Environment & Transport',
    description:
      'Regulation of civil aviation by the NCAA, licensing of operators, the domestication of the Montreal Convention and the liability of carriers to passengers.',
  },
  {
    id: 'minerals-mining-2007',
    title: 'Nigerian Minerals and Mining Act 2007',
    shortTitle: 'Minerals and Mining Act',
    citation: 'NMMA 2007',
    year: 2007,
    category: 'Energy, Environment & Transport',
    description:
      'Ownership and control of minerals, mineral titles, community development agreements, and the surface rights of landholders.',
  },

  // Public Law & Administration
  {
    id: 'electoral-act-2022',
    title: 'Electoral Act 2022',
    shortTitle: 'Electoral Act 2022',
    citation: 'Electoral Act 2022',
    year: 2022,
    category: 'Public Law & Administration',
    description:
      'Conduct of elections by INEC, party primaries and nomination, electronic transmission of results, election petitions and the timelines that govern them.',
    fullTextId: 'electoral-act-2022',
  },
  {
    id: 'foi-act-2011',
    title: 'Freedom of Information Act 2011',
    shortTitle: 'FOI Act 2011',
    citation: 'FOIA 2011',
    year: 2011,
    category: 'Public Law & Administration',
    description:
      'The right of access to records held by public institutions, the exemptions, the seven-day response period and judicial review of a refusal.',
  },
  {
    id: 'fiscal-responsibility-2007',
    title: 'Fiscal Responsibility Act 2007',
    shortTitle: 'Fiscal Responsibility Act',
    citation: 'FRA 2007',
    year: 2007,
    category: 'Public Law & Administration',
    description:
      'Medium-term expenditure framework, limits on borrowing and deficits, the remittance of operating surpluses by government corporations, and fiscal transparency.',
  },
  {
    id: 'national-health-2014',
    title: 'National Health Act 2014',
    shortTitle: 'National Health Act',
    citation: 'NHA 2014',
    year: 2014,
    category: 'Public Law & Administration',
    description:
      'The national health system, the Basic Health Care Provision Fund, informed consent, confidentiality of health records and the control of human tissue.',
  },
  {
    id: 'immigration-2015',
    title: 'Immigration Act 2015',
    shortTitle: 'Immigration Act 2015',
    citation: 'Immigration Act 2015',
    year: 2015,
    category: 'Public Law & Administration',
    description:
      'Entry into and departure from Nigeria, residence and work permits, expatriate quota, deportation, and offences relating to immigration.',
  },
  {
    id: 'armed-forces-act',
    title: 'Armed Forces Act',
    shortTitle: 'Armed Forces Act',
    citation: 'Cap A20 LFN 2004',
    year: 2004,
    category: 'Public Law & Administration',
    description:
      'Constitution and discipline of the Armed Forces, service offences, courts-martial and the review of their findings and sentences.',
  },
];

/** Federal laws whose full sectioned text is loaded in the statute database. */
export const federalLawFullText = (entry: FederalLawEntry) =>
  entry.fullTextId ? NIGERIAN_LAWS_DATA.find((law) => law.id === entry.fullTextId) : undefined;

// ---------------------------------------------------------------------------
// Laws of the 36 states and the Federal Capital Territory
// ---------------------------------------------------------------------------

export interface StateLaw {
  id: string;
  title: string;
  subject: string;
  description: string;
  keyProvisions: { heading: string; content: string }[];
}

export interface StateLawBook {
  state: string;
  slug: string;
  /** How the state's body of laws is cited, e.g. "Laws of Lagos State of Nigeria". */
  citation: string;
  laws: StateLaw[];
}

/**
 * Every state has a comparable body of law: the courts, criminal justice, land,
 * tenancy, revenue, the child, the environment and local government. The titles and
 * years differ from state to state — confirm the current title and edition against
 * the state's own gazette before citing.
 */
const stateLawsFor = (state: string): StateLaw[] => {
  const isFct = state === 'Federal Capital Territory';
  const place = isFct ? 'the Federal Capital Territory' : `${state} State`;
  const legislature = isFct
    ? 'the National Assembly, which legislates for the Federal Capital Territory'
    : `the ${state} State House of Assembly`;
  const slug = stateSlug(state);

  return [
    {
      id: `${slug}-high-court-law`,
      title: `High Court Law of ${place}`,
      subject: 'Courts & judicial administration',
      description: `Constitution, jurisdiction and administration of the ${highCourtName(state)}, including its supervisory jurisdiction over the inferior courts and tribunals in ${place}.`,
      keyProvisions: [
        {
          heading: 'Jurisdiction of the Court',
          content: `The ${highCourtName(state)} has unlimited jurisdiction to hear and determine any civil proceedings in which the existence or extent of a legal right, power, duty, liability, privilege, interest, obligation or claim is in issue, subject to the exclusive jurisdiction conferred on the Federal High Court by Section 251 of the Constitution.`,
        },
        {
          heading: 'Supervisory jurisdiction',
          content: `The Court exercises supervisory jurisdiction over the Magistrate Courts, Customary Courts and tribunals in ${place}, and may issue the prerogative orders of mandamus, prohibition and certiorari.`,
        },
        {
          heading: 'Practice and procedure',
          content: `The Chief Judge of ${place} may make rules of court regulating the practice and procedure of the Court, and may issue practice directions for the speedy disposal of causes.`,
        },
      ],
    },
    {
      id: `${slug}-magistrates-courts-law`,
      title: `Magistrates’ Courts Law of ${place}`,
      subject: 'Courts & judicial administration',
      description: `Establishment, grades and jurisdiction of the Magistrate Courts of ${place}, their monetary limits in civil causes and their criminal jurisdiction.`,
      keyProvisions: [
        {
          heading: 'Grades and monetary jurisdiction',
          content:
            'The Court is constituted in grades, and the civil jurisdiction of each grade is limited to the monetary ceiling prescribed for it. A claim exceeding the ceiling may proceed where the claimant abandons the excess.',
        },
        {
          heading: 'Matters outside jurisdiction',
          content:
            'A Magistrate Court has no jurisdiction in any cause relating to title to land, the validity of a will or marriage, the administration of an estate, the winding up of a company, or the guardianship of an infant.',
        },
        {
          heading: 'Appeals',
          content: `An appeal from a decision of a Magistrate Court lies to the ${highCourtName(state)}, and shall be brought within the time prescribed by the rules of that Court.`,
        },
      ],
    },
    {
      id: `${slug}-acj-law`,
      title: `Administration of Criminal Justice Law of ${place}`,
      subject: 'Criminal justice',
      description: `Criminal procedure in the courts of ${place} — arrest, remand, bail, day-to-day trial, plea bargaining, sentencing and non-custodial measures, on the model of the Administration of Criminal Justice Act 2015.`,
      keyProvisions: [
        {
          heading: 'Purpose of the Law',
          content:
            'The purpose is to ensure that the system of administration of criminal justice promotes efficient management of criminal justice institutions, speedy dispensation of justice, protection of the society from crime, and protection of the rights and interests of the suspect, the defendant and the victim.',
        },
        {
          heading: 'Day-to-day trial and stay of proceedings',
          content:
            'A criminal trial shall proceed from day to day until conclusion; where that is impracticable, no party is entitled to more than five adjournments and the interval shall not exceed fourteen working days. An application for stay of proceedings in a criminal trial shall not be entertained.',
        },
        {
          heading: 'Bail and the rights of a suspect',
          content:
            'A suspect shall be brought before a court within twenty-four or forty-eight hours as the case requires, shall be informed of the reason for the arrest, and is entitled to legal representation. Bail in a non-capital offence shall not be denied as a punishment, and no money shall be demanded for police bail.',
        },
      ],
    },
    {
      id: `${slug}-land-registration-law`,
      title: `Land Instruments Registration Law of ${place}`,
      subject: 'Land & property',
      description: `Registration of instruments affecting land in ${place}, the effect of non-registration, and the priority of registered instruments.`,
      keyProvisions: [
        {
          heading: 'Registrable instruments',
          content:
            'Every instrument affecting land — a deed of assignment, mortgage, lease exceeding three years, power of attorney or vesting order — shall be registered in the Lands Registry within the time prescribed after its execution.',
        },
        {
          heading: 'Effect of non-registration',
          content:
            'An unregistered registrable instrument is inadmissible in evidence to prove title to land, though it may be admitted as evidence of an equitable interest or of payment of purchase money and receipt of possession.',
        },
        {
          heading: 'Priority',
          content:
            'Registered instruments take priority according to the order of their registration, and not according to the order of their execution.',
        },
      ],
    },
    {
      id: `${slug}-land-use-administration`,
      title: `Land Use Act (State Administration) — ${place}`,
      subject: 'Land & property',
      description: `Administration of the Land Use Act 1978 in ${place}: the grant of statutory rights of occupancy, the Governor’s consent to alienation, ground rent, and revocation for overriding public interest.`,
      keyProvisions: [
        {
          heading: 'Grant of a statutory right of occupancy',
          content: `All land in ${place} is vested in the Governor in trust for the people. The Governor grants statutory rights of occupancy evidenced by a Certificate of Occupancy, subject to the terms and conditions endorsed on it.`,
        },
        {
          heading: 'Governor’s consent',
          content:
            'It is unlawful to alienate a statutory right of occupancy by assignment, mortgage, transfer of possession, sublease or otherwise without the prior consent of the Governor. A transaction entered into without consent is inchoate and unenforceable as a legal interest.',
        },
        {
          heading: 'Revocation and compensation',
          content:
            'A right of occupancy may be revoked for overriding public interest on notice, and the holder is entitled to compensation for unexhausted improvements, crops and installations, assessed as provided by the Act.',
        },
      ],
    },
    {
      id: `${slug}-tenancy-law`,
      title: `Tenancy and Recovery of Premises Law of ${place}`,
      subject: 'Land & property',
      description: `The relationship of landlord and tenant in ${place} — the forms and periods of notice, the procedure for recovery of premises, and the reliefs available to each party.`,
      keyProvisions: [
        {
          heading: 'Notice to quit',
          content:
            'The length of notice to quit depends on the tenancy: one week for a weekly tenant, one month for a monthly tenant, three months for a quarterly or half-yearly tenant, and six months for a yearly tenant, unless the tenancy agreement provides otherwise.',
        },
        {
          heading: 'Seven days’ notice of owner’s intention',
          content:
            'After the notice to quit has expired, the landlord shall serve a seven-day notice of his intention to apply to recover possession before commencing proceedings. Failure to serve either notice is fatal to the action.',
        },
        {
          heading: 'Self-help prohibited',
          content:
            'A landlord shall not use force, change the locks, remove the roof, cut off electricity or water, or otherwise eject a tenant except under an order of court. A landlord who does so is liable in damages.',
        },
      ],
    },
    {
      id: `${slug}-child-rights-law`,
      title: `Child’s Rights Law of ${place}`,
      subject: 'Family & persons',
      description: `Domestication of the Child’s Rights Act in ${place} — the best interests of the child, the Family Court, and the prohibition of child marriage, child labour and other harmful practices.`,
      keyProvisions: [
        {
          heading: 'Best interests of the child',
          content:
            'In every action concerning a child, whether by an individual, public or private body, institution, service, court of law or administrative authority, the best interest of the child shall be the paramount consideration.',
        },
        {
          heading: 'Family Court',
          content: `A Family Court is established at the ${highCourtName(state)} and at the Magistrate Court level, with jurisdiction over all matters relating to children, sitting in camera and constituted with assessors.`,
        },
        {
          heading: 'Prohibited practices',
          content:
            'Child marriage and betrothal, tattooing and skin marks, exploitative labour, use of a child in criminal activity, and the buying or selling of a child are prohibited and punishable.',
        },
      ],
    },
    {
      id: `${slug}-revenue-law`,
      title: `Revenue Administration Law of ${place}`,
      subject: 'Tax & revenue',
      description: `Assessment, collection and enforcement of taxes and levies due to ${place}, and the establishment of the State Internal Revenue Service and its board.`,
      keyProvisions: [
        {
          heading: 'Taxes within state competence',
          content:
            'The State collects personal income tax from residents under the Personal Income Tax Act, together with capital gains tax on individuals, stamp duties on instruments between individuals, road taxes, business premises levies and such other levies as the Taxes and Levies (Approved List) Act permits.',
        },
        {
          heading: 'Assessment and objection',
          content:
            'A taxpayer dissatisfied with an assessment may object in writing within thirty days, stating the grounds. Where the objection is refused, an appeal lies to the Tax Appeal Tribunal and thereafter to the Federal High Court.',
        },
        {
          heading: 'Enforcement',
          content:
            'The Service may distrain for unpaid tax, apply for a warrant to enter and search, and recover tax as a civil debt due to the State.',
        },
      ],
    },
    {
      id: `${slug}-environmental-law`,
      title: `Environmental Protection and Sanitation Law of ${place}`,
      subject: 'Environment & public health',
      description: `Control of pollution, waste management, sanitation and environmental nuisance in ${place}, and the powers of the state environmental protection agency.`,
      keyProvisions: [
        {
          heading: 'Prohibition of pollution and dumping',
          content:
            'No person shall discharge effluent, hazardous substances or refuse into any drain, watercourse, land or air in a manner contrary to the standards prescribed. Contravention is an offence attracting a fine, sealing of the premises, or both.',
        },
        {
          heading: 'Environmental nuisance and abatement',
          content:
            'The Agency may serve an abatement notice requiring the occupier of any premises to remove a nuisance within a stated time, and may on default enter and abate it and recover the cost.',
        },
      ],
    },
    {
      id: `${slug}-local-government-law`,
      title: `Local Government Law of ${place}`,
      subject: 'Public administration',
      description: `Constitution, functions and finances of the local government councils in ${place}, and the exercise of their by-law-making powers.`,
      keyProvisions: [
        {
          heading: 'Functions of a council',
          content:
            'A local government council exercises the functions in the Fourth Schedule to the Constitution — markets, motor parks, refuse disposal, registration of births and deaths, licensing of bicycles and trucks, and the naming of roads.',
        },
        {
          heading: 'By-laws',
          content:
            'A council may make by-laws for the good governance of its area, which take effect on publication and are enforceable in the Magistrate Court within the area.',
        },
      ],
    },
    {
      id: `${slug}-public-procurement-law`,
      title: `Public Procurement Law of ${place}`,
      subject: 'Public administration',
      description: `Competitive procurement of goods, works and services by the government of ${place}, its ministries, departments and agencies.`,
      keyProvisions: [
        {
          heading: 'Open competitive bidding',
          content:
            'All procurement shall be by open competitive bidding save where the Law permits restricted tendering, request for quotations, direct procurement or emergency procurement, and every such departure shall be justified in writing.',
        },
        {
          heading: 'Review of procurement decisions',
          content:
            'A bidder who claims to have suffered loss by a breach of the Law may seek administrative review by the procuring entity and thereafter by the Bureau, before commencing proceedings in court.',
        },
      ],
    },
    {
      id: `${slug}-adr-law`,
      title: `Multi-Door Courthouse / Alternative Dispute Resolution Law of ${place}`,
      subject: 'Dispute resolution',
      description: `Court-connected mediation, conciliation and arbitration in ${place}, and the enforcement of settlements reached at the multi-door courthouse.`,
      keyProvisions: [
        {
          heading: 'Referral to the multi-door courthouse',
          content: `A Judge of the ${highCourtName(state)} may at any stage refer a matter to the multi-door courthouse for mediation or conciliation, and shall adjourn the proceedings for that purpose.`,
        },
        {
          heading: 'Enforcement of terms of settlement',
          content:
            'Terms of settlement reached and signed by the parties and the neutral shall, on the endorsement of a Judge, be enforceable as the consent judgment of the Court.',
        },
      ],
    },
    {
      id: `${slug}-legislature`,
      title: `Laws made by ${legislature}`,
      subject: 'Legislative index',
      description: `The full body of enactments in force in ${place}, as consolidated in the Laws of ${place} and amended by subsequent Laws of ${legislature}.`,
      keyProvisions: [
        {
          heading: 'Legislative competence',
          content: isFct
            ? 'The National Assembly legislates for the Federal Capital Territory on all matters, exercising in respect of the Territory the powers a State House of Assembly exercises in a State.'
            : `The House of Assembly of ${state} State may make laws for the peace, order and good government of the State on matters in the Concurrent Legislative List and on any matter not in either List, subject to the supremacy of an Act of the National Assembly on a concurrent matter.`,
        },
        {
          heading: 'Consolidation and citation',
          content: `Enactments are cited by their short title and the year, and are consolidated periodically as the Laws of ${place}. Always confirm the current edition and any amending Law against the State gazette before citing a section.`,
        },
      ],
    },
  ];
};

export const STATE_LAW_BOOKS: StateLawBook[] = NIGERIAN_STATES.map((state) => ({
  state,
  slug: stateSlug(state),
  citation:
    state === 'Federal Capital Territory'
      ? 'Laws applicable in the Federal Capital Territory, Abuja'
      : `Laws of ${state} State of Nigeria`,
  laws: stateLawsFor(state),
}));

export const stateLawBookBySlug = (slug: string): StateLawBook | undefined =>
  STATE_LAW_BOOKS.find((book) => book.slug === slug.toLowerCase());
