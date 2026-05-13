import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import { UserProfile } from './types';

// Pages
import Landing from './pages/Landing';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Diagnostics from './pages/Diagnostics';
import Assistant from './pages/Assistant';
import Analytics from './pages/Analytics';
import Appointments from './pages/Appointments';
import Reports from './pages/Reports';

// Layout
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BackgroundGlow from './components/BackgroundGlow';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 font-bold text-xs italic tracking-tighter">V</div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
        
        <Route path="/*" element={
          user ? (
            <div className="flex h-screen bg-[#020617] overflow-hidden relative">
              <BackgroundGlow />
              <Sidebar role={profile?.role || 'patient'} />
              <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                <Header profile={profile} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard profile={profile} />} />
                    <Route path="/diagnostics" element={<Diagnostics profile={profile} />} />
                    <Route path="/assistant" element={<Assistant profile={profile} />} />
                    <Route path="/analytics" element={<Analytics profile={profile} />} />
                    <Route path="/appointments" element={<Appointments profile={profile} />} />
                    <Route path="/reports" element={<Reports profile={profile} />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </main>
              </div>
            </div>
          ) : (
            <Navigate to="/auth" />
          )
        } />
      </Routes>
    </BrowserRouter>
  );
}
