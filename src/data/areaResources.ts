import {
  AreaOfLaw,
  AreaResourceBundle,
  AreaDraftResource,
  AreaGoverningLaw,
  AreaArticle,
  AreaPractical,
} from '../types';
import { AREAS_OF_LAW, LANDMARK_CASES } from './legalData';

/**
 * Per-area content for the eight features every area of law exposes:
 * demand letters, initiating processes, responding processes, preliminary objections
 * and counter affidavits, governing law, articles, case law and courtroom practicals.
 *
 * Matrimonial Causes is authored in full. Every other area is generated from its own
 * statutes, rules, principles and checklists so the same eight features are present
 * throughout, with area-specific scaffolds ready for fuller content to be dropped in.
 */

const HEADING = (court: string, division: string) =>
  `IN THE ${court.toUpperCase()}\nIN THE ${division.toUpperCase()} JUDICIAL DIVISION\nHOLDEN AT ${division.toUpperCase()}\n\nSUIT NO: ______________`;

// ---------------------------------------------------------------------------
// Matrimonial Causes — authored in full
// ---------------------------------------------------------------------------

const MATRIMONIAL: AreaResourceBundle = {
  partyLabels: { initiating: 'Petitioner', responding: 'Respondent' },

  demandLetters: [
    {
      id: 'mc-demand-01',
      title: 'Letter of Demand — Maintenance & Settlement of Property',
      description:
        'Pre-action letter to a spouse demanding maintenance for the petitioner and the children of the marriage, and an account of matrimonial property, before a petition is filed.',
      sampleText: `[FIRM LETTERHEAD]

Our Ref: ____________                                    Date: ______________

[Name of Respondent]
[Address]

Dear Sir/Madam,

RE: MAINTENANCE OF [NAME OF SPOUSE] AND THE CHILDREN OF THE MARRIAGE
    AND SETTLEMENT OF MATRIMONIAL PROPERTY

We act as Solicitors to [Name of Client] (hereinafter "our client"), on whose express
instructions we write to you.

Our client informs us that you and she/he were lawfully married under the Marriage Act
on the ____ day of __________ at the Marriage Registry, __________, and that there are
____ children of the marriage, namely [names and ages].

Our client further instructs us that since on or about __________ you have failed and/or
neglected to provide reasonable maintenance for our client and the said children,
notwithstanding your means, and that you have taken steps to deal with the matrimonial
property situate at [address] without our client's knowledge or consent.

TAKE NOTICE that our client is entitled, under Sections 70 and 72 of the Matrimonial
Causes Act Cap M7 LFN 2004, to an order for maintenance and to a settlement of property.

WE THEREFORE DEMAND, on behalf of our client, that within fourteen (14) days of receipt
of this letter you:

1. Pay to our client the sum of N__________ being arrears of maintenance from __________
   to date;
2. Commit to a monthly maintenance sum of N__________ for our client and the children;
3. Render a full account of the matrimonial property and undertake not to alienate,
   encumber or otherwise deal with the property at [address]; and
4. Confirm arrangements for the custody, welfare, advancement and education of the
   children of the marriage.

TAKE FURTHER NOTICE that should you fail to comply within the time stipulated, our client
has instructed us to commence proceedings in the High Court without further reference to
you, and to seek all ancillary reliefs together with the costs of the action.

This letter is written without prejudice to our client's rights and remedies, all of which
are expressly reserved.

Yours faithfully,

______________________
[Name], Esq.
For: [Firm Name]
Solicitors to the Petitioner`,
    },
  ],

  initiatingProcesses: [
    {
      id: 'mc-pet-01',
      title: 'Petition for Dissolution of Marriage (Irretrievable Breakdown)',
      description:
        'Full petition under Sections 15 and 16 of the Matrimonial Causes Act pleading the facts evidencing irretrievable breakdown, with ancillary claims for custody, maintenance and settlement of property.',
      sampleText: `${HEADING('High Court of ______ State', '______')}

BETWEEN:

[NAME OF PETITIONER] .................................................... PETITIONER

AND

[NAME OF RESPONDENT] ................................................... RESPONDENT

                                  PETITION

The Petition of [Name of Petitioner] of [address] SHOWS THAT:

1. The Petitioner is a [occupation] resident at [address] within the jurisdiction of this
   Honourable Court.

2. The Respondent is a [occupation] resident at [address] within the jurisdiction of this
   Honourable Court.

3. The Petitioner and the Respondent were lawfully married under the Marriage Act on the
   ____ day of __________ at the Marriage Registry, __________. The Certificate of
   Marriage is pleaded and shall be relied upon at the trial.

4. The Petitioner is domiciled in Nigeria and this Honourable Court has jurisdiction to
   entertain this Petition by virtue of Section 2(2) of the Matrimonial Causes Act.

5. After the said marriage the parties cohabited at [address] and there are ____ children
   of the marriage, namely:
   (a) [Name], born on __________ ;
   (b) [Name], born on __________ .

6. THE MARRIAGE HAS BROKEN DOWN IRRETRIEVABLY in that:
   (a) Since the marriage the Respondent has behaved in such a way that the Petitioner
       cannot reasonably be expected to live with the Respondent — Section 15(2)(c) of the
       Matrimonial Causes Act. PARTICULARS:
       (i)   [particular];
       (ii)  [particular];
       (iii) [particular].
   (b) The parties have lived apart for a continuous period of at least two (2) years
       immediately preceding the presentation of this Petition and the Respondent does not
       object to a decree being granted — Section 15(2)(e).

7. There have been no previous proceedings in any court in Nigeria or elsewhere with
   reference to the marriage or to any child of the marriage, save as follows: [state or
   write "None"].

8. No collusion or connivance exists between the Petitioner and the Respondent in
   presenting or prosecuting this Petition.

9. The arrangements proposed for the welfare, advancement and education of the children of
   the marriage are as follows: [state proposals].

WHEREFORE the Petitioner PRAYS this Honourable Court for:

(a) A DECREE that the marriage celebrated between the Petitioner and the Respondent on the
    ____ day of __________ be dissolved on the ground that the said marriage has broken
    down irretrievably;
(b) AN ORDER granting custody of the children of the marriage to the Petitioner;
(c) AN ORDER that the Respondent pays the sum of N__________ monthly as maintenance for
    the said children;
(d) AN ORDER for the settlement of the property situate at [address];
(e) SUCH FURTHER OR OTHER ORDERS as this Honourable Court may deem fit to make in the
    circumstances.

DATED this ____ day of __________ 20____.

                                        ______________________________
                                        [Name], Esq.
                                        Petitioner's Counsel
                                        [Firm name and address]

FOR SERVICE ON:
The Respondent,
[address].`,
    },
    {
      id: 'mc-pet-02',
      title: 'Notice of Petition & Verifying Affidavit',
      description:
        'The notice served on the respondent with the petition, together with the affidavit verifying the facts pleaded, as required by the Matrimonial Causes Rules.',
      sampleText: `${HEADING('High Court of ______ State', '______')}

BETWEEN:

[NAME OF PETITIONER] .................................................... PETITIONER
AND
[NAME OF RESPONDENT] ................................................... RESPONDENT

                            NOTICE OF PETITION

TO: The Respondent, [Name], of [address].

TAKE NOTICE that a Petition for the dissolution of your marriage with the Petitioner has
been presented to this Honourable Court, a sealed copy of which is served on you herewith.

IF YOU INTEND TO DEFEND this Petition, or to oppose any of the reliefs sought, you must
enter an Answer within twenty-eight (28) days of the service of this Notice on you,
inclusive of the day of service.

IF YOU FAIL to enter an Answer within the time stated, the Petition may be heard and
determined in your absence and such orders made as the Court thinks fit.

DATED this ____ day of __________ 20____.

                                        ______________________________
                                        Registrar

                          VERIFYING AFFIDAVIT

I, [Name], [occupation], [nationality], of [address], do hereby make oath and state as
follows:

1. That I am the Petitioner in this Petition and by virtue of which I am conversant with
   the facts of this case.

2. That I have read the Petition dated the ____ day of __________ 20____ and the facts
   deposed to therein are true and correct to the best of my knowledge, information and
   belief.

3. That the particulars pleaded in paragraph 6 of the Petition are within my personal
   knowledge and are true.

4. That there is no collusion or connivance between me and the Respondent in the
   presentation or prosecution of this Petition.

5. That I make this affidavit conscientiously believing the contents to be true and
   correct in accordance with the Oaths Act.

                                        ______________________________
                                        DEPONENT

SWORN TO at the High Court Registry, __________
this ____ day of __________ 20____.

                                        ______________________________
                                        COMMISSIONER FOR OATHS`,
    },
  ],

  respondingProcesses: [
    {
      id: 'mc-res-01',
      title: 'Answer to Petition',
      description:
        "The respondent's Answer joining issues with the petition, traversing the particulars of behaviour and responding to the ancillary claims.",
      sampleText: `${HEADING('High Court of ______ State', '______')}

BETWEEN:

[NAME OF PETITIONER] .................................................... PETITIONER
AND
[NAME OF RESPONDENT] ................................................... RESPONDENT

                                   ANSWER

The Respondent, [Name], in Answer to the Petition filed herein, states as follows:

1. The Respondent admits paragraphs 1, 2, 3, 4 and 5 of the Petition.

2. The Respondent denies paragraph 6 of the Petition and each and every particular pleaded
   thereunder, and puts the Petitioner to the strictest proof thereof.

3. In further answer to paragraph 6(a), the Respondent avers that:
   (a) [answer to particular];
   (b) [answer to particular].

4. In further answer to paragraph 6(b), the Respondent avers that the parties have not
   lived apart for a continuous period of two (2) years, the parties having resumed
   cohabitation at [address] between __________ and __________.

5. The Respondent denies that the marriage has broken down irretrievably and avers that the
   marriage is capable of being preserved.

6. In answer to paragraph 9, the Respondent avers that the arrangements proposed by the
   Petitioner for the children are unsatisfactory in that [state grounds], and proposes
   instead that [state counter-proposal].

7. Save as herein expressly admitted, the Respondent denies each and every allegation of
   fact contained in the Petition as if the same were set out seriatim and traversed.

WHEREFORE the Respondent PRAYS this Honourable Court for:

(a) AN ORDER dismissing the Petition in its entirety;
(b) IN THE ALTERNATIVE, AN ORDER granting custody of the children of the marriage to the
    Respondent;
(c) COSTS of this action.

DATED this ____ day of __________ 20____.

                                        ______________________________
                                        [Name], Esq.
                                        Respondent's Counsel`,
    },
    {
      id: 'mc-res-02',
      title: 'Cross-Petition for Dissolution of Marriage',
      description:
        'Filed with the Answer where the respondent also seeks a decree, pleading separate facts evidencing irretrievable breakdown and its own ancillary reliefs.',
      sampleText: `${HEADING('High Court of ______ State', '______')}

BETWEEN:

[NAME OF PETITIONER] .................................................... PETITIONER
AND
[NAME OF RESPONDENT] ................................................... RESPONDENT
                                                                    /CROSS-PETITIONER

                              CROSS-PETITION

The Respondent/Cross-Petitioner repeats paragraphs 1 to 7 of the Answer filed herein and
further states as follows:

1. The marriage between the parties has broken down irretrievably in that since the
   marriage the Petitioner has behaved in such a way that the Respondent cannot reasonably
   be expected to live with the Petitioner — Section 15(2)(c) of the Matrimonial Causes
   Act. PARTICULARS:
   (a) [particular];
   (b) [particular].

2. Further or in the alternative, the Petitioner has deserted the Respondent for a
   continuous period of at least one (1) year immediately preceding the presentation of
   this Cross-Petition — Section 15(2)(d).

3. There is no collusion or connivance between the parties in the presentation or
   prosecution of this Cross-Petition.

WHEREFORE the Respondent/Cross-Petitioner PRAYS this Honourable Court for:

(a) A DECREE dissolving the marriage on the ground that it has broken down irretrievably;
(b) AN ORDER granting custody of the children of the marriage to the Cross-Petitioner;
(c) AN ORDER for maintenance in the sum of N__________ monthly;
(d) AN ORDER for the settlement of the property situate at [address];
(e) COSTS.

DATED this ____ day of __________ 20____.

                                        ______________________________
                                        [Name], Esq.
                                        Counsel to the Respondent/Cross-Petitioner`,
    },
  ],

  preliminaryObjections: [
    {
      id: 'mc-po-01',
      title: 'Notice of Preliminary Objection — Jurisdiction & Domicile',
      description:
        'Challenges the competence of the court where the petitioner is not domiciled in Nigeria, or where the two-year rule in Section 30 of the Act has not been complied with.',
      sampleText: `${HEADING('High Court of ______ State', '______')}

BETWEEN:

[NAME OF PETITIONER] .................................................... PETITIONER
AND
[NAME OF RESPONDENT] ................................................... RESPONDENT

                    NOTICE OF PRELIMINARY OBJECTION

BROUGHT PURSUANT TO SECTIONS 2(2) AND 30(1) OF THE MATRIMONIAL CAUSES ACT CAP M7 LFN 2004
AND UNDER THE INHERENT JURISDICTION OF THIS HONOURABLE COURT.

TAKE NOTICE that this Honourable Court will be moved on the ____ day of __________ 20____
at the hour of 9 o'clock in the forenoon or so soon thereafter as Counsel to the Respondent
may be heard praying this Honourable Court for:

1. AN ORDER striking out this Petition for want of jurisdiction.

2. AND FOR SUCH FURTHER ORDER OR ORDERS as this Honourable Court may deem fit to make.

                              GROUNDS OF OBJECTION

1. The Petitioner is not domiciled in Nigeria at the date of the institution of these
   proceedings, and the Court is therefore without jurisdiction under Section 2(2) of the
   Matrimonial Causes Act.

2. The Petition was presented within two (2) years of the date of the marriage without the
   leave of this Honourable Court having first been sought and obtained, contrary to
   Section 30(1) of the Matrimonial Causes Act.

3. Jurisdiction is a threshold issue which can be raised at any stage, and proceedings
   conducted without jurisdiction, however well conducted, amount to a nullity —
   Madukolu v. Nkemdilim (1962) LDLR (SC) pt 1003.

DATED this ____ day of __________ 20____.

                                        ______________________________
                                        [Name], Esq.
                                        Counsel to the Respondent/Objector`,
    },
    {
      id: 'mc-po-02',
      title: 'Counter Affidavit to Motion for Interim Custody / Maintenance',
      description:
        'Opposes an interlocutory application for interim custody or maintenance pending the determination of the petition, with a supporting written address.',
      sampleText: `${HEADING('High Court of ______ State', '______')}

BETWEEN:

[NAME OF PETITIONER] ....................................... PETITIONER/APPLICANT
AND
[NAME OF RESPONDENT] ..................................... RESPONDENT/RESPONDENT

                            COUNTER AFFIDAVIT

I, [Name], [occupation], [nationality], of [address], do hereby make oath and state as
follows:

1. That I am the Respondent in this Petition and the Respondent to the Motion on Notice
   dated the ____ day of __________ 20____, by virtue of which I am conversant with the
   facts of this case.

2. That I have read the affidavit in support of the Motion on Notice and I depose that
   paragraphs ____, ____ and ____ thereof are false and are hereby denied.

3. That contrary to paragraph ____ of the said affidavit, [state the true facts].

4. That the children of the marriage have resided with me at [address] continuously since
   __________ and are enrolled at [school], where their fees are paid by me. Copies of the
   receipts are attached and marked EXHIBIT "A" — "C".

5. That I am able and willing to provide for the welfare, advancement and education of the
   children of the marriage.

6. That it will not be in the best interest of the children of the marriage for the reliefs
   sought in the Motion on Notice to be granted.

7. That I depose to this Counter Affidavit in good faith, conscientiously believing the
   contents to be true and correct in accordance with the Oaths Act.

                                        ______________________________
                                        DEPONENT

SWORN TO at the High Court Registry, __________
this ____ day of __________ 20____.

                                        ______________________________
                                        COMMISSIONER FOR OATHS

                    WRITTEN ADDRESS IN OPPOSITION

1.0 INTRODUCTION
    This written address is filed in opposition to the Applicant's Motion on Notice dated
    __________ seeking interim custody and maintenance.

2.0 SOLE ISSUE FOR DETERMINATION
    Whether, having regard to the paramountcy of the welfare of the children of the
    marriage, the Applicant has placed sufficient material before this Honourable Court to
    warrant the grant of the reliefs sought.

3.0 ARGUMENT
    3.1 It is settled that in all questions touching the custody of children, the welfare
        of the child is the first, paramount and only consideration — Section 71(1) of the
        Matrimonial Causes Act.
    3.2 The Applicant has not controverted the fact that the children have been in the
        custody of the Respondent since __________ and are settled in school.
    3.3 An interlocutory order ought not to disturb a settled status quo where doing so
        would prejudice the welfare of the children.

4.0 CONCLUSION
    We respectfully urge this Honourable Court to refuse the application and dismiss the
    same with substantial costs.

DATED this ____ day of __________ 20____.

                                        ______________________________
                                        [Name], Esq.
                                        Counsel to the Respondent`,
    },
  ],

  governingLaws: [
    {
      title: 'Matrimonial Causes Act',
      citation: 'Cap M7 Laws of the Federation of Nigeria 2004',
      kind: 'Act',
      note: 'The principal Act. Section 15 provides the single ground — irretrievable breakdown — and Section 15(2)(a)–(h) the facts by which it is proved. Section 30 imposes the two-year rule; Sections 70–73 govern maintenance and settlement of property.',
    },
    {
      title: 'Matrimonial Causes Rules',
      citation: '1983',
      kind: 'Rules',
      note: 'Procedure for petitions, answers and cross-petitions, verifying affidavits, service, and the interval between decree nisi and decree absolute.',
    },
    {
      title: 'Marriage Act',
      citation: 'Cap M6 Laws of the Federation of Nigeria 2004',
      kind: 'Act',
      note: 'Governs the celebration and validity of statutory marriage. Relevant to nullity petitions and to proof that the marriage is one under the Act.',
    },
    {
      title: 'Child Rights Act',
      citation: '2003',
      kind: 'Act',
      note: 'Reinforces the paramountcy of the best interests of the child in custody, access and maintenance proceedings, where domesticated by the relevant State.',
    },
    {
      title: 'Constitution of the Federal Republic of Nigeria',
      citation: '1999 (as amended), Section 272',
      kind: 'Constitution',
      note: 'Confers on the State High Court unlimited jurisdiction in civil proceedings, including matrimonial causes.',
    },
  ],

  articles: [
    {
      id: 'mc-art-01',
      title: 'Proving Irretrievable Breakdown: The Facts Under Section 15(2) in Practice',
      author: 'LAWPEX Editorial Board',
      readTimeMinutes: 9,
      excerpt:
        'There is only one ground for dissolution of a statutory marriage in Nigeria. Everything else is evidence. This article works through each of the eight facts and what a court actually expects to see pleaded and proved.',
      body: `## One ground, eight facts

Section 15(1) of the Matrimonial Causes Act is deceptively short: a petition for a decree of dissolution of marriage may be presented on the ground that the marriage has broken down irretrievably. That is the only ground. Practitioners who plead "adultery" or "desertion" as grounds have already misconceived the petition.

What Section 15(2) supplies is a closed list of facts, proof of any one of which entitles the court to hold that the marriage has broken down irretrievably.

## The facts most often pleaded

**Section 15(2)(b) — adultery and intolerability.** Two limbs, both of which must be proved. It is not enough that the respondent committed adultery; the petitioner must also show that he or she finds it intolerable to live with the respondent. Continued cohabitation for more than six months after discovery is fatal.

**Section 15(2)(c) — behaviour.** The most frequently pleaded fact and the most frequently pleaded badly. The test is objective and subjective at once: has the respondent behaved in such a way that this petitioner cannot reasonably be expected to live with the respondent? Particulars must be specific — dates, places, words spoken. A pleading that the respondent was "wicked and unbearable" particularises nothing.

**Section 15(2)(d) — desertion for one year.** Requires the factum of separation, the animus deserendi, absence of consent and absence of just cause. Constructive desertion — where the conduct of the party remaining drove the other out — is available but must be pleaded.

**Section 15(2)(e) and (f) — living apart.** Two years with consent, three years without. "Living apart" is not merely living at different addresses; it imports the ending of consortium. Parties under one roof may be living apart if the household has ceased to function as one.

## What the court will not do

The court may not make a decree absolute where the arrangements for the welfare, advancement and education of the children of the marriage are unsatisfactory. Counsel who treat paragraph 9 of the petition as a formality find the decree nisi stranded.

## Practice points

1. Plead the ground once, then plead the facts relied upon and particularise each.
2. Do not plead facts you cannot prove — an unproved particular damages the credibility of the rest.
3. Check Section 30 before filing: a petition presented within two years of the marriage needs leave.
4. Diarise the interval between decree nisi and decree absolute. The marriage subsists until the decree is made absolute, with every consequence that follows for remarriage and succession.`,
    },
    {
      id: 'mc-art-02',
      title: 'Ancillary Relief: Maintenance, Custody and Settlement of Property',
      author: 'LAWPEX Editorial Board',
      readTimeMinutes: 7,
      excerpt:
        'The decree is often the easy part. This article covers the ancillary reliefs that decide what the parties actually walk away with, and how to plead them so they are not lost.',
      body: `## Ancillary relief must be claimed

A court will not grant what has not been asked for. Claims for maintenance, custody and settlement of property are ancillary to the petition and must appear in the prayers. Counsel who obtain a decree and then attempt to open a fresh action for property find themselves met with objections.

## Maintenance — Sections 70 and 71

The court may order such periodic or lump-sum maintenance as it thinks proper, having regard to the means, earning capacity and conduct of the parties and all the circumstances of the case. Evidence of means matters: bank statements, pay slips, and evidence of the standard of living enjoyed during the marriage.

## Custody — the paramountcy principle

In proceedings touching the custody of children of the marriage, the welfare of the child is the first and paramount consideration. Age, the child's own wishes where old enough, continuity of schooling, and the character of each parent are all weighed. Courts are reluctant to disturb a settled arrangement on an interlocutory application.

## Settlement of property — Section 72

The court may order a settlement of property for the benefit of the other party and the children. The section is wide, but the applicant must identify the property with precision and place before the court evidence of contribution, whether financial or otherwise.

## Practice points

1. Plead each ancillary relief separately and specifically; do not rely on the omnibus prayer.
2. Identify property by address and, where available, by title documents.
3. Put means in evidence early — the court cannot order what it has no material to quantify.
4. Where an interim order is needed, file the motion with the petition rather than months later.`,
    },
  ],

  caseIds: ['case-015', 'case-016'],

  practicals: [
    {
      id: 'mc-prac-01',
      title: 'Courtroom Procedure: Hearing an Undefended Petition for Dissolution',
      duration: '18 min',
      instructor: 'LAWPEX Practical Series',
      summary:
        'The full sequence from announcing appearances to moving for a decree nisi where the respondent has not entered an Answer, including the evidence the court expects on the children of the marriage.',
      steps: [
        'Announce appearances: "May it please this Honourable Court, [Name] appearing for the Petitioner. The Respondent is unrepresented and has not entered an Answer."',
        'Draw the court\'s attention to the proof of service of the Petition and Notice of Petition, and to the affidavit of service filed in the registry.',
        'Confirm the petition is not caught by Section 30 — that two years have elapsed since the marriage or that leave was obtained.',
        'Call the Petitioner into the witness box; the Petitioner adopts the verifying affidavit and gives evidence-in-chief on the facts pleaded under Section 15(2).',
        'Tender the Certificate of Marriage; it is admitted and marked as an exhibit.',
        'Lead evidence on the arrangements proposed for the welfare, advancement and education of the children of the marriage.',
        'Where corroboration is needed, call the second witness and lead the same in evidence-in-chief.',
        'Address the court briefly on the fact relied upon and the sufficiency of the arrangements for the children.',
        'Move the court for a decree nisi dissolving the marriage, together with the ancillary reliefs claimed in the prayers.',
        'Take a date for the decree to be made absolute and diarise the interval; the marriage subsists until then.',
      ],
    },
    {
      id: 'mc-prac-02',
      title: 'Courtroom Procedure: Moving a Preliminary Objection on Domicile',
      duration: '12 min',
      instructor: 'LAWPEX Practical Series',
      summary:
        'How a jurisdictional objection is taken in a matrimonial cause, from raising it in limine to addressing the court on the effect of a want of jurisdiction.',
      steps: [
        'Raise the objection in limine, before the petition is opened, and inform the court that a Notice of Preliminary Objection has been filed and served.',
        'Confirm the date of service on the Petitioner and that the Petitioner has had the opportunity to respond.',
        'Move the objection: identify the relief sought — an order striking out the petition — and the grounds.',
        'Take the court through the affidavit in support and any exhibits establishing that the Petitioner is not domiciled in Nigeria.',
        'Adopt the written address and highlight the two or three authorities that carry the point, principally Madukolu v. Nkemdilim on the requirements of competence.',
        'Deal with the Petitioner\'s counter affidavit, identifying the paragraphs that are not properly controverted.',
        'Address the court on consequence: proceedings conducted without jurisdiction are a nullity however well conducted.',
        'Urge the court to strike out rather than dismiss, jurisdiction not having been assumed to determine the merits.',
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Generic bundle builder for every other area of law
// ---------------------------------------------------------------------------

/** Areas where the parties are not simply Claimant and Defendant. */
const PARTY_LABELS: Record<string, { initiating: string; responding: string }> = {
  'matrimonial-causes': { initiating: 'Petitioner', responding: 'Respondent' },
  'family-law': { initiating: 'Applicant', responding: 'Respondent' },
  'election-petitions': { initiating: 'Petitioner', responding: 'Respondent' },
  'human-rights': { initiating: 'Applicant', responding: 'Respondent' },
  'constitutional-law': { initiating: 'Applicant', responding: 'Respondent' },
  'criminal-law': { initiating: 'Complainant / Prosecution', responding: 'Defendant' },
  'probate-estates': { initiating: 'Applicant', responding: 'Respondent' },
  'arbitration-adr': { initiating: 'Claimant', responding: 'Respondent' },
  'labour-employment': { initiating: 'Claimant', responding: 'Defendant' },
};

const partyLabelsFor = (areaId: string) =>
  PARTY_LABELS[areaId] ?? { initiating: 'Claimant', responding: 'Defendant' };

const demandLetterFor = (area: AreaOfLaw): AreaDraftResource => ({
  id: `${area.id}-demand-01`,
  title: `Letter of Demand / Memorandum of Claim — ${area.title}`,
  description: `Pre-action letter of demand setting out the claim in ${area.title.toLowerCase()}, the legal basis relied upon and the time allowed for compliance before proceedings are commenced.`,
  sampleText: `[FIRM LETTERHEAD]

Our Ref: ____________                                    Date: ______________

[Name of Addressee]
[Address]

Dear Sir/Madam,

RE: LETTER OF DEMAND — ${area.title.toUpperCase()}

We act as Solicitors to [Name of Client] (hereinafter "our client"), on whose express
instructions we write to you.

1. Our client instructs us that [set out the transaction, relationship or event giving rise
   to the claim, with dates].

2. Our client further instructs us that [set out the breach, default or wrong complained
   of, with particulars].

3. By reason of the foregoing our client has suffered loss and damage particularised as
   follows:
   (a) [head of claim] .................................... N__________
   (b) [head of claim] .................................... N__________
       TOTAL ............................................. N__________

4. Our client's claim is founded on ${area.applicableStatutes[0] ?? 'the applicable statute'}
   and on the settled principles governing ${area.title.toLowerCase()}.

WE ARE THEREFORE INSTRUCTED TO DEMAND, as we hereby do, that within fourteen (14) days of
the receipt of this letter you:

(a) Pay to our client the sum of N__________ ;
(b) [state any non-monetary step demanded]; and
(c) Confirm your compliance in writing to the undersigned.

TAKE NOTICE that upon your failure to comply within the time stipulated, we have our
client's firm instructions to commence proceedings against you without further recourse to
you, and to claim in addition interest and the full costs of the action.

This letter is written without prejudice to our client's rights and remedies, all of which
are expressly reserved.

Yours faithfully,

______________________
[Name], Esq.
For: [Firm Name]`,
});

const initiatingProcessesFor = (area: AreaOfLaw): AreaDraftResource[] => {
  const { initiating, responding } = partyLabelsFor(area.id);
  const statute = area.applicableStatutes[0] ?? 'the applicable statute';
  const rule = area.keyRules[0] ?? 'the applicable Rules of Court';

  return [
    {
      id: `${area.id}-init-01`,
      title: `Originating Process — ${area.title}`,
      description: `The process by which a ${initiating.toLowerCase()} commences an action in ${area.title.toLowerCase()}, with the reliefs commonly sought.`,
      sampleText: `${HEADING('High Court of ______ State', '______')}

BETWEEN:

[NAME] .............................................. ${initiating.toUpperCase()}

AND

[NAME] .............................................. ${responding.toUpperCase()}

                    ORIGINATING PROCESS / STATEMENT OF CLAIM

1. The ${initiating} is [describe] resident within the jurisdiction of this Honourable
   Court.

2. The ${responding} is [describe] resident within the jurisdiction of this Honourable
   Court.

3. This Honourable Court has jurisdiction to entertain this action by virtue of
   ${statute} and Section 272 of the Constitution of the Federal Republic of Nigeria 1999
   (as amended).

4. [Plead the facts founding the cause of action, chronologically and in numbered
   paragraphs. Plead documents and give notice to produce where necessary.]

5. [Plead the breach, default or wrong complained of, with full particulars.]

6. [Plead loss and damage, with particulars of special damages where claimed.]

7. The ${initiating} pleads and shall rely at the trial on the following documents:
   (a) [document];
   (b) [document].

WHEREFORE the ${initiating} claims against the ${responding} as follows:

(a) A DECLARATION that [state];
(b) AN ORDER that [state];
(c) The sum of N__________ being [state the basis of the monetary claim];
(d) Interest thereon at the rate of ____% per annum from __________ until judgment and
    thereafter at ____% until final liquidation;
(e) Cost of this action.

DATED this ____ day of __________ 20____.

                                        ______________________________
                                        [Name], Esq.
                                        Counsel to the ${initiating}

FOR SERVICE ON:
The ${responding},
[address].`,
    },
    {
      id: `${area.id}-init-02`,
      title: `Motion on Notice with Supporting Affidavit — ${area.title}`,
      description: `Interlocutory application commonly brought by a ${initiating.toLowerCase()} in ${area.title.toLowerCase()} proceedings, with affidavit in support and written address.`,
      sampleText: `${HEADING('High Court of ______ State', '______')}

BETWEEN:

[NAME] ............................................ ${initiating.toUpperCase()}/APPLICANT
AND
[NAME] ........................................... ${responding.toUpperCase()}/RESPONDENT

                              MOTION ON NOTICE

BROUGHT PURSUANT TO ${rule.toUpperCase()} AND UNDER THE INHERENT JURISDICTION OF THIS
HONOURABLE COURT.

TAKE NOTICE that this Honourable Court will be moved on the ____ day of __________ 20____
at the hour of 9 o'clock in the forenoon or so soon thereafter as Counsel to the Applicant
may be heard praying this Honourable Court for:

1. AN ORDER [state the principal relief sought];
2. AND FOR SUCH FURTHER ORDER OR ORDERS as this Honourable Court may deem fit to make in
   the circumstances.

DATED this ____ day of __________ 20____.

                                        ______________________________
                                        [Name], Esq.
                                        Counsel to the Applicant

                            AFFIDAVIT IN SUPPORT

I, [Name], [occupation], [nationality], of [address], do hereby make oath and state as
follows:

1. That I am the Applicant in this application by virtue of which I am conversant with the
   facts of this case.
2. That [depose to the facts founding the application, one fact per paragraph].
3. That [exhibit the documents relied upon and mark them EXHIBIT "A", "B" etc.].
4. That it is in the interest of justice that this application be granted.
5. That I depose to this affidavit in good faith, conscientiously believing the contents to
   be true in accordance with the Oaths Act.

                                        ______________________________
                                        DEPONENT

SWORN TO at the High Court Registry, __________
this ____ day of __________ 20____.

                                        ______________________________
                                        COMMISSIONER FOR OATHS`,
    },
  ];
};

const respondingProcessesFor = (area: AreaOfLaw): AreaDraftResource[] => {
  const { initiating, responding } = partyLabelsFor(area.id);

  return [
    {
      id: `${area.id}-resp-01`,
      title: `Statement of Defence — ${area.title}`,
      description: `The ${responding.toLowerCase()}'s defence joining issues on the pleadings and traversing the claim.`,
      sampleText: `${HEADING('High Court of ______ State', '______')}

BETWEEN:

[NAME] .............................................. ${initiating.toUpperCase()}
AND
[NAME] .............................................. ${responding.toUpperCase()}

                            STATEMENT OF DEFENCE

1. The ${responding} admits paragraphs ____, ____ and ____ of the Statement of Claim.

2. The ${responding} denies paragraphs ____, ____ and ____ of the Statement of Claim and
   puts the ${initiating} to the strictest proof thereof.

3. In further answer to paragraph ____, the ${responding} avers that [state the true
   position].

4. The ${responding} avers that [plead any positive case, including any statutory defence
   or limitation point].

5. The ${responding} shall contend at the trial that [state the legal contention].

6. Save as herein expressly admitted, the ${responding} denies each and every allegation of
   fact contained in the Statement of Claim as if the same were herein set out seriatim and
   specifically traversed.

WHEREFORE the ${responding} urges this Honourable Court to dismiss this suit in its
entirety with substantial costs.

DATED this ____ day of __________ 20____.

                                        ______________________________
                                        [Name], Esq.
                                        Counsel to the ${responding}`,
    },
    {
      id: `${area.id}-resp-02`,
      title: `Counter-Claim — ${area.title}`,
      description: `Filed with the defence where the ${responding.toLowerCase()} has its own cause of action arising from the same transaction.`,
      sampleText: `${HEADING('High Court of ______ State', '______')}

                                COUNTER-CLAIM

The ${responding}/Counter-Claimant repeats paragraphs 1 to ____ of the Statement of Defence
and further avers as follows:

1. [Plead the facts founding the counter-claim.]

2. [Plead the breach or wrong relied upon, with particulars.]

3. [Plead the loss and damage suffered, with particulars.]

WHEREFORE the ${responding}/Counter-Claimant claims against the ${initiating}/Defendant to
the Counter-Claim as follows:

(a) A DECLARATION that [state];
(b) The sum of N__________ being [state];
(c) Interest at ____% per annum from __________ until final liquidation;
(d) Cost of this Counter-Claim.

DATED this ____ day of __________ 20____.

                                        ______________________________
                                        [Name], Esq.
                                        Counsel to the ${responding}/Counter-Claimant`,
    },
  ];
};

const preliminaryObjectionsFor = (area: AreaOfLaw): AreaDraftResource[] => {
  const { initiating, responding } = partyLabelsFor(area.id);

  return [
    {
      id: `${area.id}-po-01`,
      title: `Notice of Preliminary Objection — ${area.title}`,
      description:
        'Challenges the competence of the suit on jurisdiction, locus standi, limitation, non-compliance with a condition precedent or want of proper parties.',
      sampleText: `${HEADING('High Court of ______ State', '______')}

BETWEEN:

[NAME] .............................................. ${initiating.toUpperCase()}
AND
[NAME] .................................... ${responding.toUpperCase()}/OBJECTOR

                    NOTICE OF PRELIMINARY OBJECTION

BROUGHT PURSUANT TO THE RULES OF THIS HONOURABLE COURT AND UNDER ITS INHERENT
JURISDICTION.

TAKE NOTICE that this Honourable Court will be moved on the ____ day of __________ 20____
at the hour of 9 o'clock in the forenoon or so soon thereafter as Counsel to the Objector
may be heard praying this Honourable Court for:

1. AN ORDER striking out / dismissing this suit for want of jurisdiction.
2. AND FOR SUCH FURTHER ORDER OR ORDERS as this Honourable Court may deem fit to make.

                              GROUNDS OF OBJECTION

1. This Honourable Court lacks the jurisdiction to entertain this suit, the subject matter
   falling outside the jurisdiction conferred by ${area.applicableStatutes[0] ?? 'the enabling statute'}.

2. The ${initiating} lacks the locus standi to institute this action, having disclosed no
   sufficient interest in the subject matter.

3. The suit is statute-barred, the cause of action having accrued on __________ and the
   suit having been commenced on __________, outside the period prescribed by the
   applicable Limitation Law.

4. The ${initiating} failed to comply with a condition precedent to the institution of this
   action, namely [state, e.g. pre-action notice].

5. Jurisdiction is threshold and may be raised at any time; proceedings conducted without
   jurisdiction are a nullity however well conducted — Madukolu v. Nkemdilim (1962) LDLR (SC) pt 1003
   341.

DATED this ____ day of __________ 20____.

                                        ______________________________
                                        [Name], Esq.
                                        Counsel to the Objector`,
    },
    {
      id: `${area.id}-po-02`,
      title: `Counter Affidavit & Written Address in Opposition — ${area.title}`,
      description:
        'Opposes an interlocutory application on the facts and in law, controverting the affidavit in support paragraph by paragraph.',
      sampleText: `${HEADING('High Court of ______ State', '______')}

BETWEEN:

[NAME] ................................................ APPLICANT
AND
[NAME] ................................................ RESPONDENT

                            COUNTER AFFIDAVIT

I, [Name], [occupation], [nationality], of [address], do hereby make oath and state as
follows:

1. That I am the Respondent to the Motion on Notice dated __________ by virtue of which I
   am conversant with the facts of this case.

2. That I have read the affidavit in support of the said Motion and paragraphs ____, ____
   and ____ thereof are false and are hereby specifically denied.

3. That contrary to paragraph ____ of the said affidavit, [state the true facts].

4. That [exhibit the documents relied upon and mark them EXHIBIT "A", "B" etc.].

5. That it is not in the interest of justice that the application be granted.

6. That I depose to this Counter Affidavit in good faith, conscientiously believing the
   contents to be true in accordance with the Oaths Act.

                                        ______________________________
                                        DEPONENT

SWORN TO at the High Court Registry, __________
this ____ day of __________ 20____.

                                        ______________________________
                                        COMMISSIONER FOR OATHS

                    WRITTEN ADDRESS IN OPPOSITION

1.0 INTRODUCTION
    This address is filed in opposition to the Applicant's Motion on Notice dated
    __________ .

2.0 ISSUE FOR DETERMINATION
    Whether the Applicant has placed sufficient material before this Honourable Court to
    warrant the exercise of its discretion in the Applicant's favour.

3.0 ARGUMENT
    3.1 [State the first argument and cite the authority relied upon.]
    3.2 Facts deposed to in an affidavit which are not specifically controverted are deemed
        admitted; conversely, the paragraphs controverted herein cannot be relied upon.
    3.3 [State the second argument.]

4.0 CONCLUSION
    We respectfully urge this Honourable Court to refuse the application and to dismiss the
    same with substantial costs.

DATED this ____ day of __________ 20____.

                                        ______________________________
                                        [Name], Esq.
                                        Counsel to the Respondent`,
    },
  ];
};

const governingLawsFor = (area: AreaOfLaw): AreaGoverningLaw[] => [
  ...area.applicableStatutes.map<AreaGoverningLaw>((statute) => ({
    title: statute,
    citation: 'Laws of the Federation of Nigeria',
    kind: 'Act',
    note: `Principal legislation applied in ${area.title.toLowerCase()} proceedings.`,
  })),
  ...area.keyRules.map<AreaGoverningLaw>((rule) => ({
    title: rule,
    citation: 'Rules of Court',
    kind: 'Rules',
    note: `Governs practice and procedure for ${area.title.toLowerCase()} matters, including the form of processes, time limits and service.`,
  })),
  {
    title: 'Constitution of the Federal Republic of Nigeria',
    citation: '1999 (as amended)',
    kind: 'Constitution',
    note: 'Confers jurisdiction on the relevant court and guarantees the right to fair hearing under Section 36.',
  },
  {
    title: 'Evidence Act',
    citation: '2011',
    kind: 'Act',
    note: 'Governs admissibility, burden and standard of proof — including Section 84 on computer-generated evidence.',
  },
];

const articlesFor = (area: AreaOfLaw): AreaArticle[] => [
  {
    id: `${area.id}-art-01`,
    title: `${area.title}: Principles, Procedure and Practice`,
    author: 'LAWPEX Editorial Board',
    readTimeMinutes: 8,
    excerpt: area.description,
    body: `## Overview

${area.description}

## The principles that decide these cases

${area.principlesOfLaw.map((principle, index) => `**${index + 1}.** ${principle}`).join('\n\n')}

## Where the law is found

The practitioner in this area works principally from ${area.applicableStatutes.join(', ')}${
      area.keyRules.length ? `, together with ${area.keyRules.join(', ')}` : ''
    }. Jurisdiction and fair hearing are governed by the Constitution of the Federal Republic of Nigeria 1999 (as amended), and questions of admissibility by the Evidence Act 2011.

## Running the matter

${area.checklists.map((step, index) => `**Step ${index + 1}.** ${step}`).join('\n\n')}

## Topics that recur

${area.popularTopics.map((topic) => `- ${topic}`).join('\n')}`,
  },
];

const practicalsFor = (area: AreaOfLaw): AreaPractical[] => [
  {
    id: `${area.id}-prac-01`,
    title: `Courtroom Procedure: Conducting a ${area.title} Matter`,
    duration: '15 min',
    instructor: 'LAWPEX Practical Series',
    summary: `The sequence followed in court in a ${area.title.toLowerCase()} matter, from announcing appearances through to final address.`,
    steps: [
      'Announce appearances and confirm the parties represented before the court.',
      'Confirm service of the originating process and draw the court to the affidavit of service in the file.',
      'Dispose of any preliminary objection taken in limine before the substantive matter is opened.',
      ...area.checklists.slice(0, 3),
      'Open the case and lead the first witness in evidence-in-chief; tender and mark the documents pleaded.',
      'Cross-examine the opposing witness on the paragraphs of the pleadings joined in issue.',
      'Close the case, take a date for written addresses and confirm the timetable ordered by the court.',
      'Adopt the written address on the return date and respond to questions from the bench.',
    ],
  },
];

/** Case ids drawn from the judgment library that belong to this area. */
const caseIdsFor = (area: AreaOfLaw): string[] =>
  LANDMARK_CASES.filter(
    (judgment) =>
      judgment.areaOfLaw.toLowerCase() === area.title.toLowerCase() ||
      judgment.areaOfLaw.toLowerCase().includes(area.title.toLowerCase()) ||
      area.title.toLowerCase().includes(judgment.areaOfLaw.toLowerCase()),
  ).map((judgment) => judgment.id);

const buildBundle = (area: AreaOfLaw): AreaResourceBundle => ({
  partyLabels: partyLabelsFor(area.id),
  demandLetters: [demandLetterFor(area)],
  initiatingProcesses: initiatingProcessesFor(area),
  respondingProcesses: respondingProcessesFor(area),
  preliminaryObjections: preliminaryObjectionsFor(area),
  governingLaws: governingLawsFor(area),
  articles: articlesFor(area),
  caseIds: caseIdsFor(area),
  practicals: practicalsFor(area),
});

/** Bundles keyed by area id. Authored content overrides the generated scaffold. */
const AUTHORED: Record<string, Partial<AreaResourceBundle>> = {
  'matrimonial-causes': MATRIMONIAL,
};

export const AREA_RESOURCES: Record<string, AreaResourceBundle> = Object.fromEntries(
  AREAS_OF_LAW.map((area) => {
    const generated = buildBundle(area);
    const authored = AUTHORED[area.id];
    const bundle: AreaResourceBundle = authored ? { ...generated, ...authored } : generated;

    // Authored bundles still inherit any judgments matched from the case library.
    if (authored && !authored.caseIds?.length) bundle.caseIds = generated.caseIds;

    return [area.id, bundle];
  }),
);

export const resourcesForArea = (areaId: string): AreaResourceBundle | undefined =>
  AREA_RESOURCES[areaId];
