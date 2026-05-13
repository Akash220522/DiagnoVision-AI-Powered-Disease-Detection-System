import { Bell, Search, User } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile | null;
}

export default function Header({ profile }: HeaderProps) {
  return (
    <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-white/5 backdrop-blur-xl z-40">
      <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full w-full max-w-md border border-white/10 group focus-within:border-blue-500/50 transition-all">
        <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
        <input 
          type="text" 
          placeholder="Search records, diagnoses, specialists..." 
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-500"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
        </button>
        
        <div className="h-8 w-[1px] bg-white/10" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{profile?.displayName || 'User'}</p>
            <p className="text-[10px] text-teal-400 uppercase tracking-wider font-bold">{profile?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-blue-500/50 flex items-center justify-center p-0.5 bg-white/5 overflow-hidden shadow-lg shadow-blue-500/10">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <User className="w-5 h-5 text-blue-400" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
