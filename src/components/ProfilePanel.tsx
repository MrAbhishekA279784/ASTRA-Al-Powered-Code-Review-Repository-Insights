import { useEffect, useRef } from 'react';
import { User, Github, Bell, Palette, Shield, X, LogOut, ChevronRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAstra } from '../context/AstraContext';

export function ProfilePanel({ onClose }: { onClose: () => void }) {
  const { user, signOut } = useAuth();
  const { navigate } = useAstra();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const handleNav = (view: 'settings' | 'dashboard') => {
    navigate(view);
    onClose();
  };

  if (!user) return null;

  const settings = [
    { icon: User, label: 'Account Settings', desc: 'Profile, email, name', view: 'settings' as const },
    { icon: Github, label: 'GitHub Integration', desc: 'Connect repositories', view: 'settings' as const },
    { icon: Bell, label: 'Notifications', desc: 'Alerts and updates', view: 'settings' as const },
    { icon: Palette, label: 'Appearance', desc: 'Theme and layout', view: 'settings' as const },
    { icon: Shield, label: 'Privacy & Security', desc: 'Sessions and data', view: 'settings' as const },
  ];

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div
        ref={panelRef}
        className="absolute top-full right-0 mt-2 w-[340px] max-w-[calc(100vw-16px)] bg-astra-elevated border border-astra-border shadow-xl z-40 animate-[fadeSlideIn_0.2s_ease-out] origin-top-right"
      >
        <div className="p-6 border-b border-astra-border">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-12 h-12 rounded-full object-cover border-2 border-astra-border" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-astra-text text-astra-elevated flex items-center justify-center text-lg font-bold font-sans">
                  {user.displayName?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold font-sans text-astra-text truncate max-w-[180px]">{user.displayName || 'Developer'}</span>
                <span className="text-[11px] text-astra-muted font-sans mt-0.5 truncate max-w-[180px]">{user.email}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-astra-muted hover:text-astra-text transition-colors p-1 -mr-1 -mt-1 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 border-b border-astra-border">
          {[
            { label: 'Reviews', value: '128' },
            { label: 'Repos', value: '24' },
            { label: 'Score', value: '87' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center py-4 border-r border-astra-border last:border-r-0">
              <span className="text-lg font-bold font-mono text-astra-text">{stat.value}</span>
              <span className="text-[9px] uppercase tracking-widest text-astra-muted font-sans font-bold mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="py-2 max-h-[40vh] overflow-y-auto">
          {settings.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item.view)}
              className="w-full flex items-center gap-3 px-6 py-3 hover:bg-astra-hover transition-colors group"
            >
              <item.icon className="w-4 h-4 text-astra-muted group-hover:text-astra-text transition-colors shrink-0" strokeWidth={1.5} />
              <div className="flex flex-col items-start flex-1 text-left min-w-0">
                <span className="text-[12px] font-semibold font-sans text-astra-text">{item.label}</span>
                <span className="text-[10px] text-astra-muted font-sans truncate w-full">{item.desc}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-astra-muted group-hover:text-astra-text transition-colors shrink-0" />
            </button>
          ))}
        </div>

        <div className="mx-6 mb-4 p-3 border border-astra-border bg-astra-hover flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-astra-success shrink-0" />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[10px] font-bold font-sans text-astra-text uppercase tracking-wider">GitHub Connected</span>
            <span className="text-[9px] text-astra-muted font-sans">Synced 2m ago</span>
          </div>
          <ExternalLink className="w-3 h-3 text-astra-muted shrink-0" />
        </div>

        <div className="border-t border-astra-border p-3">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[10px] uppercase tracking-[0.2em] font-bold font-sans text-astra-critical hover:bg-astra-critical/5 border border-transparent hover:border-astra-critical/20 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
