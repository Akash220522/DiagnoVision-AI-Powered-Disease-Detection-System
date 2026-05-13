import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Stethoscope, 
  MessageSquare, 
  LineChart, 
  Calendar, 
  FileText, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { auth } from '../services/firebase';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  role: string;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Stethoscope, label: 'AI Diagnosis', path: '/diagnostics' },
  { icon: MessageSquare, label: 'AI Assistant', path: '/assistant' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Calendar, label: 'Appointments', path: '/appointments' },
  { icon: LineChart, label: 'Analytics', path: '/analytics' },
];

export default function Sidebar({ role }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 hidden md:flex flex-col h-full z-50">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Stethoscope className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Lumina<span className="text-blue-400">AI</span></span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                isActive 
                  ? "text-blue-400 bg-white/10" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white")} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_#3b82f6]"
                />
              )}
              <ChevronRight className={cn("ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity", isActive && "opacity-0")} />
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6 border-t border-white/5">
        <div className="bg-white/5 rounded-2xl p-4 mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            <span className="text-sm font-medium text-slate-300 capitalize">{role} Account</span>
          </div>
        </div>
        
        <button 
          onClick={() => auth.signOut()}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-400/5 rounded-xl transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
