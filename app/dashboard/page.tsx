'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy, Zap, Flame, Clock, TrendingUp, Award, Star,
  MapPin, Calendar, ChevronRight, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import {
  DUMMY_PROFILE,
  DUMMY_BADGES,
  USER_BADGES_EARNED,
  RECENT_CHALLENGES,
  DUMMY_CHALLENGES
} from '@/lib/dummy-data';

/* ---------------- TIMER ---------------- */
function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }

      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-2">
      {['days', 'hours', 'minutes', 'seconds'].map((k, i) => (
        <div key={k} className="flex items-center gap-2">
          <div className="bg-white rounded-xl p-2 text-center min-w-[52px] shadow-sm border">
            <div className="text-xl font-black text-blue-700">
              {String((timeLeft as any)[k]).padStart(2, '0')}
            </div>
            <div className="text-[9px] text-slate-500 uppercase">
              {k}
            </div>
          </div>
          {i < 3 && <span className="text-blue-400 font-bold text-lg">:</span>}
        </div>
      ))}
    </div>
  );
}

/* ---------------- MAIN ---------------- */
export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      // 1. get logged user
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) return;

      // 2. get profile from DB
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        console.log('PROFILE ERROR:', error);
        return;
      }

      setProfile(data);
    }

    loadProfile();
  }, []);

  // ⛔ important guard
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading dashboard...
      </div>
    );
  }

  const upcomingChallenge = DUMMY_CHALLENGES.find(c => c.status === 'upcoming');
  const earnedBadges = DUMMY_BADGES.filter(b => USER_BADGES_EARNED.includes(b.id));
  const lockedBadges = DUMMY_BADGES.filter(b => !USER_BADGES_EARNED.includes(b.id));

  const streakPct = Math.min((profile.streak / 10) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm text-slate-500">Welcome back,</p>
          <h1 className="text-3xl font-black">
            {profile.full_name} 👋
          </h1>
          <p className="text-sm text-slate-500">
            {profile.school_name}
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Stat icon={Target} label="Score" value={profile.total_score} />
          <Stat icon={Trophy} label="National Rank" value={`#${profile.national_rank}`} />
          <Stat icon={MapPin} label="District Rank" value={`#${profile.district_rank}`} />
          <Stat icon={Flame} label="Streak" value={`${profile.streak} weeks`} />
        </div>

        {/* CHALLENGE */}
        {upcomingChallenge && (
          <div className="bg-blue-900 text-white rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-2">
              {upcomingChallenge.title}
            </h2>
            <CountdownTimer targetDate={upcomingChallenge.scheduled_date} />
          </div>
        )}

        {/* BADGES */}
        <div className="bg-white rounded-2xl p-6 mb-8">
          <h3 className="font-bold mb-4">Badges</h3>
          <div className="grid grid-cols-3 gap-3">
            {earnedBadges.map(b => (
              <div key={b.id} className="p-3 bg-amber-50 rounded-xl text-center">
                {b.name}
              </div>
            ))}
            {lockedBadges.map(b => (
              <div key={b.id} className="p-3 bg-slate-100 rounded-xl text-center opacity-50">
                {b.name}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENT ---------------- */
function Stat({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border">
      <Icon className="w-5 h-5 mb-2 text-blue-600" />
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}