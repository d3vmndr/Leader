'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Trophy,
  Menu,
  X,
  Zap,
  Gift,
  MapPin,
  LayoutDashboard,
  LogIn,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/districts', label: 'Districts', icon: MapPin },
  { href: '/rewards', label: 'Rewards', icon: Gift },
];

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const pathname = usePathname();

  // 🔹 Listen to auth state
  useEffect(() => {
    const getInitialUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user ?? null);

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (data) setRole(data.role);
      }

      setRoleLoading(false);
    };

    getInitialUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentUser.id)
            .single();

          if (data) setRole(data.role);
        } else {
          setRole(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-blue-900 text-sm tracking-wide">
                SmartLeague
              </span>
              <span className="text-[10px] text-amber-500 font-semibold tracking-widest uppercase">
                Nepal
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          {!roleLoading && (
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.filter((link) => {
                if (link.href === '/dashboard' && !user) return false;
                return true;
              }).map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}

              {/* Admin Link */}
              {(role === 'admin' || role === 'superadmin') && (
                <Link
                  href="/admin"
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === '/admin'
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-slate-500 hover:bg-orange-50 hover:text-orange-700'
                  )}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </nav>
          )}

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-2">
            {!user ? (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-blue-700"
                  >
                    <LogIn className="w-4 h-4 mr-1.5" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
                  >
                    <UserPlus className="w-4 h-4 mr-1.5" />
                    Join Free
                  </Button>
                </Link>
              </>
            ) : (
              <span className="text-sm text-slate-600">
                Logged in
              </span>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.filter((link) => {
              if (link.href === '/dashboard' && !user) return false;
              return true;
            }).map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  pathname === href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            {/* Admin mobile */}
            {(role === 'admin' || role === 'superadmin') && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-700 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </Link>
            )}

            {/* Auth buttons */}
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              {!user ? (
                <>
                  <Link
                    href="/login"
                    className="flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button variant="outline" className="w-full" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      Join Free
                    </Button>
                  </Link>
                </>
              ) : (
                <span className="text-sm text-slate-600 w-full text-center">
                  Logged in
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}