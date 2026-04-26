'use client';

import { useState, useEffect } from 'react';
import { Users, FileText, ChartBar as BarChart3, Trophy, Plus, CreditCard as Edit, Trash2, Eye, Download, Calendar, CircleCheck as CheckCircle2, Clock, CircleAlert as AlertCircle, Search, ChevronDown, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DUMMY_LEADERBOARD } from '@/lib/dummy-data';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

const ADMIN_TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'challenges', label: 'Challenges', icon: Calendar },
  { id: 'questions', label: 'Questions', icon: FileText },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'submissions', label: 'Submissions', icon: CheckCircle2 },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
];

const MOCK_USERS = DUMMY_LEADERBOARD.map((e, i) => ({
  ...e.profile!,
  challenges_participated: 10 + i,
  joined: `${15 - i} days ago`,
  status: i % 5 === 0 ? 'flagged' : 'active',
}));

function OverviewTab() {
  const stats = [
    { icon: Users, label: 'Total Students', value: '12,438', change: '+124 this week', color: 'from-blue-500 to-blue-700' },
    { icon: FileText, label: 'Total Challenges', value: '182', change: '2 active now', color: 'from-emerald-500 to-teal-600' },
    { icon: CheckCircle2, label: 'Total Submissions', value: '89,245', change: '+4,231 this week', color: 'from-amber-400 to-orange-500' },
    { icon: Trophy, label: 'Districts Active', value: '67/77', change: '87% participation', color: 'from-red-500 to-rose-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, change, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white`}>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-xs font-medium opacity-80 mb-0.5">{label}</div>
            <div className="text-xs opacity-60">{change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { action: 'Challenge Published', detail: 'Monday Minds – Week 18', time: '2h ago', type: 'success' },
              { action: 'Results Calculated', detail: 'Friday Fire – Week 17', time: '4h ago', type: 'info' },
              { action: 'New Users Registered', detail: '47 students joined today', time: '6h ago', type: 'info' },
              { action: 'Flag Raised', detail: 'Possible duplicate submission detected', time: '1d ago', type: 'warning' },
              { action: 'Leaderboard Updated', detail: 'National rankings refreshed', time: '2d ago', type: 'success' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <div className={cn(
                  'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                  item.type === 'success' ? 'bg-emerald-500' :
                  item.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                )} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900">{item.action}</div>
                  <div className="text-xs text-slate-500 truncate">{item.detail}</div>
                </div>
                <div className="text-xs text-slate-400 flex-shrink-0">{item.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Create New Challenge', desc: 'Schedule Monday or Friday challenge', icon: Plus, color: 'bg-blue-600 hover:bg-blue-700 text-white' },
              { label: 'Calculate Leaderboard', desc: 'Run scoring algorithm for closed challenges', icon: Trophy, color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
              { label: 'Publish Results', desc: 'Make challenge results public', icon: Eye, color: 'bg-amber-500 hover:bg-amber-600 text-white' },
              { label: 'Export User Report', desc: 'Download CSV of all users and scores', icon: Download, color: 'bg-slate-700 hover:bg-slate-800 text-white' },
            ].map(({ label, desc, icon: Icon, color }) => (
              <button key={label} className={cn('w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all', color)}>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-xs opacity-75">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChallengesTab() {
 const [showForm, setShowForm] = useState(false);
const [challenges, setChallenges] = useState<any[]>([]);

const [title, setTitle] = useState('');
const [dayType, setDayType] = useState('monday');
const [scheduledDate, setScheduledDate] = useState('');
const [duration, setDuration] = useState(30);
const [description, setDescription] = useState('');

  useEffect(() => {
    loadChallenges();
  }, []);

  async function createChallenge() {
  const { error } = await supabase.from('challenges').insert([
    {
      title,
      description,
      day_type: dayType,
      scheduled_date: scheduledDate,
      duration_minutes: duration,
      status: 'upcoming'
    }
  ]);

  if (!error) {
    loadChallenges();
    setShowForm(false);
    setTitle('');
    setDescription('');
    setScheduledDate('');
    setDuration(30);
    setDayType('monday');
  }
}
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('scheduled_date', { ascending: false });

    if (!error) setChallenges(data || []);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900 text-lg">Manage Challenges</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Challenge
        </Button>
      </div>

      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Create New Challenge</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-700 font-medium text-sm">Challenge Title</Label>
             <Input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder="e.g. Monday Minds – Week 18"
  className="mt-1.5 h-10 rounded-xl border-slate-200 bg-white"
/>
            </div>
            <div>
              <Label className="text-slate-700 font-medium text-sm">Day Type</Label>
              <div className="relative mt-1.5">
               <select
  value={dayType}
  onChange={(e) => setDayType(e.target.value)}
  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 appearance-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
>
                  <option value="monday">Monday Challenge</option>
                  <option value="friday">Friday Challenge</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <Label className="text-slate-700 font-medium text-sm">Scheduled Date & Time</Label>
             <Input
  type="datetime-local"
  value={scheduledDate}
  onChange={(e) => setScheduledDate(e.target.value)}
  className="mt-1.5 h-10 rounded-xl border-slate-200 bg-white"
/>
            </div>
            <div>
              <Label className="text-slate-700 font-medium text-sm">Duration (minutes)</Label>
             <Input
  type="number"
  value={duration}
  onChange={(e) => setDuration(Number(e.target.value))}
  className="mt-1.5 h-10 rounded-xl border-slate-200 bg-white"
/>
            </div>
            <div className="md:col-span-2">
              <Label className="text-slate-700 font-medium text-sm">Description</Label>
            <textarea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  rows={2}
  placeholder="Brief description of this challenge..."
/>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button
  onClick={createChallenge}
  className="bg-blue-600 hover:bg-blue-700 text-white"
>
  Create Challenge
</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className={cn(
                'w-2 h-10 rounded-full flex-shrink-0',
                challenge.status === 'active' ? 'bg-emerald-500' :
                challenge.status === 'upcoming' ? 'bg-blue-500' :
                challenge.status === 'results_published' ? 'bg-amber-500' : 'bg-slate-300'
              )} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 text-sm">{challenge.title}</div>
                <div className="text-xs text-slate-500">{challenge.description}</div>
              </div>
              <Badge className={cn('text-xs flex-shrink-0',
                challenge.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                challenge.status === 'upcoming' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                challenge.status === 'results_published' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                'bg-slate-100 text-slate-600'
              )}>
                {challenge.status.replace('_', ' ')}
              </Badge>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_USERS.filter((u) =>
    !search || u.full_name.toLowerCase().includes(search.toLowerCase()) || u.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900 text-lg">Users Management</h2>
        <Button variant="outline" className="border-slate-200 text-slate-600">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search users by name or district..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-xl border-slate-200"
        />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Student', 'Grade', 'District', 'Score', 'Rank', 'Challenges', 'Status'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                      {user.full_name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{user.full_name}</div>
                      <div className="text-xs text-slate-400">@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="text-sm text-slate-700">Grade {user.grade}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-slate-700">{user.district}</span></td>
                <td className="px-4 py-3"><span className="text-sm font-bold text-blue-700">{user.total_score.toFixed(2)}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-slate-700">#{user.national_rank}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-slate-700">{user.challenges_participated}</span></td>
                <td className="px-4 py-3">
                  <Badge className={cn('text-xs', user.status === 'flagged' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200')}>
                    {user.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeaderboardAdminTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900 text-lg">Leaderboard Management</h2>
        <div className="flex gap-2">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Calculate Scores
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
            <Eye className="w-4 h-4 mr-2" />
            Publish Results
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-slate-900 mb-1">Scoring Engine Ready</h4>
          <p className="text-sm text-slate-600">Friday Fire – Week 17 has been closed. Run the scoring algorithm to compute final scores for all 4,238 participants based on option selection percentages.</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[
              { label: 'Participants', value: '4,238' },
              { label: 'Questions', value: '20' },
              { label: 'Options Logged', value: '84,760' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl p-3 text-center">
                <div className="font-black text-blue-700 text-lg">{value}</div>
                <div className="text-xs text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-900 mb-4">Scoring Formula Preview</h3>
        <div className="bg-slate-50 rounded-xl p-4 font-mono text-sm text-slate-700 space-y-2">
          <div className="text-slate-400">{'// Scoring Algorithm'}</div>
          <div>{'for each question q in challenge:'}</div>
          <div className="pl-4">{'total_respondents = sum(selections for all options in q)'}</div>
          <div className="pl-4">{'for each option o in q:'}</div>
          <div className="pl-8">{'o.score = o.selection_count / total_respondents'}</div>
          <div>{'for each user u:'}</div>
          <div className="pl-4">{'u.total_score = sum(selected_option.score for each question)'}</div>
          <div>{'rank users by total_score DESC'}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Current Leaderboard Preview</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {DUMMY_LEADERBOARD.slice(0, 5).map((entry, i) => (
            <div key={entry.id} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50">
              <div className="w-8 text-center text-sm font-bold text-slate-500">#{i + 1}</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900 text-sm">{entry.profile?.full_name}</div>
                <div className="text-xs text-slate-400">{entry.profile?.district} · Grade {entry.profile?.grade}</div>
              </div>
              <div className="font-bold text-blue-700">{entry.total_score.toFixed(4)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'challenges': return <ChallengesTab />;
      case 'users': return <UsersTab />;
      case 'leaderboard': return <LeaderboardAdminTab />;
      default: return (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-500">Coming Soon</h3>
          <p className="text-slate-400 text-sm">This section is under construction.</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">SmartLeague Admin</div>
              <div className="text-xs text-slate-400">Nepal Operations Panel</div>
            </div>
          </div>
          <Badge className="bg-emerald-900 text-emerald-300 border-emerald-700 text-xs">Super Admin</Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {ADMIN_TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all border-b border-slate-100 last:border-0',
                    activeTab === id
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-l-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
