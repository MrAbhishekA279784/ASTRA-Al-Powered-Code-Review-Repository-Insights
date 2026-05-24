import { useState, useEffect, useRef } from 'react';
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
    Activity,
    X,
    LogOut,
    ChevronRight,
    ExternalLink,
    User,
    Github,
    Bell,
    Palette,
    Shield
  } from "lucide-react";
import { cn } from "../lib/utils";
import { useAstra } from "../context/AstraContext";
import { useAuth } from "../hooks/useAuth";
  
  function SidebarProfile() {
    const { user, signOut } = useAuth();
    const { navigate } = useAstra();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    if (!user) return null;

    const handleNavigation = (view: 'dashboard' | 'settings') => {
      navigate(view);
      setOpen(false);
    };

    const settings = [
      { icon: User, label: 'Account Settings', view: 'settings' as const },
      { icon: Github, label: 'GitHub Integration', view: 'settings' as const },
      { icon: Bell, label: 'Notifications', view: 'settings' as const },
      { icon: Palette, label: 'Appearance', view: 'settings' as const },
      { icon: Shield, label: 'Privacy & Security', view: 'settings' as const },
    ];

    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-3 p-3 border border-transparent hover:border-astra-border hover:bg-astra-hover transition-colors"
        >
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 bg-astra-text flex items-center justify-center text-astra-elevated text-sm font-bold font-sans">
              {user.displayName?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex flex-col items-start font-sans">
            <span className="text-[11px] text-astra-text font-bold uppercase tracking-widest leading-none mb-1">{user.displayName || 'User'}</span>
            <span className="text-[9px] text-astra-muted uppercase tracking-widest leading-none">{user.email || ''}</span>
          </div>
        </button>

        {open && (
          <div className="absolute left-0 right-0 bottom-full mb-2 bg-astra-elevated border border-astra-border shadow-xl z-40 animate-[fadeSlideIn_0.15s_ease-out] origin-bottom-left max-h-[60vh] overflow-y-auto">
            <div className="py-2">
              {settings.map((item) => (
                <button key={item.label} onClick={() => handleNavigation(item.view)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-astra-hover transition-colors group">
                  <item.icon className="w-3.5 h-3.5 text-astra-muted group-hover:text-astra-text" strokeWidth={1.5} />
                  <span className="text-[11px] font-semibold font-sans text-astra-text flex-1 text-left">{item.label}</span>
                  <ChevronRight className="w-3 h-3 text-astra-muted group-hover:text-astra-text" />
                </button>
              ))}
            </div>
            <div className="border-t border-astra-border p-2">
              <button
                onClick={() => { signOut(); setOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-[10px] uppercase tracking-[0.15em] font-bold font-sans text-astra-critical hover:bg-astra-critical/5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export function Sidebar() {
    const { currentView, navigate, showToast, prData } = useAstra();
    const { user } = useAuth();

    const NAV_ITEMS: { name: string; id: 'dashboard' | 'pr' | 'repos' | 'ai-review' | 'docs' | 'reports' | 'changelog' | 'settings'; icon: any; active: boolean }[] = [
      { name: "Dashboard", id: 'dashboard', icon: Home, active: currentView === 'dashboard' },
      { name: "Pull Request", id: 'pr', icon: GitPullRequest, active: currentView === 'pr' },
      { name: "Repositories", id: 'repos', icon: LayoutGrid, active: currentView === 'repos' },
      { name: "AI Review", id: 'ai-review', icon: ShieldCheck, active: currentView === 'ai-review' },
      { name: "Documentation", id: 'docs', icon: FileText, active: currentView === 'docs' },
      { name: "Reports", id: 'reports', icon: BarChart2, active: currentView === 'reports' },
      { name: "Changelog", id: 'changelog', icon: ListOrdered, active: currentView === 'changelog' },
      { name: "Settings", id: 'settings', icon: Settings, active: currentView === 'settings' },
    ];
    
    const QUICK_ACTIONS = [
      { name: "Analyze New PR", icon: Activity, onClick: () => navigate('dashboard') },
      { name: "Generate Docs", icon: FileText, onClick: () => {
          if (prData) { navigate('docs'); } else { showToast('Open a Pull Request first'); }
      } },
      { name: "View Reports", icon: BarChart2, onClick: () => navigate('reports') },
      { name: "Ask ASTRA", icon: MessageSquare, onClick: () => {
          if (prData) { navigate('chat'); } else { showToast('Open a Pull Request first'); }
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
                onClick={() => navigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-[11px] uppercase tracking-widest font-sans font-bold transition-colors",
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
          <div className="p-5 bg-astra-hover border border-astra-border relative overflow-hidden flex flex-col items-start gap-3">
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-astra-text font-sans">REPOSITORY STATS</span>
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
  
          <SidebarProfile />
        </div>
      </aside>
    );
  }
  
