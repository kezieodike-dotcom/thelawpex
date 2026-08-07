import React, { useState } from 'react';
import { GraduationCap, BookOpen, CheckCircle2, Trophy, Clock, Award, HelpCircle } from 'lucide-react';
import { BAR_EXAM_COURSES } from '../../data/legalData';

export const LearningCentreView: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState(BAR_EXAM_COURSES[0]);
  const [activeQuizIndex, setActiveQuizIndex] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  return (
    <div className="bg-white text-neutral-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-yellow-100 border border-yellow-400/70 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          <span className="bg-yellow-400 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
            MODULE 12
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-serif text-neutral-900 mt-2">Nigerian Law School & Bar Exam Learning Centre</h1>
          <p className="text-xs sm:text-sm text-neutral-700 max-w-3xl mt-1">
            Comprehensive Bar Final exam preparation suite: Civil Litigation, Criminal Litigation, Corporate Law, Property Law, and Professional Ethics with 10+ years of Past Questions & Interactive MCQ Quizzes.
          </p>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses List */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">Bar Final Modules</h2>
            {BAR_EXAM_COURSES.map((crs) => (
              <button
                key={crs.id}
                onClick={() => {
                  setSelectedCourse(crs);
                  setActiveQuizIndex(null);
                  setUserAnswer(null);
                  setShowResult(false);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition ${
                  selectedCourse.id === crs.id
                    ? 'bg-yellow-400 text-neutral-950 border-yellow-400 font-bold shadow-xl shadow-yellow-500/25'
                    : 'bg-yellow-100 text-neutral-700 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${selectedCourse.id === crs.id ? 'bg-white text-yellow-700' : 'bg-yellow-100 text-neutral-600'}`}>
                    BAR FINAL
                  </span>
                  <span className="text-[10px] font-mono">{crs.pastQuestionYears}</span>
                </div>
                <h3 className="text-sm font-bold font-serif mt-2">{crs.title}</h3>
                <p className={`text-[11px] line-clamp-2 mt-1 ${selectedCourse.id === crs.id ? 'text-neutral-900 font-medium' : 'text-neutral-600'}`}>
                  {crs.description}
                </p>
              </button>
            ))}
          </div>

          {/* Details & Quiz Interactive Stage */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-yellow-100 border border-neutral-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl">
              <div>
                <span className="text-[10px] text-yellow-700 font-bold uppercase tracking-wider">Nigerian Law School Curriculum</span>
                <h2 className="text-2xl font-black font-serif text-neutral-900 mt-1">{selectedCourse.title}</h2>
                <p className="text-xs text-neutral-700 mt-2 leading-relaxed">{selectedCourse.description}</p>
              </div>

              {/* Core Syllabus Modules */}
              <div>
                <h3 className="text-xs font-bold text-yellow-700 uppercase tracking-wider mb-3">Core NLS Syllabus Topics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCourse.syllabusModules.map((mod, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-800 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-yellow-700 shrink-0" />
                      <span>{mod}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive MCQ Quiz Section */}
              <div className="pt-4 border-t border-neutral-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold font-serif text-yellow-700 flex items-center gap-2">
                    <Trophy className="w-4 h-4" /> Bar Final Interactive MCQ Quiz
                  </h3>
                  <span className="text-xs text-neutral-600 font-mono">15 Questions</span>
                </div>

                {selectedCourse.sampleQuizzes.map((q, qIdx) => (
                  <div key={qIdx} className="bg-white border border-neutral-200 p-5 rounded-xl space-y-3">
                    <p className="text-xs font-bold text-neutral-900 leading-relaxed">{q.question}</p>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => {
                            setActiveQuizIndex(qIdx);
                            setUserAnswer(optIdx);
                            setShowResult(true);
                          }}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                            userAnswer === optIdx
                              ? optIdx === q.correctIndex
                                ? 'bg-green-500/20 border-green-500 text-green-300 font-bold'
                                : 'bg-red-500/20 border-red-500 text-red-300 font-bold'
                              : 'bg-yellow-100 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                          }`}
                        >
                          <span className="font-mono font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                          {opt}
                        </button>
                      ))}
                    </div>

                    {showResult && activeQuizIndex === qIdx && (
                      <div className="p-3 bg-yellow-100 border border-yellow-500/70 rounded-xl text-xs space-y-1">
                        <span className="text-yellow-700 font-bold text-[10px] uppercase block">Explanation & Precedent:</span>
                        <p className="text-neutral-800 text-xs">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
