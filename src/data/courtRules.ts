import { NIGERIAN_STATES, highCourtName, magistrateCourtName, stateSlug } from './nigeria';

/**
 * The Rules of Court library.
 *
 * Six categories of rule book are offered — Magistrate Courts, the High Courts of the
 * 36 states and the FCT, the National Industrial Court, the Federal High Court, the
 * Court of Appeal and the Supreme Court. Each book is a list of Orders, each Order a
 * list of Rules, so that a search for "Order 25", "rule 3" or "summary judgment" lands
 * on the right provision.
 *
 * The rule text here is a working practitioner's statement of each provision. State
 * High Court and Magistrate Court rules follow the same civil-procedure architecture
 * across the Federation, with local variations in Order numbering — always confirm the
 * numbering against the edition currently gazetted in your state before filing.
 */

export type CourtRuleCategoryId =
  | 'magistrate'
  | 'high-court'
  | 'national-industrial-court'
  | 'federal-high-court'
  | 'court-of-appeal'
  | 'supreme-court';

export interface CourtRuleEntry {
  ruleNumber: string;
  title: string;
  content: string;
}

export interface CourtOrder {
  orderNumber: string;
  title: string;
  /** The area of court process this Order deals with, used by the search banner. */
  processArea: string;
  rules: CourtRuleEntry[];
}

export interface CourtRuleBook {
  id: string;
  courtName: string;
  category: CourtRuleCategoryId;
  state?: string;
  /** Title of the rules, e.g. "Federal High Court (Civil Procedure) Rules". */
  edition: string;
  /** Year of the edition, where a single edition applies nationwide. */
  year?: number;
  summary: string;
  orders: CourtOrder[];
}

export interface CourtRuleCategory {
  id: CourtRuleCategoryId;
  label: string;
  description: string;
  /** True where the category has one rule book per state. */
  isStateBased: boolean;
}

export const COURT_RULE_CATEGORIES: CourtRuleCategory[] = [
  {
    id: 'magistrate',
    label: 'Magistrate Court Rules',
    description:
      'Civil procedure in the Magistrate Courts of the states and the FCT — plaints, summonses, monetary jurisdiction, default judgment, execution and appeals to the High Court.',
    isStateBased: true,
  },
  {
    id: 'high-court',
    label: 'High Court Rules — 36 States & the FCT',
    description:
      'The High Court (Civil Procedure) Rules of every state of the Federation and the Federal Capital Territory, from commencement of action through pre-trial conference to enforcement of judgment.',
    isStateBased: true,
  },
  {
    id: 'national-industrial-court',
    label: 'National Industrial Court Rules',
    description:
      'Practice and procedure of the National Industrial Court of Nigeria in labour, employment, trade dispute and workplace discrimination matters.',
    isStateBased: false,
  },
  {
    id: 'federal-high-court',
    label: 'Federal High Court Rules',
    description:
      'Civil procedure of the Federal High Court across its exclusive jurisdiction — revenue, admiralty, companies, banking, intellectual property and federal agencies.',
    isStateBased: false,
  },
  {
    id: 'court-of-appeal',
    label: 'Court of Appeal Rules',
    description:
      'Appellate practice in the Court of Appeal — notice of appeal, compilation and transmission of records, briefs of argument, motions and hearing.',
    isStateBased: false,
  },
  {
    id: 'supreme-court',
    label: 'Supreme Court Rules',
    description:
      'Practice in the Supreme Court of Nigeria — appeals as of right and by leave, records, briefs, motions and the hearing of civil and criminal appeals.',
    isStateBased: false,
  },
];

// ---------------------------------------------------------------------------
// High Court (Civil Procedure) Rules — the architecture shared across the states
// ---------------------------------------------------------------------------

const highCourtOrders = (court: string): CourtOrder[] => [
  {
    orderNumber: '1',
    title: 'Application, Interpretation and Forms',
    processArea: 'Preliminary and general',
    rules: [
      {
        ruleNumber: '1',
        title: 'Application of the Rules',
        content: `These Rules apply to all civil proceedings in the ${court}, including proceedings pending at the date they come into force, save that the Court may in any pending cause give such directions as are necessary to prevent injustice.`,
      },
      {
        ruleNumber: '2',
        title: 'Interpretation',
        content:
          '"Claimant" means the party who commences an action; "Defendant" means the party against whom relief is claimed; "Judge" means a Judge of the Court; "Registry" means the registry of the Court at the judicial division in which the action is instituted. Words in the singular include the plural.',
      },
      {
        ruleNumber: '3',
        title: 'Forms',
        content:
          'The forms in the Appendix to these Rules shall be used with such variations as the circumstances of each case require. A departure from a form does not invalidate a process where the substance is preserved and no party is misled.',
      },
    ],
  },
  {
    orderNumber: '2',
    title: 'Effect of Non-Compliance',
    processArea: 'Preliminary and general',
    rules: [
      {
        ruleNumber: '1',
        title: 'Non-compliance an irregularity, not a nullity',
        content:
          'Failure to comply with these Rules as to time, place, manner or form shall be treated as an irregularity and shall not nullify the proceedings, save where the Court holds that the non-compliance has occasioned a miscarriage of justice.',
      },
      {
        ruleNumber: '2',
        title: 'Application to set aside for irregularity',
        content:
          'An application to set aside for irregularity any process, step or order shall be made within a reasonable time and before the applicant has taken any fresh step after becoming aware of the irregularity. The application shall state the irregularity complained of.',
      },
    ],
  },
  {
    orderNumber: '3',
    title: 'Commencement of Proceedings',
    processArea: 'Originating process',
    rules: [
      {
        ruleNumber: '1',
        title: 'Modes of commencement',
        content:
          'Subject to any statute, a civil proceeding shall be commenced by (a) writ of summons; (b) originating summons; (c) originating motion; or (d) petition. Where a statute prescribes a particular mode, that mode shall be used.',
      },
      {
        ruleNumber: '2',
        title: 'Front-loading — documents to accompany the originating process',
        content:
          'All originating processes shall be accompanied by (a) the statement of claim; (b) a list of witnesses to be called at trial; (c) written statements on oath of the witnesses, except a witness on subpoena; (d) copies of every document to be relied on at trial; and (e) a pre-action counselling certificate where required. An originating process not so accompanied shall not be accepted for filing by the Registry.',
      },
      {
        ruleNumber: '3',
        title: 'When originating summons is appropriate',
        content:
          'A proceeding may be begun by originating summons where the sole or principal question in issue is, or is likely to be, the construction of a written law, instrument, deed, will, contract or other document, or some question of law in which there is unlikely to be any substantial dispute of fact.',
      },
      {
        ruleNumber: '4',
        title: 'Life of an originating process',
        content:
          'An originating process is valid in the first instance for twelve months from the date of issue. The Court may, on application made before it expires, renew it for a further period not exceeding six months at a time where it has not been possible to effect service.',
      },
    ],
  },
  {
    orderNumber: '4',
    title: 'Place of Institution and Trial',
    processArea: 'Jurisdiction and venue',
    rules: [
      {
        ruleNumber: '1',
        title: 'Proper judicial division',
        content:
          'Every proceeding shall be commenced and tried in the judicial division in which the defendant resides or carries on business, or in which the cause of action arose wholly or in part, or in which the land the subject of the action is situate.',
      },
      {
        ruleNumber: '2',
        title: 'Transfer of a wrongly placed action',
        content:
          'Where a proceeding is commenced in the wrong judicial division, the Court shall not strike it out on that ground alone but may order it transferred to the proper division, on such terms as to costs as are just.',
      },
    ],
  },
  {
    orderNumber: '5',
    title: 'Issue and Service of Originating Process',
    processArea: 'Service of process',
    rules: [
      {
        ruleNumber: '1',
        title: 'Personal service the general rule',
        content:
          'An originating process shall be served personally by delivering a copy to the person to be served, who shall be shown the original. Service on a company is effected by delivery at, or by post to, the registered or head office, or on a director, secretary or other principal officer.',
      },
      {
        ruleNumber: '2',
        title: 'Substituted service',
        content:
          'Where prompt personal service cannot be effected, the Court may on application supported by affidavit order substituted service by (a) delivery to an adult at the last known address; (b) posting on the premises or on the notice board of the Court; (c) advertisement in a newspaper of national circulation; or (d) courier, electronic mail or any other electronic means the Court considers appropriate.',
      },
      {
        ruleNumber: '3',
        title: 'Affidavit of service',
        content:
          'The bailiff or other person effecting service shall depose to an affidavit of service stating the day, time, place and manner of service and the person served. The affidavit of service is prima facie proof of the matters stated in it.',
      },
      {
        ruleNumber: '4',
        title: 'Time when service is not permitted',
        content:
          'No process shall be served on a Sunday or a public holiday except by leave of the Court, nor between the hours of 6.00 p.m. and 6.00 a.m., save with such leave.',
      },
    ],
  },
  {
    orderNumber: '6',
    title: 'Service Out of Jurisdiction',
    processArea: 'Service of process',
    rules: [
      {
        ruleNumber: '1',
        title: 'Leave to serve outside the State',
        content:
          'Service of an originating process outside the State shall be effected in accordance with the Sheriffs and Civil Process Act, and the process shall be endorsed with a notice that it is to be served outside the State and the State in which it is to be served.',
      },
      {
        ruleNumber: '2',
        title: 'Time for appearance',
        content:
          'Where an originating process is served outside the State, the time for the defendant to enter appearance and respond shall be not less than thirty days from the date of service.',
      },
    ],
  },
  {
    orderNumber: '7',
    title: 'Parties, Joinder and Representation',
    processArea: 'Parties',
    rules: [
      {
        ruleNumber: '1',
        title: 'Joinder of parties',
        content:
          'All persons may be joined as claimants in whom any right to relief is alleged to exist, and all persons may be joined as defendants against whom a right to relief is alleged to exist, whether jointly, severally or in the alternative.',
      },
      {
        ruleNumber: '2',
        title: 'Misjoinder and non-joinder',
        content:
          'A cause shall not be defeated by reason of misjoinder or non-joinder of parties. The Court may at any stage, on application or of its own motion, order that the name of a party improperly joined be struck out, or that a person whose presence is necessary for the effectual determination of the questions in issue be added.',
      },
      {
        ruleNumber: '3',
        title: 'Representative action',
        content:
          'Where numerous persons have the same interest in a proceeding, it may be begun and continued by or against any one or more of them as representing all, on the authority of the Court, and any judgment given binds all the persons represented.',
      },
    ],
  },
  {
    orderNumber: '10',
    title: 'Summary Judgment',
    processArea: 'Interlocutory applications',
    rules: [
      {
        ruleNumber: '1',
        title: 'Application for summary judgment',
        content:
          'Where a claimant believes there is no defence to his claim, he shall file with the originating process an application for summary judgment supported by an affidavit stating the grounds of that belief, together with a written address in support.',
      },
      {
        ruleNumber: '2',
        title: 'Defendant showing a defence on the merits',
        content:
          'A defendant served with an application for summary judgment shall, within the time allowed for defence, file a statement of defence, deposition of witnesses, a counter affidavit and a written address showing that there is a triable issue or that he ought to be let in to defend.',
      },
      {
        ruleNumber: '3',
        title: 'Order of the Court',
        content:
          'Where it appears to the Court that the defendant has a good defence and ought to be permitted to defend the claim, the Court shall grant him leave to defend and the action shall proceed to trial. Where it appears that the defendant has no good defence, the Court may enter judgment for the claimant.',
      },
    ],
  },
  {
    orderNumber: '11',
    title: 'Undefended List',
    processArea: 'Interlocutory applications',
    rules: [
      {
        ruleNumber: '1',
        title: 'Entry on the undefended list',
        content:
          'Where an application is made for the issue of a writ in respect of a claim to recover a debt or liquidated money demand, supported by an affidavit setting out the grounds on which the claim is based and stating that in the deponent\'s belief there is no defence, the Court shall enter the suit on the undefended list and mark the writ accordingly.',
      },
      {
        ruleNumber: '2',
        title: 'Notice of intention to defend',
        content:
          'A defendant who intends to defend shall, not less than five days before the return date, file a notice of intention to defend together with an affidavit disclosing a defence on the merits. Where such affidavit discloses a defence on the merits, the Court shall transfer the suit to the general cause list.',
      },
    ],
  },
  {
    orderNumber: '13',
    title: 'Pleadings',
    processArea: 'Pleadings',
    rules: [
      {
        ruleNumber: '1',
        title: 'Material facts only',
        content:
          'Every pleading shall contain a statement in summary form of the material facts on which the party relies, but not the evidence by which those facts are to be proved, and shall be divided into consecutively numbered paragraphs each confined as nearly as may be to a distinct allegation.',
      },
      {
        ruleNumber: '2',
        title: 'Matters that must be specifically pleaded',
        content:
          'A party shall specifically plead any matter which, if not pleaded, might take the opposite party by surprise or raise issues of fact not arising out of the preceding pleading — including fraud, misrepresentation, breach of trust, wilful default, undue influence, limitation, res judicata and any relevant statute.',
      },
      {
        ruleNumber: '3',
        title: 'Statement of defence and time to file',
        content:
          'A defendant shall file his statement of defence, list of witnesses, written statements on oath and copies of documents to be relied on within forty-two days of service of the originating process on him, unless the Court orders otherwise.',
      },
      {
        ruleNumber: '4',
        title: 'Reply and close of pleadings',
        content:
          'A claimant may file a reply within fourteen days of service of the statement of defence. Pleadings are deemed closed fourteen days after service of the reply, or of the defence where no reply is filed, and no further pleading may be filed without leave.',
      },
    ],
  },
  {
    orderNumber: '15',
    title: 'Default of Pleadings and Default Judgment',
    processArea: 'Default and dismissal',
    rules: [
      {
        ruleNumber: '1',
        title: 'Default in liquidated demand',
        content:
          'Where the claim is for a debt or liquidated money demand and the defendant fails to file a defence within the time allowed, the claimant may apply for final judgment for the amount claimed with interest and costs.',
      },
      {
        ruleNumber: '2',
        title: 'Setting aside a default judgment',
        content:
          'A judgment given in default may be set aside on application made within a reasonable time, supported by an affidavit showing a good reason for the default and disclosing a defence on the merits, on such terms as to costs as the Court considers just.',
      },
    ],
  },
  {
    orderNumber: '17',
    title: 'Amendment',
    processArea: 'Pleadings',
    rules: [
      {
        ruleNumber: '1',
        title: 'Amendment with leave',
        content:
          'The Court may at any stage of the proceedings allow a party to amend his originating process or pleading, on such terms as to costs as are just, in such manner as may be necessary for determining the real question in controversy between the parties.',
      },
      {
        ruleNumber: '2',
        title: 'Effect of amendment',
        content:
          'An amended process takes effect from the date of the original process, and the amended pleading shall be marked with the date of the order allowing the amendment and the date of amendment.',
      },
    ],
  },
  {
    orderNumber: '20',
    title: 'Discovery, Inspection and Interrogatories',
    processArea: 'Evidence and disclosure',
    rules: [
      {
        ruleNumber: '1',
        title: 'Discovery of documents',
        content:
          'A party may, without leave, deliver to any other party a notice to produce for inspection any document referred to in that party\'s pleadings or affidavits. The Court may order discovery on oath of documents relating to any matter in question in the proceeding.',
      },
      {
        ruleNumber: '2',
        title: 'Interrogatories',
        content:
          'A party may, with the leave of the Court, deliver interrogatories in writing for the examination of the opposite party, which shall be answered on oath within the time fixed by the Court. Interrogatories which are irrelevant, scandalous or oppressive shall be disallowed.',
      },
    ],
  },
  {
    orderNumber: '25',
    title: 'Pre-Trial Conference and Case Management',
    processArea: 'Case management',
    rules: [
      {
        ruleNumber: '1',
        title: 'Application for a pre-trial conference notice',
        content:
          'Within fourteen days after the close of pleadings, the claimant shall apply for the issue of a pre-trial conference notice, accompanied by a pre-trial information sheet. Where the claimant fails to do so, the defendant may apply, or may apply to dismiss the action.',
      },
      {
        ruleNumber: '2',
        title: 'Objects of the pre-trial conference',
        content:
          'The Judge shall convene a pre-trial conference for (a) disposal of all matters that can be dealt with on interlocutory application; (b) giving directions for the filing and exchange of any further processes; (c) promoting amicable settlement or referral to an alternative dispute resolution centre; (d) settling the issues for trial; and (e) fixing a timetable for the hearing.',
      },
      {
        ruleNumber: '3',
        title: 'Pre-trial conference report and sanctions',
        content:
          'At the conclusion of the conference the Judge shall issue a report which guides the subsequent course of the proceedings. Where a party or his legal practitioner fails to attend or to comply with a direction, the Judge may dismiss the claim, enter judgment on the counterclaim, strike out the defence, or make such other order as is just.',
      },
    ],
  },
  {
    orderNumber: '26',
    title: 'Motions and Other Applications',
    processArea: 'Interlocutory applications',
    rules: [
      {
        ruleNumber: '1',
        title: 'Form of an application',
        content:
          'Every application to the Court shall be by motion supported by an affidavit and a written address, and shall state under what rule or law it is brought. A motion on notice shall be served on every party affected not less than two clear days before the day named for the hearing.',
      },
      {
        ruleNumber: '2',
        title: 'Ex parte applications',
        content:
          'An application may be made ex parte only where the delay caused by proceeding on notice would entail irreparable or serious mischief, and shall be supported by an affidavit of urgency. An order made ex parte has effect for not more than seven days, and the applicant shall within that period bring a motion on notice.',
      },
      {
        ruleNumber: '3',
        title: 'Preliminary objection',
        content:
          'A party objecting to the competence of the proceedings or to the jurisdiction of the Court shall raise the objection by motion on notice or in his written address, giving the other party notice of the grounds relied on, and the objection shall be determined before the substantive matter.',
      },
    ],
  },
  {
    orderNumber: '27',
    title: 'Injunctions and Interim Preservation of Property',
    processArea: 'Interlocutory applications',
    rules: [
      {
        ruleNumber: '1',
        title: 'Interlocutory injunction',
        content:
          'An application for an interlocutory injunction may be made by any party at any stage, supported by an affidavit disclosing a legal right to be protected, a serious question to be tried, the balance of convenience, the irreparability of the injury and an undertaking as to damages.',
      },
      {
        ruleNumber: '2',
        title: 'Interim injunction and undertaking as to damages',
        content:
          'The Court may grant an interim injunction pending the hearing of a motion on notice where the matter is urgent, upon the applicant giving an undertaking in damages to abide by any order the Court may make should it turn out that the order ought not to have been granted.',
      },
    ],
  },
  {
    orderNumber: '30',
    title: 'Trial',
    processArea: 'Trial',
    rules: [
      {
        ruleNumber: '1',
        title: 'Order of proceedings at trial',
        content:
          'At the trial the claimant shall open his case and call his witnesses, who shall adopt their written statements on oath and be cross-examined and re-examined. At the close of the claimant\'s case the defendant shall open his defence and call his witnesses in like manner.',
      },
      {
        ruleNumber: '2',
        title: 'Written addresses',
        content:
          'At the close of evidence the defendant shall within twenty-one days file a written address, and the claimant shall within twenty-one days of service file his own, with a reply on points of law within seven days. Oral argument of not more than twenty minutes may be allowed to adopt the address.',
      },
      {
        ruleNumber: '3',
        title: 'Adjournments',
        content:
          'A party seeking an adjournment shall pay such costs as the Court may assess. A trial shall so far as possible proceed from day to day until concluded.',
      },
    ],
  },
  {
    orderNumber: '35',
    title: 'Judgment and Orders',
    processArea: 'Judgment',
    rules: [
      {
        ruleNumber: '1',
        title: 'Delivery of judgment',
        content:
          'The Court shall deliver its judgment in writing within ninety days after the conclusion of final addresses, and shall furnish the parties with duly authenticated copies on request.',
      },
      {
        ruleNumber: '2',
        title: 'Interest on judgment debt',
        content:
          'The Court may order interest at a rate not less than ten per cent per annum to be paid on the judgment sum from the date of judgment until the judgment is wholly satisfied.',
      },
      {
        ruleNumber: '3',
        title: 'Correction of clerical errors',
        content:
          'Clerical mistakes in a judgment or order, or errors arising from an accidental slip or omission, may at any time be corrected by the Court on motion without an appeal.',
      },
    ],
  },
  {
    orderNumber: '40',
    title: 'Enforcement of Judgment',
    processArea: 'Enforcement',
    rules: [
      {
        ruleNumber: '1',
        title: 'Modes of enforcement',
        content:
          'A judgment for the payment of money may be enforced by writ of fieri facias, garnishee proceedings, a charging order, the appointment of a receiver, or committal or sequestration in a proper case, in accordance with the Sheriffs and Civil Process Act and the Judgment Enforcement Rules.',
      },
      {
        ruleNumber: '2',
        title: 'Garnishee proceedings',
        content:
          'A judgment creditor may apply ex parte, supported by an affidavit, for a garnishee order nisi attaching debts owing to the judgment debtor in the hands of a garnishee. The order nisi shall be served on the garnishee and the judgment debtor at least fourteen days before the return date, when the Court may make the order absolute.',
      },
      {
        ruleNumber: '3',
        title: 'Stay of execution',
        content:
          'An application for stay of execution pending appeal shall be made first to the Court that gave the judgment, supported by an affidavit disclosing special or exceptional circumstances, and shall exhibit the notice of appeal.',
      },
    ],
  },
  {
    orderNumber: '49',
    title: 'Costs',
    processArea: 'Costs',
    rules: [
      {
        ruleNumber: '1',
        title: 'Costs follow the event',
        content:
          'Costs are at the discretion of the Court and shall ordinarily follow the event, unless for good cause the Court orders otherwise. In fixing costs the Court shall have regard to the conduct of the parties, the complexity of the matter and the reasonable expenses of the successful party, including legal practitioner\'s fees.',
      },
    ],
  },
  {
    orderNumber: '52',
    title: 'Appeals from the Magistrate Court',
    processArea: 'Appeals',
    rules: [
      {
        ruleNumber: '1',
        title: 'Notice of appeal',
        content: `An appeal from a Magistrate Court to the ${court} shall be by notice of appeal filed in the registry of the Magistrate Court within thirty days of the decision appealed against, setting out the grounds of appeal and the relief sought from the appellate Court.`,
      },
      {
        ruleNumber: '2',
        title: 'Record of appeal and hearing',
        content:
          'The registrar of the Magistrate Court shall compile and transmit the record of appeal within sixty days of the filing of the notice of appeal. The appeal is by way of rehearing on the record, and the appellate Court may affirm, vary, set aside or remit the decision for rehearing.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Magistrate Court Rules
// ---------------------------------------------------------------------------

const magistrateOrders = (court: string, state: string): CourtOrder[] => [
  {
    orderNumber: '1',
    title: 'Application, Interpretation and Forms',
    processArea: 'Preliminary and general',
    rules: [
      {
        ruleNumber: '1',
        title: 'Application',
        content: `These Rules govern the practice and procedure in civil causes and matters in the ${court}, and are made under the Magistrates’ Courts Law of ${state}.`,
      },
      {
        ruleNumber: '2',
        title: 'Forms and irregularities',
        content:
          'The prescribed forms shall be used with such variations as circumstances require. Non-compliance with these Rules shall be treated as an irregularity and shall not nullify the proceedings unless it has occasioned a miscarriage of justice.',
      },
    ],
  },
  {
    orderNumber: '2',
    title: 'Jurisdiction of the Court',
    processArea: 'Jurisdiction and venue',
    rules: [
      {
        ruleNumber: '1',
        title: 'Monetary and subject-matter limits',
        content:
          'The Court exercises civil jurisdiction up to the monetary limit prescribed for the grade of the Magistrate presiding, as fixed by the Magistrates’ Courts Law and any practice direction of the Chief Judge. The Court has no jurisdiction in matters of title to land, probate, the validity of a marriage, or the winding up of companies.',
      },
      {
        ruleNumber: '2',
        title: 'Abandonment of excess and consent to jurisdiction',
        content:
          'A claimant whose claim exceeds the monetary limit may abandon the excess and recover up to the limit, in which case judgment is in full discharge of all demands in respect of the cause of action. Parties may, with the consent of the Court, agree in writing to confer jurisdiction where the Law permits.',
      },
    ],
  },
  {
    orderNumber: '3',
    title: 'Institution of Civil Proceedings',
    processArea: 'Originating process',
    rules: [
      {
        ruleNumber: '1',
        title: 'Commencement by plaint',
        content:
          'A civil proceeding is commenced by filing a plaint in the registry, setting out the names and addresses of the parties, the particulars of claim and the relief sought. The registrar shall enter the plaint in the Civil Cause Book and issue a summons.',
      },
      {
        ruleNumber: '2',
        title: 'Particulars of claim',
        content:
          'The particulars of claim shall state concisely the facts relied on, and where the claim is for a debt or liquidated demand shall show how the sum claimed is arrived at, with copies of the documents relied on attached.',
      },
    ],
  },
  {
    orderNumber: '4',
    title: 'Issue and Service of Summons',
    processArea: 'Service of process',
    rules: [
      {
        ruleNumber: '1',
        title: 'Service of the summons',
        content:
          'A summons shall be served personally on the defendant not less than seven clear days before the return date. Where personal service cannot be effected, the Court may order substituted service by delivery at the last known address, by pasting on the premises, or by such other means as it directs.',
      },
      {
        ruleNumber: '2',
        title: 'Proof of service',
        content:
          'The bailiff shall endorse on the original summons the day, time, place and manner of service and shall depose to an affidavit of service, which the Court shall require before proceeding in the absence of the defendant.',
      },
    ],
  },
  {
    orderNumber: '6',
    title: 'Parties',
    processArea: 'Parties',
    rules: [
      {
        ruleNumber: '1',
        title: 'Joinder and representation',
        content:
          'Persons with a common interest may sue or be sued together, and the Court may at any stage order that a party be added or struck out. A person under legal disability sues by a next friend and defends by a guardian ad litem.',
      },
    ],
  },
  {
    orderNumber: '8',
    title: 'Default Judgment',
    processArea: 'Default and dismissal',
    rules: [
      {
        ruleNumber: '1',
        title: 'Judgment in default of appearance',
        content:
          'Where a defendant duly served fails to appear on the return date, the Court may, on proof of service and of the claim, enter judgment for the claimant, or may adjourn and direct fresh notice to issue.',
      },
      {
        ruleNumber: '2',
        title: 'Setting aside',
        content:
          'A judgment entered in the absence of a party may be set aside on application made within a reasonable time, on an affidavit showing good reason for the absence and a defence on the merits, and on such terms as to costs as the Court thinks fit.',
      },
    ],
  },
  {
    orderNumber: '9',
    title: 'Interlocutory Applications',
    processArea: 'Interlocutory applications',
    rules: [
      {
        ruleNumber: '1',
        title: 'Motions',
        content:
          'An interlocutory application shall be by motion on notice supported by an affidavit, served not less than two clear days before the hearing. An ex parte application may be entertained only where urgency is shown, and any order made lasts no more than seven days.',
      },
    ],
  },
  {
    orderNumber: '11',
    title: 'Hearing and Trial',
    processArea: 'Trial',
    rules: [
      {
        ruleNumber: '1',
        title: 'Order of hearing',
        content:
          'The claimant states his case and calls his witnesses, who are examined, cross-examined and re-examined; the defendant then presents his case in like manner. The Magistrate shall take a record of the evidence in longhand or by such other means as the Chief Judge directs.',
      },
      {
        ruleNumber: '2',
        title: 'Amicable settlement',
        content:
          'The Court shall at any stage encourage and facilitate the amicable settlement of the dispute, and may refer the parties to a multi-door courthouse or other alternative dispute resolution mechanism, adjourning the matter for that purpose.',
      },
    ],
  },
  {
    orderNumber: '13',
    title: 'Judgment, Execution and Garnishee',
    processArea: 'Enforcement',
    rules: [
      {
        ruleNumber: '1',
        title: 'Judgment and instalment orders',
        content:
          'The Court shall deliver judgment at the conclusion of the hearing or on a date fixed for that purpose, and may order payment of the judgment sum by instalments, with liberty to the creditor to apply on default.',
      },
      {
        ruleNumber: '2',
        title: 'Execution',
        content:
          'A judgment may be enforced by writ of fieri facias against the goods of the judgment debtor, by garnishee proceedings, or by judgment summons where the debtor is shown to have the means and refuses to pay, in accordance with the Sheriffs and Civil Process Act.',
      },
    ],
  },
  {
    orderNumber: '15',
    title: 'Costs',
    processArea: 'Costs',
    rules: [
      {
        ruleNumber: '1',
        title: 'Award of costs',
        content:
          'Costs are in the discretion of the Court and ordinarily follow the event. The Court shall assess costs summarily at the conclusion of the matter having regard to the scale in the Appendix.',
      },
    ],
  },
  {
    orderNumber: '17',
    title: 'Appeals to the High Court',
    processArea: 'Appeals',
    rules: [
      {
        ruleNumber: '1',
        title: 'Notice of appeal and time',
        content: `A party dissatisfied with a decision of the ${court} may appeal to the ${highCourtName(
          state,
        )} by notice of appeal filed in the registry of the Magistrate Court within thirty days of the decision, stating the grounds of appeal and the relief sought.`,
      },
      {
        ruleNumber: '2',
        title: 'Conditions of appeal and record',
        content:
          'The appellant shall enter into a recognisance or deposit such sum as the Court fixes as security for the costs of the appeal, and the registrar shall compile and transmit the record of proceedings to the High Court registry.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Federal courts and the appellate courts
// ---------------------------------------------------------------------------

const FEDERAL_HIGH_COURT_ORDERS: CourtOrder[] = [
  {
    orderNumber: '1',
    title: 'Application and Interpretation',
    processArea: 'Preliminary and general',
    rules: [
      {
        ruleNumber: '1',
        title: 'Application of the Rules',
        content:
          'These Rules apply to all civil proceedings in the Federal High Court in the exercise of the jurisdiction conferred by Section 251 of the Constitution and the Federal High Court Act, including revenue, customs and excise, banking, companies, admiralty, intellectual property, aviation, immigration and matters affecting agencies of the Federal Government.',
      },
      {
        ruleNumber: '2',
        title: 'Overriding objective',
        content:
          'These Rules shall be applied so as to achieve the just, efficient and speedy dispensation of justice. The Court shall discourage delay and give effect to the substance rather than the form of a proceeding.',
      },
    ],
  },
  {
    orderNumber: '3',
    title: 'Commencement of Proceedings',
    processArea: 'Originating process',
    rules: [
      {
        ruleNumber: '1',
        title: 'Modes of commencement',
        content:
          'Civil proceedings are commenced by writ of summons, originating summons, originating motion or petition. Where a statute or these Rules prescribe a particular mode for a class of proceedings, that mode shall be adopted.',
      },
      {
        ruleNumber: '2',
        title: 'Documents to accompany the originating process',
        content:
          'Every originating process shall be accompanied by the statement of claim, the list of witnesses, the written statements on oath of the witnesses, copies of every document to be relied on at trial, and, where applicable, the pre-action counselling certificate.',
      },
      {
        ruleNumber: '3',
        title: 'Duration and renewal',
        content:
          'An originating process is valid for six months from the date of issue and may, on application before expiry, be renewed for a further period not exceeding three months where service has not been effected.',
      },
    ],
  },
  {
    orderNumber: '6',
    title: 'Service of Process',
    processArea: 'Service of process',
    rules: [
      {
        ruleNumber: '1',
        title: 'Personal and substituted service',
        content:
          'Service shall be personal unless the Court orders otherwise. Where personal service is impracticable, the Court may order substituted service, including service by courier, electronic mail, or publication in a newspaper circulating in the judicial division.',
      },
      {
        ruleNumber: '2',
        title: 'Service on the Federal Government and its agencies',
        content:
          'Process against the Federal Government or a federal agency is served on the Attorney-General of the Federation or on the head of the agency or its principal officer, and thirty days’ pre-action notice is required where a statute so provides.',
      },
    ],
  },
  {
    orderNumber: '11',
    title: 'Summary Judgment',
    processArea: 'Interlocutory applications',
    rules: [
      {
        ruleNumber: '1',
        title: 'Application and supporting affidavit',
        content:
          'A claimant who believes there is no defence to his claim shall file with the originating process an application for summary judgment, an affidavit stating the grounds of that belief, and a written address in support.',
      },
      {
        ruleNumber: '2',
        title: 'Leave to defend',
        content:
          'Where the defendant’s counter affidavit and defence disclose a triable issue, the Court shall grant leave to defend and transfer the suit to the general cause list; otherwise judgment may be entered for the claimant.',
      },
    ],
  },
  {
    orderNumber: '25',
    title: 'Pleadings and Statement of Claim',
    processArea: 'Pleadings',
    rules: [
      {
        ruleNumber: '1',
        title: 'Filing and service of the statement of claim',
        content:
          'Unless the Court gives leave to the contrary, the claimant shall within thirty days of service of the writ of summons or of notice of appearance deliver his statement of claim together with the written statements on oath of witnesses and copies of the documents to be relied upon.',
      },
      {
        ruleNumber: '2',
        title: 'Statement of defence and counterclaim',
        content:
          'A defendant shall file his statement of defence and any counterclaim, with the accompanying depositions and documents, within thirty days of service of the statement of claim on him.',
      },
    ],
  },
  {
    orderNumber: '26',
    title: 'Pre-Trial Conference',
    processArea: 'Case management',
    rules: [
      {
        ruleNumber: '1',
        title: 'Pre-trial conference notice',
        content:
          'Within fourteen days after the close of pleadings the claimant shall apply for the issue of a pre-trial conference notice in the prescribed form, together with the pre-trial information sheet, failing which the defendant may apply for dismissal of the action.',
      },
      {
        ruleNumber: '2',
        title: 'Scheduling and settlement',
        content:
          'At the conference the Judge shall dispose of interlocutory applications, settle the issues for trial, explore settlement or referral to alternative dispute resolution, and fix a timetable binding on the parties.',
      },
    ],
  },
  {
    orderNumber: '34',
    title: 'Admiralty Proceedings',
    processArea: 'Specialised jurisdiction',
    rules: [
      {
        ruleNumber: '1',
        title: 'Actions in rem and in personam',
        content:
          'Admiralty proceedings may be commenced in rem against a ship, cargo or freight, or in personam against the owner or charterer, in accordance with the Admiralty Jurisdiction Act and the Admiralty Jurisdiction Procedure Rules.',
      },
      {
        ruleNumber: '2',
        title: 'Arrest of a ship and security',
        content:
          'An application for the arrest of a ship shall be supported by an affidavit stating the nature of the claim, that it has not been satisfied, and the identity of the ship, and the Court may require an undertaking as to damages or the provision of security before releasing the ship.',
      },
    ],
  },
  {
    orderNumber: '52',
    title: 'Enforcement of Judgment',
    processArea: 'Enforcement',
    rules: [
      {
        ruleNumber: '1',
        title: 'Execution and garnishee',
        content:
          'A judgment of the Court may be enforced by writ of fieri facias, garnishee proceedings, sequestration, or committal, subject to the Sheriffs and Civil Process Act. Garnishee proceedings against public officers require the consent of the Attorney-General where the funds are public funds.',
      },
    ],
  },
];

const NICN_ORDERS: CourtOrder[] = [
  {
    orderNumber: '1',
    title: 'Application and Interpretation',
    processArea: 'Preliminary and general',
    rules: [
      {
        ruleNumber: '1',
        title: 'Jurisdiction and application',
        content:
          'These Rules govern proceedings in the National Industrial Court of Nigeria in the exercise of the jurisdiction conferred by Section 254C of the Constitution — labour, employment, trade unions, industrial relations, workplace conditions, occupational health and safety, discrimination and sexual harassment at the workplace, and matters arising from applicable international labour standards.',
      },
    ],
  },
  {
    orderNumber: '3',
    title: 'Commencement of Proceedings',
    processArea: 'Originating process',
    rules: [
      {
        ruleNumber: '1',
        title: 'Modes of commencement',
        content:
          'Proceedings are commenced by complaint, originating summons, originating motion, referral, or a reference of a trade dispute by the Minister, accompanied by the statement of facts, the list of witnesses, the written statements on oath and the documents to be relied upon.',
      },
      {
        ruleNumber: '2',
        title: 'Complaint and statement of facts',
        content:
          'A complaint shall state the parties, the nature of the employment relationship, the facts constituting the cause of action, and the reliefs claimed, and shall be verified by a statement of truth signed by the claimant.',
      },
    ],
  },
  {
    orderNumber: '7',
    title: 'Service of Process',
    processArea: 'Service of process',
    rules: [
      {
        ruleNumber: '1',
        title: 'Service on an employer or trade union',
        content:
          'Service on a company, employer or trade union may be effected at its registered or principal office, on a principal officer, or by such electronic means as the Court may direct. Substituted service may be ordered where personal service cannot conveniently be effected.',
      },
    ],
  },
  {
    orderNumber: '14',
    title: 'Fast Track and Summary Judgment',
    processArea: 'Interlocutory applications',
    rules: [
      {
        ruleNumber: '1',
        title: 'Application for summary judgment',
        content:
          'Where a claimant believes that there is no defence to his claim, he may file an application for summary judgment accompanied by an affidavit on oath verifying the facts and the exhibits relied upon, together with a written address.',
      },
      {
        ruleNumber: '2',
        title: 'Fast track proceedings',
        content:
          'The President of the Court may designate a matter for the fast track where it concerns the terminal benefits of an employee, the interpretation of a collective agreement, or an urgent trade dispute, and the Court shall then conclude the matter within an abridged timetable.',
      },
    ],
  },
  {
    orderNumber: '17',
    title: 'Pleadings and Depositions',
    processArea: 'Pleadings',
    rules: [
      {
        ruleNumber: '1',
        title: 'Memorandum of appearance and defence',
        content:
          'A defendant shall enter a memorandum of appearance and file his statement of defence, list of witnesses, written statements on oath and documents within fourteen days of service where the matter is on the fast track, and within thirty days in any other case.',
      },
    ],
  },
  {
    orderNumber: '24',
    title: 'Interim and Interlocutory Reliefs in Trade Disputes',
    processArea: 'Interlocutory applications',
    rules: [
      {
        ruleNumber: '1',
        title: 'Restraining industrial action',
        content:
          'An application to restrain a strike, lock-out or other industrial action shall be on notice save in a case of extreme urgency, and the Court shall consider whether the statutory procedures for the settlement of the trade dispute under the Trade Disputes Act have been exhausted.',
      },
    ],
  },
  {
    orderNumber: '25',
    title: 'Alternative Dispute Resolution',
    processArea: 'Case management',
    rules: [
      {
        ruleNumber: '1',
        title: 'Referral to the ADR Centre',
        content:
          'The Court may at any stage refer a matter to the Court’s Alternative Dispute Resolution Centre for conciliation or mediation, and any settlement reached shall be reduced into terms of settlement and entered as the consent judgment of the Court.',
      },
    ],
  },
  {
    orderNumber: '38',
    title: 'Judgment, Awards and Enforcement',
    processArea: 'Enforcement',
    rules: [
      {
        ruleNumber: '1',
        title: 'Awards and enforcement',
        content:
          'The Court may make declaratory orders, orders of reinstatement or re-engagement, awards of compensation, damages and terminal benefits, and its judgments are enforced in the same manner as judgments of the Federal High Court.',
      },
      {
        ruleNumber: '2',
        title: 'Appeals',
        content:
          'An appeal from a decision of the Court lies to the Court of Appeal as of right on questions of fundamental rights arising from labour matters and on criminal causes, and with the leave of the Court of Appeal in other cases, as provided by Section 243 of the Constitution.',
      },
    ],
  },
];

const COURT_OF_APPEAL_ORDERS: CourtOrder[] = [
  {
    orderNumber: '2',
    title: 'General Provisions and Non-Compliance',
    processArea: 'Preliminary and general',
    rules: [
      {
        ruleNumber: '1',
        title: 'Effect of non-compliance',
        content:
          'Non-compliance with these Rules or with any rule of practice does not render the appeal void, but the Court may set aside the proceedings wholly or in part as irregular, amend, or otherwise deal with them as it thinks fit.',
      },
    ],
  },
  {
    orderNumber: '6',
    title: 'Notice and Grounds of Appeal',
    processArea: 'Commencing an appeal',
    rules: [
      {
        ruleNumber: '1',
        title: 'Filing the notice of appeal',
        content:
          'An appeal is commenced by filing in the registry of the court below a notice of appeal setting out the grounds of appeal, the part of the decision complained of, the reliefs sought from the Court of Appeal, and the names and addresses of all parties directly affected.',
      },
      {
        ruleNumber: '2',
        title: 'Time for appealing',
        content:
          'A notice of appeal against an interlocutory decision shall be filed within fourteen days of the decision, and against a final decision in a civil cause within three months. In a criminal cause the notice shall be filed within ninety days of the decision.',
      },
      {
        ruleNumber: '3',
        title: 'Form of grounds of appeal',
        content:
          'Every ground of appeal shall be concise, shall specify the particulars of the error in law, of fact or of mixed law and fact complained of, and shall not be vague or general in terms. A ground alleging misdirection or error in law shall state the particulars and the nature of the misdirection or error.',
      },
    ],
  },
  {
    orderNumber: '8',
    title: 'Records of Appeal',
    processArea: 'Records of appeal',
    rules: [
      {
        ruleNumber: '1',
        title: 'Compilation and transmission by the registrar',
        content:
          'The registrar of the court below shall, within sixty days of the filing of the notice of appeal, compile and transmit the record of appeal to the Court of Appeal, and shall give notice of the transmission to the parties.',
      },
      {
        ruleNumber: '2',
        title: 'Appellant’s record where the registrar defaults',
        content:
          'Where the registrar fails to compile and transmit the record within the time prescribed, the appellant shall within thirty days thereafter compile and transmit the record, and where the appellant also defaults the respondent may do so and recover the cost as costs in the appeal.',
      },
    ],
  },
  {
    orderNumber: '16',
    title: 'Motions and Applications',
    processArea: 'Interlocutory applications',
    rules: [
      {
        ruleNumber: '1',
        title: 'Form of application',
        content:
          'Every application to the Court shall be by notice of motion supported by an affidavit and a written address, and shall state the rule or enactment under which it is brought. Applications for extension of time shall show good and substantial reasons for the delay and disclose grounds of appeal which prima facie show good cause why the appeal should be heard.',
      },
      {
        ruleNumber: '2',
        title: 'Stay of execution and injunction pending appeal',
        content:
          'An application for stay of execution or for injunction pending appeal shall first be made to the court below, and may be made to this Court only where the court below has refused it or where there are special circumstances justifying a direct application.',
      },
    ],
  },
  {
    orderNumber: '19',
    title: 'Briefs of Argument',
    processArea: 'Briefs and hearing',
    rules: [
      {
        ruleNumber: '1',
        title: 'Appellant’s brief',
        content:
          'The appellant shall within forty-five days of the receipt of the record of appeal file in the Court a written brief, being a succinct statement of his argument in the appeal, setting out the issues arising for determination, the facts, the argument on each issue and the reliefs sought.',
      },
      {
        ruleNumber: '2',
        title: 'Respondent’s brief and reply brief',
        content:
          'The respondent shall within thirty days of service of the appellant’s brief file his own brief, and the appellant may file a reply brief within fourteen days of service of the respondent’s brief, confined to answering new points arising from the respondent’s brief.',
      },
      {
        ruleNumber: '3',
        title: 'Consequence of failure to file a brief',
        content:
          'Where an appellant fails to file his brief within the time prescribed or as extended, the respondent may apply to have the appeal dismissed for want of prosecution. Where a respondent fails to file his brief, he will not be heard in oral argument except by leave of the Court.',
      },
      {
        ruleNumber: '4',
        title: 'Oral argument',
        content:
          'Oral argument at the hearing shall be limited to emphasising and clarifying the written argument already in the brief, and shall not exceed thirty minutes for each party unless the Court otherwise directs.',
      },
    ],
  },
];

const SUPREME_COURT_ORDERS: CourtOrder[] = [
  {
    orderNumber: '2',
    title: 'General Provisions',
    processArea: 'Preliminary and general',
    rules: [
      {
        ruleNumber: '1',
        title: 'Practice and procedure',
        content:
          'The practice and procedure of the Court in its appellate jurisdiction is regulated by these Rules and, so far as they do not extend, by the practice and procedure for the time being of the Court of Appeal, with such modifications as the Court considers necessary.',
      },
      {
        ruleNumber: '2',
        title: 'Non-compliance',
        content:
          'Non-compliance with these Rules does not of itself render proceedings void, but the Court may set them aside in whole or in part as irregular, or amend or otherwise deal with them as it thinks fit.',
      },
    ],
  },
  {
    orderNumber: '6',
    title: 'Motions and Applications',
    processArea: 'Interlocutory applications',
    rules: [
      {
        ruleNumber: '1',
        title: 'Applications to the Court',
        content:
          'Every application shall be by notice of motion supported by affidavit and accompanied by a written address, and shall be served on all parties affected not less than five clear days before the hearing.',
      },
      {
        ruleNumber: '2',
        title: 'Extension of time',
        content:
          'An application for extension of time within which to appeal shall be supported by an affidavit setting out good and substantial reasons for the failure to appeal within the prescribed period, and by grounds of appeal which prima facie show good cause why the appeal should be heard.',
      },
      {
        ruleNumber: '3',
        title: 'Stay of execution',
        content:
          'An application for a stay of execution of the judgment appealed from shall be made in the first instance to the Court of Appeal, and may only be made to this Court where the Court of Appeal has refused it.',
      },
    ],
  },
  {
    orderNumber: '8',
    title: 'Civil Appeals',
    processArea: 'Commencing an appeal',
    rules: [
      {
        ruleNumber: '1',
        title: 'Appeal by way of rehearing',
        content:
          'All appeals shall be by way of rehearing and shall be brought by notice of appeal filed in the registry of the Court of Appeal, setting forth concisely the grounds upon which the appellant relies and stating the particulars of the error in law or misdirection complained of.',
      },
      {
        ruleNumber: '2',
        title: 'Appeals as of right and by leave',
        content:
          'An appeal lies as of right in the cases listed in Section 233(2) of the Constitution, including where the ground of appeal involves questions of law alone and appeals on the interpretation or application of the Constitution. In every other case the appeal lies only with the leave of the Court of Appeal or of this Court.',
      },
      {
        ruleNumber: '3',
        title: 'Time for appealing',
        content:
          'A notice of appeal against an interlocutory decision of the Court of Appeal shall be filed within fourteen days, and against a final decision within three months, of the date of the decision appealed against.',
      },
    ],
  },
  {
    orderNumber: '9',
    title: 'Records of Appeal',
    processArea: 'Records of appeal',
    rules: [
      {
        ruleNumber: '1',
        title: 'Settlement and transmission of the record',
        content:
          'The registrar of the Court of Appeal shall, after the notice of appeal is filed, settle the record of appeal with the parties and transmit it to the registry of this Court, together with the exhibits and the certified true copy of the judgment appealed from.',
      },
    ],
  },
  {
    orderNumber: '10',
    title: 'Briefs of Argument',
    processArea: 'Briefs and hearing',
    rules: [
      {
        ruleNumber: '1',
        title: 'Appellant’s brief',
        content:
          'The appellant shall within ten weeks of the receipt of the record of appeal file his brief of argument, containing the issues arising for determination, a summary of the facts with references to the pages of the record, and the argument on each issue with the authorities relied upon.',
      },
      {
        ruleNumber: '2',
        title: 'Respondent’s brief, reply brief and hearing',
        content:
          'The respondent shall file his brief within eight weeks of service of the appellant’s brief, and the appellant may file a reply brief within four weeks. At the hearing, counsel shall be allowed to adopt and briefly expatiate on their briefs.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Assembling the library
// ---------------------------------------------------------------------------

const stateBooks = (
  category: Extract<CourtRuleCategoryId, 'high-court' | 'magistrate'>,
): CourtRuleBook[] =>
  NIGERIAN_STATES.map((state) => {
    const isHighCourt = category === 'high-court';
    const courtName = isHighCourt ? highCourtName(state) : magistrateCourtName(state);

    return {
      id: `${category}-${stateSlug(state)}`,
      courtName,
      category,
      state,
      edition: isHighCourt
        ? '(Civil Procedure) Rules — edition currently in force in the State'
        : '(Civil Procedure) Rules — edition currently in force in the State',
      summary: isHighCourt
        ? `Civil procedure in the ${courtName}: how an action is commenced and served, how pleadings are exchanged and closed, the pre-trial conference, trial, judgment and enforcement.`
        : `Civil procedure in the ${courtName}: plaints and summonses, the monetary limits of the Court, default judgment, execution and appeals to the ${highCourtName(state)}.`,
      orders: isHighCourt ? highCourtOrders(courtName) : magistrateOrders(courtName, state),
    };
  });

export const COURT_RULE_BOOKS: CourtRuleBook[] = [
  ...stateBooks('magistrate'),
  ...stateBooks('high-court'),
  {
    id: 'national-industrial-court',
    courtName: 'National Industrial Court of Nigeria',
    category: 'national-industrial-court',
    edition: 'National Industrial Court of Nigeria (Civil Procedure) Rules',
    year: 2017,
    summary:
      'Practice and procedure in labour, employment, trade union and industrial relations matters, including the fast track, referral of trade disputes and the Court’s ADR Centre.',
    orders: NICN_ORDERS,
  },
  {
    id: 'federal-high-court',
    courtName: 'Federal High Court',
    category: 'federal-high-court',
    edition: 'Federal High Court (Civil Procedure) Rules',
    year: 2019,
    summary:
      'Civil procedure across the exclusive jurisdiction of the Federal High Court — revenue, customs, banking, companies, admiralty, intellectual property and federal agencies.',
    orders: FEDERAL_HIGH_COURT_ORDERS,
  },
  {
    id: 'court-of-appeal',
    courtName: 'Court of Appeal',
    category: 'court-of-appeal',
    edition: 'Court of Appeal Rules',
    year: 2021,
    summary:
      'Appellate practice: notice and grounds of appeal, time to appeal, compilation and transmission of records, briefs of argument, motions and hearing.',
    orders: COURT_OF_APPEAL_ORDERS,
  },
  {
    id: 'supreme-court',
    courtName: 'Supreme Court of Nigeria',
    category: 'supreme-court',
    edition: 'Supreme Court Rules 1985 (as amended)',
    year: 2014,
    summary:
      'Practice in the apex court: appeals as of right under Section 233(2) and by leave, records of appeal, briefs of argument and applications.',
    orders: SUPREME_COURT_ORDERS,
  },
];

const BOOK_BY_ID = new Map(COURT_RULE_BOOKS.map((book) => [book.id, book]));

export const ruleBookById = (id: string): CourtRuleBook | undefined => BOOK_BY_ID.get(id);

export const ruleBooksInCategory = (category: CourtRuleCategoryId): CourtRuleBook[] =>
  COURT_RULE_BOOKS.filter((book) => book.category === category);

export const categoryById = (id: string): CourtRuleCategory | undefined =>
  COURT_RULE_CATEGORIES.find((category) => category.id === id);

/** How a rule book's edition reads on the page. */
export const editionLabel = (book: CourtRuleBook): string =>
  book.year ? `${book.edition} ${book.year}` : `${book.courtName} ${book.edition}`;

export interface RuleSearchHit {
  order: CourtOrder;
  rule: CourtRuleEntry;
}

/**
 * Searches a rule book by rule, by Order, or by the area of court process.
 * "Order 25", "rule 3", "summary judgment" and "service" all find their provisions.
 */
export function searchRuleBook(book: CourtRuleBook, rawQuery: string): RuleSearchHit[] {
  const query = rawQuery.trim().toLowerCase();
  const hits: RuleSearchHit[] = book.orders.flatMap((order) =>
    order.rules.map((rule) => ({ order, rule })),
  );

  if (!query) return hits;

  const orderMatch = query.match(/^order\s*(\d+)$/);
  if (orderMatch) return hits.filter((hit) => hit.order.orderNumber === orderMatch[1]);

  const ruleMatch = query.match(/^rule\s*(\d+)$/);
  if (ruleMatch) return hits.filter((hit) => hit.rule.ruleNumber === ruleMatch[1]);

  const orderRuleMatch = query.match(/^order\s*(\d+)\s*,?\s*rule\s*(\d+)$/);
  if (orderRuleMatch) {
    return hits.filter(
      (hit) =>
        hit.order.orderNumber === orderRuleMatch[1] && hit.rule.ruleNumber === orderRuleMatch[2],
    );
  }

  return hits.filter(
    (hit) =>
      hit.order.title.toLowerCase().includes(query) ||
      hit.order.processArea.toLowerCase().includes(query) ||
      hit.rule.title.toLowerCase().includes(query) ||
      hit.rule.content.toLowerCase().includes(query) ||
      `order ${hit.order.orderNumber}`.includes(query) ||
      `rule ${hit.rule.ruleNumber}`.includes(query),
  );
}
