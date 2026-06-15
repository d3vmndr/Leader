'use client';

import { useState, useEffect } from 'react';
import { MapPin, Users, TrendingUp, Trophy, Search, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';

const PROVINCE_COLORS: Record<string, string> = {
  'Bagmati Province': 'bg-blue-100 text-blue-700 border-blue-200',
  'Koshi Province': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Gandaki Province': 'bg-amber-100 text-amber-700 border-amber-200',
  'Lumbini Province': 'bg-orange-100 text-orange-700 border-orange-200',
  'Madhesh Province': 'bg-teal-100 text-teal-700 border-teal-200',
  'Karnali Province': 'bg-sky-100 text-sky-700 border-sky-200',
  'Sudurpashchim Province': 'bg-red-100 text-red-700 border-red-200',
};

const MEDALS = ['🥇', '🥈', '🥉'];

export default function DistrictsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [districtsList, setDistrictsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDistricts() {
      try {
        const data = await db.getDistrictStats();
        setDistrictsList(data || []);
      } catch (err) {
        console.error('Failed to load districts:', err);
        setDistrictsList([]);
      } finally {
        setLoading(false);
      }
    }
    loadDistricts();
  }, []);

  const filtered = districtsList.filter((d) => {
    const matchSearch = !search || d.district_name.toLowerCase().includes(search.toLowerCase()) || d.province.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || d.province === filter;
    return matchSearch && matchFilter;
  });

  const provinces = Array.from(new Set(districtsList.map((d) => d.province)));

  const topDistrict = districtsList[0];
  const totalStudents = districtsList.reduce((sum, d) => sum + (d.total_students || 0), 0);
  const totalActive = districtsList.reduce((sum, d) => sum + (d.active_students || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="gradient-hero py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 mb-4">
              <MapPin className="w-4 h-4 text-amber-300" />
              <span className="text-white text-sm font-semibold">District Intelligence Rankings</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Nepal District Battle</h1>
            <p className="text-blue-200 text-sm md:text-base">Every district competes for the national district trophy. Represent yours with pride.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Trophy, label: 'Top District This Week', value: topDistrict?.district_name || 'N/A', sub: topDistrict ? `${topDistrict.average_score.toFixed(2)} avg score` : 'No data', color: 'from-amber-400 to-orange-500' },
            { icon: Users, label: 'Total Students', value: totalStudents.toLocaleString(), sub: 'Across all districts', color: 'from-blue-500 to-blue-700' },
            { icon: Star, label: 'Active This Week', value: totalActive.toLocaleString(), sub: totalStudents > 0 ? `${Math.round((totalActive / totalStudents) * 100)}% participation` : '0% participation', color: 'from-emerald-500 to-teal-600' },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white`}>
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-black">{value}</div>
              <div className="text-xs font-medium opacity-80 mb-0.5">{label}</div>
              <div className="text-xs opacity-60">{sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {districtsList.slice(0, 3).map((district: any, i: number) => (
            <div key={district.id} className={cn(
              'rounded-2xl p-6 border text-center',
              i === 0 ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300 shadow-lg' :
                i === 1 ? 'bg-gradient-to-br from-slate-50 to-gray-100 border-slate-300' :
                  'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300'
            )}>
              <div className="text-4xl mb-3 rank-float">{MEDALS[i]}</div>
              <h3 className="text-xl font-black text-slate-900 mb-1">{district.district_name}</h3>
              <Badge className={cn('mb-3 text-xs', PROVINCE_COLORS[district.province] ?? 'bg-slate-100 text-slate-700')}>
                {district.province.replace(' Province', '')}
              </Badge>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-white rounded-xl p-2">
                  <div className="text-sm font-black text-blue-700">{district.average_score.toFixed(2)}</div>
                  <div className="text-xs text-slate-400">Avg Score</div>
                </div>
                <div className="bg-white rounded-xl p-2">
                  <div className="text-sm font-black text-emerald-600">{district.active_students}</div>
                  <div className="text-xs text-slate-400">Active</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search districts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl border-slate-200"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={cn('whitespace-nowrap', filter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-200')}
            >
              All Provinces
            </Button>
            {provinces.map((p) => (
              <Button
                key={p}
                variant={filter === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(p)}
                className={cn('whitespace-nowrap', filter === p ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-200')}
              >
                {p.replace(' Province', '')}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">All Districts</h2>
            <span className="text-sm text-slate-400">{filtered.length} districts</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rank</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">District</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Province</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Score</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Students</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Active</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((district, i) => {
                  const rank = district.national_rank ?? i + 1;
                  return (
                    <tr key={district.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {rank <= 3 ? (
                            <span className="text-lg">{MEDALS[rank - 1]}</span>
                          ) : (
                            <span className="text-sm font-bold text-slate-500">#{rank}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">{district.district_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <Badge className={cn('text-xs', PROVINCE_COLORS[district.province] ?? 'bg-slate-100 text-slate-600')}>
                          {district.province.replace(' Province', '')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-bold text-blue-700">{district.average_score.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 text-right hidden md:table-cell">
                        <span className="text-sm text-slate-700">{district.total_students.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right hidden md:table-cell">
                        <span className="text-sm text-emerald-600 font-semibold">{district.active_students}</span>
                      </td>
                      <td className="px-6 py-4 text-right hidden lg:table-cell">
                        <span className="text-sm text-slate-700">{district.total_points.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
