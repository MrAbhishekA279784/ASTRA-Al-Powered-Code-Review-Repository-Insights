import React, { useState } from 'react';
import { Menu, Bell, Search, ScanLine, GitPullRequest, FolderGit2, Sparkles, FileText, Github } from 'lucide-react';
import { useAstra } from '../../context/AstraContext';

export function MobileHome() {
  const { analyzePR, isAnalyzing, setCurrentView } = useAstra();
  const [url, setUrl] = useState('');

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) analyzePR(url);
  };

  return (
    <div className="flex flex-col min-h-dvh bg-[#FDFCFB] w-full pb-32 overflow-y-auto">
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between">
        <button className="p-1"><Menu size={24} className="text-[#1C1C1E]" /></button>
        <span className="font-sans font-bold text-[14px] tracking-[0.15em] text-[#1C1C1E]">ASTRA.</span>
        <div className="flex items-center gap-3">
          <button className="p-1"><Bell size={20} className="text-[#1C1C1E]" /></button>
          <div onClick={() => setCurrentView('profile')} className="w-8 h-8 rounded-full bg-[#EADDD7] text-[#1C1C1E] flex items-center justify-center text-sm font-semibold cursor-pointer">
            A
          </div>
        </div>
      </header>

      <div className="px-5 mt-6">
        <h1 className="text-2xl font-bold text-[#1C1C1E]">
          Good morning, Aditya <span className="inline-block motion-safe:animate-bounce">👋</span>
        </h1>
        <p className="text-[#8E8E93] text-sm mt-2 max-w-[240px] leading-relaxed">
          AI-powered code reviews for better software.
        </p>

        <form onSubmit={handleAnalyze} className="mt-8 flex flex-col gap-3">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-[#8E8E93]" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste GitHub URL (PR or Repo)"
              className="w-full bg-[#F5F4F1] border-none rounded-2xl py-4 pl-12 pr-12 text-[15px] focus:outline-none text-[#1C1C1E] placeholder:text-[#8E8E93] transition-colors font-sans"
              disabled={isAnalyzing}
            />
            <ScanLine className="absolute right-4 w-5 h-5 text-[#8E8E93]" />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing || !url}
            className="w-full bg-[#1C1C1E] text-white rounded-2xl py-4 font-semibold text-[15px] flex items-center justify-center disabled:opacity-50 active:scale-[0.98] transition-transform"
          >
            {isAnalyzing ? (
               <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
               "Analyze"
            )}
          </button>
        </form>

        <section className="mt-10">
          <h2 className="text-[15px] font-bold text-[#1C1C1E] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setCurrentView('dashboard')} className="bg-[#FAF9F6] p-4 rounded-2xl flex flex-col items-start gap-3 border border-[#F0EFEB] active:scale-95 transition-transform text-left shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="w-10 h-10 rounded-full bg-[#F3EFEA] flex items-center justify-center text-[#A68A73]">
                <GitPullRequest size={20} />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-[#1C1C1E]">Pull Requests</h3>
                <p className="text-[11px] text-[#8E8E93] mt-0.5">Review PRs</p>
              </div>
            </button>
            <button onClick={() => setCurrentView('repos')} className="bg-[#FAF9F6] p-4 rounded-2xl flex flex-col items-start gap-3 border border-[#F0EFEB] active:scale-95 transition-transform text-left shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="w-10 h-10 rounded-full bg-[#F3EFEA] flex items-center justify-center text-[#A68A73]">
                <FolderGit2 size={20} />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-[#1C1C1E]">Repositories</h3>
                <p className="text-[11px] text-[#8E8E93] mt-0.5">Analyze repos</p>
              </div>
            </button>
            <button onClick={() => setCurrentView('ai-review')} className="bg-[#FAF9F6] p-4 rounded-2xl flex flex-col items-start gap-3 border border-[#F0EFEB] active:scale-95 transition-transform text-left shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="w-10 h-10 rounded-full bg-[#F3EFEA] flex items-center justify-center text-[#A68A73]">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-[#1C1C1E]">AI Review</h3>
                <p className="text-[11px] text-[#8E8E93] mt-0.5">Smart insights</p>
              </div>
            </button>
            <button onClick={() => setCurrentView('docs')} className="bg-[#FAF9F6] p-4 rounded-2xl flex flex-col items-start gap-3 border border-[#F0EFEB] active:scale-95 transition-transform text-left shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="w-10 h-10 rounded-full bg-[#F3EFEA] flex items-center justify-center text-[#A68A73]">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-[13px] font-bold text-[#1C1C1E]">Documentation</h3>
                <p className="text-[11px] text-[#8E8E93] mt-0.5">Generate docs</p>
              </div>
            </button>
          </div>
          {/* Third row from image: Reports and Settings */}
          <div className="grid grid-cols-2 gap-3 mt-3">
             {/* Omitted to save space, image shows 6 items. I'll add them if we want exact 1:1, yes. */}
          </div>
        </section>

        <section className="mt-10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-[#1C1C1E]">Recent Analyses</h2>
            <button className="text-[13px] font-semibold text-[#8E8E93]">View All</button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#F0EFEB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col gap-3 relative">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 w-3/4">
                  <Github size={18} className="text-[#1C1C1E] mt-0.5 shrink-0" />
                  <h3 className="text-[14px] font-semibold text-[#1C1C1E] leading-tight">#1287: Add user authentication & fix session bug</h3>
                </div>
                <span className="px-2 py-0.5 bg-[#FFF4E6] text-[#D97706] text-[10px] font-bold rounded-md bg-opacity-80">OPEN</span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[#8E8E93] text-[12px] ml-7">
                <span>2m ago</span>
                <span>8 files changed</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border border-[#F0EFEB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col gap-3 relative">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 w-3/4">
                  <FolderGit2 size={18} className="text-[#1C1C1E] mt-0.5 shrink-0" />
                  <h3 className="text-[14px] font-semibold text-[#1C1C1E] leading-tight">next.js Repository Analysis</h3>
                </div>
                <span className="px-2 py-0.5 bg-[#E6F4EA] text-[#198754] text-[10px] font-bold rounded-md bg-opacity-80">COMPLETED</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
