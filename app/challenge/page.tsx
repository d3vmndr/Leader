'use client';

import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  opinion: { label: 'Opinion', color: 'bg-purple-100 text-purple-700' },
};

export default function ChallengePage() {
  const { isAuthenticated, isAuthChecked } = useAuthRedirect({ redirectTo: '/login' });
  const [currentQ, setCurrentQ] = useState(0);
  const [showFairPlay, setShowFairPlay] = useState(true);
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_DURATION);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const questions = ALL_QUESTIONS;
  const q = questions[currentQ];
  const selectedOption = answers[q.id];

  useEffect(() => {
    if (!showFairPlay && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [showFairPlay, timeLeft]);

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">⏳</div>
          <p className="text-slate-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const allCorrect = Object.keys(answers).length === questions.length;
        const totalScore = allCorrect ? 100 : Object.keys(answers).length * (100 / questions.length);

        await supabase.from('challenge_responses').insert({
          user_id: user.id,
          challenge_id: 'ch-001',
          answers: answers,
          score: totalScore,
          completed_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
          <div className={`text-center font-mono font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-slate-600'}`}>
            {mins}:{String(secs).padStart(2, '0')}
          </div>
          <div className="w-16" />
        </div>

        {showFairPlay ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-black text-slate-900">Fair Play Commitment</h1>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-slate-600">
                This is a challenge designed to assess <strong>your unique thinking</strong> on real-life scenarios. There are no right or wrong answers.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Answer Honestly</p>
                    <p className="text-xs text-slate-600">Your own thoughts matter. Don't overthink or look for &quot;correct&quot; answers.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">No External Help</p>
                    <p className="text-xs text-slate-600">This is about your reasoning. Don't use external resources or ask others.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Complete in One Sitting</p>
                    <p className="text-xs text-slate-600">The timer is 30 minutes. Complete all questions without closing the page.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">You have <strong>30 minutes</strong> to answer all {questions.length} questions. The timer starts once you click begin.</p>
            </div>
            <Button
              onClick={async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                  setShowFairPlay(false);
                } else {
                  router.push('/login?redirect=/challenge');
                }
              }}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl"
            >
              I Understand — Begin Challenge
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  {QUESTION_TYPE_LABELS[q.question_type]?.label || q.question_type}
                </Badge>
                <span className="text-xs text-slate-500">Question {currentQ + 1} of {questions.length}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{q.question_text}</h2>
            </div>

            <div className="space-y-3 mb-8">
              {q.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setAnswers({ ...answers, [q.id]: option.id })}
                  className={cn(
                    'w-full text-left p-4 rounded-xl border-2 transition-all',
                    selectedOption === option.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                      selectedOption === option.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                    )}>
                      {selectedOption === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{option.option_label}</div>
                      <div className="text-sm text-slate-600">{option.option_text}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                disabled={currentQ === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>

              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all',
                      i === currentQ ? 'bg-blue-600 w-8' : answers[questions[i].id] ? 'bg-emerald-500' : 'bg-slate-300'
                    )}
                  />
                ))}
              </div>

              {currentQ === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={submitted}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {submitted ? 'Submitted' : 'Submit Challenge'}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQ(currentQ + 1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
