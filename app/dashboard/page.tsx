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
  DUMMY_PROFILE, DUMMY_BADGES, USER_BADGES_EARNED,
  RECENT_CHALLENGES, DUMMY_CHALLENGES
} from '@/lib/dummy-data';

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
      {['Days', 'Hrs', 'Min', 'Sec'].map((label, i) => {
        const value = Object.values(timeLeft)[i];
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="bg-white rounded-xl p-2 text-center min-w-[52px] shadow-sm border border-blue-100">
              <div className="text-xl font-black text-blue-700">{String(value).padStart(2, '0')}</div>
              <div className="text-[9px] text-slate-500 uppercase">{label}</div>
            </div>
            {i < 3 && <span className="text-blue-400 font-bold text-lg">:</span>}
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(DUMMY_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data: auth } = await supabase.auth.getUser();

      if (!auth?.user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', auth.user.id)
        .single();

      if (data) {
        setProfile({
          ...DUMMY_PROFILE,
          ...data,
        });
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  const upcomingChallenge = DUMMY_CHALLENGES.find((c) => c.status === 'upcoming');
  const earnedBadges = DUMMY_BADGES.filter((b) => USER_BADGES_EARNED.includes(b.id));
  const lockedBadges = DUMMY_BADGES.filter((b) => !USER_BADGES_EARNED.includes(b.id));

  const streakPct = Math.min((profile.streak / 10) * 100, 100);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* HEADER */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Welcome back,</p>

            {/* ✅ FIXED: NO EMAIL */}
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">
              {profile.full_name || 'User'} 👋
            </h1>

            {/* ✅ FIXED: dynamic details */}
            <p className="text-sm text-slate-500">
              {profile.school_name || 'School'} · {profile.player_type || 'Student'}
            </p>
          </div>

          {upcomingChallenge && (
            <Link href="/challenge">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                <Zap className="w-4 h-4 mr-2" />
                Join Next Challenge
              </Button>
            </Link>
          )}
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card title="Total Score" value={profile.total_score?.toFixed(2)} sub="All time points" icon={Target} />
          <Card title="National Rank" value={`#${profile.national_rank}`} sub="National" icon={Trophy} />
          <Card title="District Rank" value={`#${profile.district_rank}`} sub={profile.district} icon={MapPin} />
          <Card title="Streak" value={`${profile.streak} weeks`} sub="Keep going!" icon={Flame} />
        </div>

        {/* CHALLENGE */}
        {upcomingChallenge && (
          <div className="bg-blue-900 text-white p-6 rounded-2xl mb-8">
            <h2 className="font-bold text-lg mb-2">{upcomingChallenge.title}</h2>
            <CountdownTimer targetDate={upcomingChallenge.scheduled_date} />
          </div>
        )}

        {/* BADGES */}
        <div className="bg-white p-6 rounded-2xl mb-8">
          <h3 className="font-bold mb-4">My Badges</h3>
          <div className="grid grid-cols-3 gap-3">
            {earnedBadges.map((b) => (
              <div key={b.id} className="text-center p-3 bg-amber-50 rounded-xl">
                {b.name}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* SIMPLE CARD */
function Card({ title, value, sub, icon: Icon }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border">
      <Icon className="w-5 h-5 mb-2 text-blue-600" />
      <div className="font-bold text-lg">{value}</div>
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-xs text-slate-400">{sub}</div>
    </div>
  );
}