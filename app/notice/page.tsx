'use client';

import { useState } from 'react';
import { Bell, Calendar, User, Search, Pin, Archive, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const NOTICES = [
  {
    id: 1,
    title: 'Challenge 15 Results Are Live',
    description: 'Results for Monday\'s emotional intelligence challenge are now available. Check your ranking and detailed performance breakdown.',
    type: 'announcement',
    date: '2024-04-20',
    isPinned: true,
    read: true,
  },
  {
    id: 2,
    title: 'Maintenance Window This Saturday',
    description: 'SmartLeague will undergo scheduled maintenance on Saturday, April 22 from 2 AM to 4 AM UTC. During this time, the platform will be unavailable.',
    type: 'alert',
    date: '2024-04-19',
    isPinned: true,
    read: true,
  },
  {
    id: 3,
    title: 'New Badge Unlocked: Strategic Thinker',
    description: 'Congratulations! You\'ve unlocked the Strategic Thinker badge for completing 5 challenges with perfect strategy execution.',
    type: 'success',
    date: '2024-04-18',
    isPinned: false,
    read: true,
  },
  {
    id: 4,
    title: 'District Championship Registration Open',
    description: 'Registration for the Nepal District Championship is now open! Compete with top students from your district for prizes and scholarships.',
    type: 'announcement',
    date: '2024-04-17',
    isPinned: false,
    read: false,
  },
  {
    id: 5,
    title: 'New Feature: Challenge Replays',
    description: 'You can now review and replay previous challenges to improve your strategy. Access this from your Results page.',
    type: 'info',
    date: '2024-04-16',
    isPinned: false,
    read: false,
  },
  {
    id: 6,
    title: 'Leaderboard Update - April Rankings',
    description: 'The April monthly rankings have been finalized. See who made it to the top 10 and claim your prize eligibility.',
    type: 'announcement',
    date: '2024-04-15',
    isPinned: false,
    read: true,
  },
];

type NoticeType = 'all' | 'announcement' | 'alert' | 'success' | 'info';

export default function NoticePage() {
  const [activeFilter, setActiveFilter] = useState<NoticeType>('all');
  const [search, setSearch] = useState('');

  const typeColors: Record<string, { bg: string; text: string; icon: string }> = {
    announcement: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '📢' },
    alert: { bg: 'bg-red-50', text: 'text-red-700', icon: '⚠️' },
    success: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '✨' },
    info: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'ℹ️' },
  };

  const typeIcons: Record<string, typeof Bell> = {
    announcement: Bell,
    alert: AlertCircle,
    success: CheckCircle,
    info: Info,
  };

  const filtered = NOTICES.filter((notice) => {
    const matchesType = activeFilter === 'all' || notice.type === activeFilter;
    const matchesSearch = !search || notice.title.toLowerCase().includes(search.toLowerCase()) ||
                          notice.description.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const pinnedNotices = filtered.filter((n) => n.isPinned);
  const regularNotices = filtered.filter((n) => !n.isPinned);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="gradient-hero py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">Notices</h1>
          </div>
          <p className="text-blue-100 mt-2">Stay updated with important announcements and platform updates</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                placeholder="Search notices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 border-slate-200 rounded-xl focus:border-blue-500 pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {[
                { id: 'all' as NoticeType, label: 'All' },
                { id: 'announcement' as NoticeType, label: 'Announcements' },
                { id: 'alert' as NoticeType, label: 'Alerts' },
                { id: 'success' as NoticeType, label: 'Success' },
                { id: 'info' as NoticeType, label: 'Info' },
              ].map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(filter.id)}
                  className={activeFilter === filter.id ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {pinnedNotices.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 px-4">
                  <Pin className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Pinned</span>
                </div>
                <div className="space-y-3 mb-6">
                  {pinnedNotices.map((notice) => {
                    const colors = typeColors[notice.type];
                    const IconComponent = typeIcons[notice.type];
                    return (
                      <div
                        key={notice.id}
                        className={`${colors.bg} border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer group`}
                      >
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 text-2xl mt-0.5">{colors.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <h3 className={`font-bold ${colors.text} text-sm md:text-base`}>{notice.title}</h3>
                              {notice.isPinned && <Pin className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                            </div>
                            <p className="text-slate-600 text-sm mb-2">{notice.description}</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs text-slate-500">{formatDate(notice.date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {regularNotices.length > 0 ? (
              <div className="space-y-3">
                {regularNotices.map((notice) => {
                  const colors = typeColors[notice.type];
                  return (
                    <div
                      key={notice.id}
                      className={`${colors.bg} border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer ${!notice.read ? 'ring-2 ring-blue-400' : ''}`}
                    >
                      <div className="flex gap-3 items-start">
                        <span className="text-lg flex-shrink-0 mt-0.5">{colors.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold ${colors.text} text-sm mb-0.5`}>{notice.title}</h3>
                          <p className="text-slate-600 text-xs md:text-sm line-clamp-2">{notice.description}</p>
                          <span className="text-xs text-slate-500 mt-1.5 block">{formatDate(notice.date)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📭</div>
                <h3 className="font-bold text-slate-900 mb-1">No notices found</h3>
                <p className="text-slate-500 text-sm">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Stay notified</h3>
              <p className="text-sm text-slate-600 mb-3">Enable push notifications to get real-time updates about challenges, results, and important announcements.</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm">
                Enable Notifications
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
