import { ListOrdered, GitCommit, Tag, Sparkles, Bug, Zap } from 'lucide-react';
import { useAstra } from '../../context/AstraContext';

const CHANGELOG = [
  { version: 'v4.0', date: 'May 2026', tag: 'Major Release', icon: Sparkles, color: 'text-astra-purple-light', items: ['AI-powered code review engine', 'Real-time analysis pipeline', 'Mobile-responsive UI', 'GitHub integration'] },
  { version: 'v3.2', date: 'Apr 2026', tag: 'Performance', icon: Zap, color: 'text-astra-major', items: ['Optimized diff rendering', 'Reduced analysis latency', 'Improved error handling', 'Enhanced mobile scrolling'] },
  { version: 'v3.1', date: 'Mar 2026', tag: 'Bug Fixes', icon: Bug, color: 'text-astra-critical', items: ['Fixed auth persistence', 'Resolved overflow issues', 'Patched Gemini fallback', 'Fixed navigation bugs'] },
];

export function ChangelogView() {
  const { showToast } = useAstra();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ListOrdered className="w-5 h-5 text-astra-purple-light" />
          <h2 className="text-2xl font-light italic font-serif text-astra-text">Changelog</h2>
        </div>
        <p className="text-[11px] font-sans tracking-widest uppercase text-astra-muted mt-2">Release history and updates</p>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-astra-border" />
        <div className="flex flex-col gap-8">
          {CHANGELOG.map((release) => (
            <div key={release.version} className="relative pl-12">
              <div className={`absolute left-2.5 w-[30px] h-[30px] rounded-full border-2 border-astra-bg bg-astra-elevated flex items-center justify-center ${release.color}`}>
                <release.icon className="w-3.5 h-3.5" />
              </div>
              <div className="border border-astra-border bg-astra-elevated p-5 hover:border-astra-text transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-bold font-mono text-astra-text">{release.version}</span>
                  <span className="text-[9px] uppercase tracking-wider bg-astra-hover text-astra-muted px-2 py-0.5 font-sans font-bold">{release.tag}</span>
                  <span className="text-[10px] text-astra-muted font-sans ml-auto">{release.date}</span>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {release.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[12px] text-astra-tertiary font-sans">
                      <GitCommit className="w-3 h-3 text-astra-muted shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
