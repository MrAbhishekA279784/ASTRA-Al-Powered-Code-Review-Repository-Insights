import { Menu, Settings, Check, Sparkles, FolderGit2, TestTube2, GitPullRequest } from "lucide-react";
import { useState } from "react";

export function MobileActivity() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="flex flex-col bg-[#FDFCFB] min-h-dvh h-full relative overflow-y-auto pb-32">
      <header className="sticky top-0 px-5 py-4 flex items-center justify-between bg-[#FDFCFB] z-10 text-[#1C1C1E]">
         <button className="p-1 -ml-1"><Menu size={24} /></button>
         <h1 className="font-bold text-[15px] text-center">Activity</h1>
         <button className="p-1 -mr-1"><Settings size={20} /></button>
      </header>

      <div className="px-5 mt-4">
         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {['All', 'PRs', 'Repos', 'Reviews', 'Docs'].map(f => (
               <button 
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors ${filter === f ? 'bg-[#1C1C1E] text-white' : 'bg-[#F5F4F1] text-[#1C1C1E]'}`}
               >
                 {f}
               </button>
            ))}
         </div>

         <div className="mt-6 flex flex-col gap-6">
            <section>
               <h3 className="text-[13px] font-semibold text-[#8E8E93] mb-4">Today</h3>
               <div className="flex flex-col gap-5">
                  <div className="flex gap-4 items-start relative">
                     <div className="w-10 h-10 rounded-full bg-[#E6F4EA] flex items-center justify-center shrink-0">
                        <GitPullRequest size={18} className="text-[#198754]" />
                     </div>
                     <div className="flex flex-col flex-1 pb-4 border-b border-[#F0EFEB]">
                        <div className="flex justify-between items-start">
                           <h4 className="font-bold text-[14px] text-[#1C1C1E]">PR #1287 analyzed</h4>
                           <span className="text-[11px] text-[#8E8E93]">2m ago</span>
                        </div>
                        <p className="text-[12px] text-[#8E8E93] mt-0.5">8 files changed, 4 issues found</p>
                     </div>
                  </div>

                  <div className="flex gap-4 items-start relative">
                     <div className="w-10 h-10 rounded-full bg-[#E6F4EA] flex items-center justify-center shrink-0">
                        <Check size={18} className="text-[#198754]" />
                     </div>
                     <div className="flex flex-col flex-1 pb-4 border-b border-[#F0EFEB]">
                        <div className="flex justify-between items-start">
                           <h4 className="font-bold text-[14px] text-[#1C1C1E]">Documentation generated</h4>
                           <span className="text-[11px] text-[#8E8E93]">15m ago</span>
                        </div>
                        <p className="text-[12px] text-[#8E8E93] mt-0.5">README.md created</p>
                     </div>
                  </div>

                  <div className="flex gap-4 items-start relative">
                     <div className="w-10 h-10 rounded-full bg-[#F5F4F1] flex items-center justify-center shrink-0">
                        <Sparkles size={18} className="text-[#1C1C1E]" />
                     </div>
                     <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start">
                           <h4 className="font-bold text-[14px] text-[#1C1C1E]">AI review completed</h4>
                           <span className="text-[11px] text-[#8E8E93]">1h ago</span>
                        </div>
                        <p className="text-[12px] text-[#8E8E93] mt-0.5">PR #1285 review finished</p>
                     </div>
                  </div>
               </div>
            </section>

            <section className="mt-2">
               <h3 className="text-[13px] font-semibold text-[#8E8E93] mb-4">Yesterday</h3>
               <div className="flex flex-col gap-5">
                  <div className="flex gap-4 items-start relative">
                     <div className="w-10 h-10 rounded-full bg-[#EBF0FF] flex items-center justify-center shrink-0">
                        <FolderGit2 size={18} className="text-[#3B82F6]" />
                     </div>
                     <div className="flex flex-col flex-1 pb-4 border-b border-[#F0EFEB]">
                        <div className="flex justify-between items-start">
                           <h4 className="font-bold text-[14px] text-[#1C1C1E]">Repository analyzed</h4>
                           <span className="text-[11px] text-[#8E8E93]">1d ago</span>
                        </div>
                        <p className="text-[12px] text-[#8E8E93] mt-0.5">next-app repository scan</p>
                     </div>
                  </div>

                  <div className="flex gap-4 items-start relative">
                     <div className="w-10 h-10 rounded-full bg-[#EBF0FF] flex items-center justify-center shrink-0">
                        <TestTube2 size={18} className="text-[#3B82F6]" />
                     </div>
                     <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start">
                           <h4 className="font-bold text-[14px] text-[#1C1C1E]">Mock tests generated</h4>
                           <span className="text-[11px] text-[#8E8E93]">1d ago</span>
                        </div>
                        <p className="text-[12px] text-[#8E8E93] mt-0.5">32 tests created</p>
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}
