import { ChevronLeft, Search, Filter, Github, Star } from 'lucide-react';
import { useAstra } from '../../context/AstraContext';
import { useState } from 'react';

const MOCK_REPOS = [
  { name: 'next-app', fullName: 'astra/next-app', starred: true, updated: '2m ago' },
  { name: 'design-system', fullName: 'astra/design-system', starred: false, updated: '1d ago' },
  { name: 'backend-service', fullName: 'astra/backend-service', starred: false, updated: '3d ago' },
  { name: 'mobile-app', fullName: 'astra/mobile-app', starred: false, updated: '1w ago' },
];

export function MobileRepos() {
  const { setCurrentView, showToast } = useAstra();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_REPOS.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'All') return matchesSearch;
    if (filter === 'Starred') return matchesSearch && r.starred;
    return matchesSearch;
  });

  return (
    <div className="flex flex-col bg-[#FDFCFB] min-h-dvh h-full relative overflow-y-auto pb-32">
      <header className="sticky top-0 px-5 py-4 flex items-center bg-[#FDFCFB] z-10">
        <button onClick={() => setCurrentView('dashboard')} className="p-1 -ml-1"><ChevronLeft size={24} className="text-[#1C1C1E]" /></button>
        <h1 className="ml-2 font-bold text-[15px] text-[#1C1C1E] flex-1 text-center pr-6">Repositories</h1>
        <div className="w-6" />
      </header>

      <div className="px-5 mt-4">
        <div className="flex gap-2">
          <div className="relative flex items-center flex-1">
            <Search className="absolute left-4 w-4 h-4 text-[#8E8E93]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search repositories..."
              className="w-full bg-[#F5F4F1] border-none rounded-2xl py-3 pl-10 pr-4 text-[14px] text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-none"
            />
          </div>
          <button className="bg-[#F5F4F1] rounded-2xl w-12 flex items-center justify-center shrink-0">
            <Filter size={18} className="text-[#1C1C1E]" />
          </button>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
          {['All', 'Starred'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors ${filter === f ? 'bg-[#1C1C1E] text-white' : 'bg-[#F5F4F1] text-[#1C1C1E]'}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 mt-6">
          {filtered.map((repo) => (
            <button
              key={repo.name}
              onClick={() => showToast(`Analysis for ${repo.fullName} — coming soon`, 'info')}
              className="bg-white p-4 rounded-2xl border border-[#F0EFEB] shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex justify-between items-center relative w-full text-left active:scale-[0.98] transition-transform"
            >
              <div className="flex gap-3 items-start">
                <div className="mt-1"><Github size={20} className="text-[#1C1C1E]" /></div>
                <div className="flex flex-col">
                  <span className="font-bold text-[14px] text-[#1C1C1E]">{repo.name}</span>
                  <span className="text-[12px] text-[#8E8E93]">{repo.fullName}</span>
                  <span className="text-[11px] text-[#8E8E93] mt-1">Last analyzed {repo.updated}</span>
                </div>
              </div>
              <Star size={18} className={repo.starred ? 'text-[#D97706] fill-[#D97706]' : 'text-[#E5E5EA]'} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
