'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Clock, Shield, CircleAlert as AlertCircle, CircleCheck as CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SAMPLE_QUESTIONS } from '@/lib/dummy-data';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const CHALLENGE_DURATION = 30 * 60;

const ALL_QUESTIONS = [
  ...SAMPLE_QUESTIONS,
  {
    id: 'q-006', challenge_id: 'ch-001', question_text: 'You witness a friend cheating during an exam. What do you do?', question_type: 'ethical' as const, order_index: 6,
    options: [
      { id: 'o-006a', question_id: 'q-006', option_label: 'A' as const, option_text: 'Stay silent to protect your friendship', selection_count: 20, score: 0.20 },
      { id: 'o-006b', question_id: 'q-006', option_label: 'B' as const, option_text: 'Quietly tell them to stop right away', selection_count: 35, score: 0.35 },
      { id: 'o-006c', question_id: 'q-006', option_label: 'C' as const, option_text: 'Report to the teacher immediately', selection_count: 28, score: 0.28 },
      { id: 'o-006d', question_id: 'q-006', option_label: 'D' as const, option_text: 'Join in since others might too', selection_count: 17, score: 0.17 },
    ],
  },
  {
    id: 'q-007', challenge_id: 'ch-001', question_text: 'Your group project is failing. Two days left. Best approach?', question_type: 'leadership' as const, order_index: 7,
    options: [
      { id: 'o-007a', question_id: 'q-007', option_label: 'A' as const, option_text: 'Work all night and do it all yourself', selection_count: 15, score: 0.15 },
      { id: 'o-007b', question_id: 'q-007', option_label: 'B' as const, option_text: 'Hold an emergency team meeting and divide tasks', selection_count: 50, score: 0.50 },
      { id: 'o-007c', question_id: 'q-007', option_label: 'C' as const, option_text: 'Ask teacher for an extension', selection_count: 22, score: 0.22 },
      { id: 'o-007d', question_id: 'q-007', option_label: 'D' as const, option_text: 'Submit what you have with an apology note', selection_count: 13, score: 0.13 },
    ],
  },
  {
    id: 'q-008', challenge_id: 'ch-001', question_text: 'What do you think matters most in a true friendship?', question_type: 'opinion' as const, order_index: 8,
    options: [
      { id: 'o-008a', question_id: 'q-008', option_label: 'A' as const, option_text: 'Honest communication at all times', selection_count: 40, score: 0.40 },
      { id: 'o-008b', question_id: 'q-008', option_label: 'B' as const, option_text: 'Shared interests and hobbies', selection_count: 18, score: 0.18 },
      { id: 'o-008c', question_id: 'q-008', option_label: 'C' as const, option_text: 'Being there through hard times', selection_count: 32, score: 0.32 },
      { id: 'o-008d', question_id: 'q-008', option_label: 'D' as const, option_text: 'Having fun and making memories together', selection_count: 10, score: 0.10 },
    ],
  },
];

const QUESTION_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  emotional_intelligence: { label: 'Emotional Intelligence', color: 'bg-pink-100 text-pink-700' },
  social_reasoning: { label: 'Social Reasoning', color: 'bg-blue-100 text-blue-700' },
  analytical: { label: 'Analytical', color: 'bg-teal-100 text-teal-700' },
  ethical: { label: 'Ethical Choice', color: 'bg-orange-100 text-orange-700' },
  curiosity: { label: 'Curiosity', color: 'bg-sky-100 text-sky-700' },
  leadership: { label: 'Leadership', color: 'bg-emerald-100 text-emerald-700' },
  creative: { label: 'Creative', color: 'bg-violet-100 text-violet-700' },
  opinion: { label: 'Opinion', color: 'bg-amber-100 text-amber-700' },
};

export default function ChallengePage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_DURATION);
  const [submitted, setSubmitted] = useState(false);
  const [showFairPlay, setShowFairPlay] = useState(true);

  const questions = ALL_QUESTIONS;
  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    setTimeout(() => router.push('/results'), 1500);
  }, [submitted, router]);

  useEffect(() => {
    if (showFairPlay || submitted) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [showFairPlay, submitted, handleSubmit]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const selectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const typeInfo = QUESTION_TYPE_LABELS[current.question_type] ?? { label: current.question_type, color: 'bg-slate-100 text-slate-700' };

  if (showFairPlay) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Fair Play Notice</h2>
            <p className="text-slate-500 text-sm">Read before you start</p>
          </div>
          <div className="space-y-3 mb-8">
            {[
              'There are NO right or wrong answers. Think freely.',
              'You can submit only once per challenge.',
              'Results hidden until the challenge period closes.',
              'Questions and options appear in randomized order.',
              'Your score is based on how others answered — not a key.',
            ].map((rule) => (
              <div key={rule} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{rule}</span>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">You have <strong>30 minutes</strong> to answer all {questions.length} questions. The timer starts once you click begin.</p>
          </div>
          <Button onClick={async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    router.push('/login?redirect=/challenge');
    return;
  }

  setShowFairPlay(false);
}}className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl">
            I Understand — Begin Challenge
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Challenge Submitted!</h2>
          <p className="text-slate-500 mb-4">Answers: {answeredCount}/{questions.length} questions answered.</p>
          <p className="text-sm text-slate-400">Results will be published after the challenge closes. Redirecting...</p>
          <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-600">Q{currentIndex + 1}/{questions.length}</span>
              <Badge className={cn('text-xs', typeInfo.color)}>{typeInfo.label}</Badge>
            </div>
            <div className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold',
              timeLeft < 120 ? 'bg-red-100 text-red-700' : timeLeft < 300 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
            )}>
              <Clock className="w-3.5 h-3.5" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{answeredCount} answered</span>
            <span>{questions.length - answeredCount} remaining</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed mb-6">
            {current.question_text}
          </h2>
          <div className="space-y-3">
            {current.options.map((option) => {
              const isSelected = answers[current.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => selectOption(current.id, option.id)}
                  className={cn(
                    'option-btn group',
                    isSelected && 'selected'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all',
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                    )}>
                      {option.option_label}
                    </div>
                    <span className={cn('text-sm leading-relaxed pt-2', isSelected ? 'text-slate-900 font-medium' : 'text-slate-700')}>
                      {option.option_text}
                    </span>
                    {isSelected && (
                      <div className="ml-auto flex-shrink-0 pt-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="hidden sm:flex items-center gap-1 flex-1 justify-center">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  'w-6 h-6 rounded-full text-[10px] font-bold transition-all',
                  i === currentIndex ? 'bg-blue-600 text-white scale-110' :
                  answers[questions[i].id] ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                  'bg-slate-100 text-slate-400 hover:bg-slate-200'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentIndex < questions.length - 1 ? (
            <Button
              onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit
            </Button>
          )}
        </div>

        {answeredCount < questions.length && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{questions.length - answeredCount} questions unanswered. You can still submit, but unanswered questions score 0.</span> 
          </div>
        )}
      </div>
    </div>
  );
}
