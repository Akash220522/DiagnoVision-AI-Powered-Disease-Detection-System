import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { motion } from 'motion/react';
import { Activity, Shield, Brain, Zap, ArrowUpRight, TrendingUp } from 'lucide-react';

const visitData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

const diseaseStats = [
  { name: 'Lungs', value: 45, color: '#00f2ff' },
  { name: 'Brain', value: 25, color: '#0066ff' },
  { name: 'Cardio', value: 20, color: '#9d00ff' },
  { name: 'Other', value: 10, color: '#64748b' },
];

export default function Analytics() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <header>
        <h1 className="text-4xl font-bold text-white mb-2 underline decoration-brand-cyan underline-offset-8">Health <span className="text-brand-cyan">Analytics</span></h1>
        <p className="text-slate-400 text-sm">Real-time processing of complex medical data patterns.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Consumption Chart */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-cyan" />
              Vital Consistency Score
            </h2>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-brand-cyan" /> Patient Vitals</span>
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-700" /> AI Median</span>
            </div>
          </div>
          
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitData}>
                <defs>
                  <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#00f2ff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#00f2ff" strokeWidth={4} fillOpacity={1} fill="url(#colorVis)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disease Distribution */}
        <div className="glass-card p-8 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-8">Diagnosis Coverage</h2>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diseaseStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {diseaseStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {diseaseStats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">{stat.name}</span>
                <span className="text-lg font-bold text-white">{stat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Neural Accuracy', value: '99.82%', growth: '+0.04%', icon: Brain, color: '#00f2ff' },
          { label: 'System Uptime', value: '100%', growth: 'Stable', icon: Zap, color: '#9d00ff' },
          { label: 'Data Protected', value: '4.2 TB', growth: '+1.2 TB', icon: Shield, color: '#0066ff' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 group relative overflow-hidden"
          >
            <item.icon className="w-12 h-12 absolute -right-2 -top-2 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-[2] duration-700" style={{ color: item.color }} />
            <div className="relative z-10">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{item.label}</p>
              <div className="flex items-end gap-3">
                <h3 className="text-4xl font-bold text-white">{item.value}</h3>
                <span className="text-emerald-500 text-xs font-bold mb-1.5 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {item.growth}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
