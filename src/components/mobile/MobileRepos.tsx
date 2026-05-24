import { ChevronLeft, Search, Filter, Github, Star } from "lucide-react";
import { useAstra } from "../../context/AstraContext";
import { useState } from "react";

export function MobileRepos() {
  const { setCurrentView } = useAstra();
  const [filter, setFilter] = useState('All');

  return (
    <div className="flex flex-col bg-[#FDFCFB] min-h-dvh h-full relative overflow-y-auto pb-32">
      <header className="sticky top-0 px-5 py-4 flex items-center bg-[#FDFCFB] z-10">
         <button onClick={() => setCurrentView('dashboard')} className="p-1 -ml-1"><ChevronLeft size={24} className="text-[#1C1C1E]" /></button>
         <h1 className="ml-2 font-bold text-[15px] text-[#1C1C1E] flex-1 text-center pr-6">Repositories</h1>
         <div className="w-6" /> {/* spacer for centering */}
      </header>

      <div className="px-5 mt-4">
         <div className="flex gap-2">
            <div className="relative flex items-center flex-1">
               <Search className="absolute left-4 w-4 h-4 text-[#8E8E93]" />
               <input 
                  type="text" 
                  placeholder="Search repositories..."
                  className="w-full bg-[#F5F4F1] border-none rounded-2xl py-3 pl-10 pr-4 text-[14px] text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-none"
               />
            </div>
            <button className="bg-[#F5F4F1] rounded-2xl w-12 flex items-center justify-center shrink-0">
               <Filter size={18} className="text-[#1C1C1E]" />
            </button>
         </div>

         <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
            {['All', 'Analyzed', 'Starred', 'Forks'].map(f => (
               <button 
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors ${filter === f ? 'bg-[#1C1C1E] text-white' : 'bg-[#F5F4F1] text-[#1C1C1E]'}`}
               >
                 {f}
               </button>
            ))}
         </div>

         <div className="flex flex-col gap-3 mt-6">
            <div className="bg-white p-4 rounded-2xl border border-[#F0EFEB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex justify-between items-center relative">
               <div className="flex gap-3 items-start">
                  <div className="mt-1"><Github size={20} className="text-[#1C1C1E]" /></div>
                  <div className="flex flex-col">
                     <span className="font-bold text-[14px] text-[#1C1C1E]">next-app</span>
                     <span className="text-[12px] text-[#8E8E93]">astra/next-app</span>
                     <span className="text-[11px] text-[#8E8E93] mt-1">Last analyzed 2m ago</span>
                  </div>
               </div>
               <Star size={18} className="text-[#D97706] fill-[#D97706]" />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#F0EFEB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex justify-between items-center relative">
               <div className="flex gap-3 items-start">
                  <div className="mt-1"><Github size={20} className="text-[#1C1C1E]" /></div>
                  <div className="flex flex-col">
                     <span className="font-bold text-[14px] text-[#1C1C1E]">design-system</span>
                     <span className="text-[12px] text-[#8E8E93]">astra/design-system</span>
                     <span className="text-[11px] text-[#8E8E93] mt-1">Last analyzed 1d ago</span>
                  </div>
               </div>
               <Star size={18} className="text-[#E5E5EA]" />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#F0EFEB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex justify-between items-center relative">
               <div className="flex gap-3 items-start">
                  <div className="mt-1"><Github size={20} className="text-[#1C1C1E]" /></div>
                  <div className="flex flex-col">
                     <span className="font-bold text-[14px] text-[#1C1C1E]">backend-service</span>
                     <span className="text-[12px] text-[#8E8E93]">astra/backend-service</span>
                     <span className="text-[11px] text-[#8E8E93] mt-1">Last analyzed 3d ago</span>
                  </div>
               </div>
               <Star size={18} className="text-[#E5E5EA]" />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#F0EFEB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex justify-between items-center relative">
               <div className="flex gap-3 items-start">
                  <div className="mt-1"><Github size={20} className="text-[#1C1C1E]" /></div>
                  <div className="flex flex-col">
                     <span className="font-bold text-[14px] text-[#1C1C1E]">mobile-app</span>
                     <span className="text-[12px] text-[#8E8E93]">astra/mobile-app</span>
                     <span className="text-[11px] text-[#8E8E93] mt-1">Last analyzed 1w ago</span>
                  </div>
               </div>
               <Star size={18} className="text-[#E5E5EA]" />
            </div>
         </div>
      </div>
    </div>
  );
}
