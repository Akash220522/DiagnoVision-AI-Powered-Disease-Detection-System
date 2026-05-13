import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Clock, 
  ShieldCheck, 
  Plus, 
  ChevronRight,
  Brain,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { UserProfile } from '../types';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 30 },
  { name: 'Wed', value: 65 },
  { name: 'Thu', value: 45 },
  { name: 'Fri', value: 80 },
  { name: 'Sat', value: 55 },
  { name: 'Sun', value: 90 },
];

export default function Dashboard({ profile }: { profile: UserProfile | null }) {
  const isDoctor = profile?.role === 'doctor';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Welcome, <span className="neon-gradient-text">{profile?.displayName?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-slate-400 text-sm">Here is your medical ecosystem overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-all flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-cyan" />
            History
          </button>
          <Link to="/diagnostics" className="px-5 py-2.5 rounded-xl bg-brand-cyan text-slate-950 text-sm font-bold hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Diagnostic
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Overall Health', value: '92%', icon: Activity, color: 'text-brand-cyan', bg: 'bg-brand-cyan/10' },
          { label: 'Active Alerts', value: '02', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
          { label: 'AI Accuracy', value: '99.8%', icon: Brain, color: 'text-brand-purple', bg: 'bg-brand-purple/10' },
          { label: 'Cloud Sync', value: 'Live', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex items-center justify-between group"
          >
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-white group-hover:text-brand-cyan transition-colors">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white">Health Activity Index</h2>
              <p className="text-xs text-slate-400 mt-1">AI-processed vital trend monitoring</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              +12.5% Incr.
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#00f2ff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#00f2ff" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="glass-card p-8 bg-gradient-to-br from-white/5 to-brand-cyan/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-brand-cyan" />
            </div>
            <h2 className="text-xl font-bold text-white">AI Health Tips</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { text: "Increase Vitamin D intake based on your recent activity patterns.", type: "tip" },
              { text: "Consistent sleep quality detected. AI recommends maintain current schedule.", type: "insight" },
              { text: "Heart rate variability shows slight stress. Try 5-min breathing exercise.", type: "action" }
            ].map((tip, i) => (
              <div key={i} className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group cursor-pointer">
                <p className="text-sm text-slate-300 leading-relaxed group-hover:text-white">{tip.text}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-brand-cyan/70">{tip.type}</span>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand-cyan group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-3 rounded-xl border border-brand-cyan/20 text-brand-cyan text-sm font-bold hover:bg-brand-cyan hover:text-slate-950 transition-all">
            See All personalized Insights
          </button>
        </div>
      </div>

      {/* Appointment Ribbon */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-brand-blue/10 via-brand-cyan/5 to-transparent border-brand-cyan/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-brand-blue" />
          </div>
          <div>
            <h3 className="font-bold text-white">Next Consultation</h3>
            <p className="text-sm text-slate-400">Dr. Sarah Jenkins • Tomorrow at 10:30 AM</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">Reschedule</button>
          <button className="px-6 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:shadow-[0_0_20px_rgba(0,102,255,0.3)] transition-all">
            Join Online Room
          </button>
        </div>
      </div>
    </div>
  );
}
