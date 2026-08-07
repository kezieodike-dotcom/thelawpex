import { AreaDraftResource } from '../types';

/**
 * The Appeals Centre.
 *
 * Two halves: the law of the right to appeal — where the right comes from, when it is
 * exercisable as of right, and when leave must first be obtained — and the sample
 * appeal processes for each rung of the appellate ladder.
 */

export interface AppealRight {
  id: string;
  title: string;
  constitutionalBasis: string;
  summary: string;
  /** When the right arises, in the words a practitioner would use. */
  whenItApplies: string[];
  timeframe: string;
  practiceNotes: string[];
}

export const APPEAL_RIGHTS: AppealRight[] = [
  {
    id: 'right-of-appeal',
    title: 'Right of Appeal',
    constitutionalBasis: 'Sections 233, 240, 241, 242, 243 and 246, CFRN 1999 (as amended)',
    summary:
      'A right of appeal is a creature of statute. It exists only where the Constitution or an Act confers it — it is not inherent, and it cannot be conferred by the consent of the parties or by the practice of the court. The first question in any appeal is therefore not whether the decision was wrong, but whether a right of appeal against it exists at all, and in whom it is vested.',
    whenItApplies: [
      'A party to the proceedings in the court below has a right of appeal against a decision affecting them.',
      'A person having an interest in the matter may appeal with the leave of the court below or of the appellate court, as an interested party under Section 243(a) of the Constitution.',
      'The Attorney-General of the Federation or of a State may appeal in the circumstances the Constitution and the relevant Act allow.',
      'A right of appeal against a decision of the National Industrial Court lies to the Court of Appeal as of right on questions of fundamental rights arising from labour matters and on criminal causes, and otherwise only with leave.',
      'No appeal lies against a consent judgment, or against an award of costs alone, except with the leave of the court.',
    ],
    timeframe:
      'The right must be exercised within the time the Constitution or the Act prescribes; out of time, an extension must first be sought and obtained.',
    practiceNotes: [
      'Identify the exact provision conferring the right before drafting a single ground of appeal — an appeal brought without a right of appeal is incompetent and will be struck out for want of jurisdiction.',
      'A decision that is not final is interlocutory, and the shorter time limit and, often, the requirement of leave apply to it.',
      'Where the right is doubtful, file the notice of appeal and, in the alternative, an application for leave and for extension of time — the trinity prayers — so that the appeal is not lost on a technicality.',
    ],
  },
  {
    id: 'appeal-as-of-right',
    title: 'Appeal as of Right',
    constitutionalBasis: 'Section 241(1) CFRN (to the Court of Appeal); Section 233(2) CFRN (to the Supreme Court)',
    summary:
      'In the cases the Constitution lists, an appeal lies without the leave of any court. The appellant simply files the notice of appeal within time. The categories are exhaustive, and the courts construe them strictly — a ground of appeal that only appears to raise law, but in truth invites a re-examination of the facts, will not sustain an appeal brought as of right.',
    whenItApplies: [
      'Final decisions of a High Court, the Federal High Court or the National Industrial Court sitting at first instance, in any civil or criminal proceedings — Section 241(1)(a).',
      'Where the ground of appeal involves questions of law alone, in a decision in any civil or criminal proceedings — Section 241(1)(b).',
      'Decisions on the interpretation or application of the Constitution — Section 241(1)(c).',
      'Decisions on whether any provision of Chapter IV (fundamental rights) has been, is being, or is likely to be contravened in relation to the appellant — Section 241(1)(d).',
      'A decision in a criminal cause in which sentence of death has been imposed — Section 241(1)(e).',
      'To the Supreme Court: appeals from the Court of Appeal on questions of law alone, on the interpretation or application of the Constitution, on Chapter IV rights, and in criminal proceedings where the Court of Appeal has affirmed a sentence of death — Section 233(2).',
    ],
    timeframe:
      'Interlocutory decision: 14 days. Final decision in a civil cause: 3 months. Criminal cause: 90 days. Time runs from the date the decision complained of was delivered.',
    practiceNotes: [
      'A ground of law alone is one that can be decided on the record without any re-evaluation of evidence; a ground of mixed law and fact requires leave.',
      'The distinction between a final and an interlocutory decision turns on whether the decision finally disposes of the rights of the parties — not on the stage of the proceedings at which it was given.',
      'Where several grounds are filed and only some are of law alone, leave is required for the others; the safe course is to seek leave for the whole appeal.',
    ],
  },
  {
    id: 'leave-to-appeal',
    title: 'Leave to Appeal',
    constitutionalBasis: 'Sections 242 and 233(3) CFRN; Order 6, Court of Appeal Rules; Order 2, Supreme Court Rules',
    summary:
      'Where the appeal is not one of the cases in which it lies as of right, leave must first be obtained — from the court below in the first instance, and from the appellate court only where the court below has refused it. Leave is also the gateway for an appellant who is out of time, and for a person who was not a party but has an interest in the matter.',
    whenItApplies: [
      'Grounds of appeal that raise questions of fact, or of mixed law and fact.',
      'Interlocutory decisions not falling within the Section 241(1) categories.',
      'An appeal by a person having an interest in the matter who was not a party in the court below.',
      'An appeal against an order as to costs alone, or against a decision made with the consent of the parties.',
      'Where the time prescribed for appealing has expired — leave to appeal out of time, together with an extension of time.',
    ],
    timeframe:
      'The application for leave is made within the period allowed for appealing. Where that period has expired, the application must join a prayer for extension of time within which to seek leave.',
    practiceNotes: [
      'The "trinity prayers": (1) extension of time within which to seek leave to appeal; (2) leave to appeal; (3) extension of time within which to appeal. They are sought in that order in a single motion, supported by an affidavit and the proposed notice of appeal exhibited.',
      'The affidavit must show good and substantial reasons for the delay, and the proposed grounds must prima facie show good cause why the appeal should be heard — both limbs must be satisfied; neither alone is enough.',
      'Apply to the court below first. An application made directly to the appellate court without the court below having refused it, or without special circumstances shown, is liable to be refused.',
    ],
  },
];

// ---------------------------------------------------------------------------
// The appellate ladders and their sample processes
// ---------------------------------------------------------------------------

export interface AppealLadder {
  id: string;
  title: string;
  fromCourt: string;
  toCourt: string;
  summary: string;
  /** Where the practitioner should be careful — including where the brief and the law differ. */
  note?: string;
  timeframe: string;
  requirements: string[];
  drafts: AreaDraftResource[];
}

const SIGN_OFF = (role: string) => `Dated this ______ day of ____________________, 20____.

                                        ______________________________
                                        [Name of Counsel], Esq.
                                        ${role}
                                        [Firm Name]
                                        [Address for Service]
                                        [Email] • [Phone]`;

export const APPEAL_LADDERS: AppealLadder[] = [
  {
    id: 'magistrate-to-high-court',
    title: 'Magistrate Court to the High Court',
    fromCourt: 'Magistrate Court',
    toCourt: 'High Court of the State',
    summary:
      'An appeal from a Magistrate Court lies to the High Court of the State in which the Magistrate Court sits. It is by way of rehearing on the record, and is commenced by a notice of appeal filed in the registry of the Magistrate Court.',
    timeframe:
      'Notice of appeal within 30 days of the decision, unless the Magistrates’ Courts Law of the state prescribes otherwise. Record of appeal compiled and transmitted by the registrar within 60 days.',
    requirements: [
      'File the notice of appeal in the registry of the Magistrate Court that gave the decision, not in the High Court.',
      'Enter into a recognisance, or deposit the sum the Court fixes, as security for the costs of the appeal.',
      'Apply for a certified true copy of the record of proceedings and of the judgment appealed against.',
      'Where execution has issued or is threatened, apply for a stay of execution in the Magistrate Court first.',
    ],
    drafts: [
      {
        id: 'appeal-mag-hc-notice',
        title: 'Notice of Appeal — Magistrate Court to the High Court',
        description:
          'The originating process of the appeal, filed in the registry of the Magistrate Court, setting out the grounds of appeal and the relief sought from the High Court.',
        sampleText: `IN THE MAGISTRATE COURT OF ______________ STATE
IN THE ______________ MAGISTERIAL DISTRICT
HOLDEN AT ______________

                                                        SUIT NO: ______________
                                                        APPEAL NO: ______________

BETWEEN:

[NAME OF APPELLANT] ................................................ APPELLANT
   (Defendant at the Magistrate Court)

AND

[NAME OF RESPONDENT] ............................................ RESPONDENT
   (Claimant at the Magistrate Court)

                              NOTICE OF APPEAL

TAKE NOTICE that the Appellant, being dissatisfied with the decision of the Magistrate
Court of ______________ State, holden at ______________, contained in the judgment of
His/Her Worship ______________, Esq., Chief Magistrate/Magistrate Grade ____, delivered
on the ____ day of __________, 20____, doth hereby appeal to the High Court of
______________ State upon the grounds set out in paragraph 3 below, and will at the
hearing of this appeal seek the relief set out in paragraph 4.

AND the Appellant further states that the names and addresses of the persons directly
affected by the appeal are those set out in paragraph 5.

1. PART OF THE DECISION COMPLAINED OF: The whole decision.

2. DATE OF THE DECISION APPEALED AGAINST: ____ day of __________, 20____.

3. GROUNDS OF APPEAL

GROUND ONE
The learned trial Magistrate erred in law when he/she assumed jurisdiction over the
suit, the subject matter thereof being title to land, which is outside the jurisdiction
of the Magistrate Court.

PARTICULARS OF ERROR
(a) The Claimant's particulars of claim put the ownership of the land at ______________
    directly in issue.
(b) The Magistrates' Courts Law of ______________ State expressly excludes from the
    jurisdiction of the Court any cause relating to the title to land.
(c) Jurisdiction is a threshold matter, and proceedings conducted without it are a
    nullity however well conducted.

GROUND TWO
The judgment is against the weight of evidence.

PARTICULARS
(a) The Appellant tendered Exhibits ____ and ____, which the learned trial Magistrate
    did not evaluate at all.
(b) The evidence of DW1 on the question of ______________ was unchallenged under
    cross-examination and ought to have been accepted.

GROUND THREE
The learned trial Magistrate erred in law in entering judgment for the Respondent when
the Respondent failed to prove his claim on the balance of probabilities.

PARTICULARS OF ERROR
(a) The burden of proof lay on the Respondent throughout and never shifted.
(b) The Respondent called no evidence on the crucial issue of ______________.

4. RELIEF SOUGHT FROM THE HIGH COURT
   (a) AN ORDER allowing this appeal.
   (b) AN ORDER setting aside the judgment of the Magistrate Court delivered on the
       ____ day of __________, 20____, together with the orders consequential upon it.
   (c) AN ORDER striking out the suit for want of jurisdiction, or in the alternative
       dismissing the Respondent's claim in its entirety.
   (d) Costs of this appeal and of the proceedings in the court below.

5. PERSONS DIRECTLY AFFECTED BY THIS APPEAL
   (a) [Name of Appellant], of [address] — Appellant.
   (b) [Name of Respondent], of [address] — Respondent.

${SIGN_OFF('Counsel to the Appellant')}

FOR SERVICE ON:
The Respondent,
c/o his Counsel, [Name of Firm],
[Address].`,
      },
      {
        id: 'appeal-mag-hc-stay',
        title: 'Motion on Notice for Stay of Execution Pending Appeal',
        description:
          'Filed in the Magistrate Court that gave the judgment, to hold the judgment in abeyance until the High Court has heard the appeal.',
        sampleText: `IN THE MAGISTRATE COURT OF ______________ STATE
IN THE ______________ MAGISTERIAL DISTRICT
HOLDEN AT ______________

                                                        SUIT NO: ______________

BETWEEN:

[NAME OF APPELLANT] .............................. JUDGMENT DEBTOR/APPLICANT

AND

[NAME OF RESPONDENT] ......................... JUDGMENT CREDITOR/RESPONDENT

                            MOTION ON NOTICE
        BROUGHT PURSUANT TO SECTION 18 OF THE SHERIFFS AND CIVIL PROCESS ACT
                 AND UNDER THE INHERENT JURISDICTION OF THIS COURT

TAKE NOTICE that this Honourable Court will be moved on the ____ day of __________,
20____, at the hour of 9 o'clock in the forenoon or so soon thereafter as Counsel to the
Applicant may be heard, praying this Honourable Court for the following orders:

1. AN ORDER staying execution of the judgment of this Honourable Court delivered on the
   ____ day of __________, 20____, pending the hearing and determination of the appeal
   filed against the said judgment at the High Court of ______________ State.

2. AND FOR SUCH FURTHER ORDER OR ORDERS as this Honourable Court may deem fit to make
   in the circumstances.

                                GROUNDS OF THE APPLICATION

1. The Applicant has filed a Notice of Appeal against the judgment, which raises
   substantial and arguable issues, including a challenge to the jurisdiction of this
   Honourable Court.

2. The res, being [describe the subject matter], is of such a nature that its execution
   would destroy the subject matter of the appeal and render the appeal nugatory.

3. The balance of convenience is in favour of preserving the status quo until the appeal
   is determined.

DATED this ____ day of __________, 20____.

${SIGN_OFF('Counsel to the Applicant')}

                    AFFIDAVIT IN SUPPORT OF MOTION ON NOTICE

I, [Full Name], [sex], [religion], Nigerian citizen, of [address], do hereby make oath
and state as follows:

1. That I am the Applicant/Appellant in this suit and by virtue of which I am conversant
   with the facts deposed to herein.

2. That judgment was delivered against me in this suit on the ____ day of __________,
   20____, in the sum of N______________ together with costs of N______________.

3. That I am dissatisfied with the said judgment and have filed a Notice of Appeal
   against it. A copy of the Notice of Appeal, duly filed and stamped, is attached and
   marked EXHIBIT A.

4. That my Counsel, [Name], Esq., has informed me in his chambers at [address] on the
   ____ day of __________, 20____, at about ____ hours, and I verily believe him, that
   the grounds of appeal raise substantial and arguable questions of law, including the
   jurisdiction of the trial Court.

5. That the Respondent has taken out a writ of execution and has threatened to levy
   execution on my [describe property] at [address].

6. That if execution is levied and the appeal succeeds, the appeal would have been
   rendered nugatory and I would suffer irreparable loss.

7. That I undertake to prosecute the appeal diligently and to abide by any order this
   Honourable Court may make as to damages.

8. That it is in the interest of justice to grant this application.

9. That I make this solemn declaration conscientiously believing the contents to be true
   and correct in accordance with the Oaths Act.

                                                ______________________
                                                        DEPONENT

SWORN TO at the Magistrate Court Registry, ______________
This ____ day of __________, 20____

                                                ______________________
                                                    COMMISSIONER FOR OATHS`,
      },
    ],
  },
  {
    id: 'high-court-to-court-of-appeal',
    title: 'High Court to the Court of Appeal',
    fromCourt: 'High Court of a State / of the FCT',
    toCourt: 'Court of Appeal',
    summary:
      'An appeal from the High Court of a State or of the Federal Capital Territory lies to the Court of Appeal — as of right in the cases listed in Section 241(1) of the Constitution, and otherwise with leave.',
    note:
      'A decision of a State High Court is appealed to the Court of Appeal, not to the Federal High Court. The Federal High Court and the State High Courts are courts of coordinate jurisdiction, and neither hears appeals from the other. The sample below therefore takes the appeal to the Court of Appeal, which is where this rung of the ladder actually goes.',
    timeframe:
      'Interlocutory decision: 14 days. Final decision in a civil cause: 3 months. Criminal cause: 90 days. Record of appeal transmitted by the registrar within 60 days of the notice of appeal.',
    requirements: [
      'File the notice of appeal in the registry of the High Court that gave the decision.',
      'Where any ground raises fact or mixed law and fact, obtain leave before filing — or file the trinity prayers.',
      'Pay the prescribed fees for the compilation and transmission of the record of appeal.',
      'File the appellant’s brief within 45 days of receipt of the record of appeal.',
    ],
    drafts: [
      {
        id: 'appeal-hc-ca-notice',
        title: 'Notice of Appeal — High Court to the Court of Appeal',
        description:
          'Filed in the registry of the High Court, setting out concisely each ground of appeal with its particulars, and the relief sought from the Court of Appeal.',
        sampleText: `IN THE HIGH COURT OF ______________ STATE
IN THE ______________ JUDICIAL DIVISION
HOLDEN AT ______________

                                                        SUIT NO: ______________
                                                        APPEAL NO: CA/____/____/20__

BETWEEN:

[NAME OF APPELLANT] ................................................ APPELLANT
   (Defendant at the High Court)

AND

[NAME OF RESPONDENT] ............................................ RESPONDENT
   (Claimant at the High Court)

                              NOTICE OF APPEAL
     (Brought pursuant to Section 241(1)(a) and (b) of the Constitution of the
    Federal Republic of Nigeria 1999 (as amended) and Order 6 of the Court of
                              Appeal Rules)

TAKE NOTICE that the Appellant, being dissatisfied with the decision of the High Court
of ______________ State, holden at ______________, contained in the judgment of the
Honourable Justice ______________ delivered on the ____ day of __________, 20____, doth
hereby appeal to the Court of Appeal, ______________ Judicial Division, upon the grounds
set out in paragraph 3, and will at the hearing of the appeal seek the relief set out in
paragraph 4.

1. PART OF THE DECISION COMPLAINED OF: The whole decision.

2. DATE OF THE DECISION: ____ day of __________, 20____.

3. GROUNDS OF APPEAL

GROUND ONE — ERROR IN LAW
The learned trial Judge erred in law when he/she assumed jurisdiction to hear and
determine the suit notwithstanding that the Claimant failed to comply with the condition
precedent to the institution of the action.

PARTICULARS OF ERROR
(a) The Respondent failed to serve the statutory pre-action notice required by Section
    ____ of the ______________ Act before commencing the suit.
(b) Service of a pre-action notice is a condition precedent, and non-compliance robs the
    Court of jurisdiction.
(c) The Appellant raised the objection timeously by motion on notice dated ____________,
    which the learned trial Judge wrongly overruled.

GROUND TWO — ERROR IN LAW
The learned trial Judge erred in law in admitting and acting upon Exhibits ____ and ____,
being computer-generated documents tendered without the certificate required by Section
84(4) of the Evidence Act 2011.

PARTICULARS OF ERROR
(a) Exhibits ____ and ____ are statements contained in documents produced by a computer.
(b) No certificate identifying the document, describing the manner of its production and
    dealing with the conditions in Section 84(2) was tendered.
(c) Wrongly admitted evidence ought to be expunged, and when it is, there is nothing left
    to support the finding at page ____ of the record.

GROUND THREE — ERROR IN LAW
The learned trial Judge erred in law in failing to consider and pronounce upon the
Appellant's counter-claim, thereby breaching the Appellant's right to fair hearing under
Section 36(1) of the Constitution.

PARTICULARS OF ERROR
(a) The counter-claim was properly filed on ____________ and is at pages ____ to ____ of
    the record.
(b) A counter-claim is a separate and independent action which the Court is bound to
    determine.
(c) The judgment is silent on the counter-claim from beginning to end.

GROUND FOUR — OMNIBUS GROUND
The judgment is against the weight of evidence.

4. RELIEF SOUGHT FROM THE COURT OF APPEAL
   (a) AN ORDER allowing this appeal.
   (b) AN ORDER setting aside the judgment of the High Court of ______________ State
       delivered on the ____ day of __________, 20____.
   (c) AN ORDER striking out the suit for want of jurisdiction, or in the alternative
       dismissing the Respondent's claim.
   (d) AN ORDER granting the reliefs sought in the Appellant's counter-claim.
   (e) Costs.

5. PERSONS DIRECTLY AFFECTED BY THIS APPEAL
   (a) [Name of Appellant], of [address] — Appellant.
   (b) [Name of Respondent], of [address] — Respondent.

${SIGN_OFF('Counsel to the Appellant')}

FOR SERVICE ON:
The Respondent,
c/o [Name of Firm], [Address].`,
      },
      {
        id: 'appeal-hc-ca-trinity',
        title: 'Motion on Notice for the Trinity Prayers (Leave & Extension of Time)',
        description:
          'The application used where the time to appeal has expired, or where the grounds raise fact or mixed law and fact — extension of time to seek leave, leave to appeal, and extension of time to appeal.',
        sampleText: `IN THE COURT OF APPEAL
IN THE ______________ JUDICIAL DIVISION
HOLDEN AT ______________

                                                        APPEAL NO: CA/____/____/20__
                                                        SUIT NO: ______________

BETWEEN:

[NAME OF APPLICANT] ............................ APPELLANT/APPLICANT

AND

[NAME OF RESPONDENT] ......................... RESPONDENT/RESPONDENT

                              MOTION ON NOTICE
   BROUGHT PURSUANT TO SECTION 242(1) OF THE CONSTITUTION OF THE FEDERAL REPUBLIC
   OF NIGERIA 1999 (AS AMENDED), SECTION 24(4) OF THE COURT OF APPEAL ACT AND
      ORDER 6 RULE 9 OF THE COURT OF APPEAL RULES, AND UNDER THE INHERENT
                        JURISDICTION OF THIS HONOURABLE COURT

TAKE NOTICE that this Honourable Court will be moved on the ____ day of __________,
20____, at the hour of 9 o'clock in the forenoon or so soon thereafter as Counsel to the
Applicant may be heard, praying this Honourable Court for the following orders:

1. AN ORDER granting an extension of time within which the Applicant may seek leave to
   appeal against the judgment of the High Court of ______________ State delivered on the
   ____ day of __________, 20____.

2. AN ORDER granting the Applicant leave to appeal against the said judgment on grounds
   of fact and of mixed law and fact.

3. AN ORDER granting an extension of time within which the Applicant may appeal against
   the said judgment.

4. AN ORDER deeming the Notice of Appeal already filed and served as properly filed and
   served, the appropriate fees having been paid.

5. AND FOR SUCH FURTHER ORDER OR ORDERS as this Honourable Court may deem fit to make.

                              GROUNDS OF THE APPLICATION

1. The judgment sought to be appealed against was delivered on the ____ day of
   __________, 20____, and the time prescribed for appealing has expired.

2. The delay was occasioned by the delay of the registry of the court below in issuing
   the certified true copy of the judgment, which was released only on the ____ day of
   __________, 20____.

3. The proposed grounds of appeal raise substantial and arguable issues which prima facie
   show good cause why the appeal should be heard.

4. The Respondent will suffer no injustice that cannot be compensated in costs.

DATED this ____ day of __________, 20____.

${SIGN_OFF('Counsel to the Applicant')}

                       AFFIDAVIT IN SUPPORT OF THE APPLICATION

I, [Full Name], [sex], [religion], Nigerian citizen, Legal Practitioner, of [address], do
hereby make oath and state as follows:

1. That I am Counsel in the chambers of [Firm], Solicitors to the Applicant, and by
   virtue of my position I am conversant with the facts of this case.

2. That I have the consent and authority of the Applicant and of my principal in chambers
   to depose to this affidavit.

3. That judgment was delivered against the Applicant on the ____ day of __________,
   20____. A copy of the judgment is attached and marked EXHIBIT A.

4. That the Applicant applied for the certified true copy of the judgment on the ____ day
   of __________, 20____, and paid the prescribed fees. The receipt is attached and
   marked EXHIBIT B.

5. That the certified true copy was not released by the registry until the ____ day of
   __________, 20____, by which time the period allowed for appealing had expired.

6. That the delay was therefore not due to any fault, negligence or indolence on the part
   of the Applicant.

7. That the proposed grounds of appeal, contained in the Notice of Appeal attached and
   marked EXHIBIT C, raise substantial issues including the jurisdiction of the trial
   Court and the admissibility of Exhibits ____ and ____.

8. That the Respondent will not be prejudiced by the grant of this application.

9. That I make this solemn declaration conscientiously believing the contents to be true
   and correct in accordance with the Oaths Act.

                                                ______________________
                                                        DEPONENT

SWORN TO at the Court of Appeal Registry, ______________
This ____ day of __________, 20____

                                                ______________________
                                                    COMMISSIONER FOR OATHS`,
      },
    ],
  },
  {
    id: 'federal-high-court-to-court-of-appeal',
    title: 'Federal High Court to the Court of Appeal',
    fromCourt: 'Federal High Court',
    toCourt: 'Court of Appeal',
    summary:
      'An appeal from the Federal High Court lies to the Court of Appeal under Section 240 of the Constitution — as of right in the Section 241(1) cases, and with leave otherwise. The appeal is prepared exactly as from a State High Court, but the heading, the suit number and the subject matter reflect the Federal High Court’s exclusive jurisdiction under Section 251.',
    timeframe:
      'Interlocutory decision: 14 days. Final decision in a civil cause: 3 months. Criminal cause: 90 days. Appellant’s brief within 45 days of receipt of the record.',
    requirements: [
      'File the notice of appeal in the registry of the Federal High Court division that gave the decision.',
      'Where the decision concerns a federal agency, ensure the Attorney-General of the Federation is served where required.',
      'Where the judgment is monetary, consider an application for stay of execution or for an order that the sum be paid into an interest-yielding account.',
      'Compile the record with the pleadings, the exhibits, the record of proceedings and the certified true copy of the judgment.',
    ],
    drafts: [
      {
        id: 'appeal-fhc-ca-notice',
        title: 'Notice of Appeal — Federal High Court to the Court of Appeal',
        description:
          'Notice of appeal against a decision of the Federal High Court, drafted on a tax, banking, companies or federal agency matter within Section 251 of the Constitution.',
        sampleText: `IN THE FEDERAL HIGH COURT OF NIGERIA
IN THE ______________ JUDICIAL DIVISION
HOLDEN AT ______________

                                                        SUIT NO: FHC/___/CS/____/20__
                                                        APPEAL NO: CA/____/____/20__

BETWEEN:

[NAME OF APPELLANT] ................................................ APPELLANT
   (Defendant at the Federal High Court)

AND

[NAME OF RESPONDENT] ............................................ RESPONDENT
   (Plaintiff at the Federal High Court)

                              NOTICE OF APPEAL
    (Brought pursuant to Sections 240 and 241(1)(a) and (b) of the Constitution of
     the Federal Republic of Nigeria 1999 (as amended) and Order 6 of the Court of
                                Appeal Rules)

TAKE NOTICE that the Appellant, being dissatisfied with the decision of the Federal High
Court of Nigeria, ______________ Judicial Division, holden at ______________, contained
in the judgment of the Honourable Justice ______________ delivered on the ____ day of
__________, 20____, doth hereby appeal to the Court of Appeal upon the grounds set out
in paragraph 3, and will at the hearing seek the relief set out in paragraph 4.

1. PART OF THE DECISION COMPLAINED OF: The whole decision.

2. DATE OF THE DECISION: ____ day of __________, 20____.

3. GROUNDS OF APPEAL

GROUND ONE — ERROR IN LAW
The learned trial Judge erred in law in holding that the Federal High Court had
jurisdiction to entertain the Respondent's claim, the claim being in substance one for
[simple contract / employment / land], which lies outside the exclusive jurisdiction
conferred by Section 251(1) of the Constitution.

PARTICULARS OF ERROR
(a) Jurisdiction is determined by the claim as endorsed on the originating process.
(b) The reliefs at paragraph ____ of the Statement of Claim are founded on [state the
    cause of action], and not on any of the matters listed in Section 251(1).
(c) The mere fact that one of the parties is a federal agency does not, without more,
    confer jurisdiction on the Federal High Court.

GROUND TWO — ERROR IN LAW
The learned trial Judge erred in law in holding that the Appellant was liable for the
sum of N______________ as [tax / penalty / debt] when no valid assessment or demand had
been served on the Appellant as required by Section ____ of the ______________ Act.

PARTICULARS OF ERROR
(a) Service of a valid assessment is a condition precedent to liability.
(b) The document at page ____ of the record is neither signed nor dated as the Act
    requires.
(c) The Respondent led no evidence of service.

GROUND THREE — ERROR IN LAW
The learned trial Judge erred in law in granting reliefs not claimed by the Respondent,
thereby making a case for the Respondent different from the one pleaded.

PARTICULARS OF ERROR
(a) The order at page ____ of the record was not among the reliefs endorsed on the
    Originating Summons.
(b) A court is without power to grant a relief not claimed.

GROUND FOUR — OMNIBUS GROUND
The judgment is against the weight of evidence.

4. RELIEF SOUGHT FROM THE COURT OF APPEAL
   (a) AN ORDER allowing this appeal.
   (b) AN ORDER setting aside the judgment of the Federal High Court delivered on the
       ____ day of __________, 20____.
   (c) AN ORDER striking out the suit for want of jurisdiction, or in the alternative
       dismissing the Respondent's claim in its entirety.
   (d) Costs of this appeal and of the proceedings below.

5. PERSONS DIRECTLY AFFECTED BY THIS APPEAL
   (a) [Name of Appellant], of [address] — Appellant.
   (b) [Name of Respondent], of [address] — Respondent.

${SIGN_OFF('Counsel to the Appellant')}

FOR SERVICE ON:
The Respondent,
c/o [Name of Firm], [Address].`,
      },
      {
        id: 'appeal-fhc-ca-brief',
        title: 'Appellant’s Brief of Argument (Court of Appeal)',
        description:
          'The brief filed within 45 days of receipt of the record, formulating the issues for determination and arguing each with authority.',
        sampleText: `IN THE COURT OF APPEAL
IN THE ______________ JUDICIAL DIVISION
HOLDEN AT ______________

                                                        APPEAL NO: CA/____/____/20__

BETWEEN:

[NAME OF APPELLANT] ................................................ APPELLANT

AND

[NAME OF RESPONDENT] ............................................ RESPONDENT

                        APPELLANT'S BRIEF OF ARGUMENT
       (Filed pursuant to Order 19 Rule 2 of the Court of Appeal Rules)

1.0 INTRODUCTION

1.1 This is an appeal against the judgment of the Federal High Court, ______________
    Judicial Division, delivered by the Honourable Justice ______________ on the ____
    day of __________, 20____, in Suit No. FHC/___/CS/____/20__.

1.2 Dissatisfied with the said judgment, the Appellant filed a Notice of Appeal dated
    and filed on the ____ day of __________, 20____, containing four (4) grounds of
    appeal. The Notice of Appeal is at pages ____ to ____ of the Record of Appeal.

2.0 STATEMENT OF FACTS

2.1 The Respondent, as Plaintiff, commenced the action at the court below by
    Originating Summons dated ____________ seeking [state the reliefs]. See pages ____
    to ____ of the Record.

2.2 The Appellant, as Defendant, filed a counter affidavit and a written address, and
    additionally raised a preliminary objection to the jurisdiction of the court below.
    See pages ____ to ____ of the Record.

2.3 The learned trial Judge overruled the preliminary objection and entered judgment for
    the Respondent as per the reliefs claimed. See pages ____ to ____ of the Record.

3.0 ISSUES FOR DETERMINATION

3.1 The Appellant respectfully submits that the following issues arise for the
    determination of this Honourable Court:

    ISSUE ONE (Distilled from Ground One)
    Whether the court below had jurisdiction to entertain the Respondent's claim, having
    regard to the nature of the claim as endorsed on the Originating Summons and the
    provisions of Section 251(1) of the Constitution.

    ISSUE TWO (Distilled from Grounds Two and Three)
    Whether the learned trial Judge was right in entering judgment for the Respondent in
    the absence of a valid assessment and in granting reliefs not claimed.

4.0 ARGUMENT

4.1 ISSUE ONE — JURISDICTION

4.1.1 My Lords, it is settled beyond argument that jurisdiction is the lifeblood of
      adjudication, and that proceedings conducted without jurisdiction, however well
      conducted, amount to a nullity. We respectfully rely on MADUKOLU v. NKEMDILIM
      (1962) LP e-LR (SC) pt 1003.

4.1.2 It is equally settled that jurisdiction is determined by the claim of the
      plaintiff as endorsed on the originating process, and not by the defence.

4.1.3 A careful reading of the reliefs at page ____ of the Record shows that the claim is
      in substance one founded on [state], a matter over which the court below has no
      jurisdiction under Section 251(1) of the Constitution.

4.1.4 We therefore urge My Lords to resolve Issue One in favour of the Appellant.

4.2 ISSUE TWO — THE MERITS

4.2.1 The law is trite that a court has no power to grant a relief not claimed by a
      party; to do so is to descend into the arena and to make a case for the party.

4.2.2 The order at page ____ of the Record was not sought in the Originating Summons at
      page ____, and cannot stand.

4.2.3 We urge My Lords to resolve Issue Two in favour of the Appellant.

5.0 CONCLUSION AND PRAYER

5.1 On the whole, we respectfully urge My Lords to resolve all the issues in favour of
    the Appellant, to allow this appeal, to set aside the judgment of the court below,
    and to strike out the suit for want of jurisdiction, or in the alternative to dismiss
    the Respondent's claim, with substantial costs.

                              LIST OF AUTHORITIES

STATUTES
1. Constitution of the Federal Republic of Nigeria 1999 (as amended) — Sections 240, 241,
   251.
2. Evidence Act 2011 — Sections 83, 84.

CASES
1. Madukolu & Ors v. Nkemdilim (1962) LP e-LR (SC) pt 1003.
2. [Add the authorities relied upon, with full citations.]

${SIGN_OFF("Counsel to the Appellant")}

FOR SERVICE ON:
The Respondent,
c/o [Name of Firm], [Address].`,
      },
    ],
  },
  {
    id: 'nicn-to-court-of-appeal',
    title: 'National Industrial Court to the Court of Appeal',
    fromCourt: 'National Industrial Court of Nigeria',
    toCourt: 'Court of Appeal',
    summary:
      'Appeals from the National Industrial Court are restricted. Under Section 243(2) and (3) of the Constitution, an appeal lies to the Court of Appeal as of right only on questions of fundamental rights under Chapter IV arising from labour, employment and related matters, and in criminal causes. In every other case the appeal lies only with the leave of the Court of Appeal.',
    note:
      'This restriction is the single most common reason an appeal from the National Industrial Court is struck out. Before drafting, decide honestly whether the ground truly raises a Chapter IV question — if it does not, apply for leave.',
    timeframe:
      'Interlocutory decision: 14 days. Final decision: 3 months. An application for leave, where required, must be brought within that same period or joined with a prayer for extension of time.',
    requirements: [
      'Identify whether the ground falls within Section 243(2) — fundamental rights arising from a labour matter — or requires leave under Section 243(3).',
      'File the notice of appeal in the registry of the National Industrial Court division that gave the decision.',
      'Where leave is required, exhibit the proposed notice of appeal to the application for leave.',
      'Where the award is for reinstatement or terminal benefits, consider an application for stay pending appeal.',
    ],
    drafts: [
      {
        id: 'appeal-nicn-ca-notice',
        title: 'Notice of Appeal — National Industrial Court to the Court of Appeal',
        description:
          'Notice of appeal grounded on a Chapter IV fundamental rights question arising from an employment matter, so that the appeal lies as of right under Section 243(2).',
        sampleText: `IN THE NATIONAL INDUSTRIAL COURT OF NIGERIA
IN THE ______________ JUDICIAL DIVISION
HOLDEN AT ______________

                                                        SUIT NO: NICN/___/____/20__
                                                        APPEAL NO: CA/____/____/20__

BETWEEN:

[NAME OF APPELLANT] ................................................ APPELLANT
   (Defendant at the National Industrial Court)

AND

[NAME OF RESPONDENT] ............................................ RESPONDENT
   (Claimant at the National Industrial Court)

                              NOTICE OF APPEAL
   (Brought pursuant to Section 243(2) of the Constitution of the Federal Republic of
    Nigeria 1999 (as amended) — appeal as of right on questions of fundamental rights
      under Chapter IV arising from a matter of labour and employment — and Order 6
                        of the Court of Appeal Rules)

TAKE NOTICE that the Appellant, being dissatisfied with the decision of the National
Industrial Court of Nigeria, ______________ Judicial Division, holden at ______________,
contained in the judgment of the Honourable Justice ______________ delivered on the ____
day of __________, 20____, doth hereby appeal to the Court of Appeal upon the grounds
set out in paragraph 3, and will at the hearing seek the relief set out in paragraph 4.

1. PART OF THE DECISION COMPLAINED OF: The whole decision.

2. DATE OF THE DECISION: ____ day of __________, 20____.

3. GROUNDS OF APPEAL

GROUND ONE — BREACH OF THE RIGHT TO FAIR HEARING
The learned trial Judge breached the Appellant's right to fair hearing guaranteed by
Section 36(1) of the Constitution of the Federal Republic of Nigeria 1999 (as amended),
when he/she delivered judgment without considering the Appellant's Final Written Address
duly filed on the ____ day of __________, 20____.

PARTICULARS OF THE BREACH
(a) The Appellant's Final Written Address is at pages ____ to ____ of the Record.
(b) The judgment makes no reference whatsoever to the Address or to any of the four
    issues formulated in it.
(c) A party who is not heard has not had a fair hearing, and a decision reached in breach
    of Section 36(1) is a nullity.

GROUND TWO — BREACH OF THE RIGHT TO FAIR HEARING
The learned trial Judge breached the Appellant's right to fair hearing when he/she
foreclosed the Appellant from calling its second witness while the Respondent was allowed
to call all its witnesses.

PARTICULARS OF THE BREACH
(a) On the ____ day of __________, 20____, the Court refused the Appellant's application
    for a short adjournment to produce DW2, who was on official assignment abroad.
(b) The Respondent had earlier been granted three adjournments for the same purpose.
(c) The twin pillars of natural justice require that both sides be heard and that the
    Court hold the scales evenly between them.

GROUND THREE — BREACH OF CHAPTER IV RIGHTS
The learned trial Judge erred when he/she held that the Appellant's dismissal of the
Respondent amounted to a breach of the Respondent's right to dignity of the human person
under Section 34 of the Constitution, without any evidence of the treatment complained of.

PARTICULARS OF ERROR
(a) No evidence of physical or psychological ill-treatment was led at the trial.
(b) The finding at page ____ of the Record is unsupported by any evidence on the record.

4. RELIEF SOUGHT FROM THE COURT OF APPEAL
   (a) AN ORDER allowing this appeal.
   (b) AN ORDER setting aside the judgment of the National Industrial Court delivered on
       the ____ day of __________, 20____, together with the award of N______________.
   (c) AN ORDER dismissing the Respondent's claim in its entirety, or in the alternative
       an order remitting the suit to the President of the National Industrial Court for
       reassignment and hearing de novo before another Judge.
   (d) Costs.

5. PERSONS DIRECTLY AFFECTED BY THIS APPEAL
   (a) [Name of Appellant], of [address] — Appellant.
   (b) [Name of Respondent], of [address] — Respondent.

${SIGN_OFF('Counsel to the Appellant')}

FOR SERVICE ON:
The Respondent,
c/o [Name of Firm], [Address].`,
      },
      {
        id: 'appeal-nicn-ca-leave',
        title: 'Motion for Leave to Appeal under Section 243(3)',
        description:
          'Where the ground does not raise a Chapter IV question, leave of the Court of Appeal must first be obtained. This is the application that seeks it.',
        sampleText: `IN THE COURT OF APPEAL
IN THE ______________ JUDICIAL DIVISION
HOLDEN AT ______________

                                                        APPEAL NO: CA/____/____/20__
                                                        SUIT NO: NICN/___/____/20__

BETWEEN:

[NAME OF APPLICANT] ............................ APPELLANT/APPLICANT

AND

[NAME OF RESPONDENT] ......................... RESPONDENT/RESPONDENT

                              MOTION ON NOTICE
    BROUGHT PURSUANT TO SECTION 243(3) OF THE CONSTITUTION OF THE FEDERAL REPUBLIC
   OF NIGERIA 1999 (AS AMENDED) AND ORDER 6 OF THE COURT OF APPEAL RULES, AND UNDER
             THE INHERENT JURISDICTION OF THIS HONOURABLE COURT

TAKE NOTICE that this Honourable Court will be moved on the ____ day of __________,
20____, at the hour of 9 o'clock in the forenoon or so soon thereafter as Counsel to the
Applicant may be heard, praying this Honourable Court for the following orders:

1. AN ORDER granting the Applicant leave to appeal against the judgment of the National
   Industrial Court of Nigeria, ______________ Judicial Division, delivered by the
   Honourable Justice ______________ on the ____ day of __________, 20____ in Suit No.
   NICN/___/____/20__.

2. AN ORDER granting an extension of time within which the Applicant may file the Notice
   of Appeal.

3. AND FOR SUCH FURTHER ORDER OR ORDERS as this Honourable Court may deem fit.

                              GROUNDS OF THE APPLICATION

1. By Section 243(3) of the Constitution, an appeal from a decision of the National
   Industrial Court in a civil cause other than one raising questions of fundamental
   rights under Chapter IV lies to this Honourable Court only with leave.

2. The proposed grounds of appeal raise substantial and arguable questions of law,
   including the jurisdiction of the court below and the proper construction of the
   contract of employment between the parties.

3. The proposed grounds prima facie show good cause why the appeal should be heard.

4. The application has been brought without undue delay and the Respondent will suffer no
   prejudice that cannot be compensated in costs.

DATED this ____ day of __________, 20____.

${SIGN_OFF('Counsel to the Applicant')}

                       AFFIDAVIT IN SUPPORT OF THE APPLICATION

I, [Full Name], [sex], [religion], Nigerian citizen, Legal Practitioner, of [address], do
hereby make oath and state as follows:

1. That I am Counsel in the chambers of [Firm], Solicitors to the Applicant, with the
   consent and authority of the Applicant and of my principal to depose to this affidavit.

2. That judgment was delivered against the Applicant on the ____ day of __________,
   20____. A certified true copy is attached and marked EXHIBIT A.

3. That the Applicant is dissatisfied with the judgment and desires to appeal against it
   on the grounds contained in the proposed Notice of Appeal attached and marked
   EXHIBIT B.

4. That the proposed grounds do not raise questions of fundamental rights under Chapter
   IV of the Constitution, and leave of this Honourable Court is accordingly required.

5. That the proposed grounds raise substantial questions of law, namely whether the court
   below had jurisdiction over [state], and whether the contract at EXHIBIT ____ was
   properly construed.

6. That the delay in bringing this application, if any, was occasioned by the time taken
   by the registry of the court below to release the certified true copy of the judgment,
   which was issued only on the ____ day of __________, 20____.

7. That it is in the interest of justice that this application be granted.

8. That I make this solemn declaration conscientiously believing the contents to be true
   and correct in accordance with the Oaths Act.

                                                ______________________
                                                        DEPONENT

SWORN TO at the Court of Appeal Registry, ______________
This ____ day of __________, 20____

                                                ______________________
                                                    COMMISSIONER FOR OATHS`,
      },
    ],
  },
  {
    id: 'court-of-appeal-to-supreme-court',
    title: 'Court of Appeal to the Supreme Court',
    fromCourt: 'Court of Appeal',
    toCourt: 'Supreme Court of Nigeria',
    summary:
      'The final rung. An appeal lies to the Supreme Court as of right in the cases listed in Section 233(2) of the Constitution — chiefly grounds of law alone, the interpretation or application of the Constitution, Chapter IV rights, and a sentence of death affirmed by the Court of Appeal. In every other case leave of the Court of Appeal or of the Supreme Court is required.',
    timeframe:
      'Interlocutory decision: 14 days. Final decision: 3 months. Appellant’s brief within 10 weeks of receipt of the record; respondent’s brief within 8 weeks of service; reply brief within 4 weeks.',
    requirements: [
      'File the notice of appeal in the registry of the Court of Appeal division that gave the decision.',
      'Ensure every ground is a ground of law alone if the appeal is brought as of right — a ground of mixed law and fact requires leave.',
      'Where the Court of Appeal has made concurrent findings with the trial court, be ready to show a special circumstance: perversity, a misapplication of the law, or a miscarriage of justice.',
      'Settle the record with the registrar and file the appellant’s brief within ten weeks of receiving it.',
    ],
    drafts: [
      {
        id: 'appeal-ca-sc-notice',
        title: 'Notice of Appeal — Court of Appeal to the Supreme Court',
        description:
          'Notice of appeal to the apex court, drafted so that every ground is a ground of law alone and the appeal therefore lies as of right under Section 233(2).',
        sampleText: `IN THE COURT OF APPEAL
IN THE ______________ JUDICIAL DIVISION
HOLDEN AT ______________

                                                        APPEAL NO: CA/____/____/20__
                                                        SC NO: SC/____/20__

BETWEEN:

[NAME OF APPELLANT] ................................................ APPELLANT
   (Appellant at the Court of Appeal)

AND

[NAME OF RESPONDENT] ............................................ RESPONDENT
   (Respondent at the Court of Appeal)

                              NOTICE OF APPEAL
   (Brought pursuant to Section 233(2)(a), (b) and (c) of the Constitution of the
    Federal Republic of Nigeria 1999 (as amended) and Order 8 Rule 2 of the Supreme
                                 Court Rules)

TAKE NOTICE that the Appellant, being dissatisfied with the decision of the Court of
Appeal, ______________ Judicial Division, contained in the judgment of Their Lordships
______________, JCA (presiding), ______________, JCA and ______________, JCA, delivered
on the ____ day of __________, 20____, doth hereby appeal to the Supreme Court of Nigeria
upon the grounds set out in paragraph 3, and will at the hearing seek the relief set out
in paragraph 4.

1. PART OF THE DECISION COMPLAINED OF: The whole decision.

2. DATE OF THE DECISION: ____ day of __________, 20____.

3. GROUNDS OF APPEAL

GROUND ONE — ERROR IN LAW
The learned Justices of the Court of Appeal erred in law when they affirmed the decision
of the trial Court assuming jurisdiction over the suit, notwithstanding that the
condition precedent to the exercise of that jurisdiction had not been fulfilled.

PARTICULARS OF ERROR
(a) Jurisdiction is a threshold issue which can be raised at any stage, even for the
    first time in this Honourable Court.
(b) The pre-action notice required by Section ____ of the ______________ Act was never
    served on the Appellant.
(c) A defect in competence is fatal, and proceedings conducted without competence are a
    nullity ab initio — MADUKOLU v. NKEMDILIM (1962) LP e-LR (SC) pt 1003.

GROUND TWO — ERROR IN LAW
The learned Justices of the Court of Appeal erred in law in holding that the Appellant's
Ground Three was incompetent for being a ground of mixed law and fact filed without
leave, when the said ground raised a question of law alone.

PARTICULARS OF ERROR
(a) Ground Three complained of the wrongful admission of Exhibit ____ in breach of
    Section 84 of the Evidence Act 2011.
(b) The admissibility of a document is a question of law determinable on the face of the
    record without any re-evaluation of evidence.
(c) By striking out the ground, the Court of Appeal declined jurisdiction it possessed.

GROUND THREE — ERROR IN LAW (CONSTITUTIONAL INTERPRETATION)
The learned Justices of the Court of Appeal erred in law in their interpretation and
application of Section 36(1) of the Constitution when they held that the Appellant's
right to fair hearing was not breached by the trial Court's failure to consider its
Final Written Address.

PARTICULARS OF ERROR
(a) A Final Written Address is part of a party's case and the Court is bound to consider
    it.
(b) The right to fair hearing is not satisfied by the mere opportunity to file a process
    which the Court then ignores.
(c) A breach of Section 36(1) vitiates the whole proceedings irrespective of how strong
    the case of the other party may be.

4. RELIEF SOUGHT FROM THE SUPREME COURT
   (a) AN ORDER allowing this appeal.
   (b) AN ORDER setting aside the judgment of the Court of Appeal delivered on the ____
       day of __________, 20____, and the judgment of the trial Court affirmed by it.
   (c) AN ORDER striking out the suit for want of jurisdiction, or in the alternative an
       order remitting the suit for hearing de novo before another Judge.
   (d) Costs in this Court and in the courts below.

5. PERSONS DIRECTLY AFFECTED BY THIS APPEAL
   (a) [Name of Appellant], of [address] — Appellant.
   (b) [Name of Respondent], of [address] — Respondent.

${SIGN_OFF('Counsel to the Appellant')}

FOR SERVICE ON:
The Respondent,
c/o [Name of Firm], [Address].`,
      },
      {
        id: 'appeal-ca-sc-brief',
        title: 'Appellant’s Brief of Argument (Supreme Court)',
        description:
          'The brief filed within ten weeks of receipt of the record, arguing the issues distilled from the grounds and confronting any concurrent findings of the courts below.',
        sampleText: `IN THE SUPREME COURT OF NIGERIA
HOLDEN AT ABUJA

                                                        SC NO: SC/____/20__

BETWEEN:

[NAME OF APPELLANT] ................................................ APPELLANT

AND

[NAME OF RESPONDENT] ............................................ RESPONDENT

                        APPELLANT'S BRIEF OF ARGUMENT
          (Filed pursuant to Order 10 of the Supreme Court Rules)

1.0 INTRODUCTION

1.1 This is an appeal against the judgment of the Court of Appeal, ______________
    Judicial Division, delivered on the ____ day of __________, 20____, which affirmed
    the judgment of the High Court of ______________ State delivered on the ____ day of
    __________, 20____.

1.2 The Appellant's Notice of Appeal, containing three grounds of appeal, was filed on
    the ____ day of __________, 20____, and is at pages ____ to ____ of the Record.

2.0 STATEMENT OF FACTS

2.1 [Set out the facts concisely, with a page reference to the Record for every
    assertion.]

3.0 ISSUES FOR DETERMINATION

3.1 ISSUE ONE (from Ground One)
    Whether the Court of Appeal was right in affirming the assumption of jurisdiction by
    the trial Court when the statutory condition precedent had not been fulfilled.

3.2 ISSUE TWO (from Grounds Two and Three)
    Whether the Court of Appeal was right in striking out Ground Three of the Appellant's
    grounds of appeal, and in holding that the Appellant's right to fair hearing under
    Section 36(1) of the Constitution was not breached.

4.0 ARGUMENT

4.1 ISSUE ONE

4.1.1 My Lords, jurisdiction is the foundation of adjudication. Where a court proceeds
      without it, the entire proceedings, however brilliantly conducted, amount to a
      nullity: MADUKOLU v. NKEMDILIM (1962) LP e-LR (SC) pt 1003.

4.1.2 The Appellant respectfully submits that service of the statutory pre-action notice
      was a condition precedent, and that no such notice was served — a fact the
      Respondent did not controvert at page ____ of the Record.

4.1.3 We respectfully urge My Lords to resolve Issue One in favour of the Appellant.

4.2 ISSUE TWO

4.2.1 A ground of appeal complaining of the admissibility of a document raises a question
      of law alone, determinable from the record without re-evaluating evidence. The
      Court of Appeal was therefore in error in striking out Ground Three.

4.2.2 On fair hearing, the law is settled that a court must consider the case of both
      parties, including a Final Written Address duly filed. The failure to do so is a
      breach of Section 36(1) which vitiates the proceedings.

4.2.3 We respectfully urge My Lords to resolve Issue Two in favour of the Appellant.

5.0 ON THE CONCURRENT FINDINGS OF THE COURTS BELOW

5.1 The Appellant is conscious of the settled principle that this Honourable Court will
    not ordinarily disturb the concurrent findings of the two courts below. The Appellant
    respectfully submits that this case falls within the recognised exceptions, the
    findings being perverse, having been reached on a misapplication of the law, and
    having occasioned a substantial miscarriage of justice.

6.0 CONCLUSION AND PRAYER

6.1 We respectfully urge My Lords to resolve all the issues in favour of the Appellant,
    allow this appeal, set aside the judgment of the Court of Appeal and that of the trial
    Court, and strike out the suit for want of jurisdiction, with substantial costs.

                              LIST OF AUTHORITIES

STATUTES
1. Constitution of the Federal Republic of Nigeria 1999 (as amended) — Sections 36(1),
   233(2).
2. Evidence Act 2011 — Section 84.

CASES
1. Madukolu & Ors v. Nkemdilim (1962) LP e-LR (SC) pt 1003.
2. [Add the authorities relied upon, with full citations.]

${SIGN_OFF("Counsel to the Appellant")}

FOR SERVICE ON:
The Respondent,
c/o [Name of Firm], [Address].`,
      },
    ],
  },
];
