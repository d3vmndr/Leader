'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
  Target,
} from 'lucide-react';

/* ---------------- UI COMPONENTS ---------------- */
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-bold transition-all active:scale-95 disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Badge = ({ children, className = "" }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${className}`}>
    {children}
  </span>
);

/* ---------------- TIMER ---------------- */
function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;

    function calc() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
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
    <div className="flex gap-2">
      {Object.entries(timeLeft).map(([key, value]) => (
        <div key={key} className="bg-white p-2 rounded-lg text-center min-w-[50px]">
          <div className="font-bold text-blue-700">{String(value).padStart(2, '0')}</div>
          <div className="text-[9px] uppercase">{key}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- PAGE ---------------- */
export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-slate-500">Loading dashboard...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-red-500">Profile not found</div>
      </div>
    );
  }

  const streakPct = Math.min((profile.streak || 0) * 10, 100);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm text-slate-500">Welcome back,</p>
          <h1 className="text-3xl font-black">
            {profile.full_name || profile.username || 'User'} 👋
          </h1>
          <p className="text-sm text-slate-500">
            {profile.school_name || 'No School'} • {profile.district || 'No District'}
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Stat icon={Target} label="Score" value={profile.total_score || 0} />
          <Stat icon={Trophy} label="National Rank" value={`#${profile.national_rank || '-'}`} />
          <Stat icon={MapPin} label="District" value={profile.district || '-'} />
          <Stat icon={Flame} label="Streak" value={`${profile.streak || 0}`} />
        </div>

        {/* STREAK */}
        <div className="bg-white p-6 rounded-2xl border mb-8">
          <h3 className="font-bold mb-4">Consistency</h3>
          <div className="text-4xl font-black mb-2">{profile.streak || 0}</div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${streakPct}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <Button className="bg-blue-600 text-white px-6 py-3">
          <Zap className="w-4 h-4 mr-2" />
          Join Next Challenge
        </Button>

      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENT ---------------- */
function Stat({ icon: Icon, label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl border">
      <Icon className="w-5 h-5 mb-2 text-blue-600" />
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}