import { AlertCircle, AlertTriangle, Info, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import { useAstra } from "../context/AstraContext";
import { useState } from "react";

const SeverityIcon: Record<string, any> = {
  High: AlertCircle,
  critical: AlertCircle,
  Medium: AlertTriangle,
  major: AlertTriangle,
  Low: AlertTriangle,
  minor: AlertTriangle,
  Info: Info,
  info: Info,
};

const SeverityColor: Record<string, string> = {
  High: "text-astra-critical",
  critical: "text-astra-critical",
  Medium: "text-astra-major",
  major: "text-astra-major",
  Low: "text-astra-minor",
  minor: "text-astra-minor",
  Info: "text-astra-info",
  info: "text-astra-info",
};

export function AIReview() {
  const { reviewData, showToast } = useAstra();
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  if (!reviewData || !reviewData.issuesFound) return null;

  const allIssues = reviewData.issuesFound;
  
  const getSeverity = (sev: string): 'High' | 'Medium' | 'Low' | 'Other' => {
      const s = sev.toLowerCase();
      if (s === 'high' || s === 'critical') return 'High';
      if (s === 'medium' || s === 'major') return 'Medium';
      if (s === 'low' || s === 'minor') return 'Low';
      return 'Other';
  }

  const issues = allIssues.filter((issue: any) => filter === 'All' || getSeverity(issue.severity) === filter);

  const highCount = allIssues.filter((i: any) => getSeverity(i.severity) === 'High').length;
  const medCount = allIssues.filter((i: any) => getSeverity(i.severity) === 'Medium').length;
  const lowCount = allIssues.filter((i: any) => getSeverity(i.severity) === 'Low').length;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-end justify-between mb-2">
        <div className="flex items-center gap-4">
          <h2 className="text-4xl font-light italic leading-tight font-serif text-astra-text">AI Review</h2>
          <span className="px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-widest bg-astra-elevated text-astra-text border border-astra-border">
            {allIssues.length} issues
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest font-sans text-astra-muted">
          <span>Sort by:</span>
          <button className="flex items-center gap-1 hover:text-astra-text transition-colors border-b border-astra-text text-astra-text pb-0.5">
            Severity
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 font-sans border-b border-astra-border pb-4 overflow-x-auto no-scrollbar">
        <button 
           onClick={() => setFilter('All')}
           className={cn("flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold whitespace-nowrap", filter === 'All' ? "text-astra-text border-b-2 border-astra-purple-light pb-1" : "text-astra-muted hover:text-astra-text pb-1")}
        >
          All <span className="px-1.5 py-0.5 bg-astra-hover text-[9px] border border-astra-border">{allIssues.length}</span>
        </button>
        {highCount > 0 && <button 
           onClick={() => setFilter('High')}
           className={cn("flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold whitespace-nowrap", filter === 'High' ? "text-astra-text border-b-2 border-astra-purple-light pb-1" : "text-astra-muted hover:text-astra-text pb-1")}
        >
          High <span className="px-1.5 py-0.5 bg-astra-hover text-[9px] border border-astra-border text-astra-critical">{highCount}</span>
        </button>}
        {medCount > 0 && <button 
           onClick={() => setFilter('Medium')}
           className={cn("flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold whitespace-nowrap", filter === 'Medium' ? "text-astra-text border-b-2 border-astra-purple-light pb-1" : "text-astra-muted hover:text-astra-text pb-1")}
        >
          Medium <span className="px-1.5 py-0.5 bg-astra-hover text-[9px] border border-astra-border text-astra-major">{medCount}</span>
        </button>}
        {lowCount > 0 && <button 
           onClick={() => setFilter('Low')}
           className={cn("flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold whitespace-nowrap", filter === 'Low' ? "text-astra-text border-b-2 border-astra-purple-light pb-1" : "text-astra-muted hover:text-astra-text pb-1")}
        >
          Low <span className="px-1.5 py-0.5 bg-astra-hover text-[9px] border border-astra-border text-astra-success">{lowCount}</span>
        </button>}
      </div>

      {/* Issue List */}
      <div className="flex flex-col border border-astra-border rounded-none bg-astra-elevated divide-y divide-astra-border">
        {issues.map((issue: any, index: number) => {
          const Icon = SeverityIcon[issue.severity] || Info;
          const colorClass = SeverityColor[issue.severity] || "text-astra-muted";
          
          return (
            <div key={issue.id || index} className="p-6 flex items-start gap-6 hover:bg-astra-hover transition-colors">
              <Icon className={cn("w-5 h-5 mt-1 shrink-0", colorClass)} />
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3 font-sans">
                  <span className="font-black text-astra-text text-[14px] uppercase tracking-tight">{issue.title}</span>
                  <span className={cn("flex items-center gap-1.5 px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest border border-astra-border", colorClass)}>
                    {issue.severity}
                  </span>
                </div>
                <p className="text-sm text-astra-tertiary italic leading-relaxed font-serif">
                  {issue.description}
                </p>
              </div>
              <div className="flex items-center gap-6 shrink-0 pl-4 font-sans flex-col md:flex-row">
                <span className="text-[11px] uppercase tracking-widest font-bold text-astra-muted truncate w-[120px]" title={issue.file}>{issue.file}</span>
                <div className="flex items-center border border-astra-border bg-astra-elevated">
                  <button onClick={() => showToast('AI Fix logic not implemented', 'info')} className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-astra-text hover:bg-astra-text hover:text-astra-elevated transition-colors border-r border-astra-border">View Fix</button>
                  <button onClick={() => showToast('No additional options', 'info')} className="px-3 py-2 hover:bg-astra-hover transition-colors text-astra-text">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {issues.length === 0 && (
           <div className="p-6 text-center text-astra-muted italic font-serif">No issues found for this filter.</div>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button onClick={() => showToast('Chat functionality available in the right panel.')} className="flex items-center gap-3 px-8 py-3 border border-astra-text bg-transparent hover:bg-astra-text hover:text-astra-elevated transition-colors text-[11px] text-astra-text font-bold uppercase tracking-[0.2em] font-sans">
          Ask ASTRA about this code
        </button>
      </div>
    </div>
  );
}
