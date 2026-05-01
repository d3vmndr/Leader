import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Menu,
  X,
  Zap,
  Gift,
  MapPin,
  LayoutDashboard,
  UserPlus,
  ShieldCheck,
  LogOut,
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

// ======================================================
// FIREBASE CONFIG
// ======================================================
// Replace these with your actual Firebase project values
// If using Vite, keep import.meta.env
// If using Next.js, replace with process.env.NEXT_PUBLIC_...
// ======================================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ======================================================
// FIREBASE INIT
// ======================================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ======================================================
// NAVIGATION
// ======================================================

const NAV_LINKS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'districts', label: 'Districts', icon: MapPin },
  { id: 'rewards', label: 'Rewards', icon: Gift },
];

// ======================================================
// MAIN APP
// ======================================================

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // ======================================================
  // AUTH INITIALIZATION
  // ======================================================

  useEffect(() => {
    let unsubscribeAuth = () => {};

    const initAuth = async () => {
      try {
        // Anonymous login
        await signInAnonymously(auth);

        unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });
      } catch (error) {
        console.error('Authentication Error:', error);
        setLoading(false);
      }
    };

    initAuth();

    return () => unsubscribeAuth();
  }, []);

  // ======================================================
  // FETCH USER ROLE
  // ======================================================

  useEffect(() => {
    if (!user) return;

    // Example Firestore structure:
    // users/{uid}

    const profileRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(
      profileRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setRole(userData.role || 'user');
        } else {
          setRole('user');
        }
      },
      (error) => {
        console.error('Firestore Error:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = async () => {
    try {
      await signOut(auth);

      setUser(null);
      setRole(null);
      setActiveTab('dashboard');
      setMobileOpen(false);

      // Re-login anonymously
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  // ======================================================
  // ROLE CHECK
  // ======================================================

  const isAdmin =
    role === 'admin' || role === 'superadmin';

  // ======================================================
  // NAV ITEM COMPONENT
  // ======================================================

  const NavItem = ({ item, isMobile = false }) => {
    const isActive = activeTab === item.id;
    const Icon = item.icon;

    return (
      <button
        onClick={() => {
          setActiveTab(item.id);

          if (isMobile) {
            setMobileOpen(false);
          }
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
        ${
          isActive
            ? 'bg-blue-50 text-blue-700 shadow-sm'
            : 'text-slate-600 hover:bg-slate-50'
        }
        ${isMobile ? 'w-full py-3 px-6' : ''}
      `}
      >
        <Icon className="w-4 h-4" />
        {item.label}
      </button>
    );
  };

  // ======================================================
  // LOADING SCREEN
  // ======================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-slate-600 font-medium">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 text-white" />
              </div>

              <div className="flex flex-col items-start leading-none">
                <span className="font-bold text-blue-900 text-sm">
                  SmartLeague
                </span>

                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                  Nepal
                </span>
              </div>
            </button>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavItem
                  key={link.id}
                  item={link}
                />
              ))}

              {isAdmin && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    activeTab === 'admin'
                      ? 'bg-orange-50 text-orange-700 shadow-sm'
                      : 'text-slate-500 hover:bg-orange-50'
                  }
                `}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </button>
              )}
            </nav>

            {/* USER SECTION */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-900">
                  {user?.email || 'Anonymous User'}
                </span>

                <span className="text-[10px] text-slate-400 capitalize">
                  {role || 'User'}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* MOBILE TOGGLE */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() =>
                setMobileOpen(!mobileOpen)
              }
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 shadow-lg">
            <div className="px-4 py-6 space-y-2">
              {NAV_LINKS.map((link) => (
                <NavItem
                  key={link.id}
                  item={link}
                  isMobile
                />
              ))}

              {isAdmin && (
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-medium w-full text-slate-600"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Panel
                </button>
              )}

              <div className="pt-6 mt-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 text-sm font-bold text-red-600 border border-red-100 rounded-xl hover:bg-red-50 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-4 capitalize">
            {activeTab} Page
          </h1>

          <p className="text-slate-500 max-w-md mx-auto">
            Your dashboard is now rendering properly with
            production-safe Firebase initialization,
            authentication handling, loading state,
            Firestore listeners, and mobile navigation.
          </p>
        </div>
      </main>
    </div>
  );
}