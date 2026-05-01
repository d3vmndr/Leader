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
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/districts', label: 'Districts', icon: MapPin },
  { href: '/rewards', label: 'Rewards', icon: Gift },
  { href: '/notices', label: 'Notice', icon: Bell },
  { href: '/blogs', label: 'Blogs', icon: BookOpen },
];

export default function Navbar() {
  const [user, setUser] = useState(null);
const [profile, setProfile] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRole(null);
    setMobileOpen(false);
    router.push('/');
  };

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user ?? null);

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile(data);
          setRole(data.role);
        }
      }

      setLoading(false);
    };

    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', currentUser.id)
            .single();

          if (data) {
            setProfile(data);
            setRole(data.role);
          }
        } else {
          setProfile(null);
          setRole(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // ✅ filter links
  const filteredLinks = NAV_LINKS.filter((link) => {
    if (link.href === '/dashboard' && !user) return false;

    if (
      (link.href === '/notices' || link.href === '/blogs') &&
      (role === 'admin' || role === 'superadmin')
    ) {
      return false;
    }

    return true;
  });

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-blue-900 text-sm">
                SmartLeague
              </div>
              <div className="text-[10px] text-amber-500 uppercase">
                Nepal
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          {!loading && (
            <nav className="hidden md:flex items-center gap-1">
              {filteredLinks.map(({ href, label, icon: Icon }) => (
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

          {/* Right side */}
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
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">
                  {profile?.full_name || 'User'}
                </span>

                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
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

            {filteredLinks.map(({ href, label, icon: Icon }) => (
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

            <div className="pt-2 border-t">
              {!user ? (
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full">Join Free</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <span className="text-sm text-center font-medium">
                    {profile?.full_name || 'User'}
                  </span>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
}