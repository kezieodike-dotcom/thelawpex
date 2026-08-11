import { AffidavitCategoryId, AffidavitTemplate } from '../types';

/**
 * The affidavit library — all manner of affidavits, organised by the proceeding
 * they belong to. Every entry carries the full sworn text, the law it is sworn
 * under, and the defects that most often get a deposition struck out.
 */

export interface AffidavitCategory {
  id: AffidavitCategoryId;
  label: string;
  description: string;
}

export const AFFIDAVIT_CATEGORIES: AffidavitCategory[] = [
  {
    id: 'general',
    label: 'General & standalone affidavits',
    description:
      'Sworn declarations that stand on their own — change of name, loss of documents, age and identity — deposed at the registry and not tied to any suit.',
  },
  {
    id: 'civil',
    label: 'Civil proceedings',
    description:
      'The depositions that carry a civil suit: verifying affidavits, affidavits of service, non-multiplicity and facts in support of originating applications.',
  },
  {
    id: 'interlocutory',
    label: 'Interlocutory applications',
    description:
      'Affidavits in support of and against motions — injunctions, urgency, extension of time, joinder — and the counter affidavit that answers them.',
  },
  {
    id: 'criminal',
    label: 'Criminal proceedings',
    description:
      'Bail affidavits, surety verification, affidavits in support of applications to quash and depositions in aid of criminal applications.',
  },
  {
    id: 'land',
    label: 'Land & property',
    description:
      'Depositions on title, possession, loss of a Certificate of Occupancy, consent to assign and rectification of land instruments.',
  },
  {
    id: 'matrimonial',
    label: 'Matrimonial causes & family',
    description:
      'Affidavits verifying a petition, custody and maintenance depositions, and the affidavit of means that supports ancillary relief.',
  },
  {
    id: 'probate',
    label: 'Probate & estates',
    description:
      'Depositions for letters of administration, next-of-kin and beneficiary declarations and affidavits attesting to a will.',
  },
  {
    id: 'corporate',
    label: 'Corporate & commercial',
    description:
      'CAC-facing and commercial depositions: verifying corporate facts, loss of share certificates and compliance declarations.',
  },
  {
    id: 'election',
    label: 'Election petitions',
    description:
      'Affidavits in support of pre-election and petition applications, and the depositions accompanying tribunal motions.',
  },
  {
    id: 'enforcement',
    label: 'Enforcement & garnishee',
    description:
      'Depositions in aid of execution — garnishee proceedings, judgment debtor examination and applications for stay of execution.',
  },
  {
    id: 'appellate',
    label: 'Appellate practice',
    description:
      'Affidavits supporting leave, extension of time, departure from the rules, stay pending appeal and applications to regularise.',
  },
  {
    id: 'administrative',
    label: 'Administrative & regulatory',
    description:
      'Depositions for fundamental rights enforcement, immigration, tax appeals and applications to regulatory bodies.',
  },
];

/** Standard court heading used by the depositions filed in a suit. */
const HEADING = (court: string, division: string, suitPrefix: string) =>
  `IN THE ${court.toUpperCase()}
IN THE ${division.toUpperCase()} JUDICIAL DIVISION
HOLDEN AT ${division.toUpperCase()}

                                                            SUIT NO: ${suitPrefix}/____/20__`;

/** The jurat every affidavit ends with, in the form the registry requires. */
const JURAT = `SWORN TO at the Registry of the Court this ____ day of ______________, 20__.

                                                            ______________________________
                                                                        DEPONENT

BEFORE ME

______________________________
COMMISSIONER FOR OATHS`;

/** The concluding paragraph required by section 13 of the Oaths Act. */
const OATHS_ACT_CLOSE = (paragraph: number) =>
  `${paragraph}. That I make this solemn declaration conscientiously believing the contents to be true and correct and in accordance with the Oaths Act, LFN 2004.`;

export const AFFIDAVITS: AffidavitTemplate[] = [
  // -------------------------------------------------------------------------
  // General & standalone
  // -------------------------------------------------------------------------
  {
    id: 'aff-change-of-name',
    title: 'Affidavit for Change of Name',
    category: 'general',
    description:
      'Standalone declaration deposing that two names refer to one and the same person, for gazette publication and record correction.',
    whenToUse:
      'Where a deponent has changed a name on marriage, on conversion, by deed poll or to correct a spelling, and needs banks, schools, the Corporate Affairs Commission or the Immigration Service to treat both names as one person.',
    deponent: 'The person whose name has changed',
    statutoryBasis: [
      'Oaths Act, LFN 2004, sections 10 and 13',
      'Evidence Act 2011, sections 107–120 (affidavit evidence)',
    ],
    courtHeadingRequired: false,
    practiceNotes: [
      'A standalone affidavit carries no suit number and no court heading — the registry number on the jurat is the only reference.',
      'Publication in a national newspaper and in the Federal Gazette is what gives the change public effect; the affidavit alone does not bind third parties.',
      'Exhibit the birth certificate or declaration of age, and where the change follows marriage, the marriage certificate.',
    ],
    keywords: ['change of name', 'deed poll', 'gazette', 'marriage name', 'correction of name'],
    sampleText: `AFFIDAVIT FOR CHANGE OF NAME

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen of [RESIDENTIAL ADDRESS], do hereby make oath and state as follows:

1. That I am the Deponent herein and by virtue of that position I am conversant with the facts herein deposed to.

2. That I was born on the [DAY] day of [MONTH], [YEAR] at [PLACE OF BIRTH] and was christened and known as [FORMER FULL NAME].

3. That I have this day and henceforth renounced, relinquished and abandoned the use of my former name, [FORMER FULL NAME], and in its place assumed and adopted the name [NEW FULL NAME].

4. That the change of name became necessary by reason of [state the reason — marriage solemnised on the ___ day of ______, 20__ / conversion / correction of a clerical error in my records].

5. That [FORMER FULL NAME] and [NEW FULL NAME] refer to one and the same person, namely, myself.

6. That all documents, records, certificates and instruments bearing my former name remain valid and enure to my benefit under my new name.

7. That I hereby authorise and request all authorities, institutions, banks and persons concerned to record and address me by my new name, [NEW FULL NAME].

8. That the following documents are attached and marked as exhibits:
   (a) Birth Certificate / Declaration of Age  —  Exhibit A
   (b) [Marriage Certificate / Deed Poll / other supporting document]  —  Exhibit B

9. That I depose to this affidavit in good faith and not to defeat, delay or defraud any person, creditor or authority.

${OATHS_ACT_CLOSE(10)}

${JURAT}`,
  },
  {
    id: 'aff-loss-of-document',
    title: 'Affidavit of Loss of Document',
    category: 'general',
    description:
      'Sworn account of how a document was lost, the search made for it, and a request that a replacement or certified copy be issued.',
    whenToUse:
      'To support an application for a duplicate certificate, licence, receipt, share certificate or academic record after a police extract has been obtained.',
    deponent: 'The owner of the lost document',
    statutoryBasis: ['Oaths Act, LFN 2004, sections 10 and 13'],
    courtHeadingRequired: false,
    practiceNotes: [
      'Depose to the search actually made — a deposition that merely says "the document is lost" is worthless to the issuing authority.',
      'Where the document has value in the hands of a third party (a title deed, a share certificate), add the undertaking to return the original if found.',
      'Attach the police extract where the loss was by theft; most issuing authorities will not act without it.',
    ],
    keywords: ['loss', 'lost document', 'duplicate', 'police extract', 'replacement'],
    sampleText: `AFFIDAVIT OF LOSS OF DOCUMENT

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen of [RESIDENTIAL ADDRESS], do hereby make oath and state as follows:

1. That I am the Deponent herein and the lawful owner of the document hereinafter described.

2. That on or about the [DAY] day of [MONTH], [YEAR], the [DESCRIBE THE DOCUMENT — e.g. Certificate of Occupancy No. ______ / Share Certificate No. ______ / Driver's Licence No. ______] was issued to me by [ISSUING AUTHORITY].

3. That on or about the [DAY] day of [MONTH], 20__, the said document was lost in the following circumstances: [state precisely how the loss occurred].

4. That upon discovering the loss I conducted a diligent search at [places searched] and made enquiries of [persons and institutions asked], all of which proved abortive.

5. That I reported the loss at [POLICE STATION] on the [DAY] day of [MONTH], 20__ and obtained a Police Extract, which is attached and marked Exhibit A.

6. That the said document has neither been sold, pledged, deposited, charged nor in any manner encumbered or transferred by me to any person whatsoever.

7. That I undertake to return the original document to [ISSUING AUTHORITY] should the same be found or recovered at any time hereafter.

8. That I depose to this affidavit for the purpose of obtaining a duplicate/certified true copy of the said document and for no other purpose.

${OATHS_ACT_CLOSE(9)}

${JURAT}`,
  },
  {
    id: 'aff-declaration-of-age',
    title: 'Declaration of Age',
    category: 'general',
    description:
      'Sworn declaration of a date of birth where no birth certificate was issued, for use in school, employment and travel records.',
    whenToUse:
      'Where the deponent was born before registration of births was regularly kept, or the original registration cannot be traced, and an official record of age is required.',
    deponent: 'The person concerned, or a parent or elder relative with direct knowledge',
    statutoryBasis: [
      'Oaths Act, LFN 2004, sections 10 and 13',
      'Births, Deaths etc. (Compulsory Registration) Act, LFN 2004',
    ],
    courtHeadingRequired: false,
    practiceNotes: [
      'Where the deponent is not the person whose age is declared, paragraph 1 must state the source of knowledge — a declaration of age by a stranger to the facts is inadmissible.',
      'A declaration of age does not displace a birth certificate; where one exists, it prevails.',
    ],
    keywords: ['age', 'date of birth', 'declaration of age', 'birth certificate'],
    sampleText: `DECLARATION OF AGE

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen of [RESIDENTIAL ADDRESS], do hereby make oath and state as follows:

1. That I am the Deponent herein and [the person whose age is hereby declared / the [father/mother/elder sibling] of [NAME], by reason of which I am conversant with the facts herein deposed to].

2. That [I was / [NAME] was] born on the [DAY] day of [MONTH], [YEAR] at [PLACE OF BIRTH] in [LOCAL GOVERNMENT AREA], [STATE] of Nigeria.

3. That no Birth Certificate was issued in respect of the said birth, the birth having occurred at [home / a facility that kept no register].

4. That the said date of birth is the date consistently entered in [school records / baptismal record / family record], a copy of which is attached and marked Exhibit A.

5. That I am [___] years of age as at the date of this declaration.

6. That I make this declaration for the purpose of [employment / admission / passport application / pension] and for no other purpose.

${OATHS_ACT_CLOSE(7)}

${JURAT}`,
  },

  // -------------------------------------------------------------------------
  // Civil proceedings
  // -------------------------------------------------------------------------
  {
    id: 'aff-verifying-affidavit',
    title: 'Verifying Affidavit (Originating Summons / Petition)',
    category: 'civil',
    description:
      'The deposition that verifies the facts on which an originating process is founded and puts the documentary evidence before the court.',
    whenToUse:
      'Filed with an originating summons, a petition or any originating process the rules require to be verified — without it the process is incompetent under most State High Court Rules.',
    deponent: 'The claimant/applicant, or an officer of a corporate claimant with authority',
    statutoryBasis: [
      'Evidence Act 2011, sections 107–120',
      'Order 3, High Court of Lagos State (Civil Procedure) Rules 2019 (originating summons)',
      'Oaths Act, LFN 2004, section 13',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'Depose to facts, never to law or argument — a paragraph containing legal conclusions offends section 115(2) of the Evidence Act and will be struck out.',
      'Where the deponent is not a party, paragraph 1 must state the authority to depose and the source of the information, with the consent of the informant.',
      'Every exhibit must be identified in the body of the affidavit and marked; an unexhibited document referred to in the affidavit proves nothing.',
    ],
    keywords: ['verifying', 'originating summons', 'petition', 'facts in support', 'section 115'],
    sampleText: `${HEADING('High Court of [STATE] State', '[Judicial Division]', '[HC]')}

BETWEEN:

[CLAIMANT'S FULL NAME] .......................................................... CLAIMANT/APPLICANT

AND

[DEFENDANT'S FULL NAME] .................................................. DEFENDANT/RESPONDENT

                          VERIFYING AFFIDAVIT

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the Claimant/Applicant in this suit [or: the [POSITION] of the Claimant company and by virtue of my position I am conversant with the facts of this case and have the authority of the Claimant to depose to this affidavit].

2. That the facts deposed to herein are within my personal knowledge save where otherwise stated.

3. That on or about the [DAY] day of [MONTH], 20__, [set out the transaction or event giving rise to the claim].

4. That [continue the narrative chronologically, one fact to a paragraph].

5. That the [agreement / letter / receipt] evidencing the said transaction is attached hereto and marked Exhibit A.

6. That on the [DAY] day of [MONTH], 20__ the Defendant [set out the breach or default complained of].

7. That by a letter dated the [DAY] day of [MONTH], 20__, my Solicitors demanded [state the demand]; the said letter is attached and marked Exhibit B.

8. That notwithstanding the said demand the Defendant has failed, refused and/or neglected to [state what remains undone].

9. That the questions submitted for determination and the reliefs sought in the Originating Summons are founded on the facts deposed to above.

10. That I depose to this affidavit in verification of the facts contained in the Originating Summons filed herein.

${OATHS_ACT_CLOSE(11)}

${JURAT}`,
  },
  {
    id: 'aff-of-service',
    title: 'Affidavit of Service',
    category: 'civil',
    description:
      'The bailiff or process server’s sworn proof that a court process was served, on whom, when and how.',
    whenToUse:
      'Filed after service of any originating process, motion or hearing notice. Without proof of service the court will not proceed to hear the matter in the absence of the party served.',
    deponent: 'The bailiff of the court or the person who effected service',
    statutoryBasis: [
      'Sheriffs and Civil Process Act, LFN 2004',
      'Evidence Act 2011, section 115',
      'Order 7, Federal High Court (Civil Procedure) Rules 2019 (service)',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'Depose to the exact time and place of service and to how the person served was identified — service is a jurisdictional matter and the court will scrutinise it.',
      'Where service was substituted, exhibit the order permitting it and depose to compliance with its exact terms.',
      'Where the person served refused to sign, say so and depose that the process was left with them.',
    ],
    keywords: ['service', 'bailiff', 'proof of service', 'substituted service', 'hearing notice'],
    sampleText: `${HEADING('High Court of [STATE] State', '[Judicial Division]', '[HC]')}

BETWEEN:

[CLAIMANT'S FULL NAME] .......................................................................... CLAIMANT

AND

[DEFENDANT'S FULL NAME] .................................................................... DEFENDANT

                          AFFIDAVIT OF SERVICE

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, Bailiff of the High Court of [STATE] State, of [COURT ADDRESS], do hereby make oath and state as follows:

1. That I am the Bailiff of this Honourable Court charged with the service of the processes hereinafter mentioned.

2. That on the [DAY] day of [MONTH], 20__ at about [TIME] hours, I served the [describe the process — Writ of Summons, Statement of Claim, Motion on Notice dated ______] in this suit on the Defendant.

3. That service was effected at [ADDRESS OF SERVICE] by delivering the said process to [NAME OF PERSON SERVED], who identified himself/herself to me as the [Defendant / [POSITION] of the Defendant company / an adult inmate of the Defendant's residence].

4. That the said [NAME OF PERSON SERVED] [acknowledged service by endorsing the duplicate copy, which is attached and marked Exhibit A / declined to endorse the duplicate copy, whereupon I left the process with him/her].

5. That I identified the person served by [state how — introduction by a named person, production of identification, prior acquaintance].

6. That the service was effected between the hours of 6.00 a.m. and 6.00 p.m. and not on a Sunday or a public holiday.

7. That I make this affidavit as proof of service of the said process on the Defendant.

${OATHS_ACT_CLOSE(8)}

${JURAT}`,
  },
  {
    id: 'aff-non-multiplicity',
    title: 'Affidavit of Non-Multiplicity of Actions',
    category: 'civil',
    description:
      'Sworn confirmation that no other suit on the same subject matter is pending between the same parties.',
    whenToUse:
      'Required on filing in the Federal High Court and several State High Courts. Its absence is a ground for striking out; a false deposition is a contempt.',
    deponent: 'The claimant or the legal practitioner filing the process',
    statutoryBasis: [
      'Order 3 Rule 3, Federal High Court (Civil Procedure) Rules 2019',
      'Evidence Act 2011, sections 107–120',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'Search the registry before deposing — the deposition is on oath and the court treats a false one severely.',
      'Where a related action does exist, disclose it and explain why the present suit is not a multiplicity; concealment is worse than disclosure.',
    ],
    keywords: ['non-multiplicity', 'no other action', 'abuse of process', 'federal high court'],
    sampleText: `${HEADING('Federal High Court of Nigeria', '[Judicial Division]', 'FHC/[__]/CS')}

BETWEEN:

[PLAINTIFF'S FULL NAME] .......................................................................... PLAINTIFF

AND

[DEFENDANT'S FULL NAME] .................................................................... DEFENDANT

                AFFIDAVIT OF NON-MULTIPLICITY OF ACTIONS

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the Plaintiff in this suit [or: a Legal Practitioner in the Law Firm of [FIRM], Solicitors to the Plaintiff, and by virtue of my position I am conversant with the facts of this case].

2. That I have caused a search to be conducted at the Registry of this Honourable Court and at the Registry of the High Court of [STATE] State on the [DAY] day of [MONTH], 20__.

3. That the said search revealed that there is no other action pending between the parties herein in respect of the same subject matter.

4. That I have not instituted, and I am not aware of, any other suit in any other court in respect of the subject matter of this action.

5. That this suit does not constitute an abuse of the process of this Honourable Court.

6. That I depose to this affidavit in compliance with Order 3 Rule 3 of the Federal High Court (Civil Procedure) Rules 2019.

${OATHS_ACT_CLOSE(7)}

${JURAT}`,
  },

  // -------------------------------------------------------------------------
  // Interlocutory applications
  // -------------------------------------------------------------------------
  {
    id: 'aff-urgency',
    title: 'Affidavit of Urgency (Ex Parte Applications)',
    category: 'interlocutory',
    description:
      'Sworn grounds of extreme urgency showing why the court should act before the other side is heard.',
    whenToUse:
      'Filed with a motion ex parte where the res would be destroyed, dissipated or rendered nugatory in the time it would take to put the respondent on notice.',
    deponent: 'The applicant or counsel with personal knowledge of the urgency',
    statutoryBasis: [
      'Order 39, High Court of Lagos State (Civil Procedure) Rules 2019',
      'Constitution of the Federal Republic of Nigeria 1999 (as amended), section 36(1)',
      'Evidence Act 2011, section 115',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'The urgency must be shown, not asserted: depose to the facts and dates that make waiting fatal.',
      'Full and frank disclosure is a duty on an ex parte application — suppressing a material fact is a ground to discharge the order however strong the merits.',
      'An ex parte order of injunction lasts no more than 14 days and is not renewable; say when the motion on notice will be moved.',
    ],
    keywords: ['urgency', 'ex parte', 'interim order', 'res', 'nugatory'],
    sampleText: `${HEADING('High Court of [STATE] State', '[Judicial Division]', '[HC]')}

BETWEEN:

[APPLICANT'S FULL NAME] ................................................ CLAIMANT/APPLICANT

AND

[RESPONDENT'S FULL NAME] ......................................... DEFENDANT/RESPONDENT

                          AFFIDAVIT OF URGENCY

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the Claimant/Applicant in this suit and by virtue of that position I am conversant with the facts herein deposed to.

2. That the subject matter of this suit is [describe the res — the property, the account, the goods, the office].

3. That on the [DAY] day of [MONTH], 20__ I became aware that the Respondent [set out precisely what the Respondent is doing or is about to do].

4. That the said act is scheduled to take place on the [DAY] day of [MONTH], 20__, that is, in [___] days from the date of this affidavit.

5. That unless this Honourable Court intervenes immediately the res will be [destroyed / dissipated / sold to a third party / demolished] and the outcome of this suit will be rendered nugatory.

6. That the ordinary time required to put the Respondent on notice would defeat the very purpose of this application.

7. That I undertake to abide by any order this Honourable Court may make as to damages should it turn out that this order ought not to have been granted.

8. That I have made full and frank disclosure of every material fact known to me, including [disclose any fact adverse to the application].

9. That the motion on notice filed simultaneously herewith is ready to be moved on the [DAY] day of [MONTH], 20__.

10. That it is in the interest of justice to grant this application.

${OATHS_ACT_CLOSE(11)}

${JURAT}`,
  },
  {
    id: 'aff-support-injunction',
    title: 'Affidavit in Support of Motion for Interlocutory Injunction',
    category: 'interlocutory',
    description:
      'The facts establishing a legal right, a substantial issue to be tried, balance of convenience and an undertaking as to damages.',
    whenToUse:
      'Filed with a motion on notice seeking to preserve the res until judgment, and settled against the Kotoye v. CBN conditions.',
    deponent: 'The applicant or an officer with knowledge of the facts',
    statutoryBasis: [
      'Order 39, High Court of Lagos State (Civil Procedure) Rules 2019',
      'Kotoye v. CBN (1989) LDLR (SC) pt 1021',
      'Evidence Act 2011, sections 107–120',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'Depose to each condition separately — legal right, substantial issue, irreparable damage, balance of convenience, undertaking, no delay. A paragraph missing means a condition unproved.',
      'The undertaking as to damages must appear in the affidavit itself; an undertaking offered only from the bar is worth little.',
      'Do not argue the case — the argument belongs in the written address.',
    ],
    keywords: ['injunction', 'interlocutory', 'balance of convenience', 'undertaking as to damages', 'Kotoye'],
    sampleText: `${HEADING('High Court of [STATE] State', '[Judicial Division]', '[HC]')}

BETWEEN:

[APPLICANT'S FULL NAME] ................................................ CLAIMANT/APPLICANT

AND

[RESPONDENT'S FULL NAME] ......................................... DEFENDANT/RESPONDENT

        AFFIDAVIT IN SUPPORT OF MOTION ON NOTICE FOR INTERLOCUTORY INJUNCTION

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the Claimant/Applicant in this suit and conversant with the facts herein deposed to.

2. That I am the [owner / lessee / holder of the statutory right of occupancy] in respect of [DESCRIBE THE PROPERTY OR RIGHT], by virtue of [the instrument relied on], attached and marked Exhibit A.

3. That my Writ of Summons and Statement of Claim filed herein raise a substantial issue to be tried, namely [state the issue shortly].

4. That on the [DAY] day of [MONTH], 20__ the Respondent [set out the threatened or continuing act complained of].

5. That the Respondent has continued the said act notwithstanding my Solicitors' letter dated the [DAY] day of [MONTH], 20__, attached and marked Exhibit B.

6. That if the Respondent is not restrained, [state the specific irreparable consequence — the building will be demolished, the land will pass to a purchaser for value without notice, the shares will be transferred] and damages will not be an adequate remedy.

7. That the inconvenience I will suffer if this application is refused far outweighs any inconvenience the Respondent will suffer if it is granted, the Respondent being [state the comparative position].

8. That I came to this Honourable Court promptly upon becoming aware of the Respondent's act and there has been no delay on my part.

9. That I undertake to pay damages to the Respondent should it turn out that this order ought not to have been made.

10. That the grant of this application will preserve the res and keep the parties in status quo pending the determination of this suit.

${OATHS_ACT_CLOSE(11)}

${JURAT}`,
  },
  {
    id: 'aff-counter-affidavit',
    title: 'Counter Affidavit (Opposing a Motion)',
    category: 'interlocutory',
    description:
      'The respondent’s answer on the facts — admitting, denying and controverting the applicant’s affidavit paragraph by paragraph.',
    whenToUse:
      'Filed in opposition to any motion. Facts in an affidavit that are not controverted are deemed admitted, so the counter affidavit is not optional.',
    deponent: 'The respondent or an officer with knowledge of the facts',
    statutoryBasis: [
      'Evidence Act 2011, sections 115 and 116',
      'Order 43, High Court of Lagos State (Civil Procedure) Rules 2019',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'Answer paragraph by paragraph and by number. A general denial leaves the applicant’s facts standing.',
      'Denial is not enough where a positive case is available — depose to the facts that displace the application.',
      'Keep to facts. Legal argument in a counter affidavit is liable to be struck out under section 115(2) of the Evidence Act.',
    ],
    keywords: ['counter affidavit', 'opposition', 'controvert', 'deemed admitted', 'reply on points'],
    sampleText: `${HEADING('High Court of [STATE] State', '[Judicial Division]', '[HC]')}

BETWEEN:

[APPLICANT'S FULL NAME] ................................................ CLAIMANT/APPLICANT

AND

[RESPONDENT'S FULL NAME] ......................................... DEFENDANT/RESPONDENT

    COUNTER AFFIDAVIT IN OPPOSITION TO THE MOTION ON NOTICE DATED [DATE]

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the Defendant/Respondent in this suit and by virtue of that position I am conversant with the facts herein deposed to.

2. That I have read the Affidavit in Support of the Motion on Notice dated the [DAY] day of [MONTH], 20__ and deposed to by [NAME OF APPLICANT'S DEPONENT], and I respond as follows.

3. That paragraphs [___], [___] and [___] of the said affidavit are admitted.

4. That paragraphs [___], [___] and [___] of the said affidavit are denied and the Applicant is put to the strictest proof thereof.

5. That contrary to paragraph [___] of the said affidavit, [state the true position, with dates].

6. That further to paragraph 5 above, the [document / receipt / correspondence] establishing the true position is attached and marked Exhibit R1.

7. That contrary to paragraph [___], the Applicant is not the [owner / holder of the right claimed], the said [property/right] having been [state the competing basis], as shown in Exhibit R2 attached.

8. That the Applicant delayed for [___] months after becoming aware of the facts before coming to this Honourable Court.

9. That the Applicant will suffer no irreparable damage if this application is refused, damages being an adequate remedy in the circumstances deposed to above.

10. That the balance of convenience is on my side in that [state the facts].

11. That it is in the interest of justice to refuse this application.

${OATHS_ACT_CLOSE(12)}

${JURAT}`,
  },
  {
    id: 'aff-extension-of-time',
    title: 'Affidavit in Support of Extension of Time',
    category: 'interlocutory',
    description:
      'Sworn explanation of the delay and the good cause on which the court is asked to enlarge time.',
    whenToUse:
      'On any application to do out of time what the rules required to be done within time — filing a defence, a reply, a list of witnesses or a notice of appeal.',
    deponent: 'The applicant, or counsel where the default is counsel’s',
    statutoryBasis: [
      'Order 49, High Court of Lagos State (Civil Procedure) Rules 2019',
      'Evidence Act 2011, sections 107–120',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'Account for every day of the delay. A gap left unexplained is the usual ground of refusal.',
      'Where the default is counsel’s, counsel should depose personally — the sins of counsel are not visited on the litigant, but only where counsel owns them on oath.',
      'Exhibit the process sought to be filed; the court will want to see that the application is not futile.',
    ],
    keywords: ['extension of time', 'enlargement of time', 'delay', 'good cause', 'out of time'],
    sampleText: `${HEADING('High Court of [STATE] State', '[Judicial Division]', '[HC]')}

BETWEEN:

[CLAIMANT'S FULL NAME] .......................................................................... CLAIMANT

AND

[DEFENDANT'S FULL NAME] ...................................... DEFENDANT/APPLICANT

        AFFIDAVIT IN SUPPORT OF MOTION FOR EXTENSION OF TIME

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, [Legal Practitioner/Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the [Defendant/Applicant herein / a Legal Practitioner in the Law Firm of [FIRM], Solicitors to the Applicant] and conversant with the facts herein deposed to, having the authority of the Applicant to depose to this affidavit.

2. That the [Writ of Summons and Statement of Claim] in this suit were served on the Applicant on the [DAY] day of [MONTH], 20__.

3. That by the Rules of this Honourable Court the Applicant's [Statement of Defence] ought to have been filed on or before the [DAY] day of [MONTH], 20__.

4. That the said process was not filed within time by reason of the following: [account for the period day by day — the file was transmitted late, counsel was engaged in a part-heard trial at [court] on the stated dates, the Applicant was hospitalised, the documents had to be obtained from [source]].

5. That the delay was neither wilful nor intended to overreach the Claimant or to delay the hearing of this suit.

6. That the [Statement of Defence] sought to be filed is attached hereto and marked Exhibit A, and it raises a substantial defence on the merits, namely [state it in a sentence].

7. That the Claimant will suffer no prejudice that cannot be compensated in costs if this application is granted.

8. That the Applicant is willing to pay such costs as this Honourable Court may deem fit.

9. That it is in the interest of justice that this suit be determined on its merits rather than on a technicality.

${OATHS_ACT_CLOSE(10)}

${JURAT}`,
  },

  // -------------------------------------------------------------------------
  // Criminal proceedings
  // -------------------------------------------------------------------------
  {
    id: 'aff-bail-application',
    title: 'Affidavit in Support of Bail Application',
    category: 'criminal',
    description:
      'The facts on which a defendant asks to be admitted to bail pending trial — presumption of innocence, availability, ties to the jurisdiction and health.',
    whenToUse:
      'Filed with a motion for bail in the High Court, or in support of an oral application at the Magistrate Court in a bailable offence.',
    deponent: 'A relation, surety or counsel — not ordinarily the defendant in custody',
    statutoryBasis: [
      'Constitution of the Federal Republic of Nigeria 1999 (as amended), sections 35(4) and 36(5)',
      'Administration of Criminal Justice Act 2015, sections 158–169',
      'Bamaiyi v. State (2001) LDLR (SC) pt 1020',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'Address the Bamaiyi criteria head-on: nature of the charge, evidence available, penalty, likelihood of appearing, criminal record, likelihood of interference with witnesses and health.',
      'Where ill-health is relied upon, exhibit a medical report from a government hospital — a bare assertion of illness carries no weight.',
      'Name the proposed sureties and their means; the court will want to know they can be produced.',
    ],
    keywords: ['bail', 'pending trial', 'surety', 'Bamaiyi', 'ACJA', 'section 35'],
    sampleText: `${HEADING('High Court of [STATE] State', '[Judicial Division]', '[CR]')}

BETWEEN:

THE STATE / FEDERAL REPUBLIC OF NIGERIA .................................. COMPLAINANT

AND

[DEFENDANT'S FULL NAME] ...................................... DEFENDANT/APPLICANT

            AFFIDAVIT IN SUPPORT OF MOTION FOR BAIL PENDING TRIAL

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the [elder brother / spouse / employer] of the Defendant/Applicant and by virtue of that relationship I am conversant with the facts herein deposed to and have his/her authority to depose to this affidavit.

2. That the Defendant was arraigned before this Honourable Court on the [DAY] day of [MONTH], 20__ on a charge of [STATE THE OFFENCE] contrary to section [___] of the [STATUTE].

3. That the Defendant pleaded not guilty to the said charge and is presumed innocent until the contrary is proved.

4. That the offence charged is bailable and is not one punishable with death.

5. That the Defendant has been in custody at [FACILITY] since the [DAY] day of [MONTH], 20__, a period of [___] days.

6. That the Defendant is a [state occupation] resident at [ADDRESS] in [STATE], where he/she has lived for [___] years with his/her [spouse and children], and has no intention of jumping bail.

7. That the Defendant has no previous conviction and no other criminal charge pending against him/her.

8. That the Defendant will not interfere with the investigation or with any witness, the investigation having been concluded and the proof of evidence already filed.

9. That the Defendant is suffering from [CONDITION] and requires continuing medical attention which is not available in custody; the medical report from [GOVERNMENT HOSPITAL] dated [DATE] is attached and marked Exhibit A.

10. That there are two sureties ready and willing to stand for the Defendant, namely [NAME], a [occupation] of [address], and [NAME], a [occupation] of [address].

11. That the Defendant undertakes to attend his/her trial on every adjourned date and to abide by every condition this Honourable Court may impose.

12. That granting bail will enable the Defendant prepare his/her defence properly with his/her counsel.

${OATHS_ACT_CLOSE(13)}

${JURAT}`,
  },
  {
    id: 'aff-surety-verification',
    title: 'Surety Verification Affidavit',
    category: 'criminal',
    description:
      'The surety’s sworn declaration of identity, means and residence, undertaking to produce the defendant.',
    whenToUse:
      'Filed at the registry after bail is granted, as part of the perfection of bail conditions.',
    deponent: 'The proposed surety',
    statutoryBasis: [
      'Administration of Criminal Justice Act 2015, sections 165–172',
      'Oaths Act, LFN 2004, section 13',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'Attach proof of the address deposed to — a utility bill or tenancy agreement — as most registries verify the address physically.',
      'A surety who is himself facing a criminal charge will be rejected; disclose the position honestly.',
    ],
    keywords: ['surety', 'verification', 'bail perfection', 'means', 'undertaking'],
    sampleText: `${HEADING('High Court of [STATE] State', '[Judicial Division]', '[CR]')}

BETWEEN:

THE STATE .................................................................................... COMPLAINANT

AND

[DEFENDANT'S FULL NAME] ................................................................ DEFENDANT

                    SURETY VERIFICATION AFFIDAVIT

I, [FULL NAME OF SURETY], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [RESIDENTIAL ADDRESS], do hereby make oath and state as follows:

1. That I am the surety standing for the Defendant in this case pursuant to the bail granted by this Honourable Court on the [DAY] day of [MONTH], 20__.

2. That I am a [state occupation] employed by / carrying on business at [PLACE OF WORK], and I earn approximately N[AMOUNT] per annum.

3. That I reside at [FULL RESIDENTIAL ADDRESS] and have done so for [___] years; my [tenancy agreement / utility bill / certificate of occupancy] is attached and marked Exhibit A.

4. That I know the Defendant personally, being his/her [relationship], and I have known him/her for [___] years.

5. That I am worth the sum of N[AMOUNT] over and above all my debts and liabilities, as shown by [bank statement / title document] attached and marked Exhibit B.

6. That I undertake to produce the Defendant before this Honourable Court on every date to which this case may be adjourned.

7. That I undertake to notify this Honourable Court immediately of any change in my address or in the address of the Defendant.

8. That I am not a surety for any other person in any other case, and there is no criminal charge pending against me in any court.

9. That I understand that if the Defendant fails to appear, the bail bond of N[AMOUNT] may be forfeited against me.

${OATHS_ACT_CLOSE(10)}

${JURAT}`,
  },

  // -------------------------------------------------------------------------
  // Land & property
  // -------------------------------------------------------------------------
  {
    id: 'aff-loss-of-cofo',
    title: 'Affidavit of Loss of Certificate of Occupancy',
    category: 'land',
    description:
      'Sworn account of the loss of a Certificate of Occupancy, in support of an application to the Land Registry for a certified copy.',
    whenToUse:
      'Before applying to the Ministry of Lands for a replacement or certified true copy, and before newspaper publication of the loss.',
    deponent: 'The holder of the right of occupancy',
    statutoryBasis: [
      'Land Use Act, LFN 2004, sections 5 and 9',
      'Land Instruments Registration Law of the relevant State',
      'Oaths Act, LFN 2004, section 13',
    ],
    courtHeadingRequired: false,
    practiceNotes: [
      'Depose to the file number and the registration particulars — volume, page and register — as the Registry will trace the original from them.',
      'The undertaking against encumbrance matters: a purchaser or mortgagee may later rely on this deposition.',
    ],
    keywords: ['certificate of occupancy', 'C of O', 'land registry', 'loss', 'certified true copy'],
    sampleText: `AFFIDAVIT OF LOSS OF CERTIFICATE OF OCCUPANCY

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the Deponent herein and the holder of the Statutory Right of Occupancy in respect of the property hereinafter described.

2. That the Governor of [STATE] State granted to me a Certificate of Occupancy No. [NUMBER] dated the [DAY] day of [MONTH], [YEAR], registered as No. [___] at Page [___] in Volume [___] of the Lands Registry in the office at [CITY].

3. That the said Certificate relates to the parcel of land measuring approximately [___] square metres situate at, lying and being at [FULL DESCRIPTION AND ADDRESS], covered by Survey Plan No. [NUMBER].

4. That on or about the [DAY] day of [MONTH], 20__ the original Certificate of Occupancy was lost in the following circumstances: [state precisely].

5. That I searched diligently at [places searched] and made enquiries of [persons and institutions], all without success.

6. That I reported the loss at [POLICE STATION] on the [DAY] day of [MONTH], 20__ and the Police Extract is attached and marked Exhibit A.

7. That I caused the loss to be published in the [NEWSPAPER] of the [DAY] day of [MONTH], 20__; a copy of the publication is attached and marked Exhibit B.

8. That the said Certificate of Occupancy has not been sold, transferred, assigned, mortgaged, charged, deposited or in any manner encumbered by me to any person or institution whatsoever.

9. That I remain in undisturbed possession of the said property and no person has laid any adverse claim to it.

10. That I undertake to surrender the original Certificate to the Lands Registry should it be found hereafter.

11. That I depose to this affidavit in support of my application to the Honourable Commissioner for Lands, [STATE] State, for the issuance of a Certified True Copy of the said Certificate of Occupancy.

${OATHS_ACT_CLOSE(12)}

${JURAT}`,
  },
  {
    id: 'aff-title-possession',
    title: 'Affidavit of Title and Possession',
    category: 'land',
    description:
      'Sworn statement of how title was acquired and how possession has been exercised, used in land transactions and in support of land applications.',
    whenToUse:
      'On a sale or mortgage, on application for governor’s consent, or in support of an application in a land suit where possession is in issue.',
    deponent: 'The owner or the person in possession',
    statutoryBasis: [
      'Land Use Act, LFN 2004, section 22 (consent)',
      'Evidence Act 2011, section 143 (presumption from possession)',
      'Idundun v. Okumagba (1976) 9-10 SC 227 (five ways of proving title)',
    ],
    courtHeadingRequired: false,
    practiceNotes: [
      'Track the Idundun v. Okumagba routes — traditional history, documents of title, acts of ownership, possession, or possession of adjacent land — and depose to whichever applies.',
      'Acts of possession must be particularised: what was built, farmed, fenced, let or rated, and when.',
    ],
    keywords: ['title', 'possession', 'Idundun', 'root of title', 'governor consent', 'land'],
    sampleText: `AFFIDAVIT OF TITLE AND POSSESSION

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the Deponent herein and the beneficial owner of the property hereinafter described.

2. That the property is that parcel of land measuring approximately [___] square metres situate at [FULL ADDRESS], covered by Survey Plan No. [NUMBER] drawn by [SURVEYOR] and dated [DATE].

3. That I acquired the said property by [Deed of Assignment dated the ___ day of ______, 20__ from [VENDOR] / grant from the [FAMILY] family / inheritance from my late father [NAME]], the instrument of which is attached and marked Exhibit A.

4. That my [Vendor/Grantor] derived title from [set out the root of title and the chain of transmission].

5. That the transaction was for a consideration of N[AMOUNT], the receipt of which is attached and marked Exhibit B.

6. That since the [DAY] day of [MONTH], [YEAR] I have been in exclusive, peaceable and undisturbed possession of the said property.

7. That my acts of possession and ownership include: [erecting a perimeter fence in [YEAR] / constructing a [___] building thereon / letting the property to [TENANT] since [YEAR] / farming the land / paying tenement rates and land use charge], evidence of which is attached and marked Exhibits C1–C3.

8. That no person has at any time challenged my title to or possession of the said property.

9. That the said property is not subject to any government acquisition, litigation, mortgage, charge or encumbrance whatsoever.

10. That I depose to this affidavit in support of [my application for the Governor's consent to the assignment / the transaction with [PURCHASER]] and for no other purpose.

${OATHS_ACT_CLOSE(11)}

${JURAT}`,
  },

  // -------------------------------------------------------------------------
  // Matrimonial causes & family
  // -------------------------------------------------------------------------
  {
    id: 'aff-verifying-petition',
    title: 'Affidavit Verifying Petition (Matrimonial Causes)',
    category: 'matrimonial',
    description:
      'The petitioner’s sworn verification of the facts in a petition for dissolution of marriage, including the statutory certificate as to reconciliation.',
    whenToUse:
      'Filed with every petition for dissolution or nullity of marriage under the Matrimonial Causes Act; the petition is incompetent without it.',
    deponent: 'The petitioner personally',
    statutoryBasis: [
      'Matrimonial Causes Act, LFN 2004, sections 15, 16 and 83',
      'Matrimonial Causes Rules, Order V and Order VI',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'The verification must be by the petitioner personally — this is one affidavit counsel cannot depose to.',
      'Include the certificate as to reconciliation required by section 11 of the Act; its omission is a standing ground of objection.',
      'Depose to the single ground — that the marriage has broken down irretrievably — and then to the facts under section 15(2) relied upon.',
    ],
    keywords: ['matrimonial', 'petition', 'dissolution', 'verifying', 'reconciliation', 'section 15'],
    sampleText: `${HEADING('High Court of [STATE] State', '[Judicial Division]', '[HD]')}

BETWEEN:

[PETITIONER'S FULL NAME] ........................................................................ PETITIONER

AND

[RESPONDENT'S FULL NAME] .................................................................. RESPONDENT

                    AFFIDAVIT VERIFYING PETITION

I, [PETITIONER'S FULL NAME], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the Petitioner in this Petition and the facts herein deposed to are within my personal knowledge.

2. That I was lawfully married to the Respondent at the [MARRIAGE REGISTRY / CHURCH], [PLACE], on the [DAY] day of [MONTH], [YEAR] under the Marriage Act; the Marriage Certificate is attached and marked Exhibit A.

3. That there [are [___] children of the marriage, namely [NAMES AND DATES OF BIRTH] / is no child of the marriage].

4. That I am domiciled in Nigeria and have been ordinarily resident at [ADDRESS] in [STATE] for [___] years immediately preceding the presentation of this Petition.

5. That the marriage has broken down irretrievably.

6. That the facts relied upon in support of paragraph 5 above are that [set out the facts under section 15(2) of the Matrimonial Causes Act — that the Respondent has behaved in such a way that I cannot reasonably be expected to live with him/her; that the parties have lived apart for a continuous period of at least [___] years immediately preceding the presentation of this Petition].

7. That the particulars of the said facts are set out in paragraphs [___] to [___] of the Petition filed herein and are true and correct.

8. That there has been no condonation, connivance or collusion between myself and the Respondent in relation to this Petition.

9. That no previous proceedings have been instituted by me or, to my knowledge, by the Respondent in respect of this marriage in any court in Nigeria or elsewhere.

10. That the reconciliation certificate required by section 11 of the Matrimonial Causes Act has been signed by my Solicitor and filed with this Petition.

11. That I verify the whole of the contents of the Petition filed herein as true and correct.

${OATHS_ACT_CLOSE(12)}

${JURAT}`,
  },
  {
    id: 'aff-means-maintenance',
    title: 'Affidavit of Means (Maintenance & Ancillary Relief)',
    category: 'matrimonial',
    description:
      'Full disclosure of income, assets, liabilities and the needs of the children, on which maintenance and settlement are assessed.',
    whenToUse:
      'Filed with an application for maintenance pending suit, custody, or a settlement of property under section 72 of the Matrimonial Causes Act.',
    deponent: 'The party applying for or resisting ancillary relief',
    statutoryBasis: [
      'Matrimonial Causes Act, LFN 2004, sections 70, 71 and 72',
      'Child’s Rights Act 2003, section 1 (welfare principle)',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'Disclosure must be complete — an affidavit of means that hides an asset is a fraud on the court and unravels the order made on it.',
      'Break the children’s expenses down by head: school fees, medical, feeding, transport. A global figure invites the court to discount it.',
      'Exhibit payslips, bank statements and school fee invoices; assertions of income without documents rarely persuade.',
    ],
    keywords: ['maintenance', 'ancillary relief', 'means', 'custody', 'settlement of property'],
    sampleText: `${HEADING('High Court of [STATE] State', '[Judicial Division]', '[HD]')}

BETWEEN:

[PETITIONER'S FULL NAME] ........................................................................ PETITIONER

AND

[RESPONDENT'S FULL NAME] .................................................................. RESPONDENT

                          AFFIDAVIT OF MEANS

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the [Petitioner/Respondent] herein and conversant with the facts deposed to.

2. That I am employed as a [POSITION] with [EMPLOYER] and earn a net monthly income of N[AMOUNT]; my payslips for the last three months are attached and marked Exhibits A1–A3.

3. That my other sources of income are [rent of N[AMOUNT] per annum from [property] / business income of approximately N[AMOUNT] per month], evidence of which is attached and marked Exhibit B.

4. That my assets are as follows:
   (a) [Property at [ADDRESS], valued at approximately N[AMOUNT]];
   (b) [Motor vehicle — [make, model, year]];
   (c) [Bank accounts: [BANK], account no. ______, balance N[AMOUNT] as at [DATE]];
   (d) [Shares/investments: [details]].

5. That my liabilities are as follows: [mortgage instalment of N[AMOUNT] per month to [BANK] / personal loan balance of N[AMOUNT] / other].

6. That there are [___] children of the marriage, namely [NAME], aged [___], and [NAME], aged [___], who reside with [me / the Respondent].

7. That the monthly expenses of the said children are as follows:
   (a) School fees — N[AMOUNT] per term ([SCHOOL], invoice attached as Exhibit C);
   (b) Feeding — N[AMOUNT] per month;
   (c) Medical — N[AMOUNT] per month;
   (d) Transport — N[AMOUNT] per month;
   (e) Clothing and incidentals — N[AMOUNT] per month.

8. That the [Respondent/Petitioner] has [contributed N[AMOUNT] per month since [DATE] / failed to contribute anything towards the maintenance of the said children since [DATE]].

9. That the welfare of the children requires that [state the order sought — custody, maintenance in the sum of N[AMOUNT] per month, payment of school fees].

10. That the disclosure made in this affidavit is full, complete and accurate to the best of my knowledge and belief.

${OATHS_ACT_CLOSE(11)}

${JURAT}`,
  },

  // -------------------------------------------------------------------------
  // Probate & estates
  // -------------------------------------------------------------------------
  {
    id: 'aff-letters-of-administration',
    title: 'Affidavit in Support of Letters of Administration',
    category: 'probate',
    description:
      'The next-of-kin’s sworn account of the death, the survivors and the estate, on which letters of administration are granted.',
    whenToUse:
      'Filed at the Probate Registry where a person dies intestate and the family applies to administer the estate.',
    deponent: 'The applicants for the grant, ordinarily the surviving spouse or children',
    statutoryBasis: [
      'Administration of Estates Law of the relevant State',
      'Evidence Act 2011, sections 107–120',
      'Oaths Act, LFN 2004, section 13',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'List every surviving child, including those from other relationships — a grant obtained on an incomplete list is liable to be revoked.',
      'Value the estate honestly; estate fees are assessed on the declared value and understatement invites a re-assessment.',
      'Attach the death certificate; the Probate Registry will not open a file without it.',
    ],
    keywords: ['letters of administration', 'intestate', 'probate', 'estate', 'next of kin'],
    sampleText: `IN THE HIGH COURT OF [STATE] STATE
IN THE PROBATE REGISTRY
HOLDEN AT [CITY]

IN THE ESTATE OF [FULL NAME OF THE DECEASED] (DECEASED)

        AFFIDAVIT IN SUPPORT OF APPLICATION FOR LETTERS OF ADMINISTRATION

WE, (1) [FULL NAME], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS]; and (2) [FULL NAME], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That we are the [surviving spouse and eldest son] of [FULL NAME OF THE DECEASED] (deceased) and by virtue of that relationship we are conversant with the facts herein deposed to.

2. That the deceased died at [PLACE OF DEATH] on the [DAY] day of [MONTH], 20__; the Death Certificate is attached and marked Exhibit A.

3. That at the time of his/her death the deceased was domiciled in Nigeria and resident at [LAST ADDRESS] in [STATE].

4. That the deceased died intestate, having made no will, and no application for probate has been made by any person.

5. That the deceased was survived by the following persons:
   (a) [NAME] — surviving [spouse], aged [___], of [ADDRESS];
   (b) [NAME] — [son/daughter], aged [___], of [ADDRESS];
   (c) [NAME] — [son/daughter], aged [___], of [ADDRESS].

6. That there is no other person entitled to share in the estate of the deceased in priority to or equally with us.

7. That the estate of the deceased consists of the following:
   (a) [Landed property at [ADDRESS], covered by [title document], valued at approximately N[AMOUNT]];
   (b) [Bank balances: [BANK], account no. ______, N[AMOUNT]];
   (c) [Motor vehicle — [details], valued at N[AMOUNT]];
   (d) [Other assets].

8. That the gross value of the estate is approximately N[AMOUNT] and the liabilities of the estate amount to approximately N[AMOUNT].

9. That we undertake to administer the estate of the deceased faithfully, to pay the debts and liabilities of the estate, and to distribute the residue among the persons entitled according to law.

10. That we undertake to render a true and just account of our administration whenever lawfully required to do so.

11. That we depose to this affidavit in support of our application for the grant of Letters of Administration in respect of the estate of the deceased.

${OATHS_ACT_CLOSE(12)}

${JURAT}`,
  },

  // -------------------------------------------------------------------------
  // Corporate & commercial
  // -------------------------------------------------------------------------
  {
    id: 'aff-corporate-verifying',
    title: 'Corporate Verifying Affidavit (CAC Filings)',
    category: 'corporate',
    description:
      'A director or secretary’s sworn verification of corporate facts for filings at the Corporate Affairs Commission or in support of a company application.',
    whenToUse:
      'On a change of directors, alteration of share capital, restoration to the register, or any CAC filing requiring verification on oath.',
    deponent: 'A director or the company secretary duly authorised by a board resolution',
    statutoryBasis: [
      'Companies and Allied Matters Act 2020, sections 860–867',
      'Companies Regulations 2021',
      'Evidence Act 2011, sections 107–120',
    ],
    courtHeadingRequired: false,
    practiceNotes: [
      'Exhibit the board resolution authorising the deponent — the CAC and the court both ask for it.',
      'State the RC number, the date of incorporation and the registered office exactly as they appear on the register.',
    ],
    keywords: ['CAMA', 'CAC', 'company', 'director', 'board resolution', 'corporate'],
    sampleText: `AFFIDAVIT IN SUPPORT OF [DESCRIBE THE FILING]

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, [Director/Company Secretary], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the [Director / Company Secretary] of [COMPANY NAME] (RC No. [NUMBER]) and by virtue of my position I am conversant with the facts herein deposed to and duly authorised to depose to this affidavit.

2. That the Board of Directors of the Company authorised me to depose to this affidavit by a Resolution passed at its meeting of the [DAY] day of [MONTH], 20__; the said Resolution is attached and marked Exhibit A.

3. That the Company was incorporated in Nigeria on the [DAY] day of [MONTH], [YEAR] under the [Companies and Allied Matters Act] with its registered office at [ADDRESS].

4. That the issued share capital of the Company is N[AMOUNT] divided into [NUMBER] ordinary shares of N[VALUE] each.

5. That at a [Board Meeting / General Meeting] duly convened and held on the [DAY] day of [MONTH], 20__, the Company resolved that [set out the resolution — the appointment of [NAME] as director / the increase of the issued share capital / the change of the registered office].

6. That the said meeting was properly convened, notice having been given to all persons entitled to receive it, and a quorum was present throughout.

7. That the particulars set out in the [Form CAC ___] filed herewith are true and correct in every material particular.

8. That the Company is a going concern, has filed its annual returns up to the year [YEAR], and is not in liquidation or receivership.

9. That I depose to this affidavit in support of the Company's application to the Corporate Affairs Commission and for no other purpose.

${OATHS_ACT_CLOSE(10)}

${JURAT}`,
  },

  // -------------------------------------------------------------------------
  // Election petitions
  // -------------------------------------------------------------------------
  {
    id: 'aff-election-petition-motion',
    title: 'Affidavit in Support of Election Petition Application',
    category: 'election',
    description:
      'The deposition supporting a tribunal motion — inspection of electoral materials, substituted service, or an extension within the petition timetable.',
    whenToUse:
      'Filed at the Election Petition Tribunal within the compressed timetable set by the Electoral Act; time is of the essence throughout.',
    deponent: 'The petitioner or a litigation officer in the petitioner’s solicitors’ firm',
    statutoryBasis: [
      'Electoral Act 2022, sections 133–147',
      'First Schedule to the Electoral Act 2022 (Election Tribunal and Court Practice Directions)',
      'Constitution of the Federal Republic of Nigeria 1999 (as amended), section 285',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'Section 285 timelines are constitutional and cannot be extended — depose to the exact dates and show the application is within time.',
      'On an application to inspect electoral materials, particularise the documents sought by polling unit and ward; a general request will be refused.',
    ],
    keywords: ['election petition', 'tribunal', 'inspection', 'electoral act', 'section 285'],
    sampleText: `IN THE NATIONAL AND STATE HOUSES OF ASSEMBLY ELECTION PETITION TRIBUNAL
HOLDEN AT [CITY], [STATE] STATE

                                                            PETITION NO: EPT/[__]/20__

BETWEEN:

[PETITIONER'S FULL NAME] ........................................................................ PETITIONER

AND

1. [RESPONDENT] .................................................................................. 1ST RESPONDENT
2. INDEPENDENT NATIONAL ELECTORAL COMMISSION ............. 2ND RESPONDENT

    AFFIDAVIT IN SUPPORT OF MOTION FOR INSPECTION OF ELECTORAL MATERIALS

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the Petitioner herein [or: a Litigation Officer in the Law Firm of [FIRM], Solicitors to the Petitioner, and I have the authority of the Petitioner and of my employers to depose to this affidavit].

2. That the election into the office of [OFFICE] for [CONSTITUENCY] was conducted by the 2nd Respondent on the [DAY] day of [MONTH], 20__.

3. That the 2nd Respondent declared the 1st Respondent the winner of the said election on the [DAY] day of [MONTH], 20__.

4. That the Petition herein was filed on the [DAY] day of [MONTH], 20__, being within 21 days of the declaration of the result as required by section 285(5) of the Constitution.

5. That the Petitioner's case is that [state the ground shortly — the election was invalid by reason of non-compliance with the Electoral Act 2022 / the 1st Respondent was not duly elected by a majority of lawful votes].

6. That in order to prove the said ground the Petitioner requires access to the following electoral materials used at the election:
   (a) Forms EC8A (Polling Unit Result Sheets) for all polling units in [WARDS];
   (b) Forms EC8B, EC8C and EC8D for [CONSTITUENCY];
   (c) The Register of Voters and the BVAS accreditation records for the said polling units;
   (d) The Certified True Copies of the Forms EC40G where applicable.

7. That the said materials are in the exclusive custody of the 2nd Respondent and cannot be obtained otherwise than by an order of this Honourable Tribunal.

8. That the Petitioner is willing and able to pay the statutory fees for the certification of the said documents.

9. That the grant of this application will not prejudice the Respondents nor delay the hearing of this Petition within the time allowed by section 285(6) of the Constitution.

${OATHS_ACT_CLOSE(10)}

${JURAT}`,
  },

  // -------------------------------------------------------------------------
  // Enforcement & garnishee
  // -------------------------------------------------------------------------
  {
    id: 'aff-garnishee',
    title: 'Affidavit in Support of Garnishee Order Nisi',
    category: 'enforcement',
    description:
      'The judgment creditor’s sworn statement of the unsatisfied judgment and the debt owed to the judgment debtor by the garnishee.',
    whenToUse:
      'Filed ex parte to attach money standing to the credit of a judgment debtor in the hands of a bank or third party.',
    deponent: 'The judgment creditor or a litigation officer in their solicitors’ firm',
    statutoryBasis: [
      'Sheriffs and Civil Process Act, LFN 2004, sections 83–92',
      'Judgment Enforcement Rules, Order VIII',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'Where public funds are involved the consent of the Attorney-General must be obtained and exhibited — section 84 of the Sheriffs and Civil Process Act.',
      'Depose to the judgment sum, what has been paid and the exact balance outstanding; an order nisi on a wrong figure is a gift to the debtor.',
      'Name the garnishee bank branches with account details where known; a fishing expedition across an entire bank invites opposition.',
    ],
    keywords: ['garnishee', 'order nisi', 'execution', 'judgment creditor', 'section 84', 'attachment'],
    sampleText: `${HEADING('High Court of [STATE] State', '[Judicial Division]', '[HC]')}

BETWEEN:

[JUDGMENT CREDITOR] ................................................... JUDGMENT CREDITOR/APPLICANT

AND

[JUDGMENT DEBTOR] ....................................................................... JUDGMENT DEBTOR

AND

[BANK NAME] ......................................................................................... GARNISHEE

            AFFIDAVIT IN SUPPORT OF MOTION EX PARTE FOR GARNISHEE ORDER NISI

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the Judgment Creditor/Applicant herein [or: a Litigation Officer in the Law Firm of [FIRM], Solicitors to the Judgment Creditor, duly authorised to depose to this affidavit].

2. That on the [DAY] day of [MONTH], 20__ this Honourable Court entered judgment in favour of the Judgment Creditor against the Judgment Debtor in the sum of N[AMOUNT] together with interest at [___]% per annum and costs of N[AMOUNT]; the Certified True Copy of the judgment is attached and marked Exhibit A.

3. That the said judgment has neither been set aside nor stayed, and no appeal against it operates as a stay of execution.

4. That the Judgment Debtor has paid the sum of N[AMOUNT] leaving a balance of N[AMOUNT] outstanding as at the date of this affidavit.

5. That despite repeated demands, the last by letter dated the [DAY] day of [MONTH], 20__ (Exhibit B), the Judgment Debtor has failed, refused and neglected to liquidate the outstanding judgment sum.

6. That the Judgment Debtor maintains account(s) with the Garnishee at its [BRANCH] branch, namely account number [NUMBER], to which sums are standing to the credit of the Judgment Debtor.

7. That the said sums are sufficient or partly sufficient to satisfy the outstanding judgment debt.

8. That unless this Honourable Court makes an order nisi attaching the said funds, the Judgment Debtor will withdraw them and the judgment will remain unsatisfied.

9. [Where public funds are involved: That the consent of the Honourable Attorney-General of [the Federation / [STATE] State] required by section 84 of the Sheriffs and Civil Process Act was obtained on the [DAY] day of [MONTH], 20__ and is attached and marked Exhibit C.]

10. That it is in the interest of justice to grant this application.

${OATHS_ACT_CLOSE(11)}

${JURAT}`,
  },

  // -------------------------------------------------------------------------
  // Appellate practice
  // -------------------------------------------------------------------------
  {
    id: 'aff-stay-pending-appeal',
    title: 'Affidavit in Support of Stay of Execution Pending Appeal',
    category: 'appellate',
    description:
      'The special circumstances on which execution of a judgment is asked to be suspended while an appeal is pending.',
    whenToUse:
      'Filed first in the court that gave the judgment and, if refused, in the Court of Appeal under Order 6 of the Court of Appeal Rules.',
    deponent: 'The appellant or an officer with knowledge of the facts',
    statutoryBasis: [
      'Court of Appeal Rules 2021, Order 6',
      'Vaswani Trading Co. v. Savalakh (1972) 12 SC 77 (special circumstances)',
      'Martins v. Nicannar Food Co. Ltd (1988) LDLR (SC) pt 1022',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'Special circumstances must be deposed to as facts — that the res will be destroyed, that the respondent could not repay, that the appeal raises substantial issues of law.',
      'Exhibit the notice of appeal; a stay cannot ride on an appeal that has not been filed.',
      'Offer terms — payment into an interest-yielding account in the names of the parties’ solicitors is often what wins the application.',
    ],
    keywords: ['stay of execution', 'pending appeal', 'special circumstances', 'res', 'nugatory'],
    sampleText: `${HEADING('High Court of [STATE] State', '[Judicial Division]', '[HC]')}

BETWEEN:

[JUDGMENT CREDITOR] ................................................. CLAIMANT/RESPONDENT

AND

[JUDGMENT DEBTOR] .................................................. DEFENDANT/APPLICANT

    AFFIDAVIT IN SUPPORT OF MOTION FOR STAY OF EXECUTION PENDING APPEAL

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the Defendant/Applicant herein and conversant with the facts herein deposed to.

2. That on the [DAY] day of [MONTH], 20__ this Honourable Court delivered judgment against me in the sum of N[AMOUNT] [and ordered that I give up possession of the property at [ADDRESS]].

3. That being dissatisfied with the said judgment I filed a Notice of Appeal to the Court of Appeal on the [DAY] day of [MONTH], 20__, within time; the Notice of Appeal is attached and marked Exhibit A.

4. That the said Notice of Appeal raises substantial and arguable grounds of law, including [state shortly — the jurisdiction of the court, the admissibility of Exhibit ___, the effect of section ___ of the [statute]].

5. That the res in this matter is [describe — the property at [ADDRESS] / the sum of N[AMOUNT]].

6. That if execution is not stayed, [the property will be sold and transferred to a third party / the said sum will be paid out and dissipated], and the appeal, if successful, will be rendered nugatory.

7. That the Respondent is [state the facts bearing on ability to refund — a company with no known assets in Nigeria / an individual without visible means] and would be unable to refund the judgment sum should the appeal succeed.

8. That the Applicant is willing to abide by such terms as this Honourable Court may impose, including paying the judgment sum into an interest-yielding account in the joint names of the Solicitors to the parties pending the determination of the appeal.

9. That this application was brought promptly, within [___] days of the delivery of the judgment.

10. That the Respondent will suffer no injury that cannot be compensated in costs if this application is granted.

${OATHS_ACT_CLOSE(11)}

${JURAT}`,
  },

  // -------------------------------------------------------------------------
  // Administrative & regulatory
  // -------------------------------------------------------------------------
  {
    id: 'aff-fundamental-rights',
    title: 'Affidavit in Support of Fundamental Rights Enforcement',
    category: 'administrative',
    description:
      'The facts of the breach of a fundamental right, in support of an application under the Fundamental Rights (Enforcement Procedure) Rules 2009.',
    whenToUse:
      'Filed with the originating motion or summons commencing a fundamental rights action, together with the statement and the written address.',
    deponent: 'The applicant, or any person on their behalf where the applicant is in custody',
    statutoryBasis: [
      'Constitution of the Federal Republic of Nigeria 1999 (as amended), Chapter IV, sections 33–46',
      'Fundamental Rights (Enforcement Procedure) Rules 2009, Order II',
      'African Charter on Human and Peoples’ Rights (Ratification and Enforcement) Act, LFN 2004',
    ],
    courtHeadingRequired: true,
    practiceNotes: [
      'Where the applicant is in detention, a next friend may depose — the FREP Rules expressly permit it and the paragraph should say so.',
      'Depose to the dates, times and places of arrest and detention with precision; the length of detention beyond the constitutional period is the heart of the case.',
      'Name the officers involved where known — an unnamed respondent is difficult to serve and easy to disown.',
    ],
    keywords: ['fundamental rights', 'FREP', 'unlawful detention', 'chapter IV', 'human rights'],
    sampleText: `${HEADING('High Court of [STATE] State', '[Judicial Division]', '[HC/M]')}

IN THE MATTER OF AN APPLICATION BY [APPLICANT'S NAME] FOR THE ENFORCEMENT OF HIS/HER FUNDAMENTAL RIGHTS

AND

IN THE MATTER OF SECTIONS 34, 35 AND 41 OF THE CONSTITUTION OF THE FEDERAL REPUBLIC OF NIGERIA 1999 (AS AMENDED)

BETWEEN:

[APPLICANT'S FULL NAME] ........................................................................... APPLICANT

AND

1. THE NIGERIA POLICE FORCE .......................................................... 1ST RESPONDENT
2. [NAME OF OFFICER] ......................................................................... 2ND RESPONDENT

                AFFIDAVIT IN SUPPORT OF THE APPLICATION

I, [FULL NAME OF DEPONENT], [Male/Female], [Religion], Nigerian Citizen, [Occupation], of [ADDRESS], do hereby make oath and state as follows:

1. That I am the Applicant herein [or: the [relationship] of the Applicant, who is presently in the custody of the Respondents and unable to depose to this affidavit, and I depose hereto on his/her behalf as permitted by the Fundamental Rights (Enforcement Procedure) Rules 2009].

2. That on the [DAY] day of [MONTH], 20__ at about [TIME] hours, officers of the 1st Respondent led by the 2nd Respondent arrested the Applicant at [PLACE OF ARREST].

3. That no warrant was produced and no reason for the arrest was given to the Applicant at the time of the arrest or at all.

4. That the Applicant was taken to [POLICE STATION/FACILITY] and detained in a cell measuring approximately [___] by [___] metres together with [___] other detainees.

5. That the Applicant was detained from the [DAY] day of [MONTH], 20__ to the [DAY] day of [MONTH], 20__, a period of [___] days, without being brought before any court.

6. That the Applicant was not permitted access to his/her counsel or family for the first [___] days of the said detention despite repeated requests.

7. That [set out any assault, degrading treatment or seizure of property, with dates and particulars]; the medical report from [HOSPITAL] dated [DATE] is attached and marked Exhibit A.

8. That the Applicant was released on the [DAY] day of [MONTH], 20__ [without any charge being preferred against him/her / on the Respondents' administrative bail after payment of N[AMOUNT]].

9. That the Applicant has committed no offence known to law and no charge has been filed against him/her in any court to date.

10. That the acts of the Respondents constitute a breach of the Applicant's rights to personal liberty, dignity of the human person and freedom of movement guaranteed by sections 34, 35 and 41 of the Constitution.

11. That unless restrained by this Honourable Court, the Respondents will continue to harass, arrest and detain the Applicant.

12. That the Applicant has suffered [loss of business / injury to reputation / physical and psychological trauma] as a result of the said acts.

${OATHS_ACT_CLOSE(13)}

${JURAT}`,
  },
];

const BY_ID = new Map(AFFIDAVITS.map((affidavit) => [affidavit.id, affidavit]));

export const affidavitById = (id: string): AffidavitTemplate | undefined => BY_ID.get(id);

export const affidavitsInCategory = (category: AffidavitCategoryId): AffidavitTemplate[] =>
  AFFIDAVITS.filter((affidavit) => affidavit.category === category);

export const affidavitCategoryById = (id: string): AffidavitCategory | undefined =>
  AFFIDAVIT_CATEGORIES.find((category) => category.id === id);

/** Free-text search across every field a practitioner would search by. */
export const searchAffidavits = (query: string): AffidavitTemplate[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return AFFIDAVITS;

  return AFFIDAVITS.filter((affidavit) =>
    [
      affidavit.title,
      affidavit.description,
      affidavit.whenToUse,
      affidavit.deponent,
      ...affidavit.statutoryBasis,
      ...affidavit.keywords,
      affidavit.sampleText,
    ]
      .join(' ')
      .toLowerCase()
      .includes(needle),
  );
};
