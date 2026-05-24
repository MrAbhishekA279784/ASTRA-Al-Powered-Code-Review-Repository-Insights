import React, { useState } from 'react';
import { Activity, GitPullRequest, ArrowRight } from 'lucide-react';
import { useAstra } from '../context/AstraContext';

export function Dashboard() {
  const { analyzePR, isAnalyzing, showToast } = useAstra();
  const [url, setUrl] = useState('');

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      analyzePR(url);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto w-full px-8">
      <div className="flex flex-col items-center text-center gap-6 w-full fade-in">
        <h1 className="text-4xl font-light italic font-serif text-astra-text">
          Good morning.
        </h1>
        <p className="text-sm font-sans tracking-widest uppercase text-astra-muted">
          AI-powered code reviews for better software.
        </p>

        <form onSubmit={handleAnalyze} className="w-full mt-8 relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste GitHub URL (PR)..."
            className="w-full bg-astra-elevated border border-astra-border p-4 pr-16 text-sm focus:outline-none focus:border-astra-text text-astra-text placeholder:text-astra-tertiary transition-colors font-sans"
            disabled={isAnalyzing}
          />
          <button
            type="submit"
            disabled={isAnalyzing || !url}
            className="absolute right-2 top-2 bottom-2 px-4 bg-astra-text text-astra-elevated hover:bg-astra-purple-light transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {isAnalyzing ? (
              <span className="w-5 h-5 border-2 border-astra-elevated border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </form>

        <div className="grid grid-cols-2 gap-4 w-full mt-12 font-sans">
          <div 
            onClick={() => showToast('No recent pull requests found in local history')}
            className="p-6 border border-astra-border bg-astra-elevated flex flex-col gap-4 text-left group hover:border-astra-text transition-colors cursor-pointer"
          >
            <GitPullRequest className="w-5 h-5 text-astra-muted group-hover:text-astra-text transition-colors" />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-astra-text">Recent PRs</span>
              <span className="text-[10px] text-astra-muted uppercase tracking-wider">No recent PRs</span>
            </div>
          </div>
          <div 
            onClick={() => showToast('All systems are operational', 'success')}
            className="p-6 border border-astra-border bg-astra-elevated flex flex-col gap-4 text-left group hover:border-astra-text transition-colors cursor-pointer"
          >
            <Activity className="w-5 h-5 text-astra-muted group-hover:text-astra-text transition-colors" />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-astra-text">System Status</span>
              <span className="text-[10px] text-astra-muted uppercase tracking-wider text-astra-success">Online & Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
