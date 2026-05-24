import { useState } from "react";
import { Menu, Settings, Check, Sparkles, FolderGit2, GitPullRequest, TestTube } from "lucide-react";
import { useAstra } from "../../context/AstraContext";

export function MobileActivity() {
  const [filter, setFilter] = useState('All');
  const { navigate, showToast } = useAstra();

  const activities = [
    { icon: GitPullRequest, color: '#198754', bg: '#E6F4EA', title: 'PR #1287 analyzed', desc: '8 files changed, 4 issues found', time: '2m ago', action: () => showToast('Viewing PR analysis', 'info') },
    { icon: Check, color: '#198754', bg: '#E6F4EA', title: 'Documentation generated', desc: 'README.md created', time: '15m ago', action: () => navigate('docs') },
    { icon: Sparkles, color: '#1C1C1E', bg: '#F5F4F1', title: 'AI review completed', desc: 'PR #1285 review finished', time: '1h ago', action: () => showToast('Viewing review results', 'info') },
    { icon: FolderGit2, color: '#3B82F6', bg: '#EBF0FF', title: 'Repository analyzed', desc: 'next-app repository scan', time: '1d ago', action: () => navigate('repos') },
    { icon: TestTube, color: '#3B82F6', bg: '#EBF0FF', title: 'Mock tests generated', desc: '32 tests created', time: '1d ago', action: () => showToast('Test generation coming soon', 'info') },
  ];

  const filtered = filter === 'All' ? activities : activities.filter(a => {
    if (filter === 'PRs') return a.title.includes('PR');
    if (filter === 'Repos') return a.title.includes('Repository');
    if (filter === 'Reviews') return a.title.includes('review');
    if (filter === 'Docs') return a.title.includes('Documentation');
    return true;
  });

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
              {filtered.map((item, i) => (
                <button key={i} onClick={item.action} className="flex gap-4 items-start relative w-full text-left">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: item.bg }}>
                    <item.icon size={18} style={{ color: item.color }} />
                  </div>
                  <div className="flex flex-col flex-1 pb-4 border-b border-[#F0EFEB]">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-[14px] text-[#1C1C1E]">{item.title}</h4>
                      <span className="text-[11px] text-[#8E8E93] shrink-0 ml-2">{item.time}</span>
                    </div>
                    <p className="text-[12px] text-[#8E8E93] mt-0.5">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
