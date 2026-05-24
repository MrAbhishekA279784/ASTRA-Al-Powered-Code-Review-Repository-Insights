/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sidebar } from './components/Sidebar';
import { PrMain } from './components/PrMain';
import { PrRightPanel } from './components/PrRightPanel';
import { Dashboard } from './components/Dashboard';
import { Bell, Github, X } from 'lucide-react';
import { MobileLayout } from './components/mobile/MobileLayout';
import { useAstra } from './context/AstraContext';
import { cn } from './lib/utils';

export default function App() {
  const { currentView, prData, error, clearError, toast, clearToast, setCurrentView, showToast } = useAstra();

  return (
    <>
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-astra-critical text-white px-4 py-3 rounded shadow-lg flex items-center gap-3">
          <span className="font-sans text-sm font-bold">{error}</span>
          <button onClick={clearError}><X className="w-4 h-4" /></button>
        </div>
      )}
      
      {toast && (
        <div className={cn(
          "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 shadow-lg flex items-center gap-3 font-sans text-[11px] uppercase tracking-widest font-bold text-astra-elevated slide-up fade-in",
          toast.type === 'success' ? 'bg-astra-success' : toast.type === 'error' ? 'bg-astra-critical' : 'bg-astra-text'
        )}>
          <span>{toast.message}</span>
          <button onClick={clearToast}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      <div className="hidden md:flex h-screen w-screen overflow-hidden bg-astra-bg text-astra-text font-serif selection:bg-astra-purple-bg text-[13px] sm:text-[14px]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-[64px] flex items-center justify-between px-8 border-b border-astra-border shrink-0 bg-astra-bg z-10">
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest font-sans font-bold text-astra-muted">
            <span className="hover:text-astra-text cursor-pointer transition-colors" onClick={() => setCurrentView('dashboard')}>Pull Requests</span>
            <span className="text-astra-border-hover">|</span>
            <span className="text-astra-text">
              {currentView === 'pr' && prData ? prData.title : 'Dashboard'}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => showToast('GitHub synchronization complete', 'success')}
              className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest font-sans font-bold bg-transparent border border-astra-border hover:bg-astra-hover transition-colors text-astra-text"
            >
              <Github className="w-4 h-4" />
              Sync with GitHub
            </button>
            <div className="w-px h-4 bg-astra-border/50 mx-1"></div>
            <button 
              onClick={() => showToast('No new notifications')}
              className="relative text-astra-muted hover:text-astra-text transition-colors p-1"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-astra-purple-light rounded-full border border-astra-bg"></span>
            </button>
            <button 
              onClick={() => showToast('Profile settings not configured', 'info')}
              className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-astra-hover transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-astra-purple/20 border border-astra-purple border-opacity-50 flex items-center justify-center text-astra-purple-light text-xs font-semibold">
                A
              </div>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex bg-astra-elevated">
          {currentView === 'pr' && prData ? (
            <>
              {/* Main PR Area */}
              <div className="flex-1 overflow-y-auto px-12 py-10 no-scrollbar">
                <PrMain />
              </div>

              {/* Right Panel */}
              <aside className="w-[380px] flex-shrink-0 border-l border-astra-border overflow-y-auto p-8 bg-astra-bg no-scrollbar">
                <PrRightPanel />
              </aside>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto px-12 py-10 no-scrollbar">
              <Dashboard />
            </div>
          )}
        </main>
      </div>
    </div>
    
    <div className="flex md:hidden h-[100dvh] w-screen overflow-hidden bg-astra-bg text-astra-text font-serif selection:bg-astra-purple-bg text-[13px]">
      <MobileLayout />
    </div>
    </>
  );
}
