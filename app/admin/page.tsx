'use client';

import { useState, useEffect } from 'react';
import {
  Users, FileText, ChartBar as BarChart3, Trophy, Plus,
  CreditCard as Edit, Trash2, Eye, Download, Calendar,
  CircleCheck as CheckCircle2, Clock, CircleAlert as AlertCircle,
  Search, ChevronDown, Settings, Zap, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const ADMIN_TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'challenges', label: 'Challenges', icon: Calendar },
  { id: 'questions', label: 'Questions', icon: FileText },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'submissions', label: 'Submissions', icon: CheckCircle2 },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
];

// ---------- Overview Tab (real data) ----------
function OverviewTab() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalChallenges: 0,
    totalSubmissions: 0,
    districtsActive: 0,
    recentActivities: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Total students
        const { count: studentsCount, error: studentsErr } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        if (studentsErr) throw studentsErr;

        // Total challenges
        const { count: challengesCount, error: challengesErr } = await supabase
          .from('challenges')
          .select('*', { count: 'exact', head: true });
        if (challengesErr) throw challengesErr;

        // Total submissions (challenge_results)
        const { count: submissionsCount, error: submissionsErr } = await supabase
          .from('challenge_results')
          .select('*', { count: 'exact', head: true });
        if (submissionsErr) throw submissionsErr;

        // Active districts (unique districts with at least one profile)
        const { data: districtsData, error: districtsErr } = await supabase
          .from('profiles')
          .select('district')
          .not('district', 'is', null);
        if (districtsErr) throw districtsErr;
        const uniqueDistricts = new Set(districtsData.map(p => p.district).filter(Boolean));
        const districtsActive = uniqueDistricts.size;

        // Recent activity: latest 5 challenges or results
        const { data: recentChallenges, error: recentErr } = await supabase
          .from('challenges')
          .select('title, scheduled_date, status')
          .order('created_at', { ascending: false })
          .limit(5);
        if (recentErr) throw recentErr;

        const activities = (recentChallenges || []).map(ch => ({
          action: ch.status === 'active' ? 'Challenge Active' : 'Challenge Created',
          detail: ch.title,
          time: new Date(ch.scheduled_date).toLocaleDateString(),
          type: ch.status === 'active' ? 'success' : 'info'
        }));

        setStats({
          totalStudents: studentsCount || 0,
          totalChallenges: challengesCount || 0,
          totalSubmissions: submissionsCount || 0,
          districtsActive,
          recentActivities: activities,
        });
      } catch (err) {
        console.error('Failed to load overview stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { icon: Users, label: 'Total Students', value: stats.totalStudents.toLocaleString(), change: 'active this month', color: 'from-blue-500 to-blue-700' },
    { icon: FileText, label: 'Total Challenges', value: stats.totalChallenges.toLocaleString(), change: 'created to date', color: 'from-emerald-500 to-teal-600' },
    { icon: CheckCircle2, label: 'Total Submissions', value: stats.totalSubmissions.toLocaleString(), change: 'answers recorded', color: 'from-amber-400 to-orange-500' },
    { icon: Trophy, label: 'Districts Active', value: `${stats.districtsActive}/77`, change: 'participating districts', color: 'from-red-500 to-rose-600' },
  ];

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, change, color }) => (
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
            {stats.recentActivities.length === 0 ? (
              <div className="text-center text-slate-400 py-8">No recent activity</div>
            ) : (
              stats.recentActivities.map((item, i) => (
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
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Create New Challenge', desc: 'Schedule Monday or Friday challenge', icon: Plus, href: '#', color: 'bg-blue-600 hover:bg-blue-700 text-white' },
              { label: 'Calculate Leaderboard', desc: 'Run scoring algorithm for closed challenges', icon: Trophy, href: '#', color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
              { label: 'Publish Results', desc: 'Make challenge results public', icon: Eye, href: '#', color: 'bg-amber-500 hover:bg-amber-600 text-white' },
              { label: 'Export User Report', desc: 'Download CSV of all users and scores', icon: Download, href: '#', color: 'bg-slate-700 hover:bg-slate-800 text-white' },
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

// ---------- Challenges Tab (real CRUD) ----------
function ChallengesTab() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    day_type: 'monday',
    scheduled_date: '',
    duration_minutes: 30,
    total_questions: 10,
  });

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('scheduled_date', { ascending: false });
      if (error) throw error;
      setChallenges(data || []);
    } catch (err) {
      console.error('Failed to fetch challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('challenges').insert({
        ...formData,
        status: 'upcoming',
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        day_type: 'monday',
        scheduled_date: '',
        duration_minutes: 30,
        total_questions: 10,
      });
      fetchChallenges();
    } catch (err) {
      console.error('Create challenge error:', err);
      alert('Failed to create challenge');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this challenge? All associated data will be lost.')) return;
    try {
      const { error } = await supabase.from('challenges').delete().eq('id', id);
      if (error) throw error;
      fetchChallenges();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete challenge');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-500" /></div>;

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
        <form onSubmit={handleCreate} className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Create New Challenge</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-700 font-medium text-sm">Challenge Title</Label>
              <Input
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Monday Minds – Week 18"
                className="mt-1.5 h-10 rounded-xl border-slate-200 bg-white"
              />
            </div>
            <div>
              <Label className="text-slate-700 font-medium text-sm">Day Type</Label>
              <div className="relative mt-1.5">
                <select
                  value={formData.day_type}
                  onChange={e => setFormData({ ...formData, day_type: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 appearance-none text-sm"
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
                required
                type="datetime-local"
                value={formData.scheduled_date}
                onChange={e => setFormData({ ...formData, scheduled_date: e.target.value })}
                className="mt-1.5 h-10 rounded-xl border-slate-200 bg-white"
              />
            </div>
            <div>
              <Label className="text-slate-700 font-medium text-sm">Duration (minutes)</Label>
              <Input
                type="number"
                value={formData.duration_minutes}
                onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                className="mt-1.5 h-10 rounded-xl border-slate-200 bg-white"
              />
            </div>
            <div>
              <Label className="text-slate-700 font-medium text-sm">Total Questions</Label>
              <Input
                type="number"
                value={formData.total_questions}
                onChange={e => setFormData({ ...formData, total_questions: parseInt(e.target.value) })}
                className="mt-1.5 h-10 rounded-xl border-slate-200 bg-white"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-slate-700 font-medium text-sm">Description</Label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm"
                rows={2}
                placeholder="Brief description of this challenge..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Create Challenge</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {challenges.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No challenges found. Create one above.</div>
          ) : (
            challenges.map((challenge) => (
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
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(challenge.scheduled_date).toLocaleDateString()} · {challenge.duration_minutes} min · {challenge.total_questions} questions
                  </div>
                </div>
                <Badge className={cn('text-xs flex-shrink-0',
                  challenge.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                  challenge.status === 'upcoming' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                  challenge.status === 'results_published' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                  'bg-slate-100 text-slate-600'
                )}>
                  {challenge.status?.replace('_', ' ') || 'draft'}
                </Badge>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600"><Edit className="w-4 h-4" /></Button>
                  <Button onClick={() => handleDelete(challenge.id)} variant="ghost" size="sm" className="text-slate-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Users Tab (real profiles) ----------
function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, school_name, district, total_score, national_rank, player_type')
          .order('total_score', { ascending: false });
        if (error) throw error;
        // Fetch participation counts (challenge_results per user) - optional
        const userIds = (data || []).map(u => u.id);
        let participationMap: Record<string, number> = {};
        if (userIds.length) {
          const { data: participation, error: partErr } = await supabase
            .from('challenge_results')
            .select('user_id')
            .in('user_id', userIds);
          if (!partErr && participation) {
            participationMap = participation.reduce((acc, p) => {
              acc[p.user_id] = (acc[p.user_id] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);
          }
        }
        const usersWithParticipation = (data || []).map(u => ({
          ...u,
          challenges_participated: participationMap[u.id] || 0,
        }));
        setUsers(usersWithParticipation);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    !search ||
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.district?.toLowerCase().includes(search.toLowerCase()) ||
    u.school_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-500" /></div>;

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
          placeholder="Search users by name, school or district..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-xl border-slate-200"
        />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">School</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">District</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rank</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Challenges</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400">No users found</td></tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{user.full_name}</div>
                        <div className="text-xs text-slate-400">{user.player_type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-sm text-slate-700">{user.school_name || '—'}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-slate-700">{user.district || '—'}</span></td>
                  <td className="px-4 py-3"><span className="text-sm font-bold text-blue-700">{user.total_score?.toFixed(2) ?? '0.00'}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-slate-700">#{user.national_rank ?? '—'}</span></td>
                  <td className="px-4 py-3"><span className="text-sm text-slate-700">{user.challenges_participated}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Leaderboard Admin Tab (real-time ranking) ----------
function LeaderboardAdminTab() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoringInfo, setScoringInfo] = useState<any>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        // Fetch profiles ordered by total_score DESC, limited to top 100
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, district, school_name, total_score, national_rank')
          .order('total_score', { ascending: false })
          .limit(100);
        if (error) throw error;
        setLeaderboard(data || []);
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    async function fetchLatestClosedChallenge() {
      const { data } = await supabase
        .from('challenges')
        .select('id, title, total_questions')
        .eq('status', 'closed')
        .order('scheduled_date', { ascending: false })
        .limit(1);
      if (data && data[0]) {
        // Get participation count for that challenge
        const { count } = await supabase
          .from('challenge_results')
          .select('*', { count: 'exact', head: true })
          .eq('challenge_id', data[0].id);
        setScoringInfo({
          challengeTitle: data[0].title,
          participants: count || 0,
          questions: data[0].total_questions,
        });
      }
    }
    fetchLeaderboard();
    fetchLatestClosedChallenge();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-500" /></div>;

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

      {scoringInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Scoring Engine Ready</h4>
            <p className="text-sm text-slate-600">
              {scoringInfo.challengeTitle} has been closed. Run the scoring algorithm to compute final scores for all participants.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-3 text-center">
                <div className="font-black text-blue-700 text-lg">{scoringInfo.participants.toLocaleString()}</div>
                <div className="text-xs text-slate-400">Participants</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <div className="font-black text-blue-700 text-lg">{scoringInfo.questions}</div>
                <div className="text-xs text-slate-400">Questions</div>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <div className="font-black text-blue-700 text-lg">—</div>
                <div className="text-xs text-slate-400">Options Logged</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Current Leaderboard Preview</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {leaderboard.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No leaderboard data yet.</div>
          ) : (
            leaderboard.slice(0, 10).map((entry, idx) => (
              <div key={entry.id} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50">
                <div className="w-8 text-center text-sm font-bold text-slate-500">#{idx + 1}</div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm">{entry.full_name}</div>
                  <div className="text-xs text-slate-400">{entry.district} · {entry.school_name}</div>
                </div>
                <div className="font-bold text-blue-700">{entry.total_score?.toFixed(4) ?? '0.0000'}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Placeholder for other tabs ----------
function QuestionsTab() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <h3 className="font-bold text-slate-500">Question Bank</h3>
      <p className="text-slate-400 text-sm">Manage challenge questions and options.</p>
    </div>
  );
}

function SubmissionsTab() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const { data, error } = await supabase
          .from('challenge_results')
          .select('*, profiles(full_name, district), challenges(title)')
          .order('completed_at', { ascending: false })
          .limit(50);
        if (error) throw error;
        setSubmissions(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-900">Recent Submissions</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {submissions.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No submissions yet.</div>
        ) : (
          submissions.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between px-6 py-3">
              <div>
                <div className="font-medium text-slate-900">{sub.profiles?.full_name}</div>
                <div className="text-xs text-slate-400">{sub.profiles?.district} · {sub.challenges?.title}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-blue-700">{sub.score?.toFixed(2)}</div>
                <div className="text-xs text-slate-400">Rank #{sub.rank}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ---------- Main Admin Page ----------
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'challenges': return <ChallengesTab />;
      case 'questions': return <QuestionsTab />;
      case 'users': return <UsersTab />;
      case 'submissions': return <SubmissionsTab />;
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