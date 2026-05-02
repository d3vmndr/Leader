'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Bell,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/notice', label: 'Notices', icon: Bell },
  { href: '/dashboard/blogs', label: 'Blogs', icon: BookOpen },
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
  const router = useRouter();

  // ✅ Logout (fixed)
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setMobileOpen(false);
    router.push('/');
  };

  // 🔹 Auth + role loading
  useEffect(() => {
    const loadUser = async () => {
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

    loadUser();

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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-blue-900 text-sm">
                SmartLeague
              </span>
              <span className="text-[10px] text-amber-500 uppercase">
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
                    'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium',
                    pathname === href
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}

              {(role === 'admin' || role === 'superadmin') && (
                <Link
                  href="/admin"
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium',
                    pathname === '/admin'
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-slate-500 hover:bg-orange-50'
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
                  <Button variant="ghost" size="sm">
                    <LogIn className="w-4 h-4 mr-1.5" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-1.5" />
                    Join Free
                  </Button>
                </Link>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-1">

            {NAV_LINKS.filter((link) => {
              if (link.href === '/dashboard' && !user) return false;
              return true;
            }).map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            {(role === 'admin' || role === 'superadmin') && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </Link>
            )}

            <div className="pt-2 border-t flex gap-2">
              {!user ? (
                <>
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full">Join Free</Button>
                  </Link>
                </>
              ) : (
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
}