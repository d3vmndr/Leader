'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirectPath, setRedirectPath] = useState('/dashboard');

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, [searchParams]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
    } else {
      router.push(redirectPath);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">SmartLeague</div>
            <div className="text-[10px] text-amber-300 font-semibold tracking-widest uppercase">Nepal</div>
          </div>
        </Link>
        <div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Think Smart.<br />Rank Nationally.
          </h2>
          <p className="text-blue-100 text-lg mb-8">Join 12,400+ students competing every Monday &amp; Friday.</p>
          <div className="space-y-3">
            {[
              { icon: '🧠', text: 'Emotional intelligence challenges' },
              { icon: '🏆', text: 'National & district rankings' },
              { icon: '🎯', text: 'No right answers — only strategy' },
              { icon: '🏅', text: 'Win real prizes and scholarships' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-white/90 text-sm">
                <span className="text-lg">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-blue-200 text-sm">
          &copy; 2024 SmartLeague Nepal. All rights reserved.
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-blue-900 text-sm">SmartLeague</div>
              <div className="text-[10px] text-amber-500 font-semibold tracking-widest uppercase">Nepal</div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome back!</h1>
            <p className="text-slate-500">Login to see your rankings and join the next challenge.</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-12 border-slate-200 focus:border-blue-500 rounded-xl"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <Link href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-slate-200 focus:border-blue-500 rounded-xl pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-200"
            >
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Logging in...</span>
              ) : (
                <span className="flex items-center gap-2"><LogIn className="w-5 h-5" />Login to SmartLeague</span>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800 font-medium mb-2">Demo Access</p>
            <p className="text-xs text-amber-700">Use any email + password to explore the demo dashboard.</p>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to SmartLeague?{' '}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">
              Register Free <ArrowRight className="w-3.5 h-3.5 inline" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
