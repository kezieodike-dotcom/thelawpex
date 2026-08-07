import { CourtroomProcedure } from '../types';

/**
 * Different court room procedures — what actually happens in court, stage by stage,
 * across the proceedings a Nigerian practitioner appears in.
 *
 * Each procedure carries the rules that govern it, the words counsel actually says,
 * and the places where matters go wrong.
 */

export const PROCEDURE_TRACKS: { id: string; label: string; description: string }[] = [
  {
    id: 'civil',
    label: 'Civil proceedings',
    description:
      'From the filing of the writ to the delivery of judgment in a contested civil trial before a High Court.',
  },
  {
    id: 'criminal',
    label: 'Criminal proceedings',
    description:
      'Arraignment, plea, the case for the prosecution, the defence, allocutus and sentence under the ACJA and State ACJLs.',
  },
  {
    id: 'interlocutory',
    label: 'Motions & interlocutory applications',
    description:
      'How an application is moved, opposed and ruled upon, whether ex parte or on notice.',
  },
  {
    id: 'evidence',
    label: 'Witnesses & evidence',
    description:
      'Calling a witness, tendering an exhibit, cross-examining and re-examining — the mechanics of proof.',
  },
  {
    id: 'specialised',
    label: 'Specialised proceedings',
    description:
      'Matrimonial causes, fundamental rights, election petitions, garnishee and the undefended list.',
  },
  {
    id: 'appellate',
    label: 'Appellate proceedings',
    description:
      'Hearing of an appeal at the Court of Appeal and the Supreme Court, from mention to judgment.',
  },
];

export const COURTROOM_PROCEDURES: CourtroomProcedure[] = [
  // -------------------------------------------------------------------------
  // Civil
  // -------------------------------------------------------------------------
  {
    id: 'proc-civil-trial',
    title: 'Civil trial — from filing to judgment',
    track: 'civil',
    court: 'High Court of a State / Federal High Court',
    summary:
      'The full arc of a contested civil suit under the frontloading regime: originating process, pleadings, pre-trial conference, trial, addresses and judgment.',
    typicalDuration: '12–36 months from filing to judgment',
    governingRules: [
      'High Court of Lagos State (Civil Procedure) Rules 2019, Orders 5, 15, 27 and 32',
      'Federal High Court (Civil Procedure) Rules 2019, Orders 3, 15 and 25',
      'Evidence Act 2011, sections 131–141 (burden of proof)',
    ],
    stages: [
      {
        heading: '1. Commencement and frontloading',
        steps: [
          'File the Writ of Summons or Originating Summons at the registry with the prescribed filing fees.',
          'Frontload with the process: statement of claim, list of witnesses, written statements on oath of each witness, list and copies of documents to be relied on, and the pre-action protocol form where the rules require it.',
          'Obtain the suit number and the endorsed copies for service.',
          'Serve the defendant within the time allowed — six months for a writ within jurisdiction, and apply to renew before it expires if service fails.',
        ],
      },
      {
        heading: '2. Appearance and defence',
        steps: [
          'The defendant enters appearance and files a statement of defence, frontloaded in the same way, within the period prescribed (commonly 42 days in Lagos).',
          'Where a counterclaim is raised it is pleaded in the same document and attracts its own filing fees.',
          'The claimant may file a reply and a defence to counterclaim within 14 days.',
          'Any preliminary objection to jurisdiction or competence is filed at this point and taken before the trial proper.',
        ],
      },
      {
        heading: '3. Pre-trial conference / case management',
        steps: [
          'Either party applies for a pre-trial conference notice within the time the rules allow; failure to apply can lead to dismissal or striking out.',
          'The judge convenes the conference: issues are settled, admissions recorded, documents agreed or objected to, and the number of witnesses fixed.',
          'The court explores settlement and may refer the matter to the multi-door courthouse or a mediation centre.',
          'The judge issues a pre-trial conference report which fixes the hearing dates and binds the parties.',
        ],
      },
      {
        heading: '4. Trial',
        steps: [
          'Counsel announce appearances; the case is called and the court records the parties present.',
          'The claimant opens: the first witness enters the box, is sworn, adopts the written statement on oath and is led on any documents to be tendered.',
          'Documents are tendered, objections taken and either ruled upon at once or reserved to judgment.',
          'The defendant cross-examines; the claimant re-examines on matters arising from cross-examination only.',
          'The claimant closes their case. The defendant opens theirs and the same cycle runs in reverse.',
          'Either side may apply for a no-case submission (rare in civil trials) or for leave to call a witness in rebuttal.',
        ],
      },
      {
        heading: '5. Final written addresses',
        steps: [
          'The defendant files and serves a final written address first, within the time the court fixes.',
          'The claimant files theirs in response; the defendant may file a reply on points of law only.',
          'On the adopted date counsel formally adopt their addresses and may make brief oral highlights if the court permits.',
          'The court adjourns for judgment — constitutionally to be delivered within 90 days of the conclusion of evidence and final addresses.',
        ],
      },
      {
        heading: '6. Judgment and after',
        steps: [
          'Judgment is read in open court; counsel and parties stand as it is delivered.',
          'Ask immediately for a Certified True Copy of the judgment — the time for appealing runs from the date of delivery, not the date of collection.',
          'Where costs are awarded, apply for them to be taxed if not fixed on the spot.',
          'A dissatisfied party files a notice of appeal within 14 days (interlocutory) or 3 months (final) of the judgment.',
        ],
      },
    ],
    saidInCourt: [
      '"May it please Your Lordship, [Name], with me [Name], appearing for the Claimant in this suit."',
      '"My Lord, the matter is slated for the continuation of hearing. The Claimant is ready and we have our second witness in court."',
      '"My Lord, the witness has identified the document. We seek to tender it in evidence."',
      '"My Lord, we have concluded evidence. The Claimant hereby closes his case."',
      '"My Lord, we adopt our final written address filed on the [date] as our argument in this suit and urge Your Lordship to grant the reliefs sought."',
    ],
    pitfalls: [
      'Serving a writ after it has expired without renewal — the service, and everything after it, is void.',
      'Failing to apply for the pre-trial conference notice within time; several rules make that fatal to the claim.',
      'Tendering a document no witness has spoken to, or through a witness who cannot identify it.',
      'Introducing new matter in re-examination — it is confined to matters arising from cross-examination.',
      'Waiting to collect the CTC before deciding to appeal; time runs from delivery of the judgment.',
    ],
    keywords: ['civil trial', 'frontloading', 'pre-trial conference', 'writ', 'final address'],
  },
  {
    id: 'proc-undefended-list',
    title: 'Undefended list procedure',
    track: 'civil',
    court: 'High Court of a State / Federal High Court',
    summary:
      'The summary route for a liquidated money demand where the defendant has no defence on the merits — judgment without a full trial.',
    typicalDuration: '2–6 months',
    governingRules: [
      'Order 35, High Court of the FCT (Civil Procedure) Rules 2018',
      'Order 11, Federal High Court (Civil Procedure) Rules 2019 (summary judgment)',
      'Order 13, High Court of Lagos State (Civil Procedure) Rules 2019 (summary judgment)',
    ],
    stages: [
      {
        heading: '1. Application to enter the suit on the list',
        steps: [
          'File a writ of summons endorsed with the claim for a liquidated money demand, supported by an affidavit deposing that in the deponent’s belief there is no defence to the claim.',
          'Apply to the judge in chambers to enter the suit on the undefended list.',
          'If satisfied, the judge enters the suit on the undefended list and fixes a return date for hearing.',
        ],
      },
      {
        heading: '2. Service and the defendant’s response',
        steps: [
          'The writ, the affidavit and the notice of the return date are served on the defendant.',
          'The defendant who intends to defend must file a notice of intention to defend, with an affidavit disclosing a defence on the merits, at least five days before the return date.',
          'A defence "on the merits" means facts that would, if proved, defeat the claim — not a bare denial or a plea for time to pay.',
        ],
      },
      {
        heading: '3. The return date',
        steps: [
          'Where no notice of intention to defend is filed, the court hears the claimant briefly and enters judgment on the undefended list without calling evidence.',
          'Where a notice is filed, the court examines the affidavit: if it discloses a defence on the merits the suit is transferred to the general cause list and pleadings are ordered.',
          'If the affidavit discloses no defence, the court enters judgment for the claimant notwithstanding the notice.',
        ],
      },
    ],
    saidInCourt: [
      '"My Lord, this suit is on the undefended list and is slated for hearing today. The Defendant was served on the [date] and has filed no notice of intention to defend."',
      '"My Lord, we rely on our affidavit in support and urge the court to enter judgment as per our claim on the writ."',
      '"My Lord, the affidavit accompanying the notice of intention to defend discloses no defence on the merits — it merely seeks time to pay."',
    ],
    pitfalls: [
      'Using the undefended list for an unliquidated claim such as general damages — the suit will be transferred or struck out.',
      'Filing the notice of intention to defend late; the five clear days are counted strictly.',
      'A defendant’s affidavit that admits the debt and only pleads inability to pay — that is no defence and judgment follows.',
    ],
    keywords: ['undefended list', 'summary judgment', 'liquidated demand', 'notice of intention to defend'],
  },

  // -------------------------------------------------------------------------
  // Criminal
  // -------------------------------------------------------------------------
  {
    id: 'proc-criminal-trial',
    title: 'Criminal trial — arraignment to sentence',
    track: 'criminal',
    court: 'High Court / Magistrate Court',
    summary:
      'How a criminal case runs under the ACJA and the State ACJLs: arraignment, plea, prosecution case, no-case submission, defence, addresses, verdict and sentence.',
    typicalDuration: '6–24 months, with day-to-day trial once evidence begins',
    governingRules: [
      'Administration of Criminal Justice Act 2015, sections 215, 271, 300–311 and 396',
      'Constitution of the Federal Republic of Nigeria 1999 (as amended), section 36(5)–(12)',
      'Evidence Act 2011, sections 135 and 174',
    ],
    stages: [
      {
        heading: '1. Arraignment and plea',
        steps: [
          'The defendant is brought before the court unfettered, unless the court orders otherwise for security.',
          'The charge is read over and explained to the defendant in the language he understands, to the satisfaction of the court.',
          'The defendant takes his plea to each count separately; the plea is recorded in his own words.',
          'A plea of not guilty puts the prosecution to proof; a plea of guilty is only accepted where the court is satisfied the defendant understands the charge and its consequences.',
          'Bail is considered — either continued, granted on terms, or refused with reasons.',
        ],
      },
      {
        heading: '2. Case for the prosecution',
        steps: [
          'The prosecution opens and calls its witnesses (PW1, PW2 and so on), each examined in chief, cross-examined and re-examined.',
          'Exhibits are tendered through the witnesses who made or received them; a confessional statement objected to as involuntary triggers a trial within trial.',
          'The trial within trial is a self-contained hearing on voluntariness only — evidence, cross-examination, addresses and a ruling — before the main trial resumes.',
          'The prosecution closes its case.',
        ],
      },
      {
        heading: '3. No-case submission',
        steps: [
          'The defence may submit that no prima facie case has been made out — that the essential ingredients have not been established or the evidence is so discredited that no reasonable tribunal could convict.',
          'The prosecution replies; the court rules.',
          'If upheld, the defendant is discharged. If overruled, the defendant is called upon to enter his defence, and he may still elect to rest on the prosecution’s case.',
        ],
      },
      {
        heading: '4. Case for the defence',
        steps: [
          'The defendant may testify on oath, make an unsworn statement from the dock, or call no evidence at all — the burden never shifts to him.',
          'Defence witnesses (DW1, DW2 …) are called, examined, cross-examined and re-examined.',
          'The defence closes its case.',
        ],
      },
      {
        heading: '5. Final addresses, verdict and sentence',
        steps: [
          'Written addresses are filed and adopted — the defence addresses first, the prosecution replies.',
          'The court delivers judgment, reviewing the evidence and making findings on each ingredient of the offence.',
          'On a conviction the court hears allocutus: the defendant’s plea in mitigation and any previous conviction proved by the prosecution.',
          'Sentence is pronounced, with the court stating its reasons and any period spent in custody taken into account.',
        ],
      },
    ],
    saidInCourt: [
      '"May it please Your Lordship, [Name], Director of Public Prosecutions, appearing for the State."',
      '"My Lord, the defendant is before the court for arraignment. We apply that the charge be read to him."',
      '"My Lord, we object to the admissibility of the statement. The defendant says it was not made voluntarily. We apply for a trial within trial."',
      '"My Lord, at the close of the case for the prosecution we submit that no prima facie case has been made out against the defendant to warrant his being called upon to enter a defence."',
      '"My Lord, we plead for the mercy of the court. The defendant is a first offender, is remorseful, and has spent [___] months in custody awaiting trial."',
    ],
    pitfalls: [
      'Arraigning a defendant on a charge not read and explained in a language he understands — the whole trial is a nullity.',
      'Tendering a confessional statement without complying with the recording requirements of the ACJA or the applicable ACJL.',
      'Applying for a stay of proceedings in a criminal trial — section 306 of the ACJA abolished it.',
      'Failing to take the plea to each count separately in a multi-count charge.',
      'Sentencing without hearing allocutus, or without taking into account time already spent in custody.',
    ],
    keywords: ['arraignment', 'plea', 'no case submission', 'trial within trial', 'allocutus', 'ACJA'],
  },
  {
    id: 'proc-bail-application',
    title: 'Bail application in open court',
    track: 'criminal',
    court: 'High Court / Magistrate Court',
    summary:
      'How an application for bail pending trial is moved, opposed and perfected once granted.',
    typicalDuration: 'One to three appearances; perfection within days of the grant',
    governingRules: [
      'Constitution of the Federal Republic of Nigeria 1999 (as amended), section 35(4)',
      'Administration of Criminal Justice Act 2015, sections 158–172',
      'Bamaiyi v. State (2001) LP e-LR (SC) pt 1020',
    ],
    stages: [
      {
        heading: '1. Filing and moving the application',
        steps: [
          'File a motion on notice for bail with an affidavit deposing to the Bamaiyi criteria and a written address.',
          'Serve the prosecution and file proof of service.',
          'On the date, announce appearance and formally move: state the motion, its date of filing, the affidavit relied on and the exhibits.',
          'Adopt the written address and highlight the strongest two or three points orally.',
        ],
      },
      {
        heading: '2. Opposition and ruling',
        steps: [
          'The prosecution replies, ordinarily on a counter affidavit deposing to the nature of the charge, the strength of the evidence and any risk of interference with witnesses.',
          'Defence counsel replies on points of law only.',
          'The court rules — granting bail on terms, or refusing it with reasons.',
        ],
      },
      {
        heading: '3. Perfection of bail',
        steps: [
          'Take a Certified True Copy of the bail ruling to the registry.',
          'Sureties present themselves with the verification affidavit, proof of address, passport photographs and means of identification.',
          'The registrar verifies the sureties; some registries conduct a physical address check before endorsing.',
          'On approval the release warrant is signed and taken to the correctional facility, ordinarily the same day.',
        ],
      },
    ],
    saidInCourt: [
      '"My Lord, we have a motion on notice dated the [date] and filed the same day praying this Honourable Court to admit the defendant to bail pending trial."',
      '"The motion is supported by a [___] paragraph affidavit deposed to by [name], the [relationship] of the defendant, with exhibits A and B attached."',
      '"My Lord, bail is not a punishment; the defendant is presumed innocent and the offence charged is bailable."',
      '"My Lord, we undertake that the defendant will be available for his trial on every adjourned date."',
    ],
    pitfalls: [
      'Moving a bail application without proof of service on the prosecution — the court will stand it down or adjourn.',
      'Relying on ill health without a medical report from a government hospital.',
      'Producing sureties who cannot satisfy the means or residence requirements, so a granted bail cannot be perfected.',
      'Forgetting to apply for the CTC of the ruling, which the registry needs before it will process the release.',
    ],
    keywords: ['bail', 'motion', 'surety', 'perfection', 'release warrant'],
  },

  // -------------------------------------------------------------------------
  // Interlocutory
  // -------------------------------------------------------------------------
  {
    id: 'proc-motion-on-notice',
    title: 'Moving a motion on notice',
    track: 'interlocutory',
    court: 'Any court of record',
    summary:
      'The order in which an interlocutory application is moved, opposed and ruled upon — the most common event in a practitioner’s week.',
    typicalDuration: '15–45 minutes on the day; ruling same day or reserved',
    governingRules: [
      'Order 43, High Court of Lagos State (Civil Procedure) Rules 2019',
      'Order 26, Federal High Court (Civil Procedure) Rules 2019',
      'Evidence Act 2011, sections 115–116',
    ],
    stages: [
      {
        heading: '1. Before the date',
        steps: [
          'File the motion on notice, the supporting affidavit with exhibits, and the written address in support.',
          'Serve the respondent and file the affidavit of service — the court will not hear you without it.',
          'Where a counter affidavit is served, file a reply on points of law and, where new facts are raised, a further affidavit.',
        ],
      },
      {
        heading: '2. Moving the application',
        steps: [
          'Announce appearance, then tell the court what the matter is for.',
          'Identify the motion by its date of filing and read or summarise the prayers.',
          'Identify the affidavit: the number of paragraphs, who deposed to it, and the exhibits attached.',
          'Draw the court’s attention to the paragraphs that carry the application — never read all of them.',
          'Adopt the written address and highlight the leading authority in a sentence or two.',
          'Formally urge the court: "We urge Your Lordship to grant the reliefs on the face of the motion."',
        ],
      },
      {
        heading: '3. Opposition and reply',
        steps: [
          'The respondent identifies the counter affidavit and its exhibits, adopts their written address and urges the court to refuse the application.',
          'The applicant replies on points of law only — no new facts, no new authority springing a surprise.',
          'The court rules at once, or reserves the ruling to a date.',
        ],
      },
    ],
    saidInCourt: [
      '"My Lord, the matter is slated for the hearing of our motion on notice dated the [date] and filed on the [date]."',
      '"The motion is supported by a [___] paragraph affidavit deposed to by [name], to which exhibits A to C are attached. We rely on all the paragraphs and particularly on paragraphs 4, 6 and 9."',
      '"We have also filed a written address dated the [date] which we hereby adopt as our argument in this application."',
      '"My Lord, we have a reply on points of law dated the [date], which we equally adopt."',
      '"We urge Your Lordship to grant the application as prayed."',
    ],
    pitfalls: [
      'Moving without proof of service; the application will be stood down at best.',
      'Reading every paragraph of a long affidavit — the court expects you to point to the paragraphs that matter.',
      'Raising new facts in a reply on points of law; the court will disregard them.',
      'Arguing law in the affidavit instead of the address, which exposes the paragraphs to being struck out under section 115(2) of the Evidence Act.',
    ],
    keywords: ['motion on notice', 'moving a motion', 'counter affidavit', 'reply on points of law'],
  },
  {
    id: 'proc-motion-ex-parte',
    title: 'Motion ex parte and interim orders',
    track: 'interlocutory',
    court: 'Any court of record',
    summary:
      'How an urgent application is taken in the absence of the other side, and the strict limits on the order it produces.',
    typicalDuration: '10–20 minutes, often in chambers or on an urgent mention',
    governingRules: [
      'Order 39, High Court of Lagos State (Civil Procedure) Rules 2019',
      'Constitution of the Federal Republic of Nigeria 1999 (as amended), section 36(1)',
      'Kotoye v. CBN (1989) LP e-LR (SC) pt 1021',
    ],
    stages: [
      {
        heading: '1. Filing',
        steps: [
          'File the originating process, the motion ex parte, an affidavit of urgency, the supporting affidavit and a written address.',
          'File the motion on notice simultaneously — the court will want to know when the other side will be heard.',
          'Apply to the registry for an urgent date and, where the rules allow, draw the judge’s attention through the registrar.',
        ],
      },
      {
        heading: '2. The hearing',
        steps: [
          'Counsel announces appearance and states that the application is ex parte and urgent.',
          'Counsel discloses every material fact, including facts favourable to the absent party — the duty of full and frank disclosure.',
          'The court may grant the order, order the applicant to put the respondent on notice, or refuse the application.',
          'An ex parte injunction lasts a maximum of 14 days and is not renewable; the court fixes the motion on notice within that period.',
        ],
      },
      {
        heading: '3. After the order',
        steps: [
          'Serve the order, the originating process and the motion on notice on the respondent immediately.',
          'File the undertaking as to damages if it was ordered as a condition.',
          'Return to court on the fixed date to move the motion on notice; if the order lapses without being replaced, the protection is gone.',
        ],
      },
    ],
    saidInCourt: [
      '"My Lord, we crave the indulgence of the court to take this matter as one of extreme urgency."',
      '"We have a motion ex parte dated today, supported by an affidavit of urgency of [___] paragraphs."',
      '"My Lord, in compliance with our duty of full disclosure, we draw the court’s attention to the fact that [state the adverse fact]."',
      '"We undertake to abide by any order this Honourable Court may make as to damages."',
    ],
    pitfalls: [
      'Suppressing a material fact — the order will be discharged and costs may follow personally against counsel.',
      'Seeking on an ex parte application the substantive relief claimed in the suit; the court will refuse it.',
      'Allowing the 14 days to lapse without moving the motion on notice.',
      'Failing to file the motion on notice at the same time, which many judges treat as a reason to refuse outright.',
    ],
    keywords: ['ex parte', 'interim order', 'urgency', 'full disclosure', '14 days'],
  },

  // -------------------------------------------------------------------------
  // Evidence
  // -------------------------------------------------------------------------
  {
    id: 'proc-calling-witness',
    title: 'Calling a witness and examination-in-chief',
    track: 'evidence',
    court: 'Any court of record',
    summary:
      'Getting a witness into the box, sworn, and their evidence properly before the court under the frontloading regime.',
    typicalDuration: '10–30 minutes per witness in chief',
    governingRules: [
      'Evidence Act 2011, sections 214–215 and 218',
      'Order 32, High Court of Lagos State (Civil Procedure) Rules 2019 (witness statements on oath)',
    ],
    stages: [
      {
        heading: '1. Getting the witness into the box',
        steps: [
          'Announce that the witness is in court and apply that they be sworn.',
          'The registrar administers the oath or affirmation according to the witness’s belief.',
          'The witness states their name, address and occupation for the record.',
        ],
      },
      {
        heading: '2. Adopting the written statement on oath',
        steps: [
          'Ask the witness whether they made a written statement on oath in the matter, and when.',
          'Show them the statement, ask them to identify their signature, and ask whether they wish to adopt it as their evidence.',
          'On adoption the statement becomes the evidence-in-chief; the court records the adoption.',
          'Where a correction is needed, seek leave to have the witness make it orally before adoption.',
        ],
      },
      {
        heading: '3. Documents and closing in chief',
        steps: [
          'Lead the witness through any documents to be tendered: identify, authenticate, then tender.',
          'Ask only non-leading questions on matters not covered by the statement, and only with leave where the point is new.',
          'Tell the court when you are done: "That is the evidence of this witness in chief."',
        ],
      },
    ],
    saidInCourt: [
      '"My Lord, our witness is in court. We apply that he be sworn."',
      '"Q: Do you know anything about this case? Q: Did you make a written statement on oath? Q: When did you make it? Q: Is this your signature?"',
      '"My Lord, the witness has identified his written statement on oath deposed to on the [date]. We apply that he adopts it as his evidence in this suit."',
      '"That is the evidence of PW1 in chief, My Lord."',
    ],
    pitfalls: [
      'Asking leading questions on matters in dispute — objection will follow and the answer may be expunged.',
      'Letting the witness adopt a statement that has not been properly deposed to before a commissioner for oaths.',
      'Failing to have the witness identify their signature before adoption.',
      'Going beyond the written statement without leave, which invites an objection that the evidence goes to no issue.',
    ],
    keywords: ['witness', 'examination in chief', 'written statement on oath', 'adoption', 'oath'],
  },
  {
    id: 'proc-tendering-exhibits',
    title: 'Tendering documents and electronic evidence',
    track: 'evidence',
    court: 'Any court of record',
    summary:
      'The sequence for getting a document admitted, including the section 84 certificate that computer-generated evidence requires.',
    typicalDuration: '5–15 minutes per document, longer if contested',
    governingRules: [
      'Evidence Act 2011, sections 83, 84, 85–90 and 102–105',
      'Kubor v. Dickson (2013) LP e-LR (SC) pt 1005',
    ],
    stages: [
      {
        heading: '1. Laying the foundation',
        steps: [
          'Establish through the witness that the document exists, what it is, and the witness’s connection to it — maker, recipient or custodian.',
          'Where the original is not available, establish the ground for secondary evidence under section 89 before offering a copy.',
          'For a public document, ensure you hold a certified true copy — only a CTC is admissible as secondary evidence of a public document.',
        ],
      },
      {
        heading: '2. Tendering',
        steps: [
          'Show the document to opposing counsel, then to the witness for identification.',
          'Apply formally: "My Lord, we seek to tender this document in evidence."',
          'The court asks the other side whether there is any objection.',
          'If unopposed, the document is admitted and marked as an exhibit. If opposed, the objection is argued and either ruled on at once or the document admitted subject to a ruling in the judgment.',
        ],
      },
      {
        heading: '3. Electronic and computer-generated documents',
        steps: [
          'Tender the section 84(2) certificate identifying the document, describing the manner of production, the device used, and signed by a person occupying a responsible position.',
          'Alternatively lay the foundation orally through a witness who can speak to the conditions in section 84(2).',
          'Without one or the other, the computer-generated document is inadmissible however relevant it is.',
        ],
      },
    ],
    saidInCourt: [
      '"My Lord, may the witness be shown the document. Q: Do you recognise this document? Q: What is it? Q: How did it come into your possession?"',
      '"My Lord, we seek to tender the document in evidence."',
      '"My Lord, we object. The document is a public document and what has been produced is an uncertified photocopy, contrary to sections 89 and 90 of the Evidence Act."',
      '"My Lord, we have complied with section 84(2) of the Evidence Act and the certificate is attached to the document sought to be tendered."',
    ],
    pitfalls: [
      'Tendering a computer print-out without a section 84 certificate — the single most common reason documentary evidence fails.',
      'Producing an uncertified copy of a public document.',
      'Tendering through a witness who cannot identify the document or speak to its origin.',
      'Failing to ask that the exhibit be marked, leaving the record uncertain about which document was admitted.',
    ],
    keywords: ['exhibit', 'tendering', 'section 84', 'certified true copy', 'electronic evidence', 'Kubor'],
  },
  {
    id: 'proc-cross-examination',
    title: 'Cross-examination and re-examination',
    track: 'evidence',
    court: 'Any court of record',
    summary:
      'Testing the witness the other side has called, and repairing the damage on re-examination.',
    typicalDuration: '20 minutes to several hours per witness',
    governingRules: [
      'Evidence Act 2011, sections 214–215, 223 and 232–233',
      'Constitution of the Federal Republic of Nigeria 1999 (as amended), section 36(6)(d)',
    ],
    stages: [
      {
        heading: '1. Preparation',
        steps: [
          'Reduce your case to the three or four propositions this witness can be made to concede or be shown not to know.',
          'Index the witness’s written statement against the documents; contradictions between them are your material.',
          'Where a previous inconsistent statement will be used, have it ready and be prepared to comply with section 232 of the Evidence Act.',
        ],
      },
      {
        heading: '2. Cross-examining',
        steps: [
          'Lead — ask closed questions that put your proposition and invite a yes or no.',
          'Cover everything you must put to the witness: a case not put to a witness cannot be relied upon later.',
          'Confront a witness with a previous inconsistent statement by drawing their attention to the part relied on before contradicting them with it.',
          'Stop when you have the concession; one question too many gives it back.',
        ],
      },
      {
        heading: '3. Re-examination',
        steps: [
          'Re-examine only on matters arising from cross-examination — no new ground.',
          'Use open, non-leading questions to let the witness explain an answer that came out badly.',
          'Where nothing needs repair, tell the court there is no re-examination; needless re-examination usually makes things worse.',
        ],
      },
    ],
    saidInCourt: [
      '"My Lord, we have questions for the witness in cross-examination."',
      '"I put it to you that you were not present at the scene on that day."',
      '"Look at paragraph 6 of your written statement on oath. You said there that [___]. Do you stand by that?"',
      '"My Lord, we have no re-examination."',
    ],
    pitfalls: [
      'Failing to put your case to the witness — the court will hold that the evidence stands unchallenged.',
      'Asking open questions in cross-examination and handing the witness the floor.',
      'Introducing new matter in re-examination without leave.',
      'Contradicting a witness with a previous statement without first drawing their attention to it, contrary to section 232.',
    ],
    keywords: ['cross examination', 're-examination', 'previous inconsistent statement', 'putting your case'],
  },

  // -------------------------------------------------------------------------
  // Specialised
  // -------------------------------------------------------------------------
  {
    id: 'proc-matrimonial-hearing',
    title: 'Matrimonial causes — hearing of a petition',
    track: 'specialised',
    court: 'High Court of a State',
    summary:
      'How a petition for dissolution of marriage proceeds from filing to decree nisi and decree absolute.',
    typicalDuration: '9–24 months, plus three months from nisi to absolute',
    governingRules: [
      'Matrimonial Causes Act, LFN 2004, sections 15, 16, 55 and 58',
      'Matrimonial Causes Rules, Orders V, VII, X and XIV',
    ],
    stages: [
      {
        heading: '1. Filing and service',
        steps: [
          'File the petition with the verifying affidavit, the certificate as to reconciliation, the marriage certificate and the notice of the petition.',
          'Serve the respondent personally; substituted service requires an order and strict compliance with its terms.',
          'The respondent files an answer within the time allowed, and may cross-petition.',
        ],
      },
      {
        heading: '2. Hearing',
        steps: [
          'The petitioner testifies to the marriage, the children, domicile and the facts relied on under section 15(2).',
          'Documents — the marriage certificate, correspondence, medical or police reports — are tendered through the petitioner.',
          'The respondent cross-examines, then opens their case if an answer was filed.',
          'Ancillary matters — custody, maintenance, settlement of property — are heard with the petition or reserved.',
        ],
      },
      {
        heading: '3. Decree nisi and decree absolute',
        steps: [
          'If the court is satisfied the marriage has broken down irretrievably, it pronounces a decree nisi and makes orders on the ancillary reliefs.',
          'The decree becomes absolute after three months, unless the court shortens the period for special reasons.',
          'Apply for the decree absolute at the registry after the period; only then is either party free to remarry.',
        ],
      },
    ],
    saidInCourt: [
      '"My Lord, this is a petition for the dissolution of the marriage between the petitioner and the respondent celebrated on the [date]."',
      '"My Lord, we tender the certificate of marriage issued at the [___] Marriage Registry."',
      '"My Lord, we urge the court to hold that the marriage has broken down irretrievably and to pronounce a decree nisi."',
      '"We further urge the court to grant custody of the children of the marriage to the petitioner with reasonable access to the respondent."',
    ],
    pitfalls: [
      'Filing without the certificate as to reconciliation required by section 11 of the Act.',
      'Presenting a petition within two years of the marriage without the leave required by section 30.',
      'Overlooking the section 15(2) fact actually pleaded and giving evidence of a different one.',
      'Assuming a decree nisi ends the marriage — it does not until it is made absolute.',
    ],
    keywords: ['matrimonial', 'petition', 'decree nisi', 'decree absolute', 'custody', 'dissolution'],
  },
  {
    id: 'proc-fundamental-rights',
    title: 'Fundamental rights enforcement hearing',
    track: 'specialised',
    court: 'High Court of a State / Federal High Court',
    summary:
      'The streamlined procedure under the FREP Rules 2009, heard on affidavit evidence without pleadings or oral testimony.',
    typicalDuration: '2–8 months',
    governingRules: [
      'Fundamental Rights (Enforcement Procedure) Rules 2009, Orders II, IV and XI',
      'Constitution of the Federal Republic of Nigeria 1999 (as amended), sections 33–46',
    ],
    stages: [
      {
        heading: '1. Commencement',
        steps: [
          'File an originating motion or originating summons with the statement setting out the applicant’s name, the reliefs and the grounds, the supporting affidavit and the written address.',
          'No leave is required and the application may be brought by the applicant or by anyone acting on their behalf.',
          'Serve the respondents; where the applicant is in detention, service on the detaining authority is essential.',
        ],
      },
      {
        heading: '2. Hearing',
        steps: [
          'The case is heard on the affidavits — there is ordinarily no oral evidence and no pleadings.',
          'The respondent files a counter affidavit and written address; the applicant may file a further affidavit and reply.',
          'Counsel adopt their addresses. Where the affidavits conflict irreconcilably on a material fact, the court may order oral evidence on that fact alone.',
        ],
      },
      {
        heading: '3. Judgment',
        steps: [
          'The court declares whether the right was breached and grants the reliefs — declarations, an order of release, an injunction, an apology or damages.',
          'Costs follow the event; the FREP Rules encourage the court to be generous in vindicating rights.',
          'An appeal lies to the Court of Appeal as of right, the decision being on the interpretation of Chapter IV of the Constitution.',
        ],
      },
    ],
    saidInCourt: [
      '"My Lord, this is an application for the enforcement of the fundamental rights of the applicant under Chapter IV of the Constitution and the FREP Rules 2009."',
      '"The application is supported by a [___] paragraph affidavit and a statement setting out the reliefs and grounds."',
      '"My Lord, the applicant was detained for [___] days without being brought before any court, in breach of section 35(4) and (5) of the Constitution."',
      '"We urge the court to grant the declarations sought, order the release of the applicant and award damages."',
    ],
    pitfalls: [
      'Pleading a claim whose principal complaint is not a breach of a fundamental right — it will be struck out as incompetent.',
      'Suing an unnamed officer, which makes service and enforcement difficult.',
      'Filing pleadings or calling oral evidence as of course; the procedure is on affidavit.',
      'Overlooking the pre-action requirements against public officers where a separate enactment imposes them.',
    ],
    keywords: ['fundamental rights', 'FREP', 'chapter IV', 'detention', 'declaration', 'damages'],
  },
  {
    id: 'proc-garnishee',
    title: 'Garnishee proceedings',
    track: 'specialised',
    court: 'The court that gave the judgment',
    summary:
      'Attaching money in the hands of a third party to satisfy a judgment — from order nisi to order absolute.',
    typicalDuration: '2–6 months',
    governingRules: [
      'Sheriffs and Civil Process Act, LFN 2004, sections 83–92',
      'Judgment Enforcement Rules, Order VIII',
    ],
    stages: [
      {
        heading: '1. Order nisi',
        steps: [
          'File a motion ex parte with an affidavit deposing to the judgment, the sum outstanding and the funds held by the garnishee.',
          'Where public funds are involved, obtain and exhibit the consent of the Attorney-General under section 84.',
          'The court makes an order nisi attaching the funds and directing the garnishee to show cause on a fixed date.',
        ],
      },
      {
        heading: '2. Service and the return date',
        steps: [
          'Serve the order nisi on the garnishee at least 14 days before the return date, and on the judgment debtor.',
          'The garnishee files an affidavit to show cause — disclosing the balance, denying any indebtedness, or claiming a lien or set-off.',
          'The judgment debtor has no right to be heard on the merits of the judgment at this stage, only on matters touching the attachment.',
        ],
      },
      {
        heading: '3. Order absolute',
        steps: [
          'Where the garnishee shows no sufficient cause, the court makes the order absolute and directs payment of the attached sum to the judgment creditor.',
          'Where the garnishee denies holding funds, the court may order the issue to be tried.',
          'The garnishee pays into court or directly to the creditor as ordered; failure exposes the garnishee to execution against it directly.',
        ],
      },
    ],
    saidInCourt: [
      '"My Lord, we have a motion ex parte for a garnishee order nisi attaching the funds of the judgment debtor in the hands of the garnishee bank."',
      '"My Lord, the garnishee was served with the order nisi on the [date] and has filed an affidavit to show cause."',
      '"My Lord, the affidavit to show cause admits a credit balance of N[___]. We urge the court to make the order absolute in that sum."',
    ],
    pitfalls: [
      'Proceeding against public funds without the Attorney-General’s consent — the proceedings are incompetent.',
      'Short service of the order nisi on the garnishee.',
      'Allowing the judgment debtor to reopen the merits of the judgment in garnishee proceedings.',
      'Attaching an account that is not the judgment debtor’s, which exposes the creditor to a claim by the true owner.',
    ],
    keywords: ['garnishee', 'order nisi', 'order absolute', 'execution', 'attorney general consent'],
  },
  {
    id: 'proc-election-petition',
    title: 'Election petition — tribunal practice',
    track: 'specialised',
    court: 'Election Petition Tribunal / Court of Appeal',
    summary:
      'The compressed, constitutionally timed procedure for challenging the return of a candidate.',
    typicalDuration: '180 days from filing to judgment, fixed by the Constitution',
    governingRules: [
      'Constitution of the Federal Republic of Nigeria 1999 (as amended), section 285',
      'Electoral Act 2022, sections 130–147',
      'First Schedule to the Electoral Act 2022',
    ],
    stages: [
      {
        heading: '1. Filing',
        steps: [
          'File the petition within 21 days of the declaration of the result — a constitutional deadline that cannot be extended.',
          'Frontload the list of witnesses, the written statements on oath and the documents to be relied on with the petition.',
          'Pay the prescribed security for costs; failure renders the petition liable to be struck out.',
        ],
      },
      {
        heading: '2. Pre-hearing session',
        steps: [
          'Apply for the pre-hearing notice within 7 days of the close of pleadings; failure to apply is fatal and the petition is dismissed as abandoned.',
          'At the pre-hearing session issues are settled, documents admitted or objected to, the number of witnesses limited and a hearing timetable fixed.',
          'The tribunal issues a pre-hearing report which controls the conduct of the hearing.',
        ],
      },
      {
        heading: '3. Hearing and judgment',
        steps: [
          'The petitioner calls witnesses, who adopt their statements on oath and are cross-examined; time allocations are enforced strictly.',
          'Certified true copies of electoral documents are tendered, often from the bar by consent.',
          'Written addresses are filed on the tribunal’s timetable and adopted.',
          'Judgment is delivered within 180 days of the filing of the petition; an appeal must be heard and determined within 60 days of the judgment.',
        ],
      },
    ],
    saidInCourt: [
      '"My Lord, this petition was filed on the [date], within 21 days of the declaration of the result on the [date]."',
      '"My Lord, we apply for the issuance of pre-hearing notice pursuant to paragraph 18 of the First Schedule to the Electoral Act 2022."',
      '"My Lord, we tender from the bar the certified true copies of Forms EC8A for the polling units listed in our petition."',
    ],
    pitfalls: [
      'Missing the 21-day filing window — no tribunal can extend it.',
      'Failing to apply for the pre-hearing notice within 7 days of the close of pleadings; the petition is dismissed as abandoned.',
      'Pleading grounds not recognised by section 134 of the Electoral Act.',
      'Dumping certified documents on the tribunal without tying each to a pleaded polling unit through a witness.',
    ],
    keywords: ['election petition', 'tribunal', 'section 285', 'pre-hearing', '180 days', 'EC8A'],
  },

  // -------------------------------------------------------------------------
  // Appellate
  // -------------------------------------------------------------------------
  {
    id: 'proc-appeal-hearing',
    title: 'Hearing of an appeal — Court of Appeal & Supreme Court',
    track: 'appellate',
    court: 'Court of Appeal / Supreme Court of Nigeria',
    summary:
      'From notice of appeal through the record and briefs to the hearing before a panel and judgment.',
    typicalDuration: '18 months to several years',
    governingRules: [
      'Court of Appeal Act, LFN 2004, section 24',
      'Court of Appeal Rules 2021, Orders 6, 7, 8 and 19',
      'Supreme Court Rules (as amended), Order 6',
    ],
    stages: [
      {
        heading: '1. Notice of appeal and record',
        steps: [
          'File the notice of appeal in the court below within 14 days (interlocutory) or 3 months (final) of the decision.',
          'The registrar of the court below compiles and transmits the record of appeal within 60 days; if it fails, the appellant may compile and transmit within a further 30 days.',
          'Enter the appeal at the appellate court registry and obtain the appeal number.',
        ],
      },
      {
        heading: '2. Briefs of argument',
        steps: [
          'The appellant files a brief within 45 days of the receipt of the record.',
          'The respondent files within 30 days of service of the appellant’s brief, and may file a respondent’s notice or a cross-appeal.',
          'The appellant may file a reply brief within 14 days, confined to new points raised in the respondent’s brief.',
          'Failure to file the appellant’s brief in time exposes the appeal to dismissal for want of prosecution.',
        ],
      },
      {
        heading: '3. Hearing before the panel',
        steps: [
          'The appeal is listed before a panel of three Justices (Court of Appeal) or five or seven (Supreme Court).',
          'Counsel announce appearances; the presiding Justice calls on the appellant.',
          'Counsel identify their brief by its filing date, adopt it, and are permitted brief oral highlights — the argument is in the brief, not at the bar.',
          'The panel asks questions; answer them directly and return to the brief.',
          'Judgment is reserved to a date to be communicated to the parties.',
        ],
      },
      {
        heading: '4. Judgment',
        steps: [
          'The lead judgment is read, and the other Justices state whether they concur or dissent.',
          'Orders are made — the appeal allowed, dismissed, or the matter remitted for retrial — and costs assessed.',
          'A party dissatisfied with a Court of Appeal decision may appeal to the Supreme Court, as of right or with leave depending on the ground.',
        ],
      },
    ],
    saidInCourt: [
      '"My Lords, [Name], with me [Name], appearing for the Appellant."',
      '"My Lords, the appeal is against the judgment of the High Court of [State] delivered on the [date] by [Judge]."',
      '"We filed our Appellant’s Brief of Argument on the [date] and a Reply Brief on the [date], both of which we adopt as our argument in this appeal."',
      '"My Lords, we distilled [___] issues for determination from our [___] grounds of appeal and urge the court to allow the appeal and set aside the judgment of the court below."',
    ],
    pitfalls: [
      'Filing a notice of appeal out of time without first seeking an extension and leave.',
      'Grounds of appeal that are argumentative, narrative, or unaccompanied by particulars of error.',
      'Distilling more issues than grounds of appeal — a standing ground for striking out the issues.',
      'Arguing at length at the bar instead of adopting the brief; appellate courts hear argument from the brief.',
      'Raising a fresh issue on appeal without the leave of the court.',
    ],
    keywords: ['appeal', 'brief of argument', 'record of appeal', 'panel', 'grounds of appeal'],
  },
];

const BY_ID = new Map(COURTROOM_PROCEDURES.map((procedure) => [procedure.id, procedure]));

export const procedureById = (id: string): CourtroomProcedure | undefined => BY_ID.get(id);

export const proceduresInTrack = (track: string): CourtroomProcedure[] =>
  COURTROOM_PROCEDURES.filter((procedure) => procedure.track === track);

/** Free-text search across titles, stages, steps, pitfalls and the rules cited. */
export const searchProcedures = (query: string): CourtroomProcedure[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return COURTROOM_PROCEDURES;

  return COURTROOM_PROCEDURES.filter((procedure) =>
    [
      procedure.title,
      procedure.summary,
      procedure.court,
      ...procedure.governingRules,
      ...procedure.keywords,
      ...procedure.saidInCourt,
      ...procedure.pitfalls,
      ...procedure.stages.flatMap((stage) => [stage.heading, ...stage.steps]),
    ]
      .join(' ')
      .toLowerCase()
      .includes(needle),
  );
};
