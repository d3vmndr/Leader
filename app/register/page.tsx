'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Eye, EyeOff, UserPlus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { NEPAL_DISTRICTS, NEPAL_PROVINCES, getDistrictsByProvince } from '@/lib/nepal-districts';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    grade: '8',
    school_name: '',
    province: '',
    district: '',
    parent_phone: '',
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'province') setForm((prev) => ({ ...prev, province: value, district: '' }));
  }

  const filteredDistricts = form.province ? getDistrictsByProvince(form.province) : NEPAL_DISTRICTS;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? 'Registration failed');
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: form.full_name,
      username: form.username,
      grade: parseInt(form.grade),
      school_name: form.school_name,
      district: form.district,
      province: form.province,
      parent_phone: form.parent_phone,
    });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex lg:w-2/5 gradient-hero flex-col justify-between p-12">
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
          <h2 className="text-3xl font-black text-white mb-4">Join Nepal&apos;s Smartest Student Community</h2>
          <p className="text-blue-100 text-base mb-6">Compete nationally. Represent your district. Win real prizes.</p>
          <div className="space-y-3">
            {['Free to join — no hidden fees', 'Challenges every Monday & Friday', 'National rank & district rank', 'Win scholarships & laptops'].map((t) => (
              <div key={t} className="flex items-center gap-2 text-white/90 text-sm">
                <div className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>
        <div className="text-blue-200 text-sm">&copy; 2024 SmartLeague Nepal</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="font-bold text-blue-900 text-sm">SmartLeague Nepal</div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 mb-1">Create Your Account</h1>
            <p className="text-slate-500 text-sm">Step {step} of 2 — {step === 1 ? 'Personal information' : 'School & location'}</p>
            <div className="flex gap-2 mt-3">
              <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleRegister} className="space-y-4">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-slate-700 font-medium">Full Name</Label>
                    <Input
                      value={form.full_name}
                      onChange={(e) => update('full_name', e.target.value)}
                      placeholder="Your full name"
                      className="mt-1.5 h-11 rounded-xl border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">Username</Label>
                    <Input
                      value={form.username}
                      onChange={(e) => update('username', e.target.value)}
                      placeholder="e.g. aarav_thinks"
                      className="mt-1.5 h-11 rounded-xl border-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">Grade</Label>
                    <div className="relative mt-1.5">
                      <select
                        value={form.grade}
                        onChange={(e) => update('grade', e.target.value)}
                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 appearance-none text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="8">Grade 8</option>
                        <option value="9">Grade 9</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-slate-700 font-medium">Email Address</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="your@email.com"
                      className="mt-1.5 h-11 rounded-xl border-slate-200"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-slate-700 font-medium">Password</Label>
                    <div className="relative mt-1.5">
                      <Input
                        type={showPass ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => update('password', e.target.value)}
                        placeholder="Min 8 characters"
                        className="h-11 rounded-xl border-slate-200 pr-12"
                        minLength={8}
                        required
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">
                  Continue to Step 2
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label className="text-slate-700 font-medium">School Name</Label>
                  <Input
                    value={form.school_name}
                    onChange={(e) => update('school_name', e.target.value)}
                    placeholder="e.g. Kathmandu Model Secondary School"
                    className="mt-1.5 h-11 rounded-xl border-slate-200"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-700 font-medium">Province</Label>
                  <div className="relative mt-1.5">
                    <select
                      value={form.province}
                      onChange={(e) => update('province', e.target.value)}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 appearance-none text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Province</option>
                      {NEPAL_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-700 font-medium">District</Label>
                  <div className="relative mt-1.5">
                    <select
                      value={form.district}
                      onChange={(e) => update('district', e.target.value)}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 appearance-none text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select District</option>
                      {filteredDistricts.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-700 font-medium">Parent Phone <span className="text-slate-400 font-normal">(Optional)</span></Label>
                  <Input
                    type="tel"
                    value={form.parent_phone}
                    onChange={(e) => update('parent_phone', e.target.value)}
                    placeholder="+977-98XXXXXXXX"
                    className="mt-1.5 h-11 rounded-xl border-slate-200"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl">
                    Back
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">
                    {loading ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</span>
                    ) : (
                      <span className="flex items-center gap-2"><UserPlus className="w-4 h-4" />Create Account</span>
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already registered?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
          </p>
          <p className="mt-3 text-center text-xs text-slate-400">
            By registering, you agree to our Fair Play policy and Terms of Use.
          </p>
        </div>
      </div>
    </div>
  );
}
