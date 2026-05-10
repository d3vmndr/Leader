'use client';

import { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DUMMY_LEADERBOARD, DUMMY_PROFILE } from '@/lib/dummy-data';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'national', label: 'National Top' },
  { id: 'district', label: 'District Leaders' },
  { id: 'grade8', label: 'Grade 8' },
  { id: 'grade9', label: 'Grade 9' },
  { id: 'weekly', label: 'Weekly Champions' },
  { id: 'monthly', label: 'Monthly Champions' },
];

const EXTENDED_LEADERBOARD = [
  ...DUMMY_LEADERBOARD,
  { id: 'le-extra1', user_id: 'ue1', challenge_id: 'ch-002', total_score: 14.55, national_rank: 9, district_rank: 2, profile: { id: 'ue1', full_name: 'Ramesh Basnet', username: 'ramesh_b', grade: 8 as const, school_name: 'Dang Higher School', district: 'Dang', province: 'Lumbini Province', total_score: 14.55, national_rank: 9, district_rank: 2, streak: 3, challenges_participated: 8, is_admin: false, created_at: '' } },
  { id: 'le-extra2', user_id: 'ue2', challenge_id: 'ch-002', total_score: 14.33, national_rank: 10, district_rank: 3, profile: { id: 'ue2', full_name: 'Sunita Magar', username: 'sunita_m', grade: 9 as const, school_name: 'Gorkha Secondary School', district: 'Gorkha', province: 'Gandaki Province', total_score: 14.33, national_rank: 10, district_rank: 3, streak: 5, challenges_participated: 11, is_admin: false, created_at: '' } },
];

function RankChange({ change }: { change: number }) {
  if (change > 0) return <div className="flex items-center gap-0.5 text-emerald-600 text-xs font-semibold"><TrendingUp className="w-3 h-3" />+{change}</div>;
  if (change < 0) return <div className="flex items-center gap-0.5 text-red-500 text-xs font-semibold"><TrendingDown className="w-3 h-3" />{change}</div>;
  return <div className="flex items-center gap-0.5 text-slate-400 text-xs"><Minus className="w-3 h-3" /></div>;
}

const RANK_CHANGES = [5, -2, 3, 0, 1, -1, 8, 0, 2, -3];
const MEDAL_ICONS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('national');
  const [search, setSearch] = useState('');

  const filtered = EXTENDED_LEADERBOARD.filter((e) =>
    !search || e.profile?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.profile?.district?.toLowerCase().includes(search.toLowerCase())
  );

  const currentUserEntry = EXTENDED_LEADERBOARD.find((e) => e.user_id === 'user-001');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="gradient-hero py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 mb-4">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span className="text-white text-sm font-semibold">Friday Fire – Week 17 Results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">National Leaderboard</h1>
          <p className="text-blue-200 text-sm">Ranked by final score. Updated every Monday &amp; Friday.</p>

          {currentUserEntry && (
            <div className="mt-6 inline-flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl px-6 py-3 backdrop-blur-sm">
              <div className="text-white text-sm font-medium">Your Rank:</div>
              <div className="text-2xl font-black text-amber-300">#{currentUserEntry.national_rank}</div>
              <div className="text-white/70 text-sm">Score: {currentUserEntry.total_score.toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 pb-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 overflow-x-auto">
          <div className="flex p-2 gap-1 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl border-slate-200"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 h-11 rounded-xl border-slate-200">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {filtered.slice(0, 3).map((entry, i) => (
            <div key={entry.id} className={cn(
              'rounded-2xl p-6 text-center border',
              i === 0 ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300' :
              i === 1 ? 'bg-gradient-to-br from-slate-50 to-gray-100 border-slate-300' :
              'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300'
            )}>
              <div className="text-4xl mb-2 rank-float">{MEDAL_ICONS[i]}</div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-700 font-black text-lg">{entry.profile?.full_name?.charAt(0)}</span>
              </div>
              <div className="font-bold text-slate-900 mb-0.5">{entry.profile?.full_name}</div>
              <div className="text-xs text-slate-500 mb-2">{entry.profile?.district} · Grade {entry.profile?.grade}</div>
              <div className="text-2xl font-black text-blue-700">{entry.total_score.toFixed(2)}</div>
              <div className="text-xs text-slate-400 mb-3">points</div>
              <div className="flex justify-center gap-2">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                  {entry.profile?.streak} week streak
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Full Rankings</h2>
            <span className="text-sm text-slate-400">{filtered.length} students</span>
          </div>
          <div className="divide-y divide-slate-50">
            {filtered.map((entry, i) => {
              const isCurrentUser = entry.user_id === 'user-001';
              const rankChange = RANK_CHANGES[i % RANK_CHANGES.length];
              return (
                <div
                  key={entry.id}
                  className={cn(
                    'flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50',
                    isCurrentUser && 'bg-blue-50 border-l-4 border-blue-500',
                    i === 0 && !isCurrentUser && 'leaderboard-row-1',
                    i === 1 && !isCurrentUser && 'leaderboard-row-2',
                    i === 2 && !isCurrentUser && 'leaderboard-row-3',
                  )}
                >
                  <div className="w-12 text-center flex-shrink-0">
                    {i < 3 ? (
                      <span className="text-xl">{MEDAL_ICONS[i]}</span>
                    ) : (
                      <span className={cn('text-sm font-bold', isCurrentUser ? 'text-blue-700' : 'text-slate-500')}>
                        #{entry.national_rank}
                      </span>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 font-bold text-sm">{entry.profile?.full_name?.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn('font-semibold text-sm truncate', isCurrentUser ? 'text-blue-800' : 'text-slate-900')}>
                        {entry.profile?.full_name}
                      </span>
                      {isCurrentUser && <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">You</Badge>}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{entry.profile?.school_name} · {entry.profile?.district}</div>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
                    <RankChange change={rankChange} />
                    <div className="text-xs text-slate-400">Grade {entry.profile?.grade}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={cn('text-base font-bold', isCurrentUser ? 'text-blue-700' : 'text-slate-900')}>
                      {entry.total_score.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400">points</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}