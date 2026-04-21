'use client';

import Link from 'next/link';
import { Trophy, Share2, Chrome as Home, TrendingUp, CircleCheck as CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SAMPLE_QUESTIONS, DUMMY_PROFILE } from '@/lib/dummy-data';

const MOCK_RESULT = {
  total_score: 2.17,
  national_rank: 47,
  district_rank: 3,
  answers: SAMPLE_QUESTIONS.map((q) => ({
    question: q,
    selected_option: q.options[0],
    earned_score: q.options[0].score,
  })),
};

function ScoreGauge({ score, max = 20 }: { score: number; max?: number }) {
  const pct = Math.min((score / max) * 100, 100);
  const color = pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-blue-600' : pct >= 40 ? 'text-amber-600' : 'text-red-500';

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          stroke={pct >= 80 ? '#10b981' : pct >= 60 ? '#3b82f6' : pct >= 40 ? '#f59e0b' : '#ef4444'}
          strokeWidth="10"
          strokeDasharray={`${pct * 2.51} 251`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-2xl font-black ${color}`}>{score.toFixed(2)}</div>
        <div className="text-xs text-slate-400">/ {max} pts</div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const result = MOCK_RESULT;
  const profile = DUMMY_PROFILE;

  const maxPossible = result.answers.length;
  const percentage = (result.total_score / maxPossible) * 100;

  const grade =
    percentage >= 80 ? { label: 'Outstanding', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' } :
    percentage >= 65 ? { label: 'Excellent', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' } :
    percentage >= 50 ? { label: 'Good Thinker', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' } :
    { label: 'Keep Growing', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 mb-4 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-semibold text-slate-700">Friday Fire – Week 17 Results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Your Results Are In!</h1>
          <p className="text-slate-500">Results published 48 hours after challenge closed. Here&apos;s how you did.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <ScoreGauge score={result.total_score} />
              <div className="mt-3">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${grade.bg} ${grade.color}`}>{grade.label}</div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-2">🥇</div>
              <div className="text-3xl font-black text-amber-600">#{result.national_rank}</div>
              <div className="text-sm text-slate-500">National Rank</div>
              <div className="text-xs text-slate-400 mt-1">out of 4,238 participants</div>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-2">🏙️</div>
              <div className="text-3xl font-black text-blue-600">#{result.district_rank}</div>
              <div className="text-sm text-slate-500">District Rank</div>
              <div className="text-xs text-slate-400 mt-1">{profile.district} District</div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8">
              <Share2 className="w-4 h-4 mr-2" />
              Share My Result
            </Button>
            <Link href="/leaderboard">
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 w-full sm:w-auto">
                <Trophy className="w-4 h-4 mr-2" />
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-400 flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-800">Badge Earned: Participation Champ</p>
            <p className="text-xs text-emerald-700">You completed Friday Fire – Week 17. Your streak is now {profile.streak} weeks!</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900">Question-by-Question Breakdown</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {result.answers.map((item, i) => {
              const barPct = item.earned_score * 100;
              return (
                <div key={item.question.id} className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm font-medium text-slate-900 flex-1">{item.question.question_text}</p>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-blue-700">+{item.earned_score.toFixed(2)}</div>
                      <div className="text-xs text-slate-400">pts</div>
                    </div>
                  </div>
                  <div className="ml-10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {item.selected_option.option_label}
                        </div>
                        <span className="text-xs text-slate-700">{item.selected_option.option_text}</span>
                        <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${barPct}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">{item.selected_option.selection_count}% chose this</span>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-1">
                      {item.question.options.map((opt) => (
                        <div key={opt.id} className={`text-center p-1.5 rounded-lg text-xs ${opt.id === item.selected_option.id ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-slate-50 text-slate-400'}`}>
                          <div className="font-semibold">{opt.option_label}</div>
                          <div>{(opt.score * 100).toFixed(0)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full border-slate-200 text-slate-700">
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/challenge">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
              Join Next Challenge
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
