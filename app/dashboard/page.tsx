'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Zap, 
  Flame, 
  Clock, 
  TrendingUp, 
  Award, 
  Star, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Target 
} from 'lucide-react';

// Note: Assuming these components/libs exist in your environment
// Replacing @ imports with relative paths or mock implementations for this artifact
const Button = ({ children, className = "", variant = "primary", ...props }) => (
  <button className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-bold transition-all ${className}`} {...props}>{children}</button>
);
const Badge = ({ children, className = "" }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${className}`}>{children}</span>
);

// Mocking Supabase & Dummy Data for the demo
const supabase = {
  auth: {
    getUser: async () => ({
      data: {
        user: {
          email: 'anish@example.com',
          user_metadata: {
            full_name: 'Anish Giri',
            username: 'anish_pro',
            school_name: 'St. Xavier’s School',
            grade: '10'
          }
        }
      }
    })
  }
};

const DUMMY_PROFILE = {
  full_name: 'Loading...',
  username: 'user',
  school_name: 'SmartLeague Academy',
  grade: '--',
  district: 'Kathmandu',
  district_rank: 42,
  national_rank: 128,
  total_score: 850.45,
  streak: 3
};

const DUMMY_BADGES = [{ id: 1, name: 'First Win', icon: 'award' }, { id: 2, name: 'Streak 3', icon: 'zap' }];
const USER_BADGES_EARNED = [1];
const DUMMY_CHALLENGES = [{ title: 'Weekly Math Sprint', description: 'Quick-fire algebra questions.', scheduled_date: new Date(Date.now() + 86400000).toISOString(), status: 'upcoming', duration_minutes: 20, total_questions: 15 }];
const RECENT_CHALLENGES = [{ challenge: 'Science Trivia', date: '2 days ago', score: 92.5, rank: 12 }];

function CountdownTimer({ targetDate }) {
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
  const [profile, setProfile] = useState(DUMMY_PROFILE);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        const meta = data.user.user_metadata;
        
        const displayName = meta?.full_name || 
                           meta?.username?.replace('@', '') || 
                           data.user.email?.split('@')[0] || 
                           'Champion';

        setProfile({
          ...DUMMY_PROFILE,
          full_name: displayName,
          username: meta?.username || 'user',
          school_name: meta?.school_name || 'Not Assigned',
          grade: meta?.grade || 'N/A'
        });
      }
    }

    loadUser();
  }, []);

  const upcomingChallenge = DUMMY_CHALLENGES.find((c) => c.status === 'upcoming');
  const earnedBadges = DUMMY_BADGES.filter((b) => USER_BADGES_EARNED.includes(b.id));
  const lockedBadges = DUMMY_BADGES.filter((b) => !USER_BADGES_EARNED.includes(b.id));

  const badgeIconMap = {
    award: '🏅',
    trophy: '🏆',
    zap: '⚡',
    'map-pin': '📍',
    star: '⭐',
  };

  const streakPct = Math.min((profile.streak / 10) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* HEADER SECTION - FIXED NAME & DETAILS */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <p className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-widest">Dashboard Overview</p>
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900">
                Welcome back, {profile.full_name}
              </h1>
              <span className="text-2xl">👋</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <p className="text-sm font-semibold text-slate-500">
                {profile.school_name}
              </p>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <Badge className="bg-slate-100 text-slate-600 border-slate-200">
                Grade {profile.grade}
              </Badge>
            </div>
          </div>
          
          {upcomingChallenge && (
            <div className="flex items-center gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-200 px-6 py-4 rounded-2xl h-auto">
                <Zap className="w-4 h-4 mr-2 fill-current" />
                Join Challenge
              </Button>
            </div>
          )}
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Target, label: 'Total Score', value: profile.total_score.toFixed(2), sub: 'All time points', color: 'bg-blue-600 text-white shadow-blue-100' },
            { icon: Trophy, label: 'National Rank', value: `#${profile.national_rank}`, sub: `of 12.4k students`, color: 'bg-white text-slate-900 border border-slate-200 shadow-sm' },
            { icon: MapPin, label: 'District Rank', value: `#${profile.district_rank}`, sub: profile.district, color: 'bg-white text-slate-900 border border-slate-200 shadow-sm' },
            { icon: Flame, label: 'Streak', value: `${profile.streak} Weeks`, sub: 'Keep it going!', color: 'bg-orange-500 text-white shadow-orange-100' },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className={`${color} rounded-[2rem] p-6 transition-transform hover:scale-[1.02] duration-300`}>
              <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black mb-0.5">{value}</div>
              <div className="text-[10px] font-black uppercase tracking-wider opacity-70">{label}</div>
              <div className="text-[10px] opacity-60 mt-1">{sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* CHALLENGE BANNER */}
          <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Trophy size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                  Active Challenge
                </div>
              </div>
              <h2 className="text-2xl font-black mb-2">{upcomingChallenge?.title}</h2>
              <p className="text-slate-400 text-sm mb-8 max-w-md">{upcomingChallenge?.description}</p>
              
              <div className="mb-8">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Starts In</p>
                <CountdownTimer targetDate={upcomingChallenge?.scheduled_date} />
              </div>
              
              <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Clock className="w-4 h-4 text-blue-400" /> {upcomingChallenge?.duration_minutes} Mins
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Target className="w-4 h-4 text-blue-400" /> {upcomingChallenge?.total_questions} Questions
                </div>
              </div>
            </div>
          </div>

          {/* STREAK CARD */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Participation
              </h3>
              <div className="text-center mb-8">
                <div className="text-6xl font-black text-slate-900 leading-none">{profile.streak}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Week Streak</div>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full mb-4 overflow-hidden p-0.5">
                <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000" style={{ width: `${streakPct}%` }} />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-wider">
              {10 - profile.streak} more weeks to unlock 'Flame Lord'
            </p>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BADGES */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Badges
              </h3>
              <Badge className="bg-blue-50 text-blue-600 border-blue-100">
                {earnedBadges.length} Collected
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="aspect-square rounded-2xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center p-2 group cursor-help">
                  <span className="text-2xl mb-1">{badgeIconMap[badge.icon] || '🏅'}</span>
                  <span className="text-[8px] font-black text-amber-700 text-center uppercase leading-tight">{badge.name}</span>
                </div>
              ))}
              {lockedBadges.slice(0, 1).map((badge) => (
                <div key={badge.id} className="aspect-square rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center grayscale opacity-40">
                  <span className="text-2xl">🔒</span>
                </div>
              ))}
            </div>
          </div>

          {/* HISTORY */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8">
             <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                History
              </h3>
              <Button className="text-blue-600 text-[10px] uppercase font-black tracking-widest hover:bg-blue-50">
                Full Results <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {RECENT_CHALLENGES.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg">
                    📊
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-black text-slate-900">{item.challenge}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-blue-600">{item.score}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">Rank #{item.rank}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}