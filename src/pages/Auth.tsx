import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Lock, 
  User, 
  Users,
  ArrowRight, 
  Stethoscope,
  Shield,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'patient' as 'patient' | 'doctor'
  });

  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user profile already exists
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        // Create new profile if it's their first time
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'patient', // Default role
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') return;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: formData.name });
        
        // Create user doc
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: formData.email,
          displayName: formData.name,
          role: formData.role,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'patient' | 'doctor') => {
    setLoading(true);
    setError('');
    const email = role === 'patient' ? 'patient@demo.com' : 'doctor@demo.com';
    const password = 'Password@123'; // Demo password
    const name = role === 'patient' ? 'Demo Patient' : 'Dr. Sarah Jenkins';

    try {
      // Try to sign in first
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
       // If doesn't exist, create it silently for easy demo
       if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });
            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              email: email,
              displayName: name,
              role: role,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            navigate('/dashboard');
          } catch (createErr: any) {
            setError('Demo access failed. Please try manual login.');
          }
       } else {
         setError(err.message);
       }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col md:flex-row">
      {/* Left Side: Brand & Visuals */}
      <div className="hidden md:flex flex-1 relative items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 via-transparent to-brand-purple/5" />
        <div className="absolute inset-0 pattern-dots" /> 
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-12"
        >
          <div className="w-20 h-20 rounded-2xl bg-brand-cyan/10 flex items-center justify-center mx-auto mb-8 border border-brand-cyan/20 ring-4 ring-brand-cyan/5">
            <Stethoscope className="w-10 h-10 text-brand-cyan" />
          </div>
          <h2 className="text-4xl font-bold mb-6">Securing the next billion <span className="text-brand-cyan">lives</span> with AI.</h2>
          <p className="text-slate-400 max-w-sm mx-auto leading-relaxed">
            Join the most advanced medical AI ecosystem designed for the future of healthcare.
          </p>
          
          <div className="mt-12 flex items-center justify-center gap-8">
             <div className="flex flex-col items-center">
                <Shield className="w-6 h-6 text-emerald-500 mb-2" />
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">HIPAA Compliant</span>
             </div>
             <div className="flex flex-col items-center">
                <Lock className="w-6 h-6 text-brand-blue mb-2" />
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">E2E Encrypted</span>
             </div>
          </div>
        </motion.div>

        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-cyan/5 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-purple/5 blur-[100px] rounded-full animate-pulse" />
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,242,255,0.05),transparent_40%)]" />
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-10 flex md:hidden items-center gap-2">
            <Stethoscope className="text-brand-cyan w-6 h-6" />
            <span className="text-xl font-bold">Lumina<span className="text-brand-cyan">AI</span></span>
          </div>

          <h3 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
          <p className="text-slate-400 mb-8">{isLogin ? 'Enter your credentials to access your health portal.' : 'Sign up to start your AI-powered health journey.'}</p>

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 px-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Dr. John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 focus:ring-offset-0 transition-all text-white"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 px-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="name@hospital.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-semibold text-slate-400">Password</label>
                {isLogin && <button type="button" className="text-xs text-blue-400 hover:underline">Forgot?</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-white"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 px-1">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                    type="button" 
                    onClick={() => setFormData({...formData, role: 'patient'})}
                    className={cn("py-3 rounded-xl border transition-all text-sm font-bold", formData.role === 'patient' ? "bg-blue-500/10 border-blue-500 text-blue-400" : "bg-white/5 border-white/10 text-slate-500")}
                   >Patient</button>
                   <button 
                    type="button" 
                    onClick={() => setFormData({...formData, role: 'doctor'})}
                    className={cn("py-3 rounded-xl border transition-all text-sm font-bold", formData.role === 'doctor' ? "bg-teal-500/10 border-teal-500 text-teal-400" : "bg-white/5 border-white/10 text-slate-500")}
                   >Medical Professional</button>
                </div>
              </div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs py-3 px-4 rounded-xl flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-blue-600 py-4 rounded-2xl text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </form>

          {/* Quick Access Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-[#020617] px-4 text-slate-500">Quick Demo Access</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleDemoLogin('patient')}
              disabled={loading}
              className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
            >
              <Users className="w-6 h-6 text-slate-400 group-hover:text-blue-400 mb-2" />
              <span className="text-xs font-bold text-slate-400 group-hover:text-white">Patient Demo</span>
            </button>
            <button 
              onClick={() => handleDemoLogin('doctor')}
              disabled={loading}
              className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-teal-500/50 hover:bg-teal-500/5 transition-all"
            >
              <Stethoscope className="w-6 h-6 text-slate-400 group-hover:text-teal-400 mb-2" />
              <span className="text-xs font-bold text-slate-400 group-hover:text-white">Doctor Demo</span>
            </button>
          </div>

          <p className="text-center mt-8 text-slate-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-brand-cyan font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
