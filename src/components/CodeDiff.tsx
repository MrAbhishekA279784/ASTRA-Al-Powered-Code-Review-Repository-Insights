import { Maximize2, GitMerge } from "lucide-react";
import { useState } from "react";

export function CodeDiff({ diffText }: { diffText?: string }) {
  const [view, setView] = useState<'unified' | 'split'>('unified');

  if (!diffText) return null;

  // Simple diff renderer based on lines
  const lines = diffText.split('\n');

  return (
    <div className="rounded-xl border border-astra-border bg-astra-elevated overflow-hidden flex flex-col font-mono text-[13px] leading-relaxed">
      {/* Diff Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-astra-border bg-astra-hover">
        <div className="flex items-center gap-3">
          <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-astra-info bg-astra-info/10"><GitMerge className="w-3 h-3" /></span>
          <span className="text-astra-text font-medium text-sm font-sans">PR diff.patch</span>
        </div>
        <div className="flex items-center gap-2 font-sans">
          <div className="flex rounded-md border border-astra-border bg-astra-elevated overflow-hidden">
            <button 
              className={`px-3 py-1 text-xs ${view === 'split' ? 'bg-astra-border text-astra-text' : 'text-astra-muted hover:text-astra-text'}`}
              onClick={() => setView('split')}
            >Split</button>
            <button 
              className={`px-3 py-1 text-xs ${view === 'unified' ? 'bg-astra-border text-astra-text' : 'text-astra-muted hover:text-astra-text'}`}
              onClick={() => setView('unified')}
            >Unified</button>
          </div>
          <button className="p-1.5 text-astra-muted hover:text-astra-text rounded-md hover:bg-astra-hover">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Diff Body Container */}
      <div className="flex bg-astra-elevated overflow-x-auto p-4 max-h-[600px] overflow-y-auto">
        <pre className="text-astra-text">
          {lines.map((line, idx) => {
            let colorClass = "text-astra-text";
            let bgClass = "";
            if (line.startsWith('+') && !line.startsWith('+++')) {
              colorClass = "text-[#1B5E20]";
              bgClass = "bg-astra-diff-add/40";
            } else if (line.startsWith('-') && !line.startsWith('---')) {
              colorClass = "text-[#C62828]";
              bgClass = "bg-astra-diff-del/40";
            } else if (line.startsWith('@@')) {
              colorClass = "text-astra-purple-light opacity-70";
            } else if (line.startsWith('diff') || line.startsWith('index')) {
              colorClass = "text-astra-muted font-bold";
            }

            return (
              <div key={idx} className={`w-full ${bgClass}`}>
                <span className={colorClass}>{line}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
