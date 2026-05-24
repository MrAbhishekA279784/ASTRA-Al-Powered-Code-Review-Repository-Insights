import { CodeDiff } from "./CodeDiff";
import { AIReview } from "./AIReview";
import { MetricsBar } from "./MetricsBar";
import { Calendar } from "lucide-react";
import { useAstra } from "../context/AstraContext";
import { useState } from "react";

export function PrMain() {
  const { prData } = useAstra();
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'commits'>('files');

  if (!prData) return null;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
      
      {/* Title & Meta */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black tracking-tighter uppercase font-sans text-astra-text">
            {prData.title}
          </h1>
          <span className="flex items-center gap-1.5 px-3 py-1 font-sans text-[10px] uppercase font-bold rounded-full bg-astra-purple-light/10 border border-astra-purple-light/30 text-astra-purple-light tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-astra-purple-light"></span>
            Open
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-sans text-astra-muted">
          <span className="text-astra-text font-bold">{prData.repo}</span>
          <span className="text-astra-border-hover">|</span>
          <span>{prData.head}</span>
          <span>&rarr;</span>
          <span>{prData.base}</span>
          <span className="text-astra-border-hover">|</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Recently
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-astra-border text-[11px] uppercase tracking-widest font-sans font-bold overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`pb-3 whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'text-astra-text border-b-2 border-astra-purple' : 'text-astra-muted hover:text-astra-text'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('files')} 
          className={`pb-3 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'files' ? 'text-astra-text border-b-2 border-astra-purple' : 'text-astra-muted hover:text-astra-text'}`}
        >
          Files <span className="px-1.5 py-0.5 text-[9px] bg-astra-hover rounded-md text-astra-muted border border-astra-border">{prData.changedFiles}</span>
        </button>
        <button 
          onClick={() => setActiveTab('commits')} 
          className={`pb-3 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'commits' ? 'text-astra-text border-b-2 border-astra-purple' : 'text-astra-muted hover:text-astra-text'}`}
        >
          Commits <span className="px-1.5 py-0.5 text-[9px] bg-astra-hover rounded-md text-astra-muted border border-astra-border">{prData.commits}</span>
        </button>
      </div>

      {/* Main Content Flow */}
      {activeTab === 'files' && (
        <>
          <CodeDiff diffText={prData.diff} />
          <AIReview />
          <MetricsBar />
        </>
      )}

      {activeTab === 'overview' && (
        <div className="p-8 border border-astra-border bg-astra-elevated text-sm leading-relaxed font-sans text-astra-text">
           {prData.body || "No description provided."}
        </div>
      )}

      {activeTab === 'commits' && (
         <div className="p-8 border border-astra-border bg-astra-elevated text-sm font-sans flex flex-col items-center justify-center text-astra-muted italic py-16">
           Commit details are not available in this view.
         </div>
      )}

    </div>
  );
}
