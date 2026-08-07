import { AiLitigationLesson } from '../types';

/**
 * Learn litigation with AI tools.
 *
 * Each lesson pairs a litigation skill with the way an AI assistant actually helps with
 * it — what to ask, what comes back, and what must still be verified by hand before it
 * goes anywhere near a court. The verification steps are not decoration: a practitioner
 * who files an authority they have not read is answerable for it.
 */

export const AI_LESSON_STAGES: { id: AiLitigationLesson['stage']; description: string }[] = [
  {
    id: 'Case assessment',
    description: 'Working out what the case is really about before a process is filed.',
  },
  {
    id: 'Pleadings & drafting',
    description: 'Turning instructions into court processes that survive a preliminary objection.',
  },
  {
    id: 'Research & authority',
    description: 'Finding, reading and citing the statute and the case law that decide the point.',
  },
  {
    id: 'Evidence',
    description: 'Getting documents and testimony admitted, and keeping the other side’s out.',
  },
  {
    id: 'Advocacy',
    description: 'Cross-examination, written addresses and what is actually said in court.',
  },
  {
    id: 'Appeals',
    description: 'Grounds, issues and briefs that the appellate courts will entertain.',
  },
  {
    id: 'Practice management',
    description: 'Diaries, deadlines and the administration that loses more cases than bad law.',
  },
];

export const AI_LITIGATION_LESSONS: AiLitigationLesson[] = [
  {
    id: 'ai-case-theory',
    title: 'Building a case theory with AI',
    stage: 'Case assessment',
    level: 'Foundation',
    durationMinutes: 25,
    objective:
      'Reduce a bundle of instructions to a single sentence that explains why your client wins, and test it against the elements you must prove.',
    whatTheAiDoes:
      'The assistant takes your narrative of the facts and returns the causes of action available, the elements of each, and which facts you have for each element — and, more usefully, which elements have no fact attached to them yet.',
    body: `## Why a case theory comes first

A case theory is the one sentence you would give the judge if you had only one sentence. Everything else — the pleadings, the witnesses, the documents, the address — is built to support it. Counsel who file first and think later end up with a statement of claim that pleads facts nobody can prove.

## How the AI helps

Give the assistant the facts as you have them, in ordinary language, and ask it to identify the causes of action and break each into its elements. What comes back is a grid: element, the facts you have, and the gaps. The gaps are the point of the exercise — they tell you what to ask your client before you draft.

## What the AI cannot do

It cannot tell you whether your witness will hold up under cross-examination, and it cannot know what your client has not told you. Treat its output as a checklist to be tested, not a conclusion.`,
    prompts: [
      {
        label: 'Extract causes of action and elements',
        prompt:
          'Here are the facts of a matter I have been instructed on in Nigeria: [set out the facts]. Identify every cause of action available to my client under Nigerian law. For each, list the elements I must prove, the facts I already have for each element, and the elements for which I have no supporting fact. Cite the governing statute or authority for each set of elements.',
      },
      {
        label: 'Stress-test the theory',
        prompt:
          'My case theory is: [state it in one sentence]. Act as opposing counsel in a Nigerian High Court. Identify the three strongest attacks on this theory, the preliminary objections likely to be taken, and the evidence I would need to defeat each.',
      },
      {
        label: 'Limitation and condition precedent check',
        prompt:
          'For a claim in [cause of action] arising on [date] in [State], set out the limitation period under the applicable Nigerian limitation law, any pre-action notice or condition precedent required against this class of defendant, and the consequence of non-compliance.',
      },
    ],
    verificationSteps: [
      'Confirm each element against the statute itself, not the summary — statutes are amended and summaries go stale.',
      'Check the limitation period against the limitation law of the specific State; they differ.',
      'Where a pre-action notice is suggested, read the enabling statute of the defendant body to confirm the period and form.',
    ],
    exercise:
      'Take a matter currently in your file. Write the case theory in one sentence without looking at the AI output. Then run the extraction prompt and compare: which element did you have no fact for?',
  },
  {
    id: 'ai-drafting-processes',
    title: 'Drafting court processes that survive objection',
    stage: 'Pleadings & drafting',
    level: 'Foundation',
    durationMinutes: 35,
    objective:
      'Produce a first draft of an originating process, motion or affidavit that is structurally correct, then edit it into something you would sign.',
    whatTheAiDoes:
      'The assistant produces the skeleton fast — the heading, the parties, the reliefs, the numbered paragraphs — so your time goes into the facts and the strategy rather than the furniture.',
    body: `## Use it for the skeleton, not the substance

A Nigerian court process has a fixed architecture: the heading, the parties, the suit number, the body, the reliefs, the address for service. The AI produces that architecture in seconds and rarely gets it wrong. What it cannot produce is the particular fact that wins your case.

## The drafting loop that works

Ask for the process. Read it against the rules of the court you are filing in. Replace every generic paragraph with the facts of your matter. Then ask the assistant to attack the draft as opposing counsel would — the objections it raises are the ones you will meet.

## Affidavits need particular care

Section 115(2) of the Evidence Act excludes legal argument and conclusions from an affidavit. AI-generated affidavits drift into argument almost every time. Read every paragraph and ask: is this a fact a witness could be cross-examined on? If not, it belongs in the written address.`,
    prompts: [
      {
        label: 'Draft an originating process',
        prompt:
          'Draft a Writ of Summons and Statement of Claim for filing in the High Court of [State], [Judicial Division]. Claimant: [name and description]. Defendant: [name and description]. Facts: [set them out]. Reliefs sought: [list them]. Follow the frontloading requirements of the applicable rules and include the list of witnesses and list of documents.',
      },
      {
        label: 'Clean an affidavit of argument',
        prompt:
          'Here is an affidavit I have drafted: [paste it]. Identify every paragraph that offends section 115(2) of the Evidence Act 2011 by containing legal argument, conclusions or prayers, and rewrite each as a statement of fact or tell me it should be moved to the written address.',
      },
      {
        label: 'Attack your own draft',
        prompt:
          'You are counsel to the defendant in a Nigerian High Court. Here is the claimant’s statement of claim: [paste it]. Draft the preliminary objections you would take and identify every paragraph liable to be struck out, with the rule or authority for each.',
      },
    ],
    verificationSteps: [
      'Check the process against the rules of the specific court — Order numbers differ between Lagos, the FCT, the Federal High Court and the NICN.',
      'Confirm the filing fees and the frontloading requirements at the registry; rules change more often than templates do.',
      'Read every affidavit paragraph for section 115(2) compliance before it is sworn.',
      'Replace every placeholder. A bracketed placeholder left in a filed process is a professional embarrassment.',
    ],
    exercise:
      'Take a motion you filed last month. Run the "attack your own draft" prompt on it and count how many of the objections raised were ones you had already anticipated.',
  },
  {
    id: 'ai-authority-research',
    title: 'Finding and verifying authority',
    stage: 'Research & authority',
    level: 'Intermediate',
    durationMinutes: 30,
    objective:
      'Use AI to find the line of authority on a point quickly, and to verify every citation before it enters a written address.',
    whatTheAiDoes:
      'The assistant identifies the leading cases on a proposition, explains what each decided, and shows how the line developed. It is a research accelerator, not a law report.',
    body: `## The single biggest risk in AI-assisted practice

A language model can produce a citation that looks perfectly formed and does not exist. Courts in several jurisdictions have sanctioned counsel for filing fabricated authorities. In Nigeria the professional consequence would be no lighter.

The rule is simple and admits no exception: **never cite a case you have not read in a report.** Use the AI to find the case; use the law report to cite it.

## A research method that works

Start broad — ask for the leading authorities on the proposition. Then narrow — ask what each case actually decided and whether any has been overruled or distinguished. Then verify — take every citation to the report, read the ratio, and confirm it says what you were told it says.

## Reading a case properly

Ask the assistant to separate ratio from obiter, and then check that separation against the judgment. A proposition that is obiter is persuasive only, and opposing counsel will say so.`,
    prompts: [
      {
        label: 'Map the line of authority',
        prompt:
          'What is the current position of Nigerian law on [state the proposition]? List the leading Supreme Court and Court of Appeal authorities in chronological order, state what each decided, and identify any case that has been overruled, departed from or distinguished. Give full citations.',
      },
      {
        label: 'Separate ratio from obiter',
        prompt:
          'For the Nigerian case [name and citation], set out the material facts, the issues for determination, the ratio decidendi of each issue, and any obiter dicta commonly cited from it. Indicate which propositions are binding and which are persuasive only.',
      },
      {
        label: 'Find the counter-authority',
        prompt:
          'I intend to rely on [case and citation] for the proposition that [state it]. Identify the Nigerian authorities that cut against this proposition, the grounds on which [case] has been distinguished, and how I should meet those arguments.',
      },
    ],
    verificationSteps: [
      'Take every citation to the law report, the court’s own record or the LAWPEX report series, and read the passage relied on.',
      'Confirm the case has not been overruled or departed from by a later decision of the same or a higher court.',
      'Check the year, part and page of the citation. A wrong part number is enough to draw a rebuke from the bench.',
      'Where the AI offers a quotation, verify it word for word before putting it in quotation marks in a written address.',
    ],
    exercise:
      'Ask the assistant for five authorities on a proposition you know well. Verify all five in the reports. Note how long verification took relative to the search — that ratio is the honest cost of AI research.',
  },
  {
    id: 'ai-document-review',
    title: 'Reviewing documents and building a chronology',
    stage: 'Evidence',
    level: 'Intermediate',
    durationMinutes: 30,
    objective:
      'Turn a disorganised bundle into a dated chronology, an issues-to-documents index, and a list of the documents you do not have but need.',
    whatTheAiDoes:
      'The assistant reads long correspondence and contracts and returns dates, obligations, breaches and inconsistencies far faster than a manual read — and it does not get bored on page 200.',
    body: `## The chronology is the case

Most civil cases are won by whoever knows the sequence of events best. A chronology built from the documents — not from the client’s recollection — is the foundation of cross-examination and of the written address.

## Working through a bundle

Feed the documents in manageable parts and ask for dates, parties, obligations and any inconsistency with what you have already established. Then ask what is missing: a contract that refers to a schedule you do not have, a letter that answers one you have not seen. The gaps drive your discovery and your notice to produce.

## Admissibility runs alongside

As each document is indexed, note how it will get in: who made it, who will identify it, whether it is a public document requiring certification, whether it is computer-generated and needs a section 84 certificate. A document nobody can tender is not evidence.`,
    prompts: [
      {
        label: 'Build a chronology',
        prompt:
          'Here are the documents in a matter: [paste or summarise them]. Build a chronological table with columns for date, event, the document evidencing it, and the party responsible. Flag any inconsistency between documents and any date gap of more than 30 days.',
      },
      {
        label: 'Index documents to issues',
        prompt:
          'The issues for determination in this suit are: [list them]. Here are the documents: [list them with dates and descriptions]. Produce a table mapping each issue to the documents that prove or disprove it, and identify any issue with no supporting document.',
      },
      {
        label: 'Admissibility audit',
        prompt:
          'For each of the following documents I intend to tender in a Nigerian High Court: [list them]. State who must identify each document, whether it is a public document requiring a certified true copy under sections 89 and 90 of the Evidence Act 2011, whether a section 84 certificate is required, and the likely objection from opposing counsel.',
      },
    ],
    verificationSteps: [
      'Check every date in the chronology against the document itself — a misread date propagates through the whole case.',
      'Confirm the certification status of each public document before the trial date, not on it.',
      'Prepare the section 84(2) certificate for every computer-generated document well ahead of tendering.',
      'Never upload privileged or client-confidential material to a tool you have not confirmed your firm may use for that purpose.',
    ],
    exercise:
      'Build a chronology of a live matter with the AI, then check ten entries against the source documents. Record the error rate — it tells you how closely to supervise on the next matter.',
  },
  {
    id: 'ai-cross-examination',
    title: 'Preparing cross-examination with AI',
    stage: 'Advocacy',
    level: 'Advanced',
    durationMinutes: 40,
    objective:
      'Generate a disciplined cross-examination plan built on closed questions, each tied to a document or a prior inconsistent statement.',
    whatTheAiDoes:
      'Given the witness statement and your documents, the assistant produces question sequences that drive to a concession, and predicts the answers a well-prepared witness will give.',
    body: `## Cross-examination is planned, not improvised

The questions that win are the ones you can only ask because you have a document the witness cannot escape. The AI helps you find those points in the witness statement and shape them into sequences of closed questions.

## The shape of a good sequence

Commit the witness to a position. Close the escape routes. Confront with the document. Stop. The temptation to ask the one question that invites explanation is what loses the concession you had already won.

## Putting your case

Nigerian practice requires you to put your case to the witness. Ask the assistant to produce, from your pleadings, the list of propositions that must be put — then check that your plan puts every one of them.

## Where the AI is weakest

It cannot read a courtroom. It does not know that the witness is rattled, that the judge is impatient, or that the concession you planned for came out unprompted five minutes ago. Have the plan; abandon it when the case changes.`,
    prompts: [
      {
        label: 'Find the contradictions',
        prompt:
          'Here is the written statement on oath of a witness: [paste it]. Here are the documents in the case: [describe them with dates]. Identify every contradiction between the statement and the documents, and every assertion in the statement that no document supports.',
      },
      {
        label: 'Build the question sequences',
        prompt:
          'Draft a cross-examination plan for this witness in a Nigerian High Court. Use only closed, leading questions. Organise it into sequences, each ending in a single concession. For each sequence state the concession sought and the document that makes it unavoidable. Predict the evasive answer and give the follow-up.',
      },
      {
        label: 'Checklist: putting your case',
        prompt:
          'Here is my statement of defence: [paste it]. List every proposition I must put to the claimant’s witnesses in cross-examination so that my case is not treated as unchallenged, and indicate which witness each proposition should be put to.',
      },
    ],
    verificationSteps: [
      'Verify every document reference in the plan against the exhibit as it will be numbered at trial.',
      'Confirm that a previous inconsistent statement will be used in compliance with sections 232 and 233 of the Evidence Act.',
      'Cut any question you cannot support with a document or an admission — an unsupported proposition invites a damaging answer.',
      'Check the plan puts every material averment in your pleadings.',
    ],
    exercise:
      'Take a witness statement from a concluded matter. Build the plan with the AI, then compare it with the cross-examination you actually conducted. What did the AI find that you missed, and what did you know that it could not?',
  },
  {
    id: 'ai-written-address',
    title: 'Written addresses and legal argument',
    stage: 'Advocacy',
    level: 'Intermediate',
    durationMinutes: 35,
    objective:
      'Structure a final written address that argues issues rather than narrating evidence, with every authority verified.',
    whatTheAiDoes:
      'The assistant proposes issues for determination, structures the argument under each, and drafts the connective prose — leaving you to supply the judgment about which arguments are worth making.',
    body: `## Structure first

A written address has a fixed shape: introduction, brief statement of facts, issues for determination, argument under each issue, conclusion and prayer. The AI is reliable on the shape. Where it needs supervision is in the selection: it will happily argue six issues where two would win.

## Argue the issue, do not retell the trial

The commonest defect in a written address is narration — a recital of what each witness said. The court has the record. Ask the assistant to convert narrative paragraphs into argument: proposition, authority, application to the evidence, conclusion.

## Every authority verified

The rule from the research lesson applies with full force here, because this document goes to the judge over your signature. Verify every citation in a report before the address is filed.`,
    prompts: [
      {
        label: 'Distil the issues',
        prompt:
          'Here are the pleadings and the evidence led at trial: [summarise them]. Propose the issues for determination for my final written address in a Nigerian High Court. Keep them to the minimum number that disposes of the case, and explain why each is necessary.',
      },
      {
        label: 'Turn narrative into argument',
        prompt:
          'Here is a section of my written address: [paste it]. It reads as narrative. Rewrite it as legal argument: state the proposition, cite the authority, apply it to the specific evidence, and state the conclusion. Do not add any authority you cannot name precisely.',
      },
      {
        label: 'Anticipate the reply',
        prompt:
          'Here is my written address: [paste it]. Draft the opposing counsel’s reply on points of law, identifying the weakest links in my argument and the authorities that would be used against me.',
      },
    ],
    verificationSteps: [
      'Read every cited case in the report before the address is filed — no exceptions.',
      'Confirm each issue for determination arises from the pleadings and the evidence actually led.',
      'Check that every relief argued for appears in the originating process; you cannot be granted what you did not claim.',
      'Confirm the address complies with any page limit or format the court has directed.',
    ],
    exercise:
      'Take an address you filed and run the "turn narrative into argument" prompt on its longest section. Compare the two versions for length and for force.',
  },
  {
    id: 'ai-appeal-grounds',
    title: 'Grounds of appeal and appellate briefs',
    stage: 'Appeals',
    level: 'Advanced',
    durationMinutes: 40,
    objective:
      'Draft grounds of appeal with proper particulars of error, distil issues correctly, and structure a brief the appellate court will entertain.',
    whatTheAiDoes:
      'The assistant reads the judgment appealed against and identifies the findings that can be attacked, whether each is a ground of law, of fact or of mixed law and fact, and therefore whether leave is required.',
    body: `## Grounds first, issues second

An appeal is lost at the drafting stage more often than at the hearing. A ground that is narrative, argumentative or unparticularised is struck out, and the issue distilled from it goes with it.

Each ground must identify the error and set out particulars. The AI is good at the form; you supply the judgment about which findings are worth attacking.

## Leave or as of right

Whether a ground is one of law alone, or of mixed law and fact, decides whether you may appeal as of right or must first obtain leave. Ask the assistant to classify each ground, then confirm the classification against section 241 and section 242 of the Constitution before filing.

## Issues fewer than grounds

Issues for determination must not outnumber the grounds of appeal, and each must be traceable to a ground. Several grounds may be argued together under one issue; the reverse is fatal.`,
    prompts: [
      {
        label: 'Mine the judgment for grounds',
        prompt:
          'Here is the judgment appealed against: [paste or summarise it, including the findings]. Identify every finding that can properly be attacked on appeal. For each, draft a ground of appeal with particulars of error, and classify it as a ground of law alone, of fact, or of mixed law and fact.',
      },
      {
        label: 'Leave or as of right',
        prompt:
          'Here are my draft grounds of appeal: [paste them]. For each, state whether an appeal lies as of right under section 241 of the Constitution of the Federal Republic of Nigeria 1999 (as amended) or requires leave under section 242, and set out the application I must file where leave is required, with the applicable time limit.',
      },
      {
        label: 'Structure the brief',
        prompt:
          'Here are my grounds of appeal: [paste them]. Distil the issues for determination, ensuring they do not outnumber the grounds and that each is traceable to a named ground. Then outline the appellant’s brief of argument under each issue in the form required by the Court of Appeal Rules 2021.',
      },
    ],
    verificationSteps: [
      'Confirm the time for appealing — 14 days for an interlocutory decision, 3 months for a final one — and compute it from the date of delivery.',
      'Verify the classification of each ground against sections 241 and 242 of the Constitution yourself; misclassification means an incompetent appeal.',
      'Check that every issue is traceable to a ground and that no ground has been abandoned inadvertently.',
      'Read every authority cited in the brief in the report before filing.',
    ],
    exercise:
      'Take a judgment against a client. Draft three grounds by hand, then run the mining prompt. Which findings did the AI identify that you had already written off?',
  },
  {
    id: 'ai-deadlines-diary',
    title: 'Deadlines, diaries and the AI as second pair of eyes',
    stage: 'Practice management',
    level: 'Foundation',
    durationMinutes: 20,
    objective:
      'Compute every time limit in a matter from the governing rules and build a diary that surfaces them before they expire.',
    whatTheAiDoes:
      'Given the court, the process and the key dates, the assistant computes the time limits under the applicable rules and produces the diary entries — including the internal deadlines that give you room to act.',
    body: `## More cases are lost to the calendar than to the law

An appeal filed a day late, a pre-trial conference notice not applied for within time, a writ that expired before service. None of these are questions of legal skill.

## Computing time properly

Ask the assistant to compute from the specific rules of the specific court, and to state the rule it relies on for each computation. Then check the rule. Time computation differs between courts, and between editions of the same court’s rules.

## Build in margin

Set the internal deadline well before the real one. The assistant will do this if you ask for it — internal deadlines at 60% of the period, escalation at 80%.`,
    prompts: [
      {
        label: 'Compute the timetable',
        prompt:
          'A [describe the process] was served on my client on [date] in the High Court of [State]. Using the current Civil Procedure Rules of that court, compute every deadline that follows — appearance, defence, reply, pre-trial conference application — stating the Order and Rule relied on for each computation.',
      },
      {
        label: 'Appellate timetable',
        prompt:
          'Judgment was delivered against my client on [date] by the High Court of [State]. Set out the full appellate timetable to the Court of Appeal: time to file the notice of appeal, transmission of the record, entry of the appeal, and briefs, with the rule for each and the consequence of default.',
      },
      {
        label: 'Diary with margin',
        prompt:
          'Convert this timetable into diary entries: [paste the timetable]. For each deadline, give me an internal target at 60% of the available period and an escalation date at 80%, and note what must be ready by each.',
      },
    ],
    verificationSteps: [
      'Confirm every computation against the current edition of the rules of the specific court — editions differ and the AI may be working from an older one.',
      'Check whether the period counts clear days, working days or calendar days under the rule relied on.',
      'Confirm public holidays and any vacation rules affecting the period.',
      'Enter the deadline in the firm’s own diary system; an AI conversation is not a diary.',
    ],
    exercise:
      'Run the timetable prompt on a matter served this month and check every computed date against the rule book. Note any date the AI got wrong, and why.',
  },
];

const BY_ID = new Map(AI_LITIGATION_LESSONS.map((lesson) => [lesson.id, lesson]));

export const aiLessonById = (id: string): AiLitigationLesson | undefined => BY_ID.get(id);

export const lessonsInStage = (stage: AiLitigationLesson['stage']): AiLitigationLesson[] =>
  AI_LITIGATION_LESSONS.filter((lesson) => lesson.stage === stage);

/** Free-text search across the curriculum. */
export const searchAiLessons = (query: string): AiLitigationLesson[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return AI_LITIGATION_LESSONS;

  return AI_LITIGATION_LESSONS.filter((lesson) =>
    [
      lesson.title,
      lesson.stage,
      lesson.objective,
      lesson.whatTheAiDoes,
      lesson.body,
      lesson.exercise,
      ...lesson.verificationSteps,
      ...lesson.prompts.flatMap((prompt) => [prompt.label, prompt.prompt]),
    ]
      .join(' ')
      .toLowerCase()
      .includes(needle),
  );
};
