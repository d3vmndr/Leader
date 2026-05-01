import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Menu,
  X,
  Zap,
  Gift,
  MapPin,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  UserPlus,
  LucideIcon,
} from 'lucide-react';

import { initializeApp } from 'firebase/app';

import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut,
  User,
} from 'firebase/auth';

import {
  getFirestore,
  doc,
  onSnapshot,
} from 'firebase/firestore';

// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// =====================================================
// FIREBASE INIT
// =====================================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =====================================================
// TYPES
// =====================================================

type Role = 'user' | 'admin' | 'superadmin';

type NavLink = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type NavItemProps = {
  item: NavLink;
  isMobile?: boolean;
};

// =====================================================
// NAV LINKS
// =====================================================

const NAV_LINKS: NavLink[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
                  className="w-full py-3 text-sm font-bold text-red-600 border border-red-100 rounded-xl hover:bg-red-50 flex items-cente