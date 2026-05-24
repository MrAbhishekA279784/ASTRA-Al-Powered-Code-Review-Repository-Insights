import { useState } from 'react';
import { Search, FolderGit2, Github, Star, GitFork, ExternalLink } from 'lucide-react';
import { useAstra } from '../../context/AstraContext';

const MOCK_REPOS = [
  { name: 'frontend-app', fullName: 'org/frontend-app', stars: 128, forks: 34, language: 'TypeScript', updated: '2h ago' },
  { name: 'api-service', fullName: 'org/api-service', stars: 89, forks: 21, language: 'Go', updated: '1d ago' },
  { name: 'mobile-app', fullName: 'org/mobile-app', stars: 56, forks: 12, language: 'Swift', updated: '3d ago' },
  { name: 'docs-site', fullName: 'org/docs-site', stars: 34, forks: 8, language: 'MDX', updated: '5d ago' },
  { name: 'infra-tools', fullName: 'org/infra-tools', stars: 23, forks: 6, language: 'Python', updated: '1w ago' },
];

export function RepositoriesView() {
  const [search, setSearch] = useState('');
  const { showToast } = useAstra();
  const filtered = MOCK_REPOS.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-light italic font-serif text-astra-text">Repositories</h2>
        <p className="text-[11px] font-sans tracking-widest uppercase text-astra-muted mt-2">Connected repositories overview</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-astra-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search repositories..."
          className="w-full bg-astra-elevated border border-astra-border pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-astra-text text-astra-text placeholder:text-astra-tertiary/60 font-sans"
        />
      </div>

      <div className="flex flex-col gap-1">
        {filtered.map((repo) => (
          <div
            key={repo.name}
            onClick={() => showToast(`Repository analysis coming soon for ${repo.fullName}`, 'info')}
            className="flex items-center gap-4 p-4 bg-astra-elevated border border-astra-border hover:border-astra-text transition-colors cursor-pointer group"
          >
            <FolderGit2 className="w-5 h-5 text-astra-purple-light shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold font-sans text-astra-text">{repo.name}</span>
                <span className="text-[10px] font-mono text-astra-muted">{repo.fullName}</span>
              </div>
              <div className="flex items-center gap-4 mt-1.5">
                <span className="flex items-center gap-1 text-[10px] text-astra-muted font-sans">
                  <span className="w-2.5 h-2.5 rounded-full bg-astra-purple-light/60" />
                  {repo.language}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-astra-muted font-sans">
                  <Star className="w-3 h-3" /> {repo.stars}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-astra-muted font-sans">
                  <GitFork className="w-3 h-3" /> {repo.forks}
                </span>
                <span className="text-[10px] text-astra-muted font-sans">{repo.updated}</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-astra-muted opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
