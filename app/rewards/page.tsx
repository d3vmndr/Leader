'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gift, Trophy, Zap, CircleCheck as CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/db';
import type { Badge as BadgeRecord, RewardTier, StreakMilestone } from '@/lib/types';

const TIER_THEMES: Record<RewardTier['theme'], { bgLight: string; textColor: string }> = {
  blue: { bgLight: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
  emerald: { bgLight: 'bg-emerald-50 border-emerald-200', textColor: 'text-emerald-700' },
  amber: { bgLight: 'bg-amber-50 border-amber-200', textColor: 'text-amber-700' },
  red: { bgLight: 'bg-red-50 border-red-200', textColor: 'text-red-700' },
};

const STREAK_THEMES: Record<StreakMilestone['theme'], string> = {
  blue: 'border-blue-300 bg-blue-50',
  orange: 'border-orange-300 bg-orange-50',
  sky: 'border-sky-300 bg-sky-50',
  amber: 'border-amber-400 bg-amber-50',
};

const RARITY_COLORS: Record<BadgeRecord['rarity'], string> = {
  Common: 'bg-slate-100 text-slate-600',
  Rare: 'bg-blue-100 text-blue-700',
  Epic: 'bg-emerald-100 text-emerald-700',
  Legendary: 'bg-amber-100 text-amber-700',
};

interface RewardsData {
  tiers: RewardTier[];
  streaks: StreakMilestone[];
  badges: BadgeRecord[];
}

export default function RewardsPage() {
  const [data, setData] = useState<RewardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRewards() {
      try {
        const [tiers, streaks, badges] = await Promise.all([
          db.getRewardTiers(),
          db.getStreakMilestones(),
          db.getBadges(),
        ]);
        setData({ tiers, streaks, badges });
      } catch (err) {
        console.error('Failed to load rewards:', err);
        setError('We could not load the rewards right now. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    }
    loadRewards();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="gradient-hero py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 mb-4">
            <Gift className="w-4 h-4 text-amber-300" />
            <span className="text-white text-sm font-semibold">Win Real Prizes. Earn Real Recognition.</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Rewards & Prizes</h1>
          <p className="text-blue-200 max-w-xl mx-auto text-sm md:text-base">Every challenge is a chance to win something real. From badges to laptops to national fame — smart thinking pays off.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {!loading && data && (
          <>
            {data.tiers.length > 0 && (
              <div className="mb-10">
                <div className="text-center mb-8">
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200 mb-3">Prize Tiers</Badge>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">From Every Participant to Nepal Champion</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.tiers.map((tier) => (
                    <div key={tier.id} className={`rounded-2xl border p-6 ${TIER_THEMES[tier.theme].bgLight} hover-lift`}>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="text-4xl flex-shrink-0">{tier.icon}</div>
                        <div>
                          <h3 className={`text-xl font-black ${TIER_THEMES[tier.theme].textColor} mb-1`}>{tier.title}</h3>
                          <Badge className="bg-white border-slate-200 text-slate-600 text-xs">{tier.requirement}</Badge>
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        {tier.reward_items.map((item) => (
                          <div key={item.id} className="flex items-start gap-2.5 bg-white rounded-xl p-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                              <div className="text-xs text-slate-500">{item.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.streaks.length > 0 && (
              <div className="mb-10">
                <div className="text-center mb-8">
                  <Badge className="bg-orange-50 text-orange-700 border-orange-200 mb-3">Streak Rewards</Badge>
                  <h2 className="text-2xl font-black text-slate-900">Keep Your Streak Alive</h2>
                  <p className="text-slate-500 text-sm mt-2">Consecutive participation earns special streak badges</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {data.streaks.map((streak) => (
                    <div key={streak.id} className={`rounded-2xl border p-5 text-center ${STREAK_THEMES[streak.theme]} hover-lift`}>
                      <div className="text-4xl mb-3">{streak.icon}</div>
                      <div className="font-bold text-slate-900 text-sm mb-1">{streak.name}</div>
                      <div className="text-xs text-slate-500 mb-2">{streak.description}</div>
                      <div className="text-2xl font-black text-slate-700">{streak.weeks}</div>
                      <div className="text-xs text-slate-500">weeks</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.badges.length > 0 && (
              <div className="mb-10">
                <div className="text-center mb-8">
                  <Badge className="bg-sky-50 text-sky-700 border-sky-200 mb-3">Badge System</Badge>
                  <h2 className="text-2xl font-black text-slate-900">Collect All Badges</h2>
                  <p className="text-slate-500 text-sm mt-2">Unlock special badges by achieving milestones on the platform</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {data.badges.map((badge) => (
                    <div key={badge.id} className="bg-white rounded-2xl border border-slate-200 p-5 text-center hover-lift">
                      <div className="text-3xl mb-3">{badge.icon}</div>
                      <div className="font-bold text-slate-900 text-sm mb-1">{badge.name}</div>
                      <div className="text-xs text-slate-500 mb-3 leading-relaxed">{badge.description}</div>
                      <Badge className={`text-xs ${RARITY_COLORS[badge.rarity]}`}>{badge.rarity}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-8 text-white text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl font-black mb-2">Ready to Win?</h2>
          <p className="text-blue-200 mb-6 max-w-md mx-auto text-sm">Every challenge brings you closer to prizes, recognition, and becoming Nepal&apos;s next thinking champion.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-8">
                <Zap className="w-4 h-4 mr-2" />
                Join Free Now
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-white/5">
                <Trophy className="w-4 h-4 mr-2" />
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
