import React, { useEffect, useState, useCallback } from 'react';
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
  LogOut
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInAnonymously, 
  signInWithCustomToken, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  collection 
} from 'firebase/firestore';

// --- Firebase Configuration ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const NAV_LINKS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'districts', label: 'Districts', icon: MapPin },
  { id: 'rewards', label: 'Rewards', icon: Gift },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // --- Auth Initialization ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };

    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- Profile/Role Fetching ---
  useEffect(() => {
    if (!user) return;

    // Use the mandatory path structure for public/private data
    // Assuming profiles are stored in a public data collection for this context
    const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'profiles', user.uid);
    
    const unsubscribe = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        setRole(docSnap.data().role);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    setMobileOpen(false);
    setActiveTab('home');
  };

  const isAdmin = role === 'admin' || role === 'superadmin';

  // Navigation Helper
  const NavItem = ({ item, isMobile = false }) => {
    const isActive = activeTab === item.id;
    const Icon = item.icon;
    
    return (
      <button
        onClick={() => {
          setActiveTab(item.id);
          if (isMobile) setMobileOpen(false);
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          isActive 
            ? 'bg-blue-50 text-blue-700 shadow-sm' 
            : 'text-slate-600 hover:bg-slate-50'
        } ${isMobile ? 'w-full py-3 px-6' : ''}`}
      >
        <Icon className="w-4 h-4" />
        {item.label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="font-bold text-blue-900 text-sm">SmartLeague</span>
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Nepal</span>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.filter(link => link.id !== 'dashboard' || user).map(link => (
                <NavItem key={link.id} item={link} />
              ))}

              {isAdmin && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'admin' 
                      ? 'bg-orange-50 text-orange-700 shadow-sm' 
                      : 'text-slate-500 hover:bg-orange-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </button>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-3">
              {!user || user.isAnonymous ? (
                <>
                  <button className="text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-2">
                    Login
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Join Free
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-slate-900">{user.email || 'Member'}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{role || 'User'}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl animate-in slide-in-from-top-2">
            <div className="px-4 py-6 space-y-2">
              {NAV_LINKS.filter(link => link.id !== 'dashboard' || user).map(link => (
                <NavItem key={link.id} item={link} isMobile />
              ))}

              {isAdmin && (
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-medium w-full ${
                    activeTab === 'admin' ? 'bg-orange-50 text-orange-700' : 'text-slate-600'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Panel
                </button>
              )}

              <div className="pt-6 mt-4 border-t border-slate-100 flex flex-col gap-3">
                {!user || user.isAnonymous ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50">
                      Login
                    </button>
                    <button className="py-3 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-md">
                      Join Free
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.email || 'Anonymous User'}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full py-3 text-sm font-bold text-red-600 border border-red-100 rounded-xl hover:bg-red-50 flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area (Demo) */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-4 capitalize">
            {activeTab} Page
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            This is a preview of the {activeTab} view. The Navbar handles state-based navigation within this single-file application.
          </p>
        </div>
      </main>
    </div>
  );
}