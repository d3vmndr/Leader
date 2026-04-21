import Link from 'next/link';
import { Gift, Trophy, Star, Award, Crown, Zap, CircleCheck as CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const REWARD_TIERS = [
  {
    tier: 'Daily Participation',
    icon: '🏅',
    color: 'from-blue-500 to-blue-700',
    bgLight: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-700',
    rewards: [
      { label: 'Participation Certificate', desc: 'Digital PDF certificate for every challenge completed' },
      { label: 'Participation Badge', desc: 'Collectible digital badge added to your profile' },
      { label: 'Score History Entry', desc: 'Permanent record in your SmartLeague portfolio' },
    ],
    requirement: 'Complete any challenge',
  },
  {
    tier: 'Weekly Champion',
    icon: '🎖️',
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50 border-emerald-200',
    textColor: 'text-emerald-700',
    rewards: [
      { label: 'Winner Certificate', desc: 'Official SmartLeague Weekly Winner certificate' },
      { label: 'Rs. 2,000 Scholarship Credit', desc: 'Credited toward SmartLeague learning resources' },
      { label: 'Silver Thinker Badge', desc: 'Exclusive silver badge for weekly winners' },
      { label: 'District Trophy Points', desc: '+100 bonus points added to district total' },
    ],
    requirement: 'Top 1 nationally in any weekly challenge',
  },
  {
    tier: 'Monthly Grand Champion',
    icon: '🏆',
    color: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50 border-amber-200',
    textColor: 'text-amber-700',
    rewards: [
      { label: 'Laptop (15" Notebook)', desc: 'Brand new laptop for top monthly scorer' },
      { label: 'Rs. 15,000 Scholarship', desc: 'Cash scholarship for educational purposes' },
      { label: 'Gold Champion Medal', desc: 'Physical engraved medal shipped to your home' },
      { label: 'Feature Story', desc: 'Profile featured on SmartLeague website & social media' },
      { label: 'Gold Crown Badge', desc: 'Ultra-rare gold crown badge on your profile' },
    ],
    requirement: 'Highest total score in a calendar month',
  },
  {
    tier: 'Annual Nepal Champion',
    icon: '👑',
    color: 'from-red-500 to-rose-600',
    bgLight: 'bg-red-50 border-red-200',
    textColor: 'text-red-700',
    rewards: [
      { label: 'Full Academic Scholarship', desc: 'Rs. 1,00,000 scholarship for higher studies' },
      { label: 'National Recognition Award', desc: 'Award ceremony in Kathmandu' },
      { label: 'Laptop + Tablet Bundle', desc: 'Premium tech bundle for academic excellence' },
      { label: 'National Champion Badge', desc: 'Permanent elite badge — only 1 per year' },
      { label: 'Nepal Media Coverage', desc: 'Feature in national newspapers and media' },
    ],
    requirement: 'Highest cumulative score for the academic year',
  },
];

const STREAK_BADGES = [
  { weeks: 3, icon: '⚡', name: 'Streak Starter', desc: 'Complete 3 consecutive challenges', color: 'border-blue-300 bg-blue-50' },
  { weeks: 5, icon: '🔥', name: 'Fire Streak', desc: 'Complete 5 consecutive challenges', color: 'border-orange-300 bg-orange-50' },
  { weeks: 10, icon: '💎', name: 'Diamond Thinker', desc: 'Complete 10 consecutive challenges', color: 'border-sky-300 bg-sky-50' },
  { weeks: 20, icon: '🌟', name: 'Legend Status', desc: 'Complete 20 consecutive challenges', color: 'border-amber-400 bg-amber-50' },
];

const BADGES_SYSTEM = [
  { icon: '🧠', name: 'Social Thinker', desc: 'Score above 0.80 average per question', rarity: 'Common' },
  { icon: '🎯', name: 'Sharpshooter', desc: 'Win district rank #1 once', rarity: 'Rare' },
  { icon: '🏆', name: 'Weekly Champion', desc: 'Win a weekly challenge nationally', rarity: 'Epic' },
  { icon: '⭐', name: 'Rising Star', desc: 'Enter top 100 nationally', rarity: 'Rare' },
  { icon: '📍', name: 'District Hero', desc: "Lead your district's points tally", rarity: 'Rare' },
  { icon: '👑', name: 'Monthly Champion', desc: 'Win monthly leaderboard once', rarity: 'Legendary' },
  { icon: '🛡️', name: 'Fair Player', desc: 'Complete 10 challenges with no flags', rarity: 'Common' },
  { icon: '💡', name: 'Curious Mind', desc: 'Answer all curiosity questions first', rarity: 'Rare' },
];

const RARITY_COLORS: Record<string, string> = {
  Common: 'bg-slate-100 text-slate-600',
  Rare: 'bg-blue-100 text-blue-700',
  Epic: 'bg-emerald-100 text-emerald-700',
  Legendary: 'bg-amber-100 text-amber-700',
};

export default function RewardsPage() {
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
        <div className="mb-10">
          <div className="text-center mb-8">
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 mb-3">Prize Tiers</Badge>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">From Every Participant to Nepal Champion</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REWARD_TIERS.map((tier) => (
              <div key={tier.tier} className={`rounded-2xl border p-6 ${tier.bgLight} hover-lift`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl flex-shrink-0">{tier.icon}</div>
                  <div>
                    <h3 className={`text-xl font-black ${tier.textColor} mb-1`}>{tier.tier}</h3>
                    <Badge className="bg-white border-slate-200 text-slate-600 text-xs">{tier.requirement}</Badge>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {tier.rewards.map((r) => (
                    <div key={r.label} className="flex items-start gap-2.5 bg-white rounded-xl p-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{r.label}</div>
                        <div className="text-xs text-slate-500">{r.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <div className="text-center mb-8">
            <Badge className="bg-orange-50 text-orange-700 border-orange-200 mb-3">Streak Rewards</Badge>
            <h2 className="text-2xl font-black text-slate-900">Keep Your Streak Alive</h2>
            <p className="text-slate-500 text-sm mt-2">Consecutive participation earns special streak badges</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STREAK_BADGES.map((badge) => (
              <div key={badge.name} className={`rounded-2xl border p-5 text-center ${badge.color} hover-lift`}>
                <div className="text-4xl mb-3">{badge.icon}</div>
                <div className="font-bold text-slate-900 text-sm mb-1">{badge.name}</div>
                <div className="text-xs text-slate-500 mb-2">{badge.desc}</div>
                <div className="text-2xl font-black text-slate-700">{badge.weeks}</div>
                <div className="text-xs text-slate-500">weeks</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <div className="text-center mb-8">
            <Badge className="bg-sky-50 text-sky-700 border-sky-200 mb-3">Badge System</Badge>
            <h2 className="text-2xl font-black text-slate-900">Collect All Badges</h2>
            <p className="text-slate-500 text-sm mt-2">Unlock special badges by achieving milestones on the platform</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {BADGES_SYSTEM.map((badge) => (
              <div key={badge.name} className="bg-white rounded-2xl border border-slate-200 p-5 text-center hover-lift">
                <div className="text-3xl mb-3">{badge.icon}</div>
                <div className="font-bold text-slate-900 text-sm mb-1">{badge.name}</div>
                <div className="text-xs text-slate-500 mb-3 leading-relaxed">{badge.desc}</div>
                <Badge className={cn('text-xs', RARITY_COLORS[badge.rarity])}>{badge.rarity}</Badge>
              </div>
            ))}
          </div>
        </div>

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

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
