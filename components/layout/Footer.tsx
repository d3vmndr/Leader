import Link from 'next/link';
import { Zap, Mail, Phone, MapPin, Trophy, Users, Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">SmartLeague</div>
                <div className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase">Nepal</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Nepal&apos;s first student opinion intelligence competition platform. No right answers. Only smart thinking.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Users className="w-3.5 h-3.5" />
                <span>12,400+ Students</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5" />
                <span>77 Districts</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/challenge', label: 'Current Challenge' },
                { href: '/leaderboard', label: 'Leaderboard' },
                { href: '/districts', label: 'District Rankings' },
                { href: '/rewards', label: 'Rewards & Prizes' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Competition</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Monday Challenges' },
                { label: 'Friday Challenges' },
                { label: 'Monthly Champions' },
                { label: 'Annual Competition' },
                { label: 'District Cup' },
              ].map(({ label }) => (
                <li key={label}>
                  <span className="text-sm text-slate-400">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>hello@smartleague.edu.np</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>+977-01-4XXXXXX</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Kathmandu, Nepal</span>
              </li>
            </ul>
            <div className="mt-5 p-3 bg-blue-900/40 rounded-xl border border-blue-800">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-white font-semibold">Challenge Schedule</span>
              </div>
              <div className="text-xs text-slate-400">
                <div className="flex justify-between py-0.5"><span>Monday</span><span className="text-blue-300">10:00 AM</span></div>
                <div className="flex justify-between py-0.5"><span>Friday</span><span className="text-blue-300">4:00 PM</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; 2024 SmartLeague Nepal. Built for Grade 8 &amp; 9 Students.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Terms of Use</Link>
            <Link href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Fair Play</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
