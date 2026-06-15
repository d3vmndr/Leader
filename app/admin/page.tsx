'use client';

import { useState, useEffect } from 'react';
import {
  Users, FileText, ChartBar as BarChart3, Trophy, Plus,
  Edit, Trash2, Eye, Download, Calendar,
  CircleCheck as CheckCircle2, Clock, CircleAlert as AlertCircle,
  Search, ChevronDown, Settings, Zap, Loader2, BookOpen, Bell, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ADMIN_TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'challenges', label: 'Challenges', icon: Calendar },
  { id: 'questions', label: 'Questions CRUD', icon: FileText },
  { id: 'blogs', label: 'Blogs CRUD', icon: BookOpen },
  { id: 'notices', label: 'Notices CRUD', icon: Bell },
  { id: 'users', label: 'Users List', icon: Users },
  { id: 'submissions', label: 'Submissions', icon: CheckCircle2 },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
];

// ---------- Overview Tab (real data + quick actions) ----------
function OverviewTab({ setActiveTab, triggerRecheck }: { setActiveTab: (tab: string) => void; triggerRecheck: () => void }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalChallenges: 0,
    totalSubmissions: 0,
    districtsActive: 0,
    recentActivities: [] as any[],
  });
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  async function fetchStats() {
    try {
      setLoading(true);
      const profiles = await db.getProfiles();
      const challenges = await db.getChallenges();

      // Get submissions (results)
      let submissionsCount = 0;
      if (typeof window !== 'undefined') {
        const results = JSON.parse(localStorage.getItem('sl_challenge_results') || '[]');
        submissionsCount = results.length;
      }
      try {
        const { count } = await supabase.from('challenge_results').select('*', { count: 'exact', head: true });
        if (count !== null && count !== undefined) submissionsCount = count;
      } catch (e) { }

      const uniqueDistricts = new Set(profiles.map(p => p.district).filter(Boolean));
      const districtsActive = uniqueDistricts.size;

      const activities = (challenges || []).slice(0, 5).map(ch => ({
        action: ch.status === 'active' ? 'Challenge Active' : 'Challenge Created',
        detail: ch.title,
        time: new Date(ch.scheduled_date).toLocaleDateString(),
        type: ch.status === 'active' ? 'success' : 'info'
      }));

      setStats({
        totalStudents: profiles.length,
        totalChallenges: challenges.length,
        totalSubmissions: submissionsCount,
        districtsActive,
        recentActivities: activities,
      });
    } catch (err) {
      console.error('Failed to load overview stats:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCalculateScores = async () => {
    setCalculating(true);
    try {
      const res = await db.calculateScores();
      toast.success(res.message || 'Leaderboard scores calculated successfully!');
      fetchStats();
      triggerRecheck();
    } catch (e: any) {
      toast.error('Failed to calculate scores: ' + (e.message || e));
    } finally {
      setCalculating(false);
    }
  };

  const handlePublishResults = async () => {
    try {
      const challenges = await db.getChallenges();
      const closed = challenges.filter(c => c.status === 'closed');
      if (closed.length === 0) {
        toast.info('No closed challenges found to publish results for.');
        return;
      }
      for (const ch of closed) {
        await db.updateChallenge(ch.id, { status: 'results_published' });
      }
      toast.success(`Published results for ${closed.length} challenges!`);
      fetchStats();
    } catch (e: any) {
      toast.error('Failed to publish results: ' + (e.message || e));
    }
  };

  const handleExportCSV = async () => {
    try {
      const profiles = await db.getProfiles();
      if (!profiles.length) {
        toast.error('No users found to export.');
        return;
      }
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID,Full Name,Username,School Name,District,Province,Total Score,National Rank\n";
      profiles.forEach(p => {
        csvContent += `"${p.id}","${p.full_name || ''}","${p.username || ''}","${p.school_name || ''}","${p.district || ''}","${p.province || ''}",${p.total_score || 0},${p.national_rank || ''}\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `smartleague_users_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Users report CSV exported successfully!');
    } catch (e) {
      toast.error('Export failed');
    }
  };

  const statCards = [
    { icon: Users, label: 'Total Students', value: stats.totalStudents.toLocaleString(), change: 'Registered students', color: 'from-blue-600 to-indigo-700' },
    { icon: FileText, label: 'Total Challenges', value: stats.totalChallenges.toLocaleString(), change: 'Challenges created', color: 'from-emerald-500 to-teal-600' },
    { icon: CheckCircle2, label: 'Total Submissions', value: stats.totalSubmissions.toLocaleString(), change: 'Total attempts recorded', color: 'from-amber-400 to-orange-500' },
    { icon: Trophy, label: 'Districts Active', value: `${stats.districtsActive}/77`, change: 'Participating districts', color: 'from-red-500 to-rose-600' },
  ];

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, change, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-md hover:scale-[1.01] transition-transform`}>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-xs font-medium opacity-95 mb-0.5">{label}</div>
            <div className="text-xs opacity-75">{change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
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
                    item.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
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

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            Quick Actions (CPanel Engine)
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => setActiveTab('challenges')}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Create New Challenge</div>
                <div className="text-xs opacity-75">Schedule a Monday or Friday competition quiz</div>
              </div>
            </button>

            <button
              disabled={calculating}
              onClick={handleCalculateScores}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                {calculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-sm font-semibold">Calculate Leaderboard Scores</div>
                <div className="text-xs opacity-75">Execute collective intelligence formula on closed challenge answers</div>
              </div>
            </button>

            <button
              onClick={handlePublishResults}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Publish Results</div>
                <div className="text-xs opacity-75">Update status of closed challenges to publish scores to users</div>
              </div>
            </button>

            <button
              onClick={handleExportCSV}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left bg-slate-700 hover:bg-slate-800 text-white transition-all shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Export User Report</div>
                <div className="text-xs opacity-75">Download formatted CSV containing all student details and scores</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Challenges Tab (CRUD with Edit & Status updates) ----------
function ChallengesTab() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editChallenge, setEditChallenge] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    day_type: 'monday',
    scheduled_date: '',
    duration_minutes: 30,
    total_questions: 10,
    status: 'upcoming'
  });

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const data = await db.getChallenges();
      setChallenges(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load challenges');
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
      await db.createChallenge(formData);
      toast.success('Challenge scheduled successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        day_type: 'monday',
        scheduled_date: '',
        duration_minutes: 30,
        total_questions: 10,
        status: 'upcoming'
      });
      fetchChallenges();
    } catch (err) {
      toast.error('Failed to create challenge');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editChallenge) return;
    try {
      await db.updateChallenge(editChallenge.id, editChallenge);
      toast.success('Challenge updated!');
      setEditChallenge(null);
      fetchChallenges();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await db.updateChallenge(id, { status });
      toast.success(`Challenge status changed to: ${status}`);
      fetchChallenges();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete challenge? Cascade effects will clear associated user responses.')) return;
    try {
      await db.deleteChallenge(id);
      toast.success('Challenge deleted successfully');
      fetchChallenges();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900 text-lg">Manage Challenge Calendar</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditChallenge(null); }} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Challenge
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 space-y-4">
          <h3 className="font-black text-slate-900 text-base">Schedule New Weekly Challenge</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Challenge Title</Label>
              <Input
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Friday Fire – Week 18"
                className="mt-1 bg-white h-10"
              />
            </div>
            <div>
              <Label>Day Type</Label>
              <select
                value={formData.day_type}
                onChange={e => setFormData({ ...formData, day_type: e.target.value })}
                className="w-full h-10 mt-1 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="monday">Monday Minds</option>
                <option value="friday">Friday Fire</option>
              </select>
            </div>
            <div>
              <Label>Scheduled Start Date & Time</Label>
              <Input
                required
                type="datetime-local"
                value={formData.scheduled_date}
                onChange={e => setFormData({ ...formData, scheduled_date: e.target.value })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div>
              <Label>Duration (Minutes)</Label>
              <Input
                required
                type="number"
                value={formData.duration_minutes}
                onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div>
              <Label>Total Questions</Label>
              <Input
                required
                type="number"
                value={formData.total_questions}
                onChange={e => setFormData({ ...formData, total_questions: parseInt(e.target.value) })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Challenge Description</Label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full mt-1 border rounded-xl p-3 bg-white text-sm"
                rows={2}
                placeholder="Explain the topic/focus of this competition challenge..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">Schedule Now</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
          </div>
        </form>
      )}

      {editChallenge && (
        <form onSubmit={handleUpdate} className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-black text-slate-900 text-base">Modify Scheduled Challenge</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Challenge Title</Label>
              <Input
                required
                value={editChallenge.title}
                onChange={e => setEditChallenge({ ...editChallenge, title: e.target.value })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div>
              <Label>Status Control</Label>
              <select
                value={editChallenge.status}
                onChange={e => setEditChallenge({ ...editChallenge, status: e.target.value })}
                className="w-full h-10 mt-1 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active (Live Quiz)</option>
                <option value="closed">Closed (Calculations Pending)</option>
                <option value="results_published">Results Published</option>
              </select>
            </div>
            <div>
              <Label>Scheduled Date</Label>
              <Input
                required
                type="datetime-local"
                value={editChallenge.scheduled_date ? editChallenge.scheduled_date.slice(0, 16) : ''}
                onChange={e => setEditChallenge({ ...editChallenge, scheduled_date: e.target.value })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div>
              <Label>Duration (Minutes)</Label>
              <Input
                required
                type="number"
                value={editChallenge.duration_minutes}
                onChange={e => setEditChallenge({ ...editChallenge, duration_minutes: parseInt(e.target.value) })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div>
              <Label>Total Questions</Label>
              <Input
                required
                type="number"
                value={editChallenge.total_questions}
                onChange={e => setEditChallenge({ ...editChallenge, total_questions: parseInt(e.target.value) })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <textarea
                value={editChallenge.description}
                onChange={e => setEditChallenge({ ...editChallenge, description: e.target.value })}
                className="w-full mt-1 border rounded-xl p-3 bg-white text-sm"
                rows={2}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl">Save Changes</Button>
            <Button type="button" variant="outline" onClick={() => setEditChallenge(null)} className="rounded-xl">Cancel</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {challenges.map(ch => (
            <div key={ch.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-2 h-10 rounded-full flex-shrink-0 mt-0.5',
                  ch.status === 'active' ? 'bg-emerald-500' :
                    ch.status === 'upcoming' ? 'bg-blue-500' :
                      ch.status === 'results_published' ? 'bg-amber-400' : 'bg-slate-300'
                )} />
                <div>
                  <div className="font-bold text-slate-900 text-sm">{ch.title}</div>
                  <p className="text-xs text-slate-500 line-clamp-1">{ch.description}</p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {new Date(ch.scheduled_date).toLocaleString()} · {ch.duration_minutes}m · {ch.total_questions} Qs
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Easy Status Toggle Select Box */}
                <select
                  value={ch.status}
                  onChange={e => handleStatusChange(ch.id, e.target.value)}
                  className="h-8 text-xs rounded-lg border border-slate-200 bg-white px-2"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active (Live)</option>
                  <option value="closed">Closed</option>
                  <option value="results_published">Published</option>
                </select>

                <Badge className={cn('text-[10px] uppercase font-bold py-0.5',
                  ch.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    ch.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      ch.status === 'results_published' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-slate-100 text-slate-600'
                )}>
                  {ch.status}
                </Badge>

                <div className="flex gap-1.5">
                  <Button onClick={() => { setEditChallenge(ch); setShowForm(false); }} variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-amber-600">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => handleDelete(ch.id)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Questions & Options CRUD ----------
function QuestionsTab() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editQuestion, setEditQuestion] = useState<any | null>(null);

  // New Question Form State
  const [newQText, setNewQText] = useState('');
  const [newQType, setNewQType] = useState('opinion');
  const [newQOrder, setNewQOrder] = useState(1);
  const [newOptions, setNewOptions] = useState([
    { label: 'A', text: '', score: 0.5 },
    { label: 'B', text: '', score: 0.3 },
    { label: 'C', text: '', score: 0.1 },
    { label: 'D', text: '', score: 0.1 },
  ]);

  const loadChallenges = async () => {
    try {
      const data = await db.getChallenges();
      setChallenges(data);
      if (data.length && !selectedChallengeId) {
        setSelectedChallengeId(data[0].id);
      }
    } catch (e) { }
  };

  const loadQuestions = async () => {
    if (!selectedChallengeId) return;
    setLoading(true);
    try {
      const data = await db.getQuestions(selectedChallengeId);
      setQuestions(data);
    } catch (e) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadChallenges(); }, []);
  useEffect(() => { loadQuestions(); }, [selectedChallengeId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallengeId) return;
    try {
      const mappedOpts = newOptions.map(opt => ({
        option_label: opt.label as any,
        option_text: opt.text,
        score: Number(opt.score)
      }));
      await db.createQuestion({
        challenge_id: selectedChallengeId,
        question_text: newQText,
        question_type: newQType,
        order_index: newQOrder
      }, mappedOpts);
      toast.success('Question added to challenge bank!');
      setShowForm(false);
      setNewQText('');
      setNewQOrder(prev => prev + 1);
      setNewOptions([
        { label: 'A', text: '', score: 0.5 },
        { label: 'B', text: '', score: 0.3 },
        { label: 'C', text: '', score: 0.1 },
        { label: 'D', text: '', score: 0.1 },
      ]);
      loadQuestions();
    } catch (err) {
      toast.error('Failed to create question');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editQuestion) return;
    try {
      await db.updateQuestion(editQuestion.id, {
        question_text: editQuestion.question_text,
        question_type: editQuestion.question_type,
        order_index: editQuestion.order_index
      }, editQuestion.options);
      toast.success('Question updated!');
      setEditQuestion(null);
      loadQuestions();
    } catch (err) {
      toast.error('Failed to update question');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question and its options?')) return;
    try {
      await db.deleteQuestion(id);
      toast.success('Question removed');
      loadQuestions();
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-slate-900 text-lg">Question Bank Builder</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-slate-500 font-semibold uppercase">Challenge:</span>
            <select
              value={selectedChallengeId}
              onChange={e => setSelectedChallengeId(e.target.value)}
              className="h-8 text-xs rounded-lg border border-slate-200 bg-white px-2 font-medium"
            >
              {challenges.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>
        <Button
          disabled={!selectedChallengeId}
          onClick={() => { setShowForm(!showForm); setEditQuestion(null); }}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-slate-900">Add Question details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label>Question Scenario Text</Label>
              <Input
                required
                value={newQText}
                onChange={e => setNewQText(e.target.value)}
                placeholder="What scenario does the student face?"
                className="mt-1 bg-white h-10"
              />
            </div>
            <div>
              <Label>Category / Type</Label>
              <select
                value={newQType}
                onChange={e => setNewQType(e.target.value)}
                className="w-full h-10 mt-1 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="emotional_intelligence">Emotional Intelligence</option>
                <option value="social_reasoning">Social Reasoning</option>
                <option value="analytical">Analytical</option>
                <option value="ethical">Ethical</option>
                <option value="leadership">Leadership</option>
                <option value="creative">Creative</option>
                <option value="opinion">Opinion</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-200 pt-3">
            <Label className="text-slate-800 font-bold block mb-1">Set 4 Options (Text and Score weight)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {newOptions.map((opt, i) => (
                <div key={opt.label} className="flex gap-2 items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center">{opt.label}</div>
                  <Input
                    required
                    placeholder={`Option ${opt.label} Text`}
                    value={opt.text}
                    onChange={e => {
                      const copy = [...newOptions];
                      copy[i].text = e.target.value;
                      setNewOptions(copy);
                    }}
                    className="flex-1 h-9"
                  />
                  <Input
                    required
                    type="number"
                    step="0.01"
                    placeholder="Score"
                    value={opt.score}
                    onChange={e => {
                      const copy = [...newOptions];
                      copy[i].score = parseFloat(e.target.value) || 0;
                      setNewOptions(copy);
                    }}
                    className="w-20 h-9"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">Save Question</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
          </div>
        </form>
      )}

      {editQuestion && (
        <form onSubmit={handleUpdate} className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-slate-900">Edit Question & Weights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label>Question Scenario Text</Label>
              <Input
                required
                value={editQuestion.question_text}
                onChange={e => setEditQuestion({ ...editQuestion, question_text: e.target.value })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div>
              <Label>Category</Label>
              <select
                value={editQuestion.question_type}
                onChange={e => setEditQuestion({ ...editQuestion, question_type: e.target.value })}
                className="w-full h-10 mt-1 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="emotional_intelligence">Emotional Intelligence</option>
                <option value="social_reasoning">Social Reasoning</option>
                <option value="analytical">Analytical</option>
                <option value="ethical">Ethical</option>
                <option value="leadership">Leadership</option>
                <option value="creative">Creative</option>
                <option value="opinion">Opinion</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-200 pt-3">
            <Label className="text-slate-800 font-bold block mb-1">Set Options & Score Weighting</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(editQuestion.options || []).map((opt: any, i: number) => (
                <div key={opt.id} className="flex gap-2 items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center">{opt.option_label}</div>
                  <Input
                    required
                    value={opt.option_text}
                    onChange={e => {
                      const copy = { ...editQuestion };
                      copy.options[i].option_text = e.target.value;
                      setEditQuestion(copy);
                    }}
                    className="flex-1 h-9"
                  />
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={opt.score}
                    onChange={e => {
                      const copy = { ...editQuestion };
                      copy.options[i].score = parseFloat(e.target.value) || 0;
                      setEditQuestion(copy);
                    }}
                    className="w-20 h-9"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl">Save Changes</Button>
            <Button type="button" variant="outline" onClick={() => setEditQuestion(null)} className="rounded-xl">Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-relaxed">{q.question_text}</h4>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 inline-block mt-1">
                      {q.question_type?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button onClick={() => { setEditQuestion(q); setShowForm(false); }} variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-amber-600">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => handleDelete(q.id)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {(q.options || []).map((o: any) => (
                  <div key={o.id} className="bg-white rounded-lg p-2.5 border border-slate-200 flex flex-col justify-between">
                    <div className="flex gap-1.5 items-start">
                      <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{o.option_label}</span>
                      <p className="text-[11px] text-slate-600 leading-tight">{o.option_text}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2 border-t border-slate-100 pt-1.5">
                      <span className="text-[9px] text-slate-400">Weight: <strong>{o.score}</strong></span>
                      <span className="text-[9px] text-slate-400">Chosen: <strong>{o.selection_count || 0}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {questions.length === 0 && (
            <div className="text-center text-slate-400 py-12">No questions defined for this challenge. Click Add Question above.</div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Blogs CRUD Tab ----------
function BlogsTab() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBlog, setEditBlog] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'SmartLeague Team',
    category: 'Strategy',
    image_url: 'https://images.pexels.com/photos/3808517/pexels-photo-3808517.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: false
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await db.getBlogs();
      setBlogs(data);
    } catch (e) {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.createBlog(formData);
      toast.success('Blog article created!');
      setShowForm(false);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        author: 'SmartLeague Team',
        category: 'Strategy',
        image_url: 'https://images.pexels.com/photos/3808517/pexels-photo-3808517.jpeg?auto=compress&cs=tinysrgb&w=600',
        featured: false
      });
      fetchBlogs();
    } catch (e) {
      toast.error('Creation failed');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBlog) return;
    try {
      await db.updateBlog(editBlog.id, editBlog);
      toast.success('Blog article updated!');
      setEditBlog(null);
      fetchBlogs();
    } catch (e) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await db.deleteBlog(id);
      toast.success('Blog post deleted');
      fetchBlogs();
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900 text-lg">Blogs & Learning Articles</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditBlog(null); }} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Create Blog Post
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-slate-900">Create New Article</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Article Title</Label>
              <Input
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div>
              <Label>Category</Label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-10 mt-1 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="Strategy">Strategy</option>
                <option value="Psychology">Psychology</option>
                <option value="Tips & Tricks">Tips & Tricks</option>
                <option value="Analysis">Analysis</option>
              </select>
            </div>
            <div>
              <Label>Author Name</Label>
              <Input
                required
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div>
              <Label>Cover Image URL</Label>
              <Input
                value={formData.image_url}
                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Brief Excerpt (Short description for card previews)</Label>
              <Input
                required
                value={formData.excerpt}
                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Full Content</Label>
              <textarea
                required
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                className="w-full mt-1 border rounded-xl p-3 bg-white text-sm"
                rows={5}
                placeholder="Write the full educational post content here..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 h-4.5 w-4.5"
              />
              <Label htmlFor="featured">Featured Article (highlighted at top)</Label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">Publish Blog</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
          </div>
        </form>
      )}

      {editBlog && (
        <form onSubmit={handleUpdate} className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-slate-900">Edit Blog Article</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Article Title</Label>
              <Input
                required
                value={editBlog.title}
                onChange={e => setEditBlog({ ...editBlog, title: e.target.value })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div>
              <Label>Category</Label>
              <select
                value={editBlog.category}
                onChange={e => setEditBlog({ ...editBlog, category: e.target.value })}
                className="w-full h-10 mt-1 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="Strategy">Strategy</option>
                <option value="Psychology">Psychology</option>
                <option value="Tips & Tricks">Tips & Tricks</option>
                <option value="Analysis">Analysis</option>
              </select>
            </div>
            <div>
              <Label>Author</Label>
              <Input
                required
                value={editBlog.author}
                onChange={e => setEditBlog({ ...editBlog, author: e.target.value })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div>
              <Label>Cover Image URL</Label>
              <Input
                value={editBlog.image_url || editBlog.image || ''}
                onChange={e => setEditBlog({ ...editBlog, image_url: e.target.value })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Brief Excerpt</Label>
              <Input
                required
                value={editBlog.excerpt}
                onChange={e => setEditBlog({ ...editBlog, excerpt: e.target.value })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Full Content</Label>
              <textarea
                required
                value={editBlog.content || editBlog.excerpt}
                onChange={e => setEditBlog({ ...editBlog, content: e.target.value })}
                className="w-full mt-1 border rounded-xl p-3 bg-white text-sm"
                rows={5}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit_featured"
                checked={editBlog.featured}
                onChange={e => setEditBlog({ ...editBlog, featured: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 h-4.5 w-4.5"
              />
              <Label htmlFor="edit_featured">Featured Article</Label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl">Save Changes</Button>
            <Button type="button" variant="outline" onClick={() => setEditBlog(null)} className="rounded-xl">Cancel</Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.map(blog => (
          <div key={blog.id} className="bg-white border rounded-2xl p-5 shadow-sm flex gap-4">
            <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
              <img src={blog.image_url || blog.image} alt={blog.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="text-[9px] py-0">{blog.category}</Badge>
                  {blog.featured && <Badge className="text-[9px] bg-amber-100 text-amber-700 py-0">Featured</Badge>}
                </div>
                <h4 className="font-bold text-slate-900 text-sm truncate">{blog.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{blog.excerpt}</p>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                <span className="text-[10px] text-slate-400">By {blog.author}</span>
                <div className="flex gap-1">
                  <Button onClick={() => { setEditBlog(blog); setShowForm(false); }} variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-amber-600">
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button onClick={() => handleDelete(blog.id)} variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-400">No blog posts found.</div>
        )}
      </div>
    </div>
  );
}

// ---------- Notices CRUD Tab ----------
function NoticesTab() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editNotice, setEditNotice] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'announcement',
    is_pinned: false
  });

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await db.getNotices();
      setNotices(data);
    } catch (e) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.createNotice(formData);
      toast.success('Notice published to feed!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        type: 'announcement',
        is_pinned: false
      });
      fetchNotices();
    } catch (e) {
      toast.error('Failed to create notice');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNotice) return;
    try {
      await db.updateNotice(editNotice.id, {
        title: editNotice.title,
        description: editNotice.description,
        type: editNotice.type,
        is_pinned: editNotice.is_pinned || editNotice.isPinned
      });
      toast.success('Notice updated successfully!');
      setEditNotice(null);
      fetchNotices();
    } catch (e) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      await db.deleteNotice(id);
      toast.success('Notice deleted');
      fetchNotices();
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900 text-lg">Platform Notices feed</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditNotice(null); }} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Publish Notice
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-slate-900">Publish Notice Alert</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Notice Title</Label>
              <Input
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief summary header"
                className="mt-1 bg-white h-10"
              />
            </div>
            <div>
              <Label>Notice Level / Type</Label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full h-10 mt-1 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="announcement">Announcement (Blue)</option>
                <option value="alert">Alert/Warning (Red)</option>
                <option value="success">Success (Green)</option>
                <option value="info">Information (Yellow)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label>Notice Description Body</Label>
              <textarea
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full mt-1 border rounded-xl p-3 bg-white text-sm"
                rows={3}
                placeholder="Details about maintenance windows, challenge results, unlocks, etc."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_pinned"
                checked={formData.is_pinned}
                onChange={e => setFormData({ ...formData, is_pinned: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 h-4.5 w-4.5"
              />
              <Label htmlFor="is_pinned">Pin to top of feed</Label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">Publish</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
          </div>
        </form>
      )}

      {editNotice && (
        <form onSubmit={handleUpdate} className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-slate-900">Edit Notice Alert</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Notice Title</Label>
              <Input
                required
                value={editNotice.title}
                onChange={e => setEditNotice({ ...editNotice, title: e.target.value })}
                className="mt-1 bg-white h-10"
              />
            </div>
            <div>
              <Label>Notice Type</Label>
              <select
                value={editNotice.type}
                onChange={e => setEditNotice({ ...editNotice, type: e.target.value })}
                className="w-full h-10 mt-1 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="announcement">Announcement</option>
                <option value="alert">Alert</option>
                <option value="success">Success</option>
                <option value="info">Info</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <textarea
                required
                value={editNotice.description}
                onChange={e => setEditNotice({ ...editNotice, description: e.target.value })}
                className="w-full mt-1 border rounded-xl p-3 bg-white text-sm"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit_is_pinned"
                checked={editNotice.is_pinned || editNotice.isPinned || false}
                onChange={e => setEditNotice({ ...editNotice, is_pinned: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 h-4.5 w-4.5"
              />
              <Label htmlFor="edit_is_pinned">Pin to top</Label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl">Save Changes</Button>
            <Button type="button" variant="outline" onClick={() => setEditNotice(null)} className="rounded-xl">Cancel</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {notices.map(notice => (
          <div key={notice.id} className="bg-white border rounded-xl p-4 shadow-sm flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <div className="text-xl">
                {notice.type === 'announcement' ? '📢' :
                  notice.type === 'alert' ? '⚠️' :
                    notice.type === 'success' ? '✨' : 'ℹ️'}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  {notice.title}
                  {(notice.is_pinned || notice.isPinned) && <Badge className="text-[8px] bg-amber-50 text-amber-600 border-amber-100">Pinned</Badge>}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{notice.description}</p>
                <span className="text-[9px] text-slate-400 block mt-1">{new Date(notice.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button onClick={() => { setEditNotice(notice); setShowForm(false); }} variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-amber-600">
                <Edit className="w-3.5 h-3.5" />
              </Button>
              <Button onClick={() => handleDelete(notice.id)} variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-red-600">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {notices.length === 0 && (
          <div className="text-center py-12 text-slate-400">No notice alerts found.</div>
        )}
      </div>
    </div>
  );
}

// ---------- Users Tab (real profiles list) ----------
function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await db.getProfiles();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleExportCSV = () => {
    if (!users.length) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Full Name,School Name,District,Total Score,National Rank\n";
    users.forEach(u => {
      csvContent += `"${u.id}","${u.full_name || ''}","${u.school_name || ''}","${u.district || ''}",${u.total_score || 0},${u.national_rank || ''}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "smartleague_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV Exported!');
  };

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
        <h2 className="font-bold text-slate-900 text-lg">User Accounts Database</h2>
        <Button onClick={handleExportCSV} variant="outline" className="border-slate-200 text-slate-600 rounded-xl">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search students by name, school, district..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-xl border-slate-200"
        />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-xs">
                <th className="text-left px-6 py-3 tracking-wider">Student Details</th>
                <th className="text-left px-6 py-3 tracking-wider">School</th>
                <th className="text-left px-6 py-3 tracking-wider">District</th>
                <th className="text-right px-6 py-3 tracking-wider">Total Score</th>
                <th className="text-right px-6 py-3 tracking-wider">National Rank</th>
                <th className="text-right px-6 py-3 tracking-wider">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{user.full_name || 'Anonymous Student'}</div>
                        <div className="text-[10px] text-slate-400">Type: {user.player_type || 'Student'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5"><span className="text-slate-600">{user.school_name || '—'}</span></td>
                  <td className="px-6 py-3.5"><span className="text-slate-600">{user.district || '—'}</span></td>
                  <td className="px-6 py-3.5 text-right font-black text-blue-700">{user.total_score?.toFixed(2) ?? '0.00'}</td>
                  <td className="px-6 py-3.5 text-right font-medium">#{user.national_rank ?? '—'}</td>
                  <td className="px-6 py-3.5 text-right font-semibold text-emerald-600">{user.streak ?? 0} weeks</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">No student users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------- Submissions Tab ----------
function SubmissionsTab() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        setLoading(true);
        // Attempt Supabase fetch
        let data: any[] = [];
        try {
          const { data: res } = await supabase
            .from('challenge_results')
            .select('*, profiles(full_name, district), challenges(title)')
            .order('completed_at', { ascending: false })
            .limit(50);
          if (res) data = res;
        } catch (e) { }

        // Fallback to local storage if empty
        if (data.length === 0 && typeof window !== 'undefined') {
          const list = JSON.parse(localStorage.getItem('sl_challenge_results') || '[]');
          const profiles = JSON.parse(localStorage.getItem('sl_profiles') || '[]');
          const challenges = JSON.parse(localStorage.getItem('sl_challenges') || '[]');

          data = list.map((item: any) => {
            const p = profiles.find((prof: any) => prof.id === item.user_id);
            const c = challenges.find((ch: any) => ch.id === item.challenge_id);
            return {
              id: item.id,
              score: item.score,
              rank: item.rank,
              completed_at: item.completed_at,
              profiles: p ? { full_name: p.full_name, district: p.district } : null,
              challenges: c ? { title: c.title } : null
            };
          });
        }

        setSubmissions(data);
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
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-900">Recent Student Submissions</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {submissions.map((sub) => (
          <div key={sub.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
            <div>
              <div className="font-bold text-slate-900 text-sm">{sub.profiles?.full_name || 'Anonymous Student'}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {sub.profiles?.district || 'Nepal'} · {sub.challenges?.title || 'Smart Challenge'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-blue-700">+{sub.score?.toFixed(2)} pts</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Ranked #{sub.rank} in challenge</div>
            </div>
          </div>
        ))}
        {submissions.length === 0 && (
          <div className="p-8 text-center text-slate-400">No attempts logged yet.</div>
        )}
      </div>
    </div>
  );
}

// ---------- Leaderboard Tab ----------
function LeaderboardAdminTab({ keyVal }: { keyVal: number }) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const data = await db.getProfiles();
        setLeaderboard(data.slice(0, 50) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [keyVal]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-black text-slate-900 text-base">Top 50 Cumulative Leaderboard</h3>
      </div>
      <div className="divide-y divide-slate-50">
        {leaderboard.map((entry, idx) => (
          <div key={entry.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
            <div className="w-8 text-center text-sm font-black text-slate-500">#{idx + 1}</div>
            <div className="flex-1">
              <div className="font-bold text-slate-900 text-sm">{entry.full_name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{entry.district} · {entry.school_name}</div>
            </div>
            <div className="font-black text-blue-700 text-sm">{entry.total_score?.toFixed(4) ?? '0.0000'} pts</div>
          </div>
        ))}
        {leaderboard.length === 0 && (
          <div className="p-8 text-center text-slate-400">No student profiles ranked yet.</div>
        )}
      </div>
    </div>
  );
}

// ---------- Main Admin Page ----------
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [checkLoading, setCheckLoading] = useState(true);
  const [recheckKey, setRecheckKey] = useState(0);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setAuthorized(false);
          setCheckLoading(false);
          return;
        }

        if (user.email === 'd3v.mndr@gmail.com') {
          setAuthorized(true);
          setCheckLoading(false);
          return;
        }

        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();

        setAuthorized(!!data?.is_admin);
      } catch (err) {
        console.error(err);
        setAuthorized(false);
      } finally {
        setCheckLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (checkLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center max-w-md w-full space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center text-4xl text-red-500 mx-auto">🔒</div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Access Restricted</h2>
            <p className="text-slate-500 text-sm mt-2">This administration portal requires Super Admin clearance credentials. Please log in with an authorized account.</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-left space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Super Admin:</span>
            <p className="text-xs text-slate-600">Authorized user email: <strong>d3v.mndr@gmail.com</strong></p>
          </div>
          <Button onClick={() => window.location.href = '/login'} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200">
            Go to Login Portal
          </Button>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab setActiveTab={setActiveTab} triggerRecheck={() => setRecheckKey(prev => prev + 1)} />;
      case 'challenges': return <ChallengesTab />;
      case 'questions': return <QuestionsTab />;
      case 'blogs': return <BlogsTab />;
      case 'notices': return <NoticesTab />;
      case 'users': return <UsersTab />;
      case 'submissions': return <SubmissionsTab />;
      case 'leaderboard': return <LeaderboardAdminTab keyVal={recheckKey} />;
      default: return (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-500">Notice</h3>
          <p className="text-slate-400 text-sm">Control panel module under maintenance.</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">SmartLeague Admin Control Panel</div>
              <div className="text-[10px] text-slate-400">Nepal Operations Management System (CPanel)</div>
            </div>
          </div>
          <Badge className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-bold px-3 py-1">Super Admin Panel</Badge>
        </div>
      </div>

      {/* Control Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Side Tabs */}
          <div className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {ADMIN_TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-left transition-all border-b border-slate-100 last:border-0',
                    activeTab === id
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-l-blue-600'
                      : 'text-slate-500 hover:bg-slate-50'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Panel */}
          <div className="flex-1 min-w-0 w-full">
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  );
}