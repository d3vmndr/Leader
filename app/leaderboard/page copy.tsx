'use client';

import { useState, useEffect } from 'react';
import { Trophy, Search, Filter, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'national', label: 'National Top' },
  { id: 'district', label: 'District Leaders' },
  { id: 'grade8', label: 'Grade 8' },
  { id: 'grade9', label: 'Grade 9' },
  { id: 'weekly', label: 'Weekly Champions' },
  { id: 'monthly', label: 'Monthly Champions' },
];

const MEDAL_ICONS = ['🥇', '🥈', '🥉'];

interface LeaderboardEntry {
  id: string;
  user_id: string;
  full_name: string;
  school_name: string;
  district: string;
  grade: number;
  streak: number;
  total_score: number;
  national_rank?: number;
  district_rank?: number;
  // For weekly/monthly
  period_score?: number;
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('national');
  const [search, setSearch] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserDistrict, setCurrentUserDistrict] = useState<string | null>(null);

  // Get current user info
  useEffect(() => {
    async function getCurrentUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        // Fetch user's district for district leaders tab
        const { data: profile } = await supabase
          .from('profiles')
          .select('district')
          .eq('id', user.id)
          .single();
        if (profile) setCurrentUserDistrict(profile.district);
      }
    }
    getCurrentUser();
  }, []);

  // Fetch leaderboard based on active tab and search
  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        let query;
        const today = new Date();
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

        switch (activeTab) {
          case 'national':
            // Top 100 by total_score from profiles
            query = supabase
              .from('profiles')
              .select('id, full_name, school_name, district, grade, streak, total_score, national_rank')
              .order('total_score', { ascending: false })
              .limit(100);
            break;

          case 'district':
            if (!currentUserDistrict) {
              // Fallback: show all districts if user not logged in or district unknown
              query = supabase
                .from('profiles')
                .select('id, full_name, school_name, district, grade, streak, total_score, district_rank')
                .order('total_score', { ascending: false })
                .limit(100);
            } else {
              query = supabase
                .from('profiles')
                .select('id, full_name, school_name, district, grade, streak, total_score, district_rank')
                .eq('district', currentUserDistrict)
                .order('total_score', { ascending: false })
                .limit(100);
            }
            break;

          case 'grade8':
            query = supabase
              .from('profiles')
              .select('id, full_name, school_name, district, grade, streak, total_score')
              .eq('grade', 8)
              .order('total_score', { ascending: false })
              .limit(100);
            break;

          case 'grade9':
            query = supabase
              .from('profiles')
              .select('id, full_name, school_name, district, grade, streak, total_score')
              .eq('grade', 9)
              .order('total_score', { ascending: false })
              .limit(100);
            break;

          case 'weekly':
            // Sum scores from challenge_results in last 7 days
            const { data: weeklyResults, error: weeklyErr } = await supabase
              .from('challenge_results')
              .select('user_id, score, profiles(full_name, school_name, district, grade, streak)')
              .gte('completed_at', sevenDaysAgo)
              .not('score', 'is', null);
            if (weeklyErr) throw weeklyErr;
            const weeklyMap = new Map<string, any>();
            (weeklyResults || []).forEach((res: any) => {
              const uid = res.user_id;
              const existing = weeklyMap.get(uid);
              const score = res.score || 0;
              weeklyMap.set(uid, {
                id: uid,
                user_id: uid,
                total_score: (existing?.total_score || 0) + score,
                full_name: res.profiles?.full_name,
                school_name: res.profiles?.school_name,
                district: res.profiles?.district,
                grade: res.profiles?.grade,
                streak: res.profiles?.streak,
              });
            });
            const weeklyRank = Array.from(weeklyMap.values())
              .sort((a, b) => b.total_score - a.total_score)
              .slice(0, 100);
            setLeaderboard(weeklyRank);
            setLoading(false);
            return;

          case 'monthly':
            const { data: monthlyResults, error: monthlyErr } = await supabase
              .from('challenge_results')
              .select('user_id, score, profiles(full_name, school_name, district, grade, streak)')
              .gte('completed_at', thirtyDaysAgo)
              .not('score', 'is', null);
            if (monthlyErr) throw monthlyErr;
            const monthlyMap = new Map<string, any>();
            (monthlyResults || []).forEach((res: any) => {
              const uid = res.user_id;
              const existing = monthlyMap.get(uid);
              const score = res.score || 0;
              monthlyMap.set(uid, {
                id: uid,
                user_id: uid,
                total_score: (existing?.total_score || 0) + score,
                full_name: res.profiles?.full_name,
                school_name: res.profiles?.school_name,
                district: res.profiles?.district,
                grade: res.profiles?.grade,
                streak: res.profiles?.streak,
              });
            });
            const monthlyRank = Array.from(monthlyMap.values())
              .sort((a, b) => b.total_score - a.total_score)
              .slice(0, 100);
            setLeaderboard(monthlyRank);
            setLoading(false);
            return;

          default:
            query = supabase
              .from('profiles')
              .select('id, full_name, school_name, district, grade, streak, total_score')
              .order('total_score', { ascending: false })
              .limit(100);
        }

        const { data, error } = await query;
        if (error) throw error;
        setLeaderboard(data || []);
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [activeTab, currentUserDistrict]);

  // Apply search filter (post-fetch)
  const filtered = leaderboard.filter(entry =>
    !search ||
    entry.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    entry.district?.toLowerCase().includes(search.toLowerCase()) ||
    entry.school_name?.toLowerCase().includes(search.toLowerCase())
  );

  // Find current user's entry
  const currentUserEntry = filtered.find(entry => entry.user_id === currentUserId);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="gradient-hero py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 mb-4">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span className="text-white text-sm font-semibold">Live Rankings</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">National Leaderboard</h1>
          <p className="text-blue-200 text-sm">Ranked by challenge performance. Updated in real time.</p>

          {currentUserEntry && (
            <div className="mt-6 inline-flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl px-6 py-3 backdrop-blur-sm">
              <div className="text-white text-sm font-medium">Your Rank:</div>
              <div className="text-2xl font-black text-amber-300">
                #{filtered.findIndex(e => e.user_id === currentUserId) + 1 || '—'}
              </div>
              <div className="text-white/70 text-sm">
                Score: {(currentUserEntry.total_score ?? 0).toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 pb-12">
        {/* Tabs */}
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

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, school or district..."
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

        {/* Loading state */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
            <p className="text-slate-500">Loading rankings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No results found for "{search}"</p>
          </div>
        ) : (
          <>
            {/* Top 3 medallists */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {filtered.slice(0, 3).map((entry, i) => (
                <div
                  key={entry.id}
                  className={cn(
                    'rounded-2xl p-6 text-center border',
                    i === 0 ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300' :
                    i === 1 ? 'bg-gradient-to-br from-slate-50 to-gray-100 border-slate-300' :
                    'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300'
                  )}
                >
                  <div className="text-4xl mb-2">{MEDAL_ICONS[i]}</div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-700 font-black text-lg">{entry.full_name?.charAt(0)}</span>
                  </div>
                  <div className="font-bold text-slate-900 mb-0.5">{entry.full_name}</div>
                  <div className="text-xs text-slate-500 mb-2">{entry.district} · Grade {entry.grade}</div>
                  <div className="text-2xl font-black text-blue-700">{entry.total_score?.toFixed(2)}</div>
                  <div className="text-xs text-slate-400 mb-3">points</div>
                  <div className="flex justify-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                      {entry.streak || 0} week streak
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Full ranking table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">Full Rankings</h2>
                <span className="text-sm text-slate-400">{filtered.length} students</span>
              </div>
              <div className="divide-y divide-slate-50">
                {filtered.map((entry, idx) => {
                  const isCurrentUser = entry.user_id === currentUserId;
                  return (
                    <div
                      key={entry.id}
                      className={cn(
                        'flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50',
                        isCurrentUser && 'bg-blue-50 border-l-4 border-blue-500'
                      )}
                    >
                      {/* Rank / Medal */}
                      <div className="w-12 text-center flex-shrink-0">
                        {idx < 3 ? (
                          <span className="text-xl">{MEDAL_ICONS[idx]}</span>
                        ) : (
                          <span className={cn('text-sm font-bold', isCurrentUser ? 'text-blue-700' : 'text-slate-500')}>
                            #{idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 font-bold text-sm">{entry.full_name?.charAt(0)}</span>
                      </div>

                      {/* Name & school */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn('font-semibold text-sm truncate', isCurrentUser ? 'text-blue-800' : 'text-slate-900')}>
                            {entry.full_name}
                          </span>
                          {isCurrentUser && <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">You</Badge>}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {entry.school_name} · {entry.district}
                        </div>
                      </div>

                      {/* Grade (hidden on small screens) */}
                      <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
                        <div className="text-xs text-slate-400">Grade {entry.grade}</div>
                      </div>

                      {/* Score */}
                      <div className="text-right flex-shrink-0">
                        <div className={cn('text-base font-bold', isCurrentUser ? 'text-blue-700' : 'text-slate-900')}>
                          {entry.total_score?.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-400">points</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}