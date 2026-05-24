import { ChevronLeft, Share, MoreHorizontal, Github, FileCode, Maximize2 } from "lucide-react";
import { useAstra } from "../../context/AstraContext";
import { CodeDiff } from "../CodeDiff";
import { useState } from "react";

export function MobilePRView() {
  const { prData, reviewData, setCurrentView, showToast } = useAstra();
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'commits' | 'checks'>('files');

  if (!prData || !reviewData) return null;

  return (
    <div className="flex flex-col w-full min-h-dvh bg-[#FDFCFB] overflow-y-auto pb-32 font-sans relative">
      <header className="sticky top-0 flex items-center justify-between px-5 py-4 bg-[#FDFCFB] z-40">
        <button className="p-1 -ml-1 text-[#1C1C1E]" onClick={() => setCurrentView('dashboard')}><ChevronLeft size={24} /></button>
        <span className="font-bold text-[15px] text-[#1C1C1E]">PR {prData.title?.substring(0, 5) || '#1287'}</span>
        <div className="flex gap-3 text-[#1C1C1E]">
          <button className="p-1" onClick={() => showToast('Link copied to clipboard', 'success')}><Share size={20} /></button>
          <button className="p-1 -mr-1" onClick={() => showToast('More options not available')}><MoreHorizontal size={20} /></button>
        </div>
      </header>

      <div className="px-5 py-4 flex flex-col gap-3">
        <span className="w-fit px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#FFF4E6] text-[#D97706]">OPEN</span>
        <h1 className="text-[22px] font-bold text-[#1C1C1E] leading-tight">
          {prData.title || "Add user authentication & fix session bug"}
        </h1>
        <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1C1C1E] mt-1">
          <Github size={16} /> {prData.repo || "astra/next-app"}
        </div>
      </div>

      <div className="mx-5 my-4 bg-white rounded-2xl p-4 border border-[#F0EFEB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-[#1C1C1E] font-bold text-[14px]">{prData.base || "Main"}</span>
            <span className="text-[#8E8E93] text-[11px]">base</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#1C1C1E] font-bold text-[14px]">{prData.head || "auth-fix"}</span>
            <span className="text-[#8E8E93] text-[11px]">head</span>
          </div>
        </div>
        <div className="flex gap-4 border-l border-[#F0EFEB] pl-4">
          <div className="flex flex-col items-end">
            <span className="text-[#198754] font-medium text-[14px]">+{prData.additions || "245"}</span>
            <span className="text-[#8E8E93] text-[11px]">Changes</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[#D92D20] font-medium text-[14px]">-{prData.deletions || "123"}</span>
            <span className="text-[#8E8E93] text-[11px] invisible">Changes</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-2 border-b border-[#F0EFEB] flex gap-6 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`pb-3 text-[13px] font-semibold whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'text-[#1C1C1E] border-b-2 border-[#1C1C1E]' : 'text-[#8E8E93]'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('files')} 
          className={`pb-3 text-[13px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === 'files' ? 'text-[#1C1C1E] border-b-2 border-[#1C1C1E]' : 'text-[#8E8E93]'}`}
        >
          Files <span className="px-1.5 py-0.5 rounded-full bg-[#F5F4F1] text-[#1C1C1E] text-[10px]">{prData.changedFiles || 8}</span>
        </button>
        <button 
          onClick={() => setActiveTab('commits')} 
          className={`pb-3 text-[13px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === 'commits' ? 'text-[#1C1C1E] border-b-2 border-[#1C1C1E]' : 'text-[#8E8E93]'}`}
        >
          Commits <span className="px-1.5 py-0.5 rounded-full bg-[#F5F4F1] text-[#1C1C1E] text-[10px]">{prData.commits || 5}</span>
        </button>
        <button 
          onClick={() => setActiveTab('checks')} 
          className={`pb-3 text-[13px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === 'checks' ? 'text-[#1C1C1E] border-b-2 border-[#1C1C1E]' : 'text-[#8E8E93]'}`}
        >
          Checks <span className="px-1.5 py-0.5 rounded-full bg-[#F5F4F1] text-[#1C1C1E] text-[10px]">12</span>
        </button>
      </div>

      {activeTab === 'files' && (
        <div className="mx-5 mt-6 bg-white rounded-2xl border border-[#F0EFEB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-3 border-b border-[#F0EFEB] flex items-center justify-between bg-[#FDFCFB]">
             <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center rounded bg-[#F0EBF4] text-[#7A40A8] font-bold text-[10px]">TS</span>
                <span className="text-[12px] font-medium text-[#1C1C1E]">src/controllers/auth.controller.ts</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[11px] font-medium">
                   <span className="text-[#198754]">+45</span>
                   <span className="text-[#D92D20]">-23</span>
                </div>
             </div>
          </div>
          <div className="p-3 bg-[#FDFCFB] flex justify-center gap-2 border-b border-[#F0EFEB]">
             <div className="flex bg-[#F5F4F1] rounded-lg p-1 w-full max-w-[200px]">
                <button className="flex-1 py-1.5 bg-white text-[#1C1C1E] rounded-md shadow-sm text-[12px] font-semibold">Unified</button>
                <button className="flex-1 py-1.5 text-[#8E8E93] text-[12px] font-semibold">Split</button>
             </div>
             <button className="p-2 ml-2 text-[#8E8E93] hover:text-[#1C1C1E]"><Maximize2 size={16} /></button>
          </div>
          <div className="font-mono text-[11px] overflow-x-auto w-full [&>div]:min-w-full">
            <CodeDiff diffText={prData.diff} />
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="mx-5 mt-6 bg-white p-4 rounded-2xl border border-[#F0EFEB] text-[14px] leading-relaxed text-[#1C1C1E] whitespace-pre-wrap">
          {prData.body || "No description provided."}
        </div>
      )}

      {activeTab === 'commits' && (
        <div className="mx-5 mt-6 text-center text-[#8E8E93] py-10">
          Commits detail view not implemented in mobile preview.
        </div>
      )}
      
      {activeTab === 'checks' && (
        <div className="mx-5 mt-6 text-center text-[#8E8E93] py-10">
          All checks have passed.
        </div>
      )}
    </div>
  );
}
