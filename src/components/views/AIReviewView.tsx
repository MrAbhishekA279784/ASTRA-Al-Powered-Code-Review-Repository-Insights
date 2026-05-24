import { useState, FormEvent } from 'react';
import { Sparkles, ArrowRight, Github, Shield, AlertTriangle, Info } from 'lucide-react';
import { useAstra } from '../../context/AstraContext';

export function AIReviewView() {
  const { analyzePR, isAnalyzing, quotaCooldown } = useAstra();
  const [url, setUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url) analyzePR(url);
  };

  const severityConfig = {
    High: { icon: AlertTriangle, class: 'text-astra-critical bg-astra-critical/10 border-astra-critical/20' },
    Medium: { icon: Shield, class: 'text-astra-major bg-astra-major/10 border-astra-major/20' },
    Low: { icon: Info, class: 'text-astra-info bg-astra-info/10 border-astra-info/20' },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-astra-purple-light" />
          <h2 className="text-2xl font-light italic font-serif text-astra-text">AI Review</h2>
        </div>
        <p className="text-[11px] font-sans tracking-widest uppercase text-astra-muted mt-2">Run intelligent code analysis on any pull request</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-12">
        <div className="flex border border-astra-border bg-astra-elevated overflow-hidden focus-within:border-astra-text transition-colors max-w-xl">
          <div className="flex items-center px-4 border-r border-astra-border">
            <Github className="w-4 h-4 text-astra-muted" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repo/pull/123"
            className="flex-1 bg-transparent p-4 text-sm focus:outline-none text-astra-text placeholder:text-astra-tertiary/60 font-sans"
            disabled={isAnalyzing}
          />
          <button
            type="submit"
            disabled={isAnalyzing || !url || quotaCooldown}
            className="px-6 bg-astra-text text-astra-elevated hover:bg-astra-purple-light transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {isAnalyzing ? (
              <span className="w-4 h-4 border-2 border-astra-elevated border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {(['High', 'Medium', 'Low'] as const).map((sev) => {
          const config = severityConfig[sev];
          return (
            <div key={sev} className={`p-5 border ${config.class}`}>
              <div className="flex items-center gap-2 mb-3">
                <config.icon className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-widest font-bold font-sans">{sev} Severity</span>
              </div>
              <p className="text-[12px] font-sans text-astra-muted">
                {sev === 'High' ? 'Security vulnerabilities, data leaks, critical bugs' : 
                 sev === 'Medium' ? 'Performance issues, code smells, maintainability concerns' :
                 'Style improvements, suggestions, best practices'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
