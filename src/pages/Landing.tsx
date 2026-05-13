import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  ShieldCheck, 
  Zap, 
  Brain, 
  Stethoscope, 
  ChevronRight, 
  Users,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#020617] selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Stethoscope className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Lumina<span className="text-blue-400">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
          <a href="#diagnostics" className="hover:text-blue-400 transition-colors">AI Diagnostics</a>
          <a href="#assistant" className="hover:text-blue-400 transition-colors">Assistant</a>
        </div>
        <Link to="/auth" className="neon-button">
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center justify-center">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-[30%] right-[30%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Next Gen Healthcare Ecosystem</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
              The Future of <br />
              <span className="neon-gradient-text">Precision Medicine</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Empowering patients and doctors with enterprise-grade AI diagnostics, 
              intelligent assistants, and real-time medical insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-all duration-300 shadow-xl shadow-blue-500/20 flex items-center gap-2 group">
                Enter Ecosystem <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-white/5 text-white font-bold rounded-full hover:bg-white/10 border border-white/10 transition-all duration-300">
                How it works
              </button>
            </div>
          </motion.div>

          {/* Feature Grid Intro */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-20">
             {[
               { icon: Brain, label: '12+ Disease Diagnosis', color: 'text-blue-400' },
               { icon: Heart, label: 'Real-time Health Score', color: 'text-rose-500' },
               { icon: Activity, label: 'Medical Analytics', color: 'text-teal-400' },
               { icon: Users, label: 'Doctor Collaborative', color: 'text-purple-400' },
             ].map((f, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 + (i * 0.1) }}
                 className="glass-card p-6 flex flex-col items-center group cursor-default border-white/10"
               >
                 <f.icon className={`w-8 h-8 mb-4 ${f.color} group-hover:scale-110 transition-transform duration-300`} />
                 <span className="font-bold text-sm tracking-tight text-white">{f.label}</span>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Floating Elements (Visual Polish) */}
      <div className="absolute top-[30%] right-[10%] w-64 h-64 border border-blue-500/10 rounded-full animate-pulse pointer-events-none" />
      <div className="absolute top-[40%] left-[5%] w-32 h-32 border border-purple-500/10 rounded-lg rotate-12 animate-bounce pointer-events-none" />
    </div>
  );
}
