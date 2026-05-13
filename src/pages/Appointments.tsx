import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  ChevronRight, 
  Plus, 
  User,
  Stethoscope,
  MoreVertical,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';

const doctors = [
  { id: '1', name: 'Dr. Sarah Jenkins', specialty: 'Cardiologist', rating: 4.9, image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200' },
  { id: '2', name: 'Dr. Michael Chen', specialty: 'Neurologist', rating: 4.8, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200' },
  { id: '3', name: 'Dr. Elena Rossi', specialty: 'Dermatologist', rating: 5.0, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200' },
];

const upcomingAppointments = [
  { id: 'a1', doctorId: '1', date: 'May 14, 2026', time: '10:30 AM', type: 'online', status: 'confirmed' },
  { id: 'a2', doctorId: '2', date: 'May 18, 2026', time: '02:00 PM', type: 'in-person', status: 'pending' },
];

export default function Appointments() {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'history'>('upcoming');

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 underline decoration-brand-blue underline-offset-8">Consultation <span className="text-brand-blue">Center</span></h1>
          <p className="text-slate-400 text-sm">Manage your professional medical appointments and virtual rooms.</p>
        </div>
        <button className="neon-button flex items-center gap-2 group">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Book New Consultation
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Schedule */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-1">
             <button 
              onClick={() => setSelectedTab('upcoming')}
              className={cn("px-6 py-4 text-sm font-bold transition-all relative", selectedTab === 'upcoming' ? "text-brand-cyan" : "text-slate-500 hover:text-white")}
             >
                Upcoming
                {selectedTab === 'upcoming' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-cyan" />}
             </button>
             <button 
              onClick={() => setSelectedTab('history')}
              className={cn("px-6 py-4 text-sm font-bold transition-all relative", selectedTab === 'history' ? "text-brand-cyan" : "text-slate-500 hover:text-white")}
             >
                History
                {selectedTab === 'history' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-cyan" />}
             </button>
          </div>

          <div className="space-y-4">
             {upcomingAppointments.map((app, i) => {
               const doctor = doctors.find(d => d.id === app.doctorId)!;
               return (
                 <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-brand-blue/30 transition-all border-white/5"
                 >
                   <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-white/10 group-hover:border-brand-blue/50 transition-all">
                      <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                   </div>

                   <div className="flex-1 text-center md:text-left">
                      <h3 className="text-lg font-bold text-white group-hover:text-brand-blue transition-colors">
                        {doctor.name}
                        <span className="ml-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">{doctor.specialty}</span>
                      </h3>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                         <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                            <CalendarIcon className="w-4 h-4 text-brand-blue" />
                            {app.date}
                         </div>
                         <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                            <Clock className="w-4 h-4 text-brand-blue" />
                            {app.time}
                         </div>
                         <div className={cn(
                           "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                           app.type === 'online' ? "bg-brand-cyan/10 text-brand-cyan" : "bg-brand-purple/10 text-brand-purple"
                         )}>
                            {app.type === 'online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                            {app.type}
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-2">
                      <button className="px-6 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:shadow-[0_0_20px_rgba(0,102,255,0.3)] transition-all">
                         {app.type === 'online' ? 'Join Call' : 'View Map'}
                      </button>
                      <button className="p-2.5 text-slate-500 hover:text-white transition-colors">
                         <MoreVertical className="w-5 h-5" />
                      </button>
                   </div>
                 </motion.div>
               );
             })}
          </div>
        </div>

        {/* Right: Available Doctors */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 bg-gradient-to-br from-brand-blue/5 to-transparent">
             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-brand-blue" />
                Specialists Online
             </h2>
             
             <div className="space-y-6">
                {doctors.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-4 group cursor-pointer">
                     <div className="relative">
                        <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#030712] rounded-full" />
                     </div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-white group-hover:text-brand-blue transition-colors">{doc.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{doc.specialty}</p>
                     </div>
                     <button className="p-2 bg-white/5 rounded-lg group-hover:bg-brand-blue/20 transition-all">
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand-blue" />
                     </button>
                  </div>
                ))}
             </div>

             <button className="w-full mt-10 py-3 text-xs font-bold text-brand-blue bg-brand-blue/10 rounded-xl hover:bg-brand-blue hover:text-white transition-all">
                Browse Full Directory
             </button>
          </div>

          <div className="glass-card p-6 border-white/5 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <User className="w-24 h-24" />
             </div>
             <h3 className="font-bold text-white mb-2">Need Help Booking?</h3>
             <p className="text-xs text-slate-500 leading-relaxed">Our AI Personal Support node is available 24/7 to help you find the right specialist for your needs.</p>
             <button className="mt-4 flex items-center gap-2 text-xs font-bold text-brand-cyan group">
                Talk to Assistant <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
