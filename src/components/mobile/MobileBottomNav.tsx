import { Home, Plus, Bell, User } from "lucide-react";
import { useAstra } from "../../context/AstraContext";
import { useAuth } from "../../hooks/useAuth";

export function MobileBottomNav() {
  const { currentView, setCurrentView } = useAstra();
  const { user } = useAuth();
  const initials = user?.displayName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'A';

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe-offset pl-8 pr-8 pt-3 flex justify-between items-center z-50 h-[88px] pb-6 border-t border-[#F0EFEB]">
      <button
        onClick={() => setCurrentView('dashboard')}
        className={`flex flex-col items-center gap-1 transition-all ${currentView === 'dashboard' ? 'text-[#1C1C1E] scale-100' : 'text-[#8E8E93] scale-95'}`}
      >
        <Home size={22} strokeWidth={currentView === 'dashboard' ? 2 : 1.5} />
        <span className="font-sans text-[10px] font-medium tracking-wide">Home</span>
      </button>

      <button
        onClick={() => setCurrentView('dashboard')}
        className="w-[54px] h-[54px] rounded-full bg-[#B89C85] text-white flex items-center justify-center -mt-6 border-[4px] border-[#FDFCFB] transition-transform active:scale-90 shadow-lg hover:bg-[#A68A73]"
      >
        <Plus size={26} strokeWidth={2} />
      </button>

      <button
        onClick={() => setCurrentView('activity')}
        className={`flex flex-col items-center gap-1 transition-all ${currentView === 'activity' ? 'text-[#1C1C1E] scale-100' : 'text-[#8E8E93] scale-95'}`}
      >
        <Bell size={22} strokeWidth={currentView === 'activity' ? 2 : 1.5} />
        <span className="font-sans text-[10px] font-medium tracking-wide">Activity</span>
      </button>

      <button
        onClick={() => setCurrentView('profile')}
        className={`flex flex-col items-center gap-1 transition-all ${currentView === 'profile' ? 'text-[#1C1C1E] scale-100' : 'text-[#8E8E93] scale-95'}`}
      >
        <div className={`w-6 h-6 rounded-full ${currentView === 'profile' ? 'bg-[#1C1C1E] text-white' : 'bg-[#EADDD7] text-[#1C1C1E]'} flex items-center justify-center text-[10px] font-bold`}>
          {initials}
        </div>
        <span className="font-sans text-[10px] font-medium tracking-wide">Profile</span>
      </button>
    </div>
  );
}
