'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import {
  NEPAL_DISTRICTS,
  NEPAL_PROVINCES,
  getDistrictsByProvince,
} from '@/lib/nepal-districts';

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    player_type: 'Student',
    school_name: '',
    province: '',
    district: '',
    parent_phone: '',
  });

  function update(field: keyof typeof form, value: string) {
  setForm((prev) => ({ ...prev, [field]: value }));

  if (field === 'province') {
    setForm((prev) => ({
      ...prev,
      province: value,
      district: '',
    }));
  }
}

  const filteredDistricts =
    form.province ? getDistrictsByProvince(form.province) : NEPAL_DISTRICTS;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message || 'Signup failed');
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: form.full_name,
      username: form.username,
      player_type: form.player_type,
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
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-2/5 gradient-hero flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">SmartLeague</div>
            <div className="text-[10px] text-amber-300 uppercase">
              Nepal
            </div>
          </div>
        </Link>

        <div>
          <h2 className="text-3xl font-black text-white mb-4">
            Join Nepal&apos;s Smartest Community
          </h2>
          <p className="text-blue-100 text-base">
            Compete nationally. Represent your district. Win real prizes.
          </p>
        </div>

        <div className="text-blue-200 text-sm">
          &copy; 2024 SmartLeague Nepal
        </div>
      </div>

      {/* FORM */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-lg py-8">

          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 mb-1">
              Create Your Account
            </h1>
            <p className="text-slate-500 text-sm">
              Fill all details below
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">

            {/* STEP 1 FIELDS */}
            <div>
              <Label>Full Name</Label>
              <Input
                value={form.full_name}
                onChange={(e) => update('full_name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Username</Label>
              <Input
                value={form.username}
                onChange={(e) => update('username', e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Player Type</Label>
              <div className="relative mt-1.5">
                <select
                  value={form.player_type}
                  onChange={(e) => update('player_type', e.target.value)}
                  className="w-full h-11 rounded-xl border px-3 appearance-none"
                  required
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* STEP 2 FIELDS */}
            <div>
              <Label>School/College</Label>
              <Input
                value={form.school_name}
                onChange={(e) => update('school_name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Province</Label>
              <select
                value={form.province}
                onChange={(e) => update('province', e.target.value)}
                className="w-full h-11 rounded-xl border px-3"
                required
              >
                <option value="">Select Province</option>
                {NEPAL_PROVINCES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>District</Label>
              <select
                value={form.district}
                onChange={(e) => update('district', e.target.value)}
                className="w-full h-11 rounded-xl border px-3"
                required
              >
                <option value="">Select District</option>
                {filteredDistricts.map((d) => (
                  <option key={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating...' : 'Create Account'}
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
}