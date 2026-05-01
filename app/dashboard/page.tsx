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
} from 'lucide-react';

import { initializeApp } from 'firebase/app';

import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut,
} from 'firebase/auth';

import {
  getFirestore,
  doc,
  onSnapshot,
} from 'firebase/firestore';

// =====================================================
// FIREBASE CONFIG
// =====================================================
// Create a .env file in project root
// =====================================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// =====================================================
// FIREBASE INIT
// =====================================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =====================================================
// NAVIGATION LINKS
// =====================================================

const NAV_LINKS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
       