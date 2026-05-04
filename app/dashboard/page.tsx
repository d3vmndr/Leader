'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Zap, Flame, Clock, TrendingUp, Award, Star, MapPin, Calendar, ChevronRight, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
// import { DUMMY_PROFILE, DUMMY_BADGES, USER_BADGES_EARNED, RECENT_CHALLENGES, DUMMY_CHALLENGES } from '@/lib/dummy-data';

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-2">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hrs' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Sec' },
      ].map(({ value, label }, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="bg-white rounded-xl p-2 text-center min-w-[52px] shadow-sm border border-blue-100">
            <div className="text-xl font-black text-blue-700">{String(value).padStart(2, '0')}</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider">{label}</div>
          </div>
          {i < 3 && <span className="text-blue-400 font-bold text-lg">:</span>}
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (!mounted) return;

        if (authError || !user) {
          setProfile(null);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, school_name, player_type, district, province, total_score, national_rank, district_rank, streak')
          .eq('id', user.id)
          .maybeSingle();

        if (!mounted) return;

        if (error) {
  console.error('Profile fetch error:', error);
  setProfile(null);
} else if (data) {
  setProfile(data);
} else {
  setProfile(null);
}
      } catch (err) {
        console.error('Dashboard load error:', err);
        if (mounted) setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">⏳</div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const upcomingChallenge = DUMMY_CHALLENGES.find((c) => c.status === 'upcoming');
  const earnedBadges = DUMMY_BADGES.filter((b) => USER_BADGES_EARNED.includes(b.id));
  const lockedBadges = DUMMY_BADGES.filter((b) => !USER_BADGES_EARNED.includes(b.id));

  const badgeIconMap: Record<string, string> = {
    award: '🏅',
    trophy: '🏆',
    zap: '⚡',
    'map-pin': '📍',
    star: '⭐',
    brain: '🧠',
    crown: '👑',
    shield: '🛡️',
    lightbulb: '💡',
  };

  const streakPct = Math.min((profile.streak / 10) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 mb-0.5">Welcome back,</p>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">{profile.full_name} 👋</h1>
            <p className="text-sm text-slate-500 mt-0.5">{profile.school_name} · {profile.player_type}</p>
          </div>
          {upcomingChallenge && (
            <Link href="/challenge">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 px-6">
                <Zap className="w-4 h-4 mr-2" />
                Join Next Challenge
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Target, label: 'Total Score',value: (profile.total_score ?? 0).toFixed(2), sub: 'All time points', color: 'from-blue-500 to-blue-700', text: 'text-white' },
            { icon: Trophy, label: 'National Rank', value: `#${profile.national_rank}`, sub: `of 12,400+ students`, color: 'from-amber-400 to-orange-500', text: 'text-white' },
            { icon: MapPin, label: 'District Rank', value: `#${profile.district_rank}`, sub: profile.district, color: 'from-emerald-500 to-teal-600', text: 'text-white' },
            { icon: Flame, label: 'Streak', value: `${profile.streak} weeks`, sub: 'Keep it going!', color: 'from-red-500 to-rose-600', text: 'text-white' },
          ].map(({ icon: Icon, label, value, sub, color, text }) => (
            <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 shadow-sm`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${text}`} />
                </div>
              </div>
              <div className={`text-2xl font-black ${text} mb-0.5`}>{value}</div>
              <div className={`text-xs font-medium ${text} opacity-80`}>{label}</div>
              <div className={`text-xs ${text} opacity-60`}>{sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {upcomingChallenge ? (
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-900 to-blue-950 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-300 text-sm font-semibold uppercase tracking-wider">Next Challenge</span>
              </div>
              <h2 className="text-xl font-black mb-1">{upcomingChallenge.title}</h2>
              <p className="text-blue-200 text-sm mb-5">{upcomingChallenge.description}</p>
              <div className="mb-5">
                <p className="text-blue-300 text-xs mb-2 uppercase tracking-wider">Starts In</p>
                <CountdownTimer targetDate={upcomingChallenge.scheduled_date} />
              </div>
              <div className="flex items-center gap-4 text-xs text-blue-300">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{upcomingChallenge.duration_minutes} minutes</span>
                <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" />{upcomingChallenge.total_questions} questions</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{upcomingChallenge.day_type === 'monday' ? 'Monday' : 'Friday'} Challenge</span>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-bold text-lg mb-1">No Active Challenge</h3>
                <p className="text-slate-400 text-sm">The next challenge hasn&apos;t been scheduled yet. Check back Monday!</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Participation Streak
            </h3>
            <div className="text-center mb-4">
              <div className="text-4xl font-black text-slate-900">{profile.streak}</div>
              <div className="text-sm text-slate-500">week{profile.streak !== 1 ? 's' : ''} in a row</div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full mb-3 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${streakPct}%` }} />
            </div>
            <div className="text-xs text-slate-500 text-center mb-4">{10 - profile.streak} more weeks for Streak Master badge</div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className={`h-8 rounded-md ${i < profile.streak % 7 ? 'bg-emerald-400' : 'bg-slate-100'} transition-colors`} />
              ))}
            </div>
            <div className="text-xs text-slate-400 text-center mt-2">Last 7 challenges</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                My Badges
              </h3>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">{earnedBadges.length}/{DUMMY_BADGES.length} Earned</Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100 group hover-lift">
                  <div className="text-2xl mb-1">{badgeIconMap[badge.icon] ?? '🏅'}</div>
                  <div className="text-xs font-semibold text-slate-700 leading-tight">{badge.name}</div>
                </div>
              ))}
              {lockedBadges.slice(0, 3).map((badge) => (
                <div key={badge.id} className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200 opacity-50">
                  <div className="text-2xl mb-1 grayscale">{badgeIconMap[badge.icon] ?? '🏅'}</div>
                  <div className="text-xs font-semibold text-slate-400 leading-tight">{badge.name}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 text-center">{lockedBadges.length} more badges to unlock</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Recent History
              </h3>
              <Link href="/results">
                <Button variant="ghost" size="sm" className="text-blue-600 text-xs">View All <ChevronRight className="w-3 h-3 ml-0.5" /></Button>
              </Link>
            </div>
            <div className="space-y-3">
              {RECENT_CHALLENGES.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">{item.challenge}</div>
                    <div className="text-xs text-slate-400">{item.date}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-blue-700">{item.score.toFixed(2)}</div>
                    <div className="text-xs text-slate-400">Rank #{item.rank}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">You&apos;re ranked <span className="text-amber-600">#{profile.national_rank}</span> nationally!</h3>
              <p className="text-sm text-slate-600">Keep competing to climb into the Top 10 and win monthly prizes.</p>
            </div>
          </div>
          <Link href="/leaderboard">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white font-bold whitespace-nowrap">
              View Leaderboard <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
