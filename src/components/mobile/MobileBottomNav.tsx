import { Home, Plus, Bell } from "lucide-react";
import { useAstra } from "../../context/AstraContext";

export function MobileBottomNav() {
  const { currentView, setCurrentView } = useAstra();
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe-offset pl-10 pr-10 pt-4 flex justify-between items-center z-50 h-[88px] pb-6">
      <button 
        onClick={() => setCurrentView('dashboard')}
        className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'dashboard' ? 'text-[#1C1C1E]' : 'text-[#8E8E93]'}`}
      >
        <Home size={24} strokeWidth={currentView === 'dashboard' ? 2 : 1.5} />
        <span className="font-sans text-[10px] font-medium tracking-wide">Home</span>
      </button>
      
      <button 
        onClick={() => setCurrentView('dashboard')}
        className="w-[56px] h-[56px] rounded-full bg-[#B89C85] text-white flex items-center justify-center -mt-8 border-[4px] border-[#FDFCFB] transition-transform active:scale-95 shadow-md"
      >
        <Plus size={28} strokeWidth={2} />
      </button>
      
      <button 
        onClick={() => setCurrentView('activity')}
        className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'activity' ? 'text-[#1C1C1E]' : 'text-[#8E8E93]'}`}
      >
        <Bell size={24} strokeWidth={currentView === 'activity' ? 2 : 1.5} />
        <span className="font-sans text-[10px] font-medium tracking-wide">Activity</span>
      </button>
    </div>
  );
}
