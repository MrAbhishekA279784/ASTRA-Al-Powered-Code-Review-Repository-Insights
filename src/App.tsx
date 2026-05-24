/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { PrMain } from './components/PrMain';
import { PrRightPanel } from './components/PrRightPanel';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { ProfilePanel } from './components/ProfilePanel';
import { RepositoriesView } from './components/views/RepositoriesView';
import { AIReviewView } from './components/views/AIReviewView';
import { DocsView } from './components/views/DocsView';
import { ReportsView } from './components/views/ReportsView';
import { ChangelogView } from './components/views/ChangelogView';
import { SettingsView } from './components/views/SettingsView';
import { Bell, Github, X, Mail, Eye, EyeOff, ArrowRight, ChevronLeft, Loader2 } from 'lucide-react';
import { MobileLayout } from './components/mobile/MobileLayout';
import { useAstra } from './context/AstraContext';
import { useAuth } from './hooks/useAuth';
import { cn } from './lib/utils';

function AuthScreen({ onBackToLanding }: { onBackToLanding: () => void }) {
  const { signInWithGoogle, signInWithGithub, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password);
      } else {
        await resetPassword(email);
        setResetSent(true);
        return;
      }
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password.');
      } else if (code === 'auth/email-already-in-use') {
        setAuthError('An account with this email already exists.');
      } else if (code === 'auth/weak-password') {
        setAuthError('Password should be at least 6 characters.');
      } else if (code === 'auth/invalid-email') {
        setAuthError('Invalid email address.');
      } else if (code === 'auth/too-many-requests') {
        setAuthError('Too many attempts. Please try again later.');
      } else {
        setAuthError(err?.message || 'Authentication failed.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-astra-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background grain */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBudW1PY3RhdmVzPSI0Ii8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2YpIiBvcGFjaXR5PSIwIi8+PC9zdmc+')]" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-astra-purple-light/5 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-astra-purple-light/5 blur-3xl" />

      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter uppercase font-sans text-astra-text leading-none">
            ASTRA.
          </h1>
          <span className="text-[10px] uppercase tracking-[0.3em] text-astra-muted mt-3 font-sans font-bold">
            AI Code Intelligence
          </span>
          <div className="w-12 h-px bg-astra-purple-light/40 mt-5" />
        </div>

        {/* Auth Card */}
        <div className="border border-astra-border bg-astra-elevated p-8">
          {/* Header */}
          <div className="mb-8">
            {mode === 'forgot' ? (
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => { setMode('login'); setAuthError(null); setResetSent(false); }} className="text-astra-muted hover:text-astra-text transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-bold font-sans text-astra-text tracking-tight">Reset Password</h2>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold font-sans text-astra-text tracking-tight">
                  {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-[11px] text-astra-muted font-sans mt-1.5">
                  {mode === 'signup' ? 'Join ASTRA for AI-powered code reviews.' : 'Sign in to continue to ASTRA.'}
                </p>
              </>
            )}
          </div>

          {/* Social Buttons */}
          {mode !== 'forgot' && (
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-astra-border hover:bg-astra-hover transition-all text-[11px] uppercase tracking-[0.15em] font-bold font-sans text-astra-text group"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <button
                onClick={signInWithGithub}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-astra-border hover:bg-astra-hover transition-all text-[11px] uppercase tracking-[0.15em] font-bold font-sans text-astra-text group"
              >
                <Github className="w-4 h-4" />
                Continue with GitHub
              </button>
            </div>
          )}

          {/* Divider */}
          {mode !== 'forgot' && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-astra-border" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-astra-tertiary font-sans font-bold">or</span>
              <div className="flex-1 h-px bg-astra-border" />
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-[0.2em] text-astra-tertiary font-sans font-bold">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-astra-tertiary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-astra-bg border border-astra-border pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-astra-text text-astra-text placeholder:text-astra-tertiary/60 transition-colors font-sans"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-[0.2em] text-astra-tertiary font-sans font-bold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                    className="w-full bg-astra-bg border border-astra-border pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-astra-text text-astra-text placeholder:text-astra-tertiary/60 transition-colors font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-astra-tertiary hover:text-astra-text transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'login' && !resetSent && (
              <button
                type="button"
                onClick={() => { setMode('forgot'); setAuthError(null); }}
                className="text-[10px] text-astra-tertiary hover:text-astra-text transition-colors font-sans text-left tracking-wider"
              >
                Forgot password?
              </button>
            )}

            {authError && (
              <div className="p-3 border border-astra-critical/30 bg-astra-critical/5 text-astra-critical text-[11px] font-sans">
                {authError}
              </div>
            )}

            {resetSent && (
              <div className="p-3 border border-astra-success/30 bg-astra-success/5 text-astra-success text-[11px] font-sans">
                Password reset email sent. Check your inbox.
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-astra-text text-astra-elevated hover:bg-astra-purple-light transition-all text-[11px] uppercase tracking-[0.15em] font-bold font-sans disabled:opacity-50 mt-2"
            >
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Send Reset Link' : 'Sign In'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          {mode !== 'forgot' && (
            <p className="mt-6 text-[11px] text-astra-muted font-sans text-center">
              {mode === 'login' ? (
                <>Don't have an account?{' '}
                  <button onClick={() => { setMode('signup'); setAuthError(null); }} className="text-astra-text font-bold hover:underline">
                    Sign up
                  </button>
                </>
              ) : (
                <>Already have an account?{' '}
                  <button onClick={() => { setMode('login'); setAuthError(null); }} className="text-astra-text font-bold hover:underline">
                    Sign in
                  </button>
                </>
              )}
            </p>
          )}

          {mode === 'forgot' && (
            <p className="mt-6 text-[11px] text-astra-muted font-sans text-center">
              Remember your password?{' '}
              <button onClick={() => { setMode('login'); setAuthError(null); setResetSent(false); }} className="text-astra-text font-bold hover:underline">
                Sign in
              </button>
            </p>
          )}
        </div>

        {/* Back to landing */}
        <button onClick={onBackToLanding} className="text-[9px] text-astra-tertiary/50 font-sans text-center mt-4 tracking-wider uppercase hover:text-astra-tertiary transition-colors mx-auto block">
          ← Back to home
        </button>

        <p className="text-[9px] text-astra-tertiary/40 font-sans text-center mt-4 tracking-wider uppercase">
          Protected by Firebase Authentication
        </p>
      </div>
    </div>
  );
}

function ProfileDropdown() {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setShowProfile(!showProfile)}
        className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-astra-hover transition-all"
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName || ''} className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-astra-purple/20 border border-astra-purple border-opacity-50 flex items-center justify-center text-astra-purple-light text-xs font-semibold">
            {user.displayName?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        )}
      </button>
      {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} />}
    </div>
  );
}

export default function App() {
  const { currentView, prData, error, clearError, toast, clearToast, setCurrentView, showToast, navigate } = useAstra();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (!user) {
    if (!showAuth) {
      return <LandingPage onGetStarted={() => setShowAuth(true)} />;
    }
    return <AuthScreen onBackToLanding={() => setShowAuth(false)} />;
  }

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
            <span className="hover:text-astra-text cursor-pointer transition-colors" onClick={() => navigate('dashboard')}>ASTRA</span>
            <span className="text-astra-border-hover">/</span>
            <span className="text-astra-text">
              {currentView === 'pr' && prData ? prData.title : 
               currentView === 'repos' ? 'Repositories' :
               currentView === 'ai-review' ? 'AI Review' :
               currentView === 'docs' ? 'Documentation' :
               currentView === 'reports' ? 'Reports' :
               currentView === 'changelog' ? 'Changelog' :
               currentView === 'settings' ? 'Settings' :
               currentView === 'profile' ? 'Profile' :
               currentView === 'activity' ? 'Activity' :
               currentView === 'chat' ? 'AI Chat' : 'Dashboard'}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => showToast('GitHub sync triggered — fetching latest data', 'info')}
              className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest font-sans font-bold bg-transparent border border-astra-border hover:bg-astra-hover transition-colors text-astra-text"
            >
              <Github className="w-4 h-4" />
              Sync
            </button>
            <div className="w-px h-4 bg-astra-border/50 mx-1"></div>
            <button 
              onClick={() => showToast('No new notifications', 'info')}
              className="relative text-astra-muted hover:text-astra-text transition-colors p-1"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-astra-purple-light rounded-full border border-astra-bg"></span>
            </button>
            <ProfileDropdown />
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex bg-astra-elevated">
          {currentView === 'pr' && prData ? (
            <>
              <div className="flex-1 overflow-y-auto px-12 py-10 no-scrollbar">
                <PrMain />
              </div>
              <aside className="w-[380px] flex-shrink-0 border-l border-astra-border overflow-y-auto p-8 bg-astra-bg no-scrollbar">
                <PrRightPanel />
              </aside>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto px-12 py-10 no-scrollbar">
              {currentView === 'dashboard' && <Dashboard />}
              {currentView === 'repos' && <RepositoriesView />}
              {currentView === 'ai-review' && <AIReviewView />}
              {currentView === 'docs' && <DocsView />}
              {currentView === 'reports' && <ReportsView />}
              {currentView === 'changelog' && <ChangelogView />}
              {currentView === 'settings' && <SettingsView />}
              {currentView === 'profile' && <Dashboard />}
              {currentView === 'activity' && <Dashboard />}
              {currentView === 'chat' && <Dashboard />}
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
