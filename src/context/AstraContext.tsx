import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type ViewType = 'dashboard' | 'pr' | 'activity' | 'repos' | 'docs' | 'chat' | 'profile' | 'ai-review' | 'reports' | 'changelog' | 'settings';

type Toast = { message: string; type: 'success' | 'error' | 'info' };

type AstraContextType = {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  navigate: (view: ViewType) => void;
  prData: any;
  reviewData: any;
  isAnalyzing: boolean;
  analyzePR: (url: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
  chatHistory: any[];
  setChatHistory: React.Dispatch<React.SetStateAction<any[]>>;
  toast: Toast | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
  prCount: number;
  contributorCount: number;
  quotaCooldown: boolean;
};

const AstraContext = createContext<AstraContextType | undefined>(undefined);

function hashUrl(url: string): string {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  return match ? `${match[1]}/${match[2]}/pull/${match[3]}` : url;
}

const CACHE_TTL = 5 * 60 * 1000;

export function AstraProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [prData, setPrData] = useState<any>(null);
  const [reviewData, setReviewData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const [quotaCooldown, setQuotaCooldown] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, { prData: any; review: any; timestamp: number }>>(new Map());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analyzingRef = useRef(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const clearToast = useCallback(() => setToast(null), []);
  const clearError = useCallback(() => setError(null), []);

  const navigate = useCallback((view: ViewType) => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setCurrentView(view);
  }, []);

  const analyzePR = useCallback(async (url: string) => {
    if (analyzingRef.current) {
      console.log("[ASTRA] analyzePR blocked: already analyzing");
      return;
    }

    const cacheKey = hashUrl(url);
    const cached = cacheRef.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("[ASTRA] Using cached result for:", cacheKey);
      setPrData(cached.prData);
      setReviewData(cached.review);
      setChatHistory([]);
      setCurrentView('pr');
      showToast('Analysis complete (cached)', 'success');
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    debounceRef.current && clearTimeout(debounceRef.current);

    analyzingRef.current = true;
    setIsAnalyzing(true);
    setError(null);

    await new Promise<void>((resolve) => {
      debounceRef.current = setTimeout(resolve, 1500);
    });

    if (controller.signal.aborted) {
      console.log("[ASTRA] analyzePR aborted after debounce");
      analyzingRef.current = false;
      setIsAnalyzing(false);
      return;
    }

    try {
      console.log("[ASTRA] analyzePR request origin: user click, url:", url);

      const res = await fetch('/api/review-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl: url }),
        signal: controller.signal,
      });

      if (controller.signal.aborted) {
        analyzingRef.current = false;
        setIsAnalyzing(false);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        const msg = errorData.error || 'Failed to analyze PR';
        if (msg.includes('quota') || msg.includes('429')) {
          setQuotaCooldown(true);
          setTimeout(() => setQuotaCooldown(false), 30000);
        }
        throw new Error(msg);
      }

      const data = await res.json();

      cacheRef.current.set(cacheKey, {
        prData: data.prData,
        review: data.review,
        timestamp: Date.now(),
      });

      setPrData(data.prData);
      setReviewData(data.review);
      setChatHistory([]);
      setCurrentView('pr');
      showToast('Analysis complete', 'success');
    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.log("[ASTRA] analyzePR aborted");
        return;
      }
      setError(e.message);
      showToast(e.message, 'error');
    } finally {
      analyzingRef.current = false;
      setIsAnalyzing(false);
      abortRef.current = null;
    }
  }, [showToast]);

  return (
    <AstraContext.Provider
      value={{
        currentView,
        setCurrentView,
        navigate,
        prData,
        reviewData,
        isAnalyzing,
        analyzePR,
        error,
        clearError,
        chatHistory,
        setChatHistory,
        toast,
        showToast,
        clearToast,
        prCount: 24,
        contributorCount: 12,
        quotaCooldown,
      }}
    >
      {children}
    </AstraContext.Provider>
  );
}

export function useAstra() {
  const context = useContext(AstraContext);
  if (context === undefined) {
    throw new Error('useAstra must be used within an AstraProvider');
  }
  return context;
}
