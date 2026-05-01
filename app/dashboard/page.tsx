'use client';

import { useState, useEffect } from 'react';
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

/**
 * UI Components
 * Integrated directly to ensure portability and resolve potential import issues
 */
const Button = ({ children, className = "", ...props }) => (
  <button 
    className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-bold transition-all active:scale-95 disabled:opacity-50 ${className}`} 
    {...props}
  >
    {children}
  </button>
);

const Badge = ({ children, className = "" }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${className}`}>
    {children}
  </span>
);

/**
 * Mock Data & Constants
 */
const DUMMY_PROFILE = {
  full_name: 'Anish Giri',
  username: 'anish_pro',
  school_name: 'St. Xavier’s School',
  grade: '10',
  district: 'Kathmandu',
  district_rank: 42,
  national_rank: 128,
  total_score: 850.45,
  streak: 3
};

const DUMMY_BADGES = [
  { id: 1, name: 'First Win', icon: 'award' }, 
  { id: 2, name: 'Streak 3', icon: 'zap' }
];

const USER_BADGES_EARNED = [1];

const DUMMY_CHALLENGES = [
  { 
    title: 'Weekly Math Sprint', 
    description: 'Quick-fire algebra questions. Test your speed and accuracy against the clock!', 
    scheduled_date: new Date(Date.now() + 86400000).toISOString(), 
    status: 'upcoming', 
    duration_minutes: 20, 
    total_questions: 15 
  }
];

const RECENT_CHALLENGES = [
  { challenge: 'Science Trivia', date: '2 days ago', score: 92.5, rank: 12 },
  { challenge: 'General Knowledge', date: '5 days ago', score: 88.0, rank: 45 }
];

/**
 * Countdown Timer Component
 */
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

  const timeBlocks = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hrs' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ];

  return (
    <div className="flex items-center gap-2">
      {timeBlocks.map(({ value, label }, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="bg-white rounded-xl p-2 text-center min-w-[52px] shadow-sm border border-blue-100">
            <div className="text-xl font-black text-blue-700">{String(value).padStart(2, '0')}</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">{label}</div>
          </div>
          {i < 3 && <span className="text-blue-400 font-bold text-lg">:</span>}
        </div>
      ))}
    </div>
  );
}

/**
 * Main Dashboard Page
 */
export default function App() {
  const [profile, setProfile] = useState(DUMMY_PROFILE);
  const [isLoading, setIsLoading] = useState(false);

  // Challenge and Badge logic
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* HEADER SECTION */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <p className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-widest">Student Portal</p>
            <div className="flex items-baseline gap-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Welcome, {profile.full_name}
              </h1>
              <span className="text-3xl animate-bounce">👋</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm font-semibold text-slate-500">
                {profile.school_name}
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <Badge className="bg-white text-blue-600 border-blue-100 shadow-sm">
                Grade {profile.grade}
              </Badge>
            </div>
          </div>
          
          {upcomingChallenge && (
            <div className="flex items-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black shadow-xl shadow-blue-200 px-8 py-4 rounded-2xl h-auto group">
                <Zap className="w-5 h-5 mr-2 fill-current group-hover:scale-110 transition-transform" />
                Join Active Challenge
              </Button>
            </div>
          )}
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Target, label: 'Total Score', value: profile.total_score.toFixed(2), sub: 'Overall performance', color: 'bg-blue-600 text-white' },
            { icon: Trophy, label: 'National Rank', value: `#${profile.national_rank}`, sub: 'Top 2% nationwide', color: 'bg-white border border-slate-200' },
            { icon: MapPin, label: 'District Rank', value: `#${profile.district_rank}`, sub: profile.district, color: 'bg-white border border-slate-200' },
            { icon: Flame, label: 'Streak', value: `${profile.streak} Weeks`, sub: 'Consistency is key!', color: 'bg-orange-500 text-white' },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className={`${color} rounded-[2.5rem] p-6 transition-all hover:-translate-y-1 hover:shadow-xl duration-300 shadow-sm`}>
              <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black mb-0.5">{value}</div>
              <div className="text-[10px] font-black uppercase tracking-wider opacity-80">{label}</div>
              <div className="text-[10px] opacity-60 mt-1 font-bold">{sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* CHALLENGE BANNER */}
          <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
            <div className="absolute top-[-20px] right-[-20px] p-8 opacity-10 rotate-12">
              <Trophy size={200} />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Live Soon</span>
              </div>
              <h2 className="text-3xl font-black mb-3">{upcomingChallenge?.title}</h2>
              <p className="text-slate-400 text-base mb-8 max-w-lg leading-relaxed">{upcomingChallenge?.description}</p>
              
              <div className="mb-10">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Starts In</p>
                <CountdownTimer targetDate={upcomingChallenge?.scheduled_date} />
              </div>
              
              <div className="flex flex-wrap gap-6 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2.5 text-sm font-bold text-slate-300">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  {upcomingChallenge?.duration_minutes} Minutes
                </div>
                <div className="flex items-center gap-2.5 text-sm font-bold text-slate-300">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Target className="w-4 h-4 text-blue-400" />
                  </div>
                  {upcomingChallenge?.total_questions} Questions
                </div>
              </div>
            </div>
          </div>

          {/* STREAK CARD */}
          <div className="bg-white rounded-[3rem] border border-slate-200 p-10 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="font-black text-slate-900 mb-8 flex items-center gap-3 text-lg">
                <Flame className="w-6 h-6 text-orange-500" />
                Momentum
              </h3>
              <div className="text-center mb-10">
                <div className="text-7xl font-black text-slate-900 leading-none tracking-tighter">{profile.streak}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">Current Week Streak</div>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full mb-6 overflow-hidden p-1 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${streakPct}%` }} 
                />
              </div>
            </div>
            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
              <p className="text-[10px] text-orange-700 text-center font-black uppercase tracking-wider leading-relaxed">
                Unlock 'Flame Lord' in {10 - profile.streak} weeks
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BADGES */}
          <div className="bg-white rounded-[3rem] border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="font-black text-slate-900 flex items-center gap-2 text-lg">
                <Award className="w-6 h-6 text-amber-500" />
                Achievement Gallery
              </h3>
              <Badge className="bg-amber-50 text-amber-700 border-amber-100 py-1">
                {earnedBadges.length} Won
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="aspect-square rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center p-3 group hover:bg-amber-50 hover:border-amber-200 transition-all cursor-default">
                  <span className="text-3xl mb-2 transition-transform group-hover:scale-125 duration-300">
                    {badgeIconMap[badge.icon] || '🏅'}
                  </span>
                  <span className="text-[9px] font-black text-slate-600 text-center uppercase leading-tight group-hover:text-amber-700">
                    {badge.name}
                  </span>
                </div>
              ))}
              {lockedBadges.map((badge) => (
                <div key={badge.id} className="aspect-square rounded-3xl bg-slate-50/50 border border-dashed border-slate-200 flex items-center justify-center grayscale opacity-30">
                  <span className="text-2xl">🔒</span>
                </div>
              ))}
              {[1, 2].map((i) => (
                <div key={i} className="aspect-square rounded-3xl border border-dashed border-slate-100 flex items-center justify-center opacity-20">
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                </div>
              ))}
            </div>
          </div>

          {/* HISTORY */}
          <div className="bg-white rounded-[3rem] border border-slate-200 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="font-black text-slate-900 flex items-center gap-2 text-lg">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                Recent Results
              </h3>
              <Button className="text-blue-600 text-[10px] uppercase font-black tracking-widest hover:bg-blue-50 px-3 py-1.5">
                View All <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {RECENT_CHALLENGES.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {i === 0 ? '🧬' : '🌍'}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-black text-slate-900">{item.challenge}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-blue-600">{item.score}%</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Rank #{item.rank}</div>
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