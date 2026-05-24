import { ChevronLeft, User, Github, Bell, Palette, Shield, ChevronRight, PenLine } from "lucide-react";
import { useAstra } from "../../context/AstraContext";

export function MobileProfile() {
  const { setCurrentView } = useAstra();
  return (
    <div className="flex flex-col bg-[#FDFCFB] min-h-dvh h-full relative overflow-y-auto pb-32">
      <header className="sticky top-0 px-5 py-4 flex items-center bg-[#FDFCFB] z-10 text-[#1C1C1E]">
         <button onClick={() => setCurrentView('dashboard')} className="p-1 -ml-1"><ChevronLeft size={24} /></button>
         <h1 className="ml-2 font-bold text-[15px] flex-1 text-center pr-6">Profile</h1>
         <div className="w-6" /> {/* spacer */}
      </header>

      <div className="flex flex-col items-center mt-6">
         <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#EADDD7] border-4 border-white shadow-sm flex items-center justify-center text-[36px] font-bold text-[#1C1C1E]">
               A
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1C1C1E] text-white flex items-center justify-center border-2 border-white shadow-sm">
               <PenLine size={14} />
            </button>
         </div>
         <h2 className="mt-4 font-bold text-[20px] text-[#1C1C1E]">Aditya Verma</h2>
         <p className="text-[#8E8E93] text-[13px] mt-1">aditya.verma@tcet.edu</p>
      </div>

      <div className="mx-5 my-8 bg-white border border-[#F0EFEB] rounded-2xl flex items-center justify-between p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] divide-x divide-[#F0EFEB]">
         <div className="flex flex-col items-center flex-1">
            <span className="text-[#8E8E93] text-[11px] font-medium mb-1">Reviews</span>
            <span className="text-[#1C1C1E] font-bold text-[18px]">128</span>
         </div>
         <div className="flex flex-col items-center flex-1">
            <span className="text-[#8E8E93] text-[11px] font-medium mb-1">Repositories</span>
            <span className="text-[#1C1C1E] font-bold text-[18px]">24</span>
         </div>
         <div className="flex flex-col items-center flex-1">
            <span className="text-[#8E8E93] text-[11px] font-medium mb-1">Score</span>
            <span className="text-[#198754] font-bold text-[18px]">87</span>
         </div>
      </div>

      <div className="px-5 mb-8 flex flex-col gap-1">
         <button className="flex items-center justify-between p-4 bg-white hover:bg-[#FAF9F6] border border-transparent rounded-2xl transition-colors group">
            <div className="flex items-center gap-3">
               <User size={20} className="text-[#1C1C1E]" strokeWidth={1.5} />
               <span className="text-[#1C1C1E] font-semibold text-[14px]">Account Settings</span>
            </div>
            <ChevronRight size={18} className="text-[#8E8E93] group-hover:text-[#1C1C1E] transition-colors" />
         </button>
         <button className="flex items-center justify-between p-4 bg-white hover:bg-[#FAF9F6] border border-transparent rounded-2xl transition-colors group">
            <div className="flex items-center gap-3">
               <Github size={20} className="text-[#1C1C1E]" strokeWidth={1.5} />
               <span className="text-[#1C1C1E] font-semibold text-[14px]">GitHub Integration</span>
            </div>
            <ChevronRight size={18} className="text-[#8E8E93] group-hover:text-[#1C1C1E] transition-colors" />
         </button>
         <button className="flex items-center justify-between p-4 bg-white hover:bg-[#FAF9F6] border border-transparent rounded-2xl transition-colors group">
            <div className="flex items-center gap-3">
               <Bell size={20} className="text-[#1C1C1E]" strokeWidth={1.5} />
               <span className="text-[#1C1C1E] font-semibold text-[14px]">Notifications</span>
            </div>
            <ChevronRight size={18} className="text-[#8E8E93] group-hover:text-[#1C1C1E] transition-colors" />
         </button>
         <button className="flex items-center justify-between p-4 bg-white hover:bg-[#FAF9F6] border border-transparent rounded-2xl transition-colors group">
            <div className="flex items-center gap-3">
               <Palette size={20} className="text-[#1C1C1E]" strokeWidth={1.5} />
               <span className="text-[#1C1C1E] font-semibold text-[14px]">Appearance</span>
            </div>
            <ChevronRight size={18} className="text-[#8E8E93] group-hover:text-[#1C1C1E] transition-colors" />
         </button>
         <button className="flex items-center justify-between p-4 bg-white hover:bg-[#FAF9F6] border border-transparent rounded-2xl transition-colors group">
            <div className="flex items-center gap-3">
               <Shield size={20} className="text-[#1C1C1E]" strokeWidth={1.5} />
               <span className="text-[#1C1C1E] font-semibold text-[14px]">Privacy & Security</span>
            </div>
            <ChevronRight size={18} className="text-[#8E8E93] group-hover:text-[#1C1C1E] transition-colors" />
         </button>
      </div>
    </div>
  );
}
