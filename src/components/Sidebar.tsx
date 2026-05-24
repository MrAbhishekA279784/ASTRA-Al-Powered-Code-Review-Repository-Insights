import { 
    BarChart2, 
    FileText, 
    GitPullRequest, 
    Home, 
    LayoutGrid, 
    ListOrdered, 
    MessageSquare, 
    Settings, 
    ShieldCheck, 
    ChevronDown,
    Activity
  } from "lucide-react";
  import { cn } from "../lib/utils";
  import { useAstra } from "../context/AstraContext";
  
  export function Sidebar() {
    const { currentView, setCurrentView, showToast } = useAstra();

    const NAV_ITEMS = [
      { name: "Dashboard", id: 'dashboard', icon: Home, active: currentView === 'dashboard' },
      { name: "Pull Request", id: 'pr', icon: GitPullRequest, active: currentView === 'pr' },
      { name: "Repositories", id: 'repos', icon: LayoutGrid, active: false },
      { name: "AI Review", id: 'review', icon: ShieldCheck, active: false },
      { name: "Documentation", id: 'docs', icon: FileText, active: false },
      { name: "Reports", id: 'reports', icon: BarChart2, active: false },
      { name: "Changelog", id: 'changelog', icon: ListOrdered, active: false },
      { name: "Settings", id: 'settings', icon: Settings, active: false },
    ];
    
    const QUICK_ACTIONS = [
      { name: "Analyze New PR", icon: Activity, onClick: () => setCurrentView('dashboard') },
      { name: "Generate Docs", icon: FileText, onClick: () => {
          if (currentView !== 'pr') showToast('Open a Pull Request first');
      } },
      { name: "View Reports", icon: BarChart2, onClick: () => showToast('Reports not configured') },
      { name: "Ask ASTRA", icon: MessageSquare, onClick: () => {
          if (currentView !== 'pr') showToast('Open a Pull Request first');
      } },
    ];
    
    return (
      <aside className="w-[240px] flex-shrink-0 flex flex-col h-full bg-astra-bg border-r border-astra-border pt-6 pb-4">
        {/* Logo */}
        <div className="flex flex-col px-6 mb-12 gap-1">
          <div className="flex items-center gap-2 text-astra-text mb-2">
            <h1 className="text-2xl font-black tracking-tighter uppercase font-sans">ASTRA.</h1>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-astra-muted leading-tight font-sans font-bold">
            Vol. IV // Review System
          </span>
        </div>
  
        {/* Main Nav */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-8 no-scrollbar">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  if (item.id === 'dashboard' || item.id === 'pr') {
                    setCurrentView(item.id as 'dashboard' | 'pr');
                  } else {
                    showToast('Module disabled in preview', 'info');
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-[11px] uppercase tracking-widest font-sans font-bold rounded-none transition-colors",
                  item.active 
                    ? "bg-astra-hover text-astra-text border-l-[3px] border-astra-purple-light pl-[9px]" 
                    : "text-astra-muted hover:text-astra-text hover:bg-astra-hover"
                )}
              >
                <item.icon className={cn("w-4 h-4", item.active && "text-astra-purple-light")} />
                {item.name}
              </button>
            ))}
          </div>
  
          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="px-3 text-[9px] font-black text-astra-tertiary mb-4 tracking-[0.2em] uppercase font-sans border-b border-astra-border pb-2">
              Quick Actions
            </h3>
            <div className="space-y-1">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.name}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-3 px-3 py-2 text-[11px] uppercase tracking-widest font-sans font-bold text-astra-muted hover:text-astra-text hover:bg-astra-hover transition-colors"
                >
                  <action.icon className="w-3.5 h-3.5" />
                  {action.name}
                </button>
              ))}
            </div>
          </div>
        </nav>
  
        {/* Repository Stats & Profile */}
        <div className="px-4 mt-auto space-y-6">
          <div className="p-5 bg-astra-hover border border-astra-border relative overflow-hidden flex flex-col items-start gap-3 rounded-none">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-astra-text font-sans">REPOSITORY STATS</span>
            </div>
            <div className="flex flex-col gap-2 w-full mt-1">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest font-sans">
                <span className="text-astra-muted">Open PRs</span>
                <span className="text-astra-text">24</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest font-sans">
                <span className="text-astra-muted">Contributors</span>
                <span className="text-astra-text">12</span>
              </div>
            </div>
          </div>
  
          <button className="w-full flex items-center justify-between p-3 border border-transparent hover:border-astra-border hover:bg-astra-hover transition-colors rounded-none">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-astra-text flex items-center justify-center text-astra-elevated text-sm font-serif italic">
                A
              </div>
              <div className="flex flex-col items-start font-sans">
                <span className="text-[11px] text-astra-text font-bold uppercase tracking-widest leading-none mb-1.5">Aditya</span>
                <span className="text-[9px] text-astra-muted uppercase tracking-widest leading-none">Core Team</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-astra-muted" />
          </button>
        </div>
      </aside>
    );
  }
  
