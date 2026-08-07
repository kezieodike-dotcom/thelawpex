import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  ArrowLeft,
  Bot,
  Clock,
  Target,
  ShieldCheck,
  Wand2,
  PenLine,
} from 'lucide-react';
import {
  AI_LESSON_STAGES,
  AI_LITIGATION_LESSONS,
  aiLessonById,
  lessonsInStage,
  searchAiLessons,
} from '../../data/litigationAI';
import { AiLitigationLesson } from '../../types';
import { DocumentActions } from '../DocumentActions';
import { ProseView } from '../ProseView';
import { buildWordList, buildWordSection } from '../../lib/copyToWord';
import { proseToWordHtml } from '../../lib/prose';

interface LitigationAIViewProps {
  /** Lesson taken from the URL (`/learn-litigation-ai/:lessonId`). */
  lessonId?: string;
}

export const LitigationAIView: React.FC<LitigationAIViewProps> = ({ lessonId }) => {
  const lesson = lessonId ? aiLessonById(lessonId) : undefined;
  if (lesson) return <LessonDetail lesson={lesson} />;
  return <LessonDirectory />;
};

// ---------------------------------------------------------------------------
// The curriculum
// ---------------------------------------------------------------------------

const LessonDirectory: React.FC = () => {
  const [query, setQuery] = useState('');
  const [stage, setStage] = useState<'all' | AiLitigationLesson['stage']>('all');

  const needle = query.trim();
  const lessons = useMemo(() => {
    const matched = searchAiLessons(needle);
    return stage === 'all' ? matched : matched.filter((lesson) => lesson.stage === stage);
  }, [needle, stage]);

  const totalMinutes = AI_LITIGATION_LESSONS.reduce(
    (total, lesson) => total + lesson.durationMinutes,
    0,
  );

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          {/* Module cover. Pulled flush to the card edges and faded into the card colour,
              so it reads as part of the panel rather than a picture dropped on top of it. */}
          <div className="relative -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 h-36 sm:h-48 overflow-hidden rounded-t-2xl">
            <img
              src="/legal-tech.jpg"
              alt="A gavel resting on a desk while a practitioner works at a laptop behind it"
              loading="lazy"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-100 via-yellow-100/35 to-transparent" />
          </div>

          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            Module 8
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">
            Learn Litigation with AI Tools
          </h1>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1 leading-relaxed">
            A working curriculum for practising litigation with an AI assistant beside you — case
            theory, drafting, research, evidence, cross-examination, appeals and the diary. Every
            lesson gives you the prompts to send, and the checks you must carry out before anything
            the AI produced goes near a court.
          </p>

          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-700" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the curriculum e.g. 'cross-examination', 'grounds of appeal', 'section 84', 'chronology'..."
              className="w-full bg-white text-xs sm:text-sm pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-neutral-900 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <StageChip
              label="Whole curriculum"
              count={AI_LITIGATION_LESSONS.length}
              isActive={stage === 'all'}
              onClick={() => setStage('all')}
            />
            {AI_LESSON_STAGES.map((item) => (
              <StageChip
                key={item.id}
                label={item.id}
                count={lessonsInStage(item.id).length}
                isActive={stage === item.id}
                onClick={() => setStage(item.id)}
              />
            ))}
          </div>

          <p className="text-[11px] text-neutral-500 mt-4">
            {AI_LITIGATION_LESSONS.length} lessons • about {Math.round(totalMinutes / 60)} hours in
            total.
          </p>
        </div>

        {/* The standing warning — it governs every lesson in the module */}
        <div className="bg-yellow-400/20 border border-yellow-500/70 rounded-2xl p-5 mb-8 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-yellow-700 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xs font-bold text-yellow-700 uppercase tracking-wider">
              The rule that governs this whole module
            </h2>
            <p className="text-xs text-yellow-100 mt-1.5 leading-relaxed">
              Never cite a case you have not read in a report, and never file a process you have not
              read line by line. An AI assistant accelerates the work; it does not carry the
              professional responsibility. That remains yours.
            </p>
          </div>
        </div>

        {lessons.length === 0 ? (
          <p className="text-sm text-neutral-600">No lesson matches “{query}”.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/learn-litigation-ai/${lesson.id}`}
                className="bg-yellow-100 border border-neutral-200 hover:border-yellow-500/50 rounded-2xl p-5 transition shadow-lg group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-yellow-700" />
                    <span className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider">
                      {lesson.stage}
                    </span>
                  </div>

                  <h2 className="text-base font-black font-serif text-neutral-900 group-hover:text-yellow-700 transition leading-snug">
                    {lesson.title}
                  </h2>
                  <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed">
                    {lesson.objective}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500">
                    {lesson.level} • {lesson.durationMinutes} min • {lesson.prompts.length} prompts
                  </span>
                  <ChevronRight className="w-4 h-4 text-yellow-700" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StageChip: React.FC<{
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
      isActive
        ? 'bg-yellow-400 text-neutral-950 border-yellow-400 font-bold'
        : 'bg-white text-neutral-700 border-neutral-200 hover:border-yellow-500/80'
    }`}
  >
    {label} ({count})
  </button>
);

// ---------------------------------------------------------------------------
// One lesson
// ---------------------------------------------------------------------------

const LessonDetail: React.FC<{ lesson: AiLitigationLesson }> = ({ lesson }) => (
  <div className="bg-white text-neutral-900 min-h-screen py-8">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl">
        <Link
          to="/learn-litigation-ai"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-700 hover:text-yellow-800 uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          The whole curriculum
        </Link>

        <h1 className="text-xl sm:text-3xl font-black font-serif text-neutral-900 mt-2 leading-snug">
          {lesson.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="bg-white border border-neutral-200 text-neutral-700 text-[11px] px-2.5 py-1 rounded-lg">
            {lesson.stage}
          </span>
          <span className="bg-white border border-neutral-200 text-neutral-700 text-[11px] px-2.5 py-1 rounded-lg">
            {lesson.level}
          </span>
          <span className="bg-white border border-neutral-200 text-neutral-700 text-[11px] px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-yellow-700" />
            {lesson.durationMinutes} minutes
          </span>
        </div>
      </div>

      <div className="space-y-5">
        <Panel
          title="What you will be able to do"
          subtitle="The skill this lesson leaves you with."
          icon={Target}
        >
          <p className="text-xs text-neutral-800 leading-relaxed bg-white border border-neutral-200 rounded-xl p-4">
            {lesson.objective}
          </p>
          <p className="text-xs text-neutral-700 leading-relaxed bg-white border border-neutral-200 rounded-xl p-4 mt-3">
            <span className="text-yellow-700 font-bold">What the AI does here: </span>
            {lesson.whatTheAiDoes}
          </p>
        </Panel>

        <Panel title="The lesson" subtitle="How the skill and the tool fit together." icon={PenLine}>
          <ProseView body={lesson.body} />

          <DocumentActions
            className="mt-5"
            html={proseToWordHtml(lesson.title, `LAWPEX — ${lesson.stage}`, lesson.body)}
            filename={lesson.title}
            hint="Copy the lesson to MS Word."
          />
        </Panel>

        <Panel
          title="Prompts to send"
          subtitle="Open one in the AI assistant, then replace the bracketed parts with your matter."
          icon={Wand2}
        >
          <div className="space-y-3">
            {lesson.prompts.map((prompt, index) => (
              <div key={index} className="bg-white border border-neutral-200 rounded-xl p-4">
                <h4 className="text-sm font-bold font-serif text-neutral-900">{prompt.label}</h4>

                <p className="text-[11px] text-neutral-700 leading-relaxed font-mono mt-2 bg-yellow-100 border border-neutral-200 rounded-lg p-3">
                  {prompt.prompt}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Link
                    to={`/ai-assistant?prompt=${encodeURIComponent(prompt.prompt)}`}
                    className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-[11px] px-3 py-1.5 rounded-lg transition"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    Open in the AI assistant
                  </Link>

                  <DocumentActions
                    html={buildWordSection(prompt.label, lesson.title, [prompt.prompt])}
                    filename={prompt.label}
                    hint="Or copy the prompt to MS Word."
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Verify before you file"
          subtitle="The checks that stand between an AI draft and a filed process."
          icon={ShieldCheck}
        >
          <ul className="space-y-2">
            {lesson.verificationSteps.map((step, index) => (
              <li
                key={index}
                className="bg-white border border-yellow-400/70 rounded-xl p-3 flex items-start gap-2.5 text-xs text-neutral-800 leading-relaxed"
              >
                <ShieldCheck className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 bg-white border border-neutral-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-yellow-700 uppercase tracking-wider">
              Practise it
            </h4>
            <p className="text-xs text-neutral-700 mt-1.5 leading-relaxed">{lesson.exercise}</p>
          </div>

          <DocumentActions
            className="mt-4"
            html={[
              buildWordList('Verify before you file', lesson.title, lesson.verificationSteps),
              buildWordSection('Exercise', '', [lesson.exercise]),
            ].join('')}
            filename={`${lesson.title} - verification checklist`}
            hint="Copy the verification checklist to MS Word."
          />
        </Panel>
      </div>
    </div>
  </div>
);

const Panel: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ElementType;
  children: React.ReactNode;
}> = ({ title, subtitle, icon: Icon, children }) => (
  <div className="bg-yellow-100 border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xl">
    <div className="border-b border-neutral-200 pb-3 mb-4 flex items-start gap-3">
      <Icon className="w-5 h-5 text-yellow-700 shrink-0 mt-0.5" />
      <div>
        <h2 className="text-lg font-black font-serif text-neutral-900">{title}</h2>
        <p className="text-[11px] text-neutral-600 mt-0.5">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);
