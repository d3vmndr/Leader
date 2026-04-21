import Link from 'next/link';
import { Trophy, Zap, Brain, Users, MapPin, Star, Clock, TrendingUp, ChevronRight, Target, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DUMMY_LEADERBOARD, DUMMY_DISTRICT_STATS } from '@/lib/dummy-data';

function HeroSection() {
  return (
    <section className="gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-amber-300 blur-3xl" />
        <div className="absolute top-40 right-1/3 w-24 h-24 rounded-full bg-sky-300 blur-2xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-amber-300" />
            <span className="text-white text-sm font-medium">Grade 8 &amp; 9 | Nepal-wide Competition</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
            No Right Answers.
            <br />
            <span className="text-amber-300">Only Smart Thinking.</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-3 max-w-2xl mx-auto leading-relaxed">
            Nepal&apos;s first student opinion intelligence platform. Compete with 12,000+ students across 77 districts using emotional IQ and social reasoning.
          </p>
          <p className="text-sm text-blue-200 mb-8 font-medium">
            Challenges every Monday &amp; Friday. Results in real-time. Rankings across Nepal.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-base px-8 shadow-xl shadow-amber-900/30 w-full sm:w-auto">
                <Zap className="w-5 h-5 mr-2" />
                Join This Week&apos;s Challenge
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm font-semibold w-full sm:w-auto">
                <Trophy className="w-5 h-5 mr-2" />
                See Leaderboard
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[
              { value: '12,400+', label: 'Students' },
              { value: '77', label: 'Districts' },
              { value: '180+', label: 'Challenges' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-xs text-blue-200 font-medium uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { step: '01', icon: Users, title: 'Register & Join', description: 'Sign up with your grade, school, and district. Join the Nepal-wide community of smart thinkers.', color: 'from-blue-500 to-blue-700' },
    { step: '02', icon: Brain, title: 'Answer Scenarios', description: 'Face 20 real-life scenarios every Monday and Friday. No wrong answers — only your unique thinking.', color: 'from-emerald-500 to-teal-600' },
    { step: '03', icon: Trophy, title: 'Earn Points & Rank', description: 'Your score = how popular your choices were. Popular thinking = more points. Rank nationally!', color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 mb-3">How It Works</Badge>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Think Smart. Predict Wisely.</h2>
          <p className="text-slate-500 max-w-xl mx-auto">The scoring is based on collective wisdom. The more aligned your thinking with your peers, the higher your score.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.step} className="relative group hover-lift">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 h-full">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-5xl font-black text-slate-100 absolute top-6 right-6">{step.step}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100 max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Scoring Formula</h4>
              <p className="text-sm text-slate-600">
                If 38 out of 100 students chose Option B, then Option B earns <strong>0.38 points</strong>. Select wisely — the crowd&apos;s thinking decides your score. Your final score = sum of all question points.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScheduleSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-slate-900 to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30 mb-3">Challenge Schedule</Badge>
          <h2 className="text-3xl font-black text-white">Two Chances Every Week</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {[
            { day: 'Monday', time: '10:00 AM', label: 'Monday Minds Challenge', desc: 'Emotional intelligence & social reasoning', color: 'border-blue-400', badge: 'bg-blue-500' },
            { day: 'Friday', time: '4:00 PM', label: 'Friday Fire Challenge', desc: 'Leadership, ethics & creative thinking', color: 'border-amber-400', badge: 'bg-amber-500' },
          ].map((item) => (
            <div key={item.day} className={`bg-white/5 backdrop-blur-sm border ${item.color} rounded-2xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`${item.badge} text-white text-xs font-bold px-3 py-1 rounded-full`}>{item.day}</div>
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-lg">{item.time}</span>
                </div>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{item.label}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>30 minutes | 20 questions | Results in 48 hours</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeaderboardPreview() {
  const top5 = DUMMY_LEADERBOARD.slice(0, 5);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-2">Live Rankings</Badge>
            <h2 className="text-3xl font-black text-slate-900">National Leaderboard</h2>
            <p className="text-slate-500 text-sm mt-1">Updated after each challenge closes</p>
          </div>
          <Link href="/leaderboard">
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              Full Leaderboard <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {top5.map((entry, i) => (
            <div
              key={entry.id}
              className={`flex items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors
                ${i === 0 ? 'leaderboard-row-1' : i === 1 ? 'leaderboard-row-2' : i === 2 ? 'leaderboard-row-3' : ''}`}
            >
              <div className="w-10 text-center">
                {i < 3 ? (
                  <span className="text-xl">{medals[i]}</span>
                ) : (
                  <span className="text-slate-500 font-bold text-sm">#{entry.national_rank}</span>
                )}
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 font-bold text-sm">{entry.profile?.full_name?.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 text-sm truncate">{entry.profile?.full_name}</div>
                <div className="text-xs text-slate-500 truncate">{entry.profile?.school_name} · {entry.profile?.district}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-700">{entry.total_score.toFixed(2)}</div>
                <div className="text-xs text-slate-400">Grade {entry.profile?.grade}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DistrictPreview() {
  const top5 = DUMMY_DISTRICT_STATS.slice(0, 5);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 mb-2">District Battle</Badge>
            <h2 className="text-3xl font-black text-slate-900">Top Districts This Week</h2>
            <p className="text-slate-500 text-sm mt-1">Representing the pride of every district across Nepal</p>
          </div>
          <Link href="/districts">
            <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
              All Districts <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {top5.map((district, i) => (
            <div key={district.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 hover-lift text-center">
              <div className="text-2xl mb-2">{i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</div>
              <div className="font-bold text-slate-900 text-sm">{district.district_name}</div>
              <div className="text-xs text-slate-500 mb-3">{district.province.replace(' Province', '')}</div>
              <div className="bg-blue-50 rounded-xl py-2 px-3">
                <div className="text-blue-700 font-bold text-sm">{district.average_score.toFixed(2)}</div>
                <div className="text-xs text-slate-500">avg score</div>
              </div>
              <div className="mt-2 text-xs text-slate-400">{district.active_students} active</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RewardsSection() {
  const rewards = [
    { icon: '🏅', title: 'Daily Winner', desc: 'Certificate of recognition + digital badge', color: 'bg-blue-50 border-blue-200' },
    { icon: '🎖️', title: 'Weekly Champion', desc: 'Trophy + Rs. 2,000 scholarship credit', color: 'bg-emerald-50 border-emerald-200' },
    { icon: '🏆', title: 'Monthly Grand Champion', desc: 'Laptop + Rs. 15,000 scholarship', color: 'bg-amber-50 border-amber-200' },
    { icon: '👑', title: 'Annual Nepal Champion', desc: 'Full scholarship + National recognition', color: 'bg-red-50 border-red-200' },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge className="bg-red-50 text-red-700 border-red-200 mb-3">Rewards</Badge>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Win Real Prizes. Earn Real Recognition.</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Top thinkers earn more than scores. Scholarships, laptops, and national fame await.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {rewards.map((reward) => (
            <div key={reward.title} className={`rounded-2xl border p-6 ${reward.color} hover-lift`}>
              <div className="text-4xl mb-4">{reward.icon}</div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{reward.title}</h3>
              <p className="text-sm text-slate-600">{reward.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/rewards">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              View All Rewards <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const reasons = [
    { icon: Brain, title: 'Build Emotional IQ', desc: 'Questions designed by educators to develop real social intelligence', color: 'text-blue-600 bg-blue-50' },
    { icon: Globe, title: 'Represent Nepal', desc: 'Compete with students from all 77 districts. Your district needs you.', color: 'text-emerald-600 bg-emerald-50' },
    { icon: TrendingUp, title: 'Track Your Growth', desc: 'See your thinking evolve week by week with detailed analytics', color: 'text-amber-600 bg-amber-50' },
    { icon: Shield, title: 'Fair & Transparent', desc: 'No trick questions. No biased answers. Pure collective reasoning.', color: 'text-slate-600 bg-slate-100' },
    { icon: Star, title: 'Earn Recognition', desc: 'Badges, certificates, and national rank that matter for your future', color: 'text-orange-600 bg-orange-50' },
    { icon: Users, title: 'Join 12K+ Students', desc: "Be part of Nepal's largest student intelligence community", color: 'text-sky-600 bg-sky-50' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge className="bg-sky-50 text-sky-700 border-sky-200 mb-3">Why Students Love It</Badge>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">More Than Just a Quiz</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
              <div className={`w-11 h-11 rounded-xl ${r.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <r.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{r.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-20 gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-10 left-20 w-40 h-40 rounded-full bg-amber-300 blur-3xl" />
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-sky-300 blur-3xl" />
      </div>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Ready to Think Smarter?</h2>
        <p className="text-blue-100 text-lg mb-8">
          Join 12,400+ Grade 8 &amp; 9 students already competing across Nepal. Your district needs a champion.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register">
            <Button size="lg" className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-base px-10 w-full sm:w-auto">
              Register Now — It&apos;s Free
            </Button>
          </Link>
          <Link href="/challenge">
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-white/5 w-full sm:w-auto">
              Preview a Challenge
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <ScheduleSection />
      <LeaderboardPreview />
      <DistrictPreview />
      <RewardsSection />
      <WhySection />
      <CtaSection />
    </>
  );
}
